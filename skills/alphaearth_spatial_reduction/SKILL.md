---
name: alphaearth_spatial_reduction
description: >-
  Recipes for spatially reducing AlphaEarth Satellite Embeddings in Google Earth Engine. Covers single-pass reduction for mean and count, calculation of Mean Resultant Length (R̄), and specialized medoid pixel extraction for heterogeneous areas.
---

Use this skill to reduce per-pixel embeddings to one representative vector per
region — fields, parcels, admin units, grid cells. This is a vector operation,
not 64 independent averages. Note that the mean of unit vectors is shorter than
unit length. The resulting length carries information you should keep in most
cases.

See introduction in `alphaearth_core`.

--------------------------------------------------------------------------------

## 1. Terminology

-   **Mean Direction:** The normalized mean vector. Re-normalize to unit length
    for similarity tasks (cosine similarity, nearest-neighbor, dot product).
-   **Mean Resultant Length (R̄):** The magnitude of the raw mean vector `R̄ =
    ‖mean‖` $\in [0, 1]$. R̄ near 1 indicates a homogeneous region; low R̄
    indicates dispersion, mixture, or multimodality. R̄ itself is a sufficient
    feature for tree-based models. High R̄ means the mean direction is a
    trustworthy single summary of the region; low R̄ means the mean is a blend
    of dissimilar pixels, so prefer the medoid (Section 3) or multiple
    prototypes. The "low" vs "high" distinction is somewhat ambiguous in this
    context: it will shift from place to place and material to material, and
    might not even be meaningful in some cases.
-   **Renormalize for some tasks, but not others:** Re-normalization is
    mandatory for cosine/similarity tasks because cosine and nearest-neighbor
    compare directions, so inputs must be unit-length. But re-normalization is
    generally not recommended for Random Forest or other tree-based classifiers.
    Tree-based models split one feature at a time and tolerate scale
    differences. Keeping the raw mean components is actually beneficial because
    the vector magnitude (Mean Resultant Length R̄) is itself a highly
    informative feature for these models.

---

## 2. Single-Pass Reduction

This recipe calculates all 64 band means, the valid pixel count, R̄, and the
normalized mean direction in a single `reduceRegion` pass.

For best results, run the reduction at the native scale of 10 m. Coarser scales
lose precision, and worse, they bias R̄ toward looking homogeneous, because the
coarser input pixels are themselves spatial averages renormalized back to unit
length, which flattens the magnitude deficit R̄ measures. Use larger scales only
for rough previews where R̄ is not relied upon.

```python
import ee

dataset = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL')
band_names = [f'A{i:02d}' for i in range(64)]
mean_keys = [f'{b}_mean' for b in band_names]

# Create year mosaic
embeddings_image = dataset.filterDate('2024-01-01', '2025-01-01').select(band_names).mosaic()

# Reduce at native scale (10m) to preserve pixel-level heterogeneity details
NATIVE_SCALE = 10

def summarize_region(feature):
  feature = ee.Feature(feature)
  geom = feature.geometry()

  # Single-pass reduction for all band means and counts
  stats = embeddings_image.reduceRegion(
      reducer=ee.Reducer.mean().combine(
          reducer2=ee.Reducer.count(), sharedInputs=True
      ),
      geometry=geom,
      scale=NATIVE_SCALE,
      maxPixels=1e10,
      tileScale=4,
  )

  # Extract values safely (fall back to 0 if null)
  def safe(key):
    return ee.Number(ee.List([stats.get(key), 0]).reduce(ee.Reducer.firstNonNull()))

  n_pixels = safe('A00_count')
  mean_vals = ee.List(mean_keys).map(safe)

  # Calculate R̄ (magnitude of the mean vector)
  sum_sq = mean_vals.map(lambda v: ee.Number(v).pow(2)).reduce(ee.Reducer.sum())
  rbar = ee.Number(sum_sq).sqrt()

  # Calculate normalized unit mean direction
  unit_vals = mean_vals.map(
      lambda v: ee.Algorithms.If(rbar.gt(0), ee.Number(v).divide(rbar), 0)
  )

  mean_out = ee.Dictionary.fromLists([f'{b}_mean' for b in band_names], mean_vals)
  unit_out = ee.Dictionary.fromLists([f'{b}_unit' for b in band_names], unit_vals)

  return feature.set(mean_out).set(unit_out).set({
      'Rbar': rbar,
      'embedding_dispersion': ee.Number(1).subtract(rbar),
      'n_pixels': n_pixels,
  })

# Map over geometries
# region_collection: User-supplied ee.FeatureCollection of geometries.
summarized = region_collection.map(summarize_region)
```

---

## 3. Representative Pixels (Medoid) for Heterogeneous Areas

A low R̄ means the region mixes dissimilar surfaces whose embeddings point in
different directions, so their average lands in an in-between direction that may
match nothing actually present. The medoid returns a real observed pixel instead
of that synthetic average.

The `region_medoid` function requires a pre-summarized collection as its input.
Specifically, it must run on the output of the first reduction pass (which
calculates the `_unit` properties representing the normalized mean direction) in
order to compute the similarities and extract the medoid.

```python
def region_medoid(feature):
    feature = ee.Feature(feature)
    geom = feature.geometry()

    unit_img = ee.Image.constant(
        [ee.Number(feature.get(f'{b}_unit')) for b in band_names]
    ).rename(band_names)

    sim = embeddings_image.multiply(unit_img).reduce(ee.Reducer.sum()).rename('sim')

    # Add coordinates so the reducer returns the medoid's location
    image_with_coords = embeddings_image.addBands(ee.Image.pixelLonLat())

    # max(67): 'max' = peak similarity;
    # 'max1'..'max64' = the 64 bands (A00..A63);
    # 'max65', 'max66' = longitude, latitude.
    md = sim.addBands(image_with_coords).reduceRegion(
        reducer=ee.Reducer.max(67),
        geometry=geom, scale=NATIVE_SCALE, maxPixels=1e10, tileScale=4,
    )

    medoid_out = ee.Dictionary.fromLists(
        [f'{b}_medoid' for b in band_names],
        ee.List([f'max{i+1}' for i in range(64)]).map(lambda k: md.get(k))
    )
    return feature.set(medoid_out).set({
        'medoid_similarity': md.get('max'),
        'medoid_lon': md.get('max65'),
        'medoid_lat': md.get('max66')
    })
```

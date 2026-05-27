---
name: alphaearth
description: >-
  Use AlphaEarth Foundations Satellite Embeddings in Google Earth Engine (GEE)
  for change detection and area summarization.
---

# Using AlphaEarth Satellite Embeddings in Google Earth Engine

The Google Satellite Embedding dataset is a global dataset of learned geospatial embeddings produced by **Google and Google DeepMind**. It provides 64-dimensional geospatial embeddings representing the semantic characteristics of Earth's surface at 10-meter resolution.

Use this skill to write Earth Engine scripts for change detection and area summarization.


---

## Core Dataset Specifications

The dataset is an ImageCollection with the id `GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL`.
The embeddings are 64-dimensional, with bands named `A00` through `A63`.

See the catalog page for more information:
[Satellite Embedding V1 (Annual)](https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL)
---

## Change Detection

### 1. Basic Dot Product (Cosine Similarity) & Visualization
Because the bands in `GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL` are already unit vectors, their cosine similarity (dot product) is calculated simply by element-wise multiplication followed by a band sum.

Depending on your spatial scope, use `.first()` for point-based queries or `.mosaic()` for larger geographic regions.

```python
dataset = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL')

# --- OPTION A: For a Point of Interest (POI) ---
point = ee.Geometry.Point([-121.8036, 39.0372])

image1 = dataset.filterDate('2023-01-01', '2024-01-01') \
                .filterBounds(point) \
                .first()

image2 = dataset.filterDate('2024-01-01', '2025-01-01') \
                .filterBounds(point) \
                .first()

# --- OPTION B: For a Large Area of Interest (AOI) ---
# image1 = dataset.filterDate('2023-01-01', '2024-01-01').mosaic()
# image2 = dataset.filterDate('2024-01-01', '2025-01-01').mosaic()

# 1. Qualitative Visualization (Pseudo-RGB parameters)
# Three specific axes of the 64D embedding space provide qualitative surface context.
vis_params = {'min': -0.3, 'max': 0.3, 'bands': ['A01', 'A16', 'A09']}

# 2. Quantitative Similarity (Dot Product)
# Calculates a single-band similarity map from -1.0 to 1.0.
dot_product = image1.multiply(image2).reduce(ee.Reducer.sum())
```

### 2. Vectorizing and Filtering Change Polygons
To extract vector boundaries (polygons) for areas that may have underwent changes:

```python
similarity_threshold = 0.8
area_threshold = 20000
scale = 100

# Mask out pixels that did not undergo change (similarity above threshold)
change_mask = dot_product.lt(similarity_threshold).selfMask()

# Convert changed pixels to polygons
change_vectors = change_mask.reduceToVectors(
    reducer=ee.Reducer.countEvery(),
    geometry=aoi,
    scale=scale,
    maxPixels=1e13
)

# Filter by minimum area threshold
filtered_vectors = change_vectors.map(
    lambda feature: feature.set('area', feature.area(1))
).filter(ee.Filter.gt('area', area_threshold))

# Optional boundary smoothing to eliminate pixelated edges
smoothed_vectors = filtered_vectors.map(
    lambda feature: feature.dissolve(1).buffer(2 * scale).buffer(-2 * scale).simplify(scale / 5)
)
```

---

## Spatial Reduction over Geometry (Re-normalization)

When performing spatial reductions of Satellite Embeddings over specific geometries (such as computing the average embedding of an agricultural field, forest parcel, or administrative boundary using `reduceRegion` or `reduceRegions` with `ee.Reducer.mean()`):

> [!IMPORTANT]
> **You MUST re-normalize the resulting reduced vector back to unit length (magnitude = 1).**
> 
> Because AEF embeddings are unit vectors, spatial averages (like the mean of multiple unit vectors pointing in slightly different directions) will yield a resulting vector with a magnitude strictly **less than 1**. To maintain mathematical consistency for downstream similarity calculations, the reduced vector must be explicitly re-normalized.

### Recipe for Tabular/Feature Re-normalization:
Best when reducing a `ee.FeatureCollection` to export a tabular dataset where each feature row contains the average embedding vector as 64 separate column properties :

```python
def summarize_region(feature):
  feature = ee.Feature(feature)
  geom = feature.geometry()
  dict_data = {}
  sum_sq = ee.Number(0)
  
  # 1. Extract the mean of each band separately and track sum of squares
  for i in range(64):
    band_name = f'A{i:02d}' # Programmatic band name (e.g., A00)
    band_data = embeddings_image.clip(geom).reduceRegion(
        reducer=ee.Reducer.mean(),
        scale=100,
        maxPixels=1e9
    )
    
    val = ee.Number(band_data.get(band_name))
    dict_data[band_name] = val
    sum_sq = sum_sq.add(val.pow(2))

  # 2. Calculate the vector norm (magnitude)
  norm = sum_sq.sqrt()

  # 3. Re-normalize: Divide every value by the norm (check norm > 0 to avoid division by zero)
  normalized_dict = {}
  for i in range(64):
    band_name = f'A{i:02d}'
    old_val = dict_data[band_name]
    normalized_dict[band_name] = ee.Algorithms.If(
        norm.gt(0),
        ee.Number(old_val).divide(norm),
        0
    )

  return feature.set(normalized_dict)

# Map over the collection to reduce and re-normalize each feature region
normalized_feature_data = zipcode_collection.map(summarize_region)
```

---

## 📖 Reference: Quantization & De-quantization (Under the Hood)

To store global high-dimensional embeddings efficiently, the dataset is internally quantized to 8-bit signed integers.

The standard `GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL` asset is a pre-computed mapped collection in GEE that **automatically** de-quantizes the raw signed 8-bit integers into floating-point unit vectors in the range `[-1, 1]`. You do not need to apply any manual de-quantization when using the standard asset.

If you are accessing raw signed 8-bit integers in the raw collection `GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL_RAW`, the non-linear de-quantization mapping used to reconstruct the native float values is:

$$v_{de\_quant} = \text{sign}(v_{raw}) \cdot \left(\frac{v_{raw}}{127.5}\right)^2$$

```python
def de_quantize(raw_image):
  return raw_image.float() \
                  .divide(127.5) \
                  .pow(2) \
                  .multiply(raw_image.signum())
```

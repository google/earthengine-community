---
name: alphaearth_foundations_change_detection
description: >-
  Use AlphaEarth Foundations Satellite Embeddings in Google Earth Engine (GEE)
  for change detection.
---

See introduction in `alphaearth_foundations_core`.

---

## 1. Basic Dot Product (Cosine Similarity) & Visualization

Because the bands in `GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL` are already unit vectors, their cosine similarity (dot product) is calculated simply by element-wise multiplication followed by a band sum.

To select input, use `.first()` for point-based queries or `.mosaic()` for
larger geographic regions.

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

## 2. Vectorizing and Filtering Change Polygons

To extract change polygons:

```python
similarity_threshold = 0.8
area_threshold = 20000
scale = 100

# Mask out pixels that did not undergo change (similarity above threshold)
change_mask = dot_product.lt(similarity_threshold).selfMask()

# Convert changed pixels to polygons
# aoi: User-supplied ee.Geometry Area of Interest
change_vectors = change_mask.reduceToVectors(
    reducer=ee.Reducer.countEvery(),
    geometry=aoi,
    scale=scale,
    maxPixels=1e13
)

# Filter by minimum area threshold
filtered_vectors = change_vectors.map(
    lambda feature: ee.Feature(feature).set('area', ee.Feature(feature).geometry().area(1))
).filter(ee.Filter.gt('area', area_threshold))



```

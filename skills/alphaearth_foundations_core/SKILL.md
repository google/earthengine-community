---
name: alphaearth_foundations_core
description: >-
  Core information for AlphaEarth Foundations Satellite Embeddings in Google Earth Engine (GEE).
---

The Google Satellite Embedding dataset provides 64-dimensional geospatial
embeddings representing the semantic characteristics of Earth's surface at
10-meter resolution.

## Specifications

-   **Dataset ID:** `GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL`
-   **Bands:** 64-dimensional float embeddings, named `A00` through `A63`.
-   **Unit-Vector Guarantee:** The bands are pre-normalized unit vectors (values
    in range `[-1, 1]`).

See the catalog page for more details:
[Satellite Embedding V1 (Annual)](https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL)

---

## Quantization & De-quantization (Under the Hood)

To store global high-dimensional embeddings efficiently, the dataset is internally quantized to 8-bit signed integers.

If you are accessing raw signed 8-bit integers in the raw collection
`GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL_RAW` or direct from the GCS bucket
`gs://alphaearth_foundations/satellite_embedding/v1/annual/`, the non-linear
de-quantization mapping used to reconstruct the native float values is:

$$v_{de\_quant} = \text{sign}(v_{raw}) \cdot \left(\frac{v_{raw}}{127.5}\right)^2$$

> [!NOTE] If reading raw COGs from the GCS bucket, mask the reserved no-data
> value -128 before applying this formula; otherwise it dequantizes to a value
> outside the valid `[-1, 1]` range.

```python
def de_quantize(raw_image):
  # Mask the reserved no-data value -128 before de-quantizing
  raw_image = raw_image.updateMask(raw_image.neq(-128))
  return raw_image.float() \
                  .divide(127.5) \
                  .pow(2) \
                  .multiply(raw_image.signum())
```

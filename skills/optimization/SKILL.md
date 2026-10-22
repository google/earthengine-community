---
name: ee-optimization
description: >-
  Advice for optimizing Google Earth Engine code. Use when debugging memory
  errors, computation timeouts, "Too many concurrent aggregations", browser
  locks, or making EE code run faster and scale. Guides client vs. server usage,
  early filtering, reducer optimization, and batch export strategies.
---

# Earth Engine Code Optimization

Optimize Earth Engine by **shrinking the computation graph before expensive
operations**, **keeping logic on the server**, **setting explicit output scale
and projection**, and **moving heavyweight work to batch**.

## Core Execution Principles

*   **Deferred (Lazy) Execution**: Earth Engine builds a computation graph.
    Execution triggers only on output request (`print()`, `getInfo()`, `Export`,
    Map addition).
*   **Pull-Based Scale and Projection**: The scale and projection in which
    computations take place are determined on a "pull" basis—inputs are
    requested in the output's projection and scale, not the input's native
    projection.

## 1. General Advice

*   **Push Pruning Left**: Filter early! Apply cheap metadata/date filters
    before expensive spatial filters. Do this before `map()`, reducers, joins,
    or exports.
*   **Do Everything on the Server**: Keep loops, conditionals, `print()`, and
    `getInfo()` off server objects (`ee.*`). Do not use them in mapped
    functions.
*   **Avoid Client-side Loops**: Use `map()` + `set()` over collections. Do not
    use `getInfo()` in loops; it triggers blocking calls and freezes execution.

## 2. Common Errors and Solutions

*   **Computation timed out**: Interactive requests fail after ~5 mins. **Fix:**
    Filter early, use coarser scale, or use batch `Export`.
*   **User memory limit exceeded**: **Fix:** No single fix for all situations.
    Some advice: avoid using `toList()` or `toArray()`, which load all data into
    memory at once. Instead, combine reducers, raise `tileScale` (to process
    smaller chunks), or switch to using batch exports.
*   **Too many concurrent aggregations**: Caused by multiplying distributed
    reductions (e.g., `reduceRegion()` inside `map()`). **Fix:** Restructure or
    use `Export`.
*   **Computed value too large**: Result is over the 100 MiB limit imposed by
    the cache. **Fix:** Reduce output size, reduce bands/properties, chunk
    features, use `maxPixelsPerRegion`/`tileScale` where appropriate, or export
    large tables.
*   **Too many pixels in the region**: **Fix:** Raise `maxPixels`, increase
    `scale`, or use `bestEffort: true`.

## 3. Optimization Checklist

*   **Specify Scale and Projection**: Specify an explicit output `scale` for
    reductions; add `crs` or `crsTransform` when reproducibility or grid
    alignment matters, especially for composites/mosaics. (Note: `scale` and
    `crsTransform` are mutually exclusive). If unspecified, EE uses the
    projection of the image's first band. A 1-degree default applies to
    composites/mosaics without a native projection.
*   **Avoid unnecessary `clip()`**: Do not use `clip()` unless analytically
    required (e.g., when the exact masked shape is needed downstream). `clip()`
    forces Earth Engine to apply an expensive boolean mask to every pixel.
    Instead, limit computation bounds by passing the `region` argument to
    reducers or export tasks, which bounds the spatial extent without the
    pixel-masking overhead.
*   **Combine Reducers**: Use `Reducer.combine(..., sharedInputs: true)` to
    compute multiple stats in one pass.
*   **Resampling and Aggregation**: To aggregate finer pixels to coarser pixels,
    use `reduceResolution()`, not just `reproject()` or bumping scale (which
    resamples rather than aggregates). For bilinear or bicubic interpolation,
    use `resample()`.
*   **Avoid `reproject()`**: Calling `reproject()` forces Earth Engine to
    compute the input at the requested scale and projection immediately,
    overriding its default behavior of determining scale dynamically from the
    output (e.g., the Map zoom level or Export scale). This often causes memory
    errors. For interactive maps, use `setDefaultProjection()` to set the CRS
    while still allowing the scale to be determined dynamically by the zoom
    level.
*   **Use `selfMask()` or `updateMask()` instead of `mask()`**: `mask()`
    replaces the current mask entirely, while `updateMask()` performs a logical
    AND with the current mask. Using `mask()` can accidentally unmask invalid
    pixels, forcing Earth Engine to process more pixels downstream.
*   **Treat `tileScale` as a memory lever**: Set `tileScale` (valid values are
    0.1-16) on reducers or sampling functions to shrink processing tiles.
    Increasing `tileScale` divides the tiles by that factor, reducing memory
    required per node. Larger `tileScale` can add overhead, so use it when
    memory is the bottleneck, not by default.
*   **Avoid materialized lists or arrays**: Do not use `toList()` or `toArray()`
    unless absolutely necessary. Arrays are fine for modest time series but
    dangerous at scale, as they load all elements into memory at once. Use
    direct aggregations (like `sum()` or `mean()`) or `toBands()` for stacks
    under 5,000 bands.
*   **Pass Collections Directly to Reducers**: For spatial reductions, pass the
    FeatureCollection directly as the region rather than using `.geometry()`
    (which forces dissolution causing "Too many vertices" errors).
    `clipToCollection()` is acceptable but applies a per-pixel mask, which can
    be expensive.
*   **Set larger `errorMargin`**: When performing geometry operations (like
    `buffer` or `union`), Earth Engine defaults to a very fine error margin,
    which can densify the geometry with millions of vertices. Specify a larger
    `errorMargin` to prevent this and avoid memory errors.
*   **Prefer `saveBest`/`saveFirst` joins**: When joining collections, use
    `saveBest` or `saveFirst` to limit the output cardinality to one match per
    feature. Unconstrained joins can create a massive Cartesian product, leading
    to "computed value too large" errors.
*   **Pre-process Mosaics Server-Side**: Use
    `ee.ImageCollection.qualityMosaic()` or `mosaic()` instead of downloading
    imagery and mosaicking locally. Server-side compositing only transmits the
    final visible pixels, saving massive amounts of bandwidth and local
    processing time compared to downloading raw overlaps.
*   **Efficient Array Reductions**: When computing the minimum and maximum of an
    `ee.Array`, use separate `ee.Reducer.min()` and `ee.Reducer.max()` reducers
    instead of `ee.Reducer.minMax()`. The combined `minMax` reducer is not
    optimized for Arrays.
*   **Avoid OOM on Large Collections**: Do not use `geometry().dissolve()` over
    extremely large `ImageCollection`s. Extract footprints to flat files and
    process externally.
*   **Randomly Subsample Collections Efficiently**: Do not use
    `.randomColumn().sort().limit()`. Sorting forces full materialization. Use
    `.randomColumn()` with `.filter(ee.Filter.lt('random', fraction))` for
    splits. For exact N samples, test `.limit(n, 'random')` on your collection
    size. For imagery, use `sample()` or `stratifiedSample()`. Avoid any method
    that builds huge lists.
*   **Avoid `ee.Algorithms.If()`**: Do not use `If()` to implement branching
    logic inside `map()`. It is highly memory-intensive. Use `filter()` to split
    collections or apply math masks instead.
*   **Optimize Neighborhood Ops**: Canonical morphological operations are
    `focalMin()` and `focalMax()`. For very large structuring elements,
    `fastDistanceTransform()` is a legitimate fast trick.
*   **Optimize `reduceToVectors()`**: Set the scale as coarse as acceptable.
    Never pass the output of `reduceToVectors()` directly into
    `reduceRegions()`; instead, append the bands you need to reduce *before*
    converting to vectors.
*   **Limit Training Data**: Requesting unnecessarily large training datasets
    causes "Computed value too large" errors. Tune hyperparameters (e.g.,
    increasing `minLeafPopulation`) before blindly increasing sample sizes.
*   **Avoid `iterate()` for Time Series**: To compare adjacent images in a time
    series, do not use `iterate()`. Use array-based forward differencing
    instead.
*   **Debugging Workflow**: Test mapped functions on `.first()`, use `.limit()`
    during development. Inspect `.bandNames()`, `.projection()`, and masks. Use
    `aside()` for intermediate inspection. Note that `print()` is capped at
    5,000 elements for collections. Include request/task IDs when reporting
    failures.
*   **Understand Quotas and Limits**: Be aware of the 10 MB request payload
    limit, 100 MiB aggregation-result cache limit, 3,000 pending task queue
    limit, and concurrent aggregation limits. These are often the cause of
    mysterious failures.
*   **Use Profiler and Tasks**: Check CPU/memory in Code Editor Profiler. Check
    Task Manager for export bottlenecks.

## 4. Large Assets & Batch Exports

*   **Switch to Export for Large Tasks**: After simplifying the graph, use batch
    `Export` for long-running computations or large outputs that don't need
    interactive results. Batch tasks can run up to ten days, but are not a magic
    fix for bad graph structure.
*   **Large Raster Exports**: Set `fileDimensions`, `skipEmptyTiles: true`, and
    `formatOptions: {cloudOptimized: true}` for efficient chunking.
*   **Grid Alignment**: For reproducible rasters, prefer `crsTransform` when
    aligning to an existing grid; `scale` alone can shift output grids relative
    to source datasets.
*   **Categorical Asset Exports**: Set `pyramidingPolicy: {'.default': 'mode'}`
    for non-continuous rasters (e.g., classifications or bit masks). Earth
    Engine's default `mean` policy averages pixel values (e.g., averaging class
    1 and 2 into 1.5), which destroys categorical labels in zoomed-out map
    views.
*   **Interactive vs. Batch Requests**: Do not use `Export` for jobs under 2
    minutes. Combine jobs or use `computePixels()`.
*   **High-Volume Endpoint**: `earthengine-highvolume.googleapis.com` has higher
    latency and less caching, and is best for automated simple queries that do
    not require aggregation. For complex analyses, use the standard endpoint or
    batch export.
*   **Avoid Exporting Intermediate Computations**: Compute pure EE logic (e.g.,
    slope) on the fly. Do not export intermediate assets that materialize cheap
    computations.
*   **Visualizing Large Feature Collections**: Create FeatureViews for fast
    rendering of large vector datasets.
*   **Pre-computed Map Tiles**: Use `Export.map.toCloudStorage` to export XYZ
    map tiles for low-latency external apps.
*   **Optimizing COGs After Export**: Earth Engine exports COGs via
    `formatOptions: {cloudOptimized: true}`. After export, optimize further
    using GDAL with ZSTD compression and band interleaving (`-co
    INTERLEAVE=BAND`).
*   **Cloud Inference via Vertex AI**: Run cloud inference using
    `ee.Model.fromVertexAi` instead of downloading imagery.

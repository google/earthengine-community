---
name: debugging
description: Diagnoses and resolves errors in Google Earth Engine JavaScript and Python APIs, including client/server mismatches, memory/timeout issues, projection ambiguities, empty data propagation, and quota/tier restrictions.
---

# Earth Engine Debugging

Most GEE errors trace back to mixing client/server logic, failing to cast
`ee.ComputedObject` results, scale/projection ambiguities, or empty data
propagation.

## 1. Client vs. Server Boundary Failures

Earth Engine relies on a proxy object model. `ee.Image`, `ee.List`, etc., are
server-side blueprints, not local data.

*   **`g.eeObject.name is not a function` / `TypeError: unsupported operand
    type(s) for +: 'Image' and 'int'`**
    *   **Cause:** Mixing a server-side `ee.Object` with a client-side operator
        (e.g., `image + 2`). Client-side JavaScript/Python runs locally and has
        no knowledge of server-side data values. Applying standard operators to
        an proxy object simply coerces the reference into a string or raises a
        type error, silently breaking the logic.
    *   **Fix:** Use server-side methods: `image.add(2)`.
*   **`A mapped function's arguments cannot be used in client-side
    operations.`**
    *   **Cause:** The `map()` function sends enclosed instructions to Earth
        Engine's servers to run in parallel. You cannot include client-side
        functions like `print()`, `getInfo()`, `Map.addLayer()`, `Chart`,
        `Export`, or local JS control flow inside `.map()` because the server
        has no connection to your browser or map.
    *   **Fix:** Keep mapped code server-side. Do not print inside `map()`. To
        debug, isolate one feature (`collection.first()`) and run the function
        outside `map()`.
*   **`User-defined methods must return a value.` / `A mapped algorithm must
    return a Feature or Image.`**
    *   **Cause:** Using `ImageCollection.map()` or `FeatureCollection.map()` to
        return scalars, dates, or nothing.
    *   **Fix:** For `ImageCollection.map`, return an `ee.Image`; for
        `FeatureCollection.map`, return an `ee.Feature`. For scalar outputs, set
        properties and aggregate, or use `ee.List.map()` where appropriate.
*   **Client `if` statements on Server Booleans / Browser Freeze**
    *   **Cause:** `if (myList.contains(5))` evaluates to true because the proxy
        object is truthy. Calling `.getInfo()` in a loop synchronously locks the
        browser.
    *   **Fix:** Use server-side `map()` and `filter()` instead of client-side
        conditionals. To fetch data without freezing the browser, use
        asynchronous `.evaluate(callback)` instead of `.getInfo()`.

## 2. Type Casting and Object Immutability

*   **`... .area is not a function` / `'Element' object has no attribute
    'area'`**
    *   **Cause:** Methods like `.first()`, `List.get()`, and `Dictionary.get()`
        return generic `ee.Element` or `ee.ComputedObject` instances, stripping
        type information.
    *   **Fix:** Explicitly cast objects:
        `ee.Feature(collection.first()).area()` or
        `ee.Number(dict.get('key')).add(5)`.
*   **List Mapping Returning Points instead of Features**
    *   **Cause:** Iterating over geometries to create a `FeatureCollection`
        returns `Point` objects.
    *   **Fix:** Use `ee.List.map()` (not JS `.map()`), and cast explicitly with
        `ee.Feature(ee.Geometry(point))`.
*   **`.set()` Appears to Do Nothing**
    *   **Cause:** `ee.Object`s are immutable. `set()` returns a new object.
    *   **Fix:** Reassign: `image = image.set('myProperty', x)`.
*   **Metadata Loss / Missing `system:time_start` after `.map()`**
    *   **Cause:** Creating new Features or Images inside a `.map()` loop (e.g.,
        via computation or masking) drops original properties like
        `system:time_start`, breaking time-series charts and filtering.
    *   **Fix:** Copy properties from the source object before returning: e.g.,
        `return result.copyProperties(image, ['system:time_start']);`
*   **Tracking Recent Modifications**
    *   **Cause:** `system:time_start` represents the acquisition or composite
        time, not the dataset update time.
    *   **Fix:** Sort by `system:version` to find the most recently updated
        image, or use `reduceColumns` with `ee.Reducer.max()`.

## 3. Scaling, Memory, Timeout, and Aggregation

Address the computation structure first.

*   **`Image.reduceRegion: Too many pixels in the region.` / `Export too
    large`**
    *   **Cause:** Region is too large for the chosen scale, or defaults are
        unrealistic (10M pixels).
    *   **Fix:** Specify `scale` and `geometry`. Then, if intentional, set
        `bestEffort: true` or raise `maxPixels`.
*   **`Computation timed out.`**
    *   **Cause:** Interactive/Code Editor requests have a fixed ~5-minute
        limit. (A separate ~12-hour limit applies to intermediate computations
        within batch tasks, not total job lifetime). Also caused by
        pulling >100MiB via `getInfo()`.
    *   **Fix:** Move large jobs to `Export` (batch mode). Break tasks into
        smaller chunks. Simplify computation structures.
*   **`User memory limit exceeded.` / `Reprojection Output Too Large`**
    *   **Cause:** Earth Engine distributes computation across nodes, and this
        error means a single node ran out of memory. Common culprits forcing too
        much data into one node include converting large collections to lists or
        arrays (`toArray()`, `toList()`), embedding massive vector geometries
        directly in the script, or forcing high-resolution calculations over
        large areas via `reproject()`.
    *   **Fix:** Process in smaller spatial chunks (e.g., 320x320 px), avoid
        array/list conversions if possible, and use `tileScale` sparingly (e.g.,
        4, 8, 16) to subdivide the processing grid if needed (higher tileScale
        reduces memory per node but adds aggregation overhead).

> [!TIP] For extensive memory limits, timeouts, `Too many concurrent
> aggregations`, or `Computed value too large` errors, refer to the
> `ee-optimization` skill.

## 4. Empty Data, Nulls, and Serialization

*   **`Pattern 'X' was applied to an Image with no bands.` / Missing Data
    Errors**
    *   **Cause:** Upstream filtered collections became empty. This often
        happens when calling `.first()`, `.toBands()`, or `.mosaic()` on an
        empty collection, or calling `ee.Dictionary().toImage()` on an empty
        dictionary.
    *   **Fix:** Filter out nulls upstream, or check if the collection is empty
        using `ee.Algorithms.If(collection.size().gt(0), realComputation,
        fallback)`. *Advanced workaround*: merge a fully masked dummy image into
        the collection (warning: dummy images can contaminate reducers, mosaics,
        properties, or time series if not carefully matched).
*   **`If one image has no bands, the other must also have no bands. Got 0 and
    1.`**
    *   **Cause:** Executing band math where one image is an empty composite (0
        bands), usually when `.median()` is called on a filtered collection with
        0 intersecting scenes.
    *   **Fix:** Pre-validate the collection size using
        `ee.Algorithms.If(collection.size().gt(0), ...)`. Note that
        `ee.Algorithms.If()` does *not* short-circuit; it evaluates both the
        true and false branches before returning.
*   **`Number.divide: Parameter 'left' is required.` / `Parameter 'value' is
    required` / `Dictionary does not contain key`**
    *   **Cause:** Null-propagation from empty data. If an upstream
        `reduceRegion()` finds no valid pixels (e.g., the polygon intersects
        less than 0.5% of a pixel center, falls entirely outside the image
        bounds, or hits only masked pixels), it skips the band and returns an
        empty dictionary `{}` instead of `{band: null}`. Subsequent math
        operations attempting to get the band value crash.
    *   **Fix:** Inspect the reduction dictionary. Check
        `.contains('bandName')`. Use `Filter.notNull()` to drop failed
        reductions. If applying weighted reducers over micro-geometries, chain
        `.unweighted()`.
*   **`reduceRegions` on Mosaics Returning Nulls**
    *   **Cause:** Mosaicing across a large `FeatureCollection` can return
        nulls.
    *   **Fix:** Filter the `ImageCollection` by each feature inside the
        `.map()` function instead of mosaicing the entire collection beforehand.
*   **Missing Samples, Missing Dictionary Keys, or Fewer Features Than
    Expected**
    *   **Cause:** Masked pixels are excluded from sampling and reductions. If
        all pixels for a band are masked inside a region, `reduceRegion()` may
        omit that band from the dictionary; if a sampled pixel has masked
        values, `sampleRegions()` may exclude it.
    *   **Fix:** Check masks and band availability before downstream math. Debug
        one band at a time, inspect `image.mask()` and `image.bandNames()`, and
        use `.unmask()` only when a fill value is valid for the analysis.
*   **Band Selection Fails After Reducers or Derived Indices**
    *   **Cause:** Operations often rename or drop bands. Reducers append
        suffixes like `_mean`; `normalizedDifference()` creates `nd`; composites
        may not preserve the names or properties expected downstream.
    *   **Fix:** Print `bandNames()` after every major transformation. Rename
        outputs immediately, e.g. `.rename('NDVI')`, and select the actual
        reducer-generated names.
*   **`ee.ee_exception.EEException: Can't encode object: ...` (Python)**
    *   **Cause:** Passing Python-native objects (e.g., `set`, `NaT`, local
        functions) that Earth Engine cannot serialize.
    *   **Fix:** Convert to EE types (`ee.List`) or JSON-safe primitives
        (`list`).
*   **`OUT_OF_RANGE - Error parsing header`**
    *   **Cause:** Reading an external Cloud Optimized GeoTIFF (COG) with a
        metadata header (many bands/long names) that exceeds EE's reading
        limits.

## 5. Projection, Geometry, and Resampling Limits

*   **Manual Reprojection (`reproject()`)**
    *   **Cause:** Earth Engine's "lazy evaluation" normally computes pixels
        only at the resolution required by the final output. Using manual
        `.reproject()` breaks this optimization, forcing EE to pull and compute
        all data at the specified scale immediately, often leading to memory
        limits.
    *   **Fix:** Let EE handle reprojections dynamically at the end of the graph
        via `scale` parameters in reducers or exports.
*   **Unable to Transform Geometry to Pixel Grid**
    *   **Cause:** The geometry falls outside the mathematical bounds of the
        requested projection. For example, trying to project a global dataset
        into a UTM zone fails because UTM is only valid for a specific longitude
        slice of the Earth.
    *   **Fix:** Clip the geometry to the valid region of the projection using
        intersection before processing (`f.geometry().intersection(valid_region,
        0)`).
*   **Polygon Distortions / Global Slivers**
    *   **Cause:** Polygons crossing the anti-meridian, or using `evenOdd:
        false` (left-inside rule) with geometries that aren't consistently wound
        counter-clockwise. (EE defaults to the even-odd rule where winding order
        doesn't matter).
    *   **Fix:** When exporting global geometries and getting slivers, use
        `geodesic=False`. Ensure proper counter-clockwise winding if overriding
        the even-odd rule.
*   **Request payload size exceeds the limit: 10485760 bytes.**
    *   **Cause:** Inlining large GeoJSON or shapefiles directly into the script
        exceeds the 10 MB payload limit for Earth Engine API requests.
    *   **Fix:** Upload large geometries as Earth Engine assets and load them
        via `ee.FeatureCollection()`.
*   **Poor/Blocky Hillshade & Topographical Resampling Artifacts ("Striping")**
    *   **Cause:** Mosaics default to a 1-degree scale, breaking gradient math.
        Alternatively, if the computation CRS differs from the DEM's native CRS,
        nearest-neighbor resampling causes banding before the 3x3 kernel
        applies.
    *   **Fix:** For DEM collections, call
        `.mosaic().setDefaultProjection(nativeProj)` before `ee.Terrain.*`.
        Single native-projection DEMs (e.g., SRTM in EPSG:4326) work as-is.
        Avoid `reproject()`.
*   **EPSG:4326 and the Degree-to-Meter Unit Mismatch**
    *   **Cause:** In `reduceRegion` and `Export`, `scale` is correctly
        interpreted as meters. However, providing a `crsTransform` using meter
        values with an `EPSG:4326` CRS fails because `crsTransform` values must
        match the CRS units (degrees for EPSG:4326).
    *   **Fix:** Avoid EPSG:4326 for metric analyses unless you understand the
        grid; use a metric/equal-area CRS or specify `scale`/`crsTransform`
        deliberately.
*   **`The default WGS84 projection is invalid for aggregations. Specify a scale
    or crs & crs_transform.`**
    *   **Cause:** Composites (`.median()`, `.mosaic()`) have a deferred default
        projection of WGS-84 at 1-degree resolution. Entering a reducer without
        specifying scale/crs throws this error.
    *   **Fix:** Always specify `scale` or `crs` in `reduceRegion()` or `Export`
        when operating on composites.

## 6. Authentication, Initialization, and Quotas

*   **`Not signed up for Earth Engine or project is not registered.` /
    `ee.Initialize: no project found.`**
    *   **Cause:** EE access is routed through Google Cloud Projects. Code taken
        from older examples using bare `ee.Initialize()` will fail.
    *   **Fix:** `ee.Initialize(project='your-project-id')`. Verify the EE API
        is enabled and caller has correct IAM/Service Usage permissions.
*   **`HTTP 429: Too Many Requests` & `HTTP 503: Service Unavailable`**
    *   **Cause:** 429 indicates per-project rate limits exceeded. 503 indicates
        an Earth Engine server is at capacity (independent of your quota).
    *   **Fix:** Implement exponential backoff on the client side. The client
        library handles this up to 5 times. Beyond that, reduce concurrency.
*   **Sudden Slowness / "Restricted Mode"**
    *   **Cause:** As of April 27, 2026, noncommercial projects use quota tiers
        (Community: 150 EECU-hours, Contributor: 1000 EECU-hours). Exceeding
        this puts the project in "restricted mode" (lower throughput), rather
        than failing outright.
    *   **Fix:** Check monthly EECU-hours. Upgrade tier to Contributor (free,
        requires billing account) if you need more.

## Diagnostic Workflow Checklist

1.  **Read the exact error text & categorize:** Is it client/server?
    Scale/memory? Empty data? Projection? Quota?
2.  **Verify object shape early:** Print/inspect band names, collection sizes,
    and nulls before math. `getInfo()` evaluations are independent; results vary
    if dynamic masking/reducing is involved. Provide explicit `scale` and `crs`
    to ensure consistency.
3.  **For `map()` errors:** Run the function on `collection.first()` outside
    `map()` to expose type-casting or dimensionality collapses.
4.  **Inspect intermediate states:** Inject `.aside(print)` directly into
    server-side operation chains to asynchronously dump intermediate proxy
    objects.
5.  **Use the Earth Engine Profiler:** If code is syntactically sound but
    breaches limits, use the Profiler to track memory consumption (bytes) and
    computational duration (EECU-seconds) for every algorithm to identify
    bottlenecks.
6.  **For memory/timeout/quota errors:** Treat as structural. Filter early,
    reduce late, export big jobs, and increase `tileScale`.

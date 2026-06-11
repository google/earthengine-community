---
name: gee-adhoc-maps
description: 'Build quick interactive HTML maps to inspect Earth Engine results. Use layered overlays on a satellite basemap with per-layer opacity, clear/show-all, and a click-to-get-coordinates tool. Use when you need to eyeball "where / what" (coverage gaps, disagreement, masks) when interacting with Earth Engine outside of the Code Editor or Colab.
---

## What this is for

Throwaway, interactive maps to see a result and sanity-check it: coverage holes,
class masks, where two products disagree, whether an AOI matches reality.

## Implementation

-   Plain `folium` + Earth Engine `getMapId` tile layers. Build a folium map
    directly and add each EE layer as a tile layer from its map-id URL.
-   Tile URLs from `getMapId` will expire in about a day; regenerate the map to
    revisit later.
-   **Note:** `map_id_dict['tile_fetcher'].url_format` might contains
    unformatted placeholders (like `{state.tile_base_url}`) which break Folium.
    Instead, construct the URL manually: `url =
    f"https://earthengine.googleapis.com/v1/{map_id_dict['mapid']}/tiles/{{z}}/{{x}}/{{y}}"`
-   Use a basemap. Add it as the base and hide it from the layer control.
-   Save an `.html` file and open it.
-   **Optional Python Server (for dynamic pixel values):** If the "Pick coords"
    tool needs to show actual Earth Engine layer values, serve the map using a
    Python `http.server` backend with a `/value` endpoint. The map's JavaScript
    can then make `fetch()` calls to query EE dynamically (e.g., via
    `ee.Image.reduceRegion`).

## Basic Controls (more can be added)

-   **Per-layer opacity sliders, embedded in each layer-control row**
    (Code-Editor style): tag each EE layer with a CSS class, then on page load
    add a range slider to every overlay row that sets that layer's opacity.
    **Note:** Folium-generated TileLayers do not have a `name` attribute in
    their Leaflet `options`, so you cannot match layers by name. Instead,
    extract the internal layer ID directly from the checkbox element (`var
    layerId = input.layerId;`) and adjust its opacity using
    `map_instance._layers[layerId].setOpacity(op);`.
-   **Clear all / Show all buttons**, placed next to the layer control.
    Implement by clicking each overlay checkbox through Leaflet's own handler so
    layer state stays consistent (and layers can be toggled back on).
-   **"Pick coords" toggle** (off by default): when on, the cursor becomes a
    crosshair and a map click drops a lat/lon popup; when off, clicks just pan.
    Grab the Leaflet map instance from the page's globals and gate the click
    handler on the toggle.
-   Disable click/scroll propagation on custom controls so interacting with them
    doesn't pan the map.

## Layer design principles

-   **Categorical / raw-class layers:** remap class codes to contiguous values
    and apply a palette; put the class order in the layer name so the name
    doubles as a legend.
-   **Reference boundaries** (lake polygon, AOI, admin) as styled outlines with
    no fill, on top.
-   **Optical true-color backdrop** (e.g. Sentinel-2) for human context under
    the overlays.
-   Offer the raw underlying layers (each product's full class image, unmasked)
    as toggles: they're the real verification tool when a derived layer looks
    wrong.

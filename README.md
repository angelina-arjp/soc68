# Harvard Property Storymap

A GitHub-ready, scroll-driven story map for campus landholdings, planning histories, neighborhood change, and redevelopment. This version is designed to be easier to adapt than a one-off newsroom project: chapters, camera moves, image states, and overlay toggles all live in config and GeoJSON.

## What this repo includes

- A sticky MapLibre map with scroll-triggered camera changes
- A timeline slider that updates parcel visibility and styling
- Config-driven chapter steps in `assets/js/config.js`
- Chapter-specific overlays loaded from `data/overlays.geojson`
- A sticky media frame that swaps images as the reader scrolls
- A built-in before/after image comparison component
- GitHub Pages deployment through Actions

## Quick start

### 1. Preview locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

You can also use the package script:

```bash
npm run preview
```

### 2. Push to your own GitHub repo

```bash
git init
git add .
git commit -m "Initial story map"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/harvard-property-storymap.git
git push -u origin main
```

### 3. Turn on GitHub Pages

In your GitHub repository:

1. Go to **Settings** → **Pages**
2. Under **Build and deployment**, choose **GitHub Actions**
3. Push to `main` again if the deployment does not start automatically

The included workflow file is `.github/workflows/pages.yml`.

## Files you will edit most

```text
assets/js/config.js         Story structure, years, camera moves, image states
assets/js/main.js           Reusable map + scroll logic
assets/css/styles.css       Layout, colors, typography, card styling
data/properties.geojson     Parcel polygons and parcel metadata
data/overlays.geojson       Overlay polygons, lines, and routes by layer_id
assets/images/              Archival photos, plans, maps, and comparison images
```

## Config structure

Each subsection in `assets/js/config.js` can control the map and media.

```js
{
  id: "chapter-2-step-1",
  timelineYear: 1955,
  text: "Narrative text for this step.",
  camera: {
    center: [-71.1271, 42.3628],
    zoom: 14.2,
    pitch: 0,
    bearing: 0,
  },
  showLayers: ["allston-corridor", "river-edge"],
  focusPropertyIds: ["allston-001", "allston-002"],
  media: {
    type: "compare",
    beforeSrc: "./assets/images/allston-before.svg",
    afterSrc: "./assets/images/allston-after.svg",
    beforeLabel: "Earlier landscape",
    afterLabel: "Later plan",
    caption: "Optional caption",
    credit: "Optional credit",
  },
}
```

### Supported step fields

- `id`: unique scroll-step id
- `timelineYear`: year used by the timeline slider and parcel styling
- `text`: main narrative text
- `quote`, `quoteAuthor`, `quoteSource`: optional quotation block
- `camera.center`, `camera.zoom`, `camera.pitch`, `camera.bearing`: map view for the step
- `showLayers`: list of overlay `layer_id` values to make visible
- `focusPropertyIds`: list of parcel ids to outline in the focus color
- `media`: one of the following
  - `type: "image"` with `src`, `alt`, `caption`, `credit`
  - `type: "compare"` with `beforeSrc`, `afterSrc`, labels, caption, credit

## GeoJSON schema

### `data/properties.geojson`

Use polygon features for parcels or building footprints. The most important properties are:

- `id` — unique parcel id
- `name` — display name for hover popup
- `address` — optional popup line
- `year_start` — first year the holding is active in the story
- `year_end` — final year the holding is active; use `null` for present-day holdings
- `currently_owned` — `true` or `false`
- `currently_exists` — `true` if the structure or footprint should still be drawable after sale or demolition
- `lat`, `lon` — optional reference coordinates
- `group` — optional grouping tag

Example:

```json
{
  "type": "Feature",
  "properties": {
    "id": "allston-001",
    "name": "Western Avenue Parcel",
    "address": "Western Ave, Allston, MA",
    "year_start": 1985,
    "year_end": null,
    "currently_owned": true,
    "currently_exists": true,
    "lat": 42.3633,
    "lon": -71.1266
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[-71.129, 42.362], [-71.1248, 42.362], [-71.1248, 42.3645], [-71.129, 42.3645], [-71.129, 42.362]]]
  }
}
```

### `data/overlays.geojson`

Overlay features can be polygons, lines, or points. Group related features with the same `layer_id` so a step can reveal them all at once.

Recommended properties:

- `layer_id` — required id used in `showLayers`
- `name` — human-readable label
- `stroke` — outline or line color
- `fill` — polygon fill color
- `opacity` — overlay opacity
- `line_width` — line width for line and outline layers

Example:

```json
{
  "type": "Feature",
  "properties": {
    "layer_id": "allston-corridor",
    "name": "Allston corridor",
    "stroke": "#1f6f8b",
    "fill": "#1f6f8b",
    "opacity": 0.12,
    "line_width": 2.5
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[-71.1353, 42.3596], [-71.1215, 42.3596], [-71.1215, 42.3655], [-71.1353, 42.3655], [-71.1353, 42.3596]]]
  }
}
```

## Suggested workflow for your Harvard version

1. Replace the sample parcels in `data/properties.geojson` with real Harvard parcel polygons
2. Add overlays for things like historical campus plans, zoning districts, road changes, or expansion corridors
3. Rewrite `assets/js/config.js` around 3 to 6 chapters with 2 to 5 steps each
4. Replace the placeholder SVGs in `assets/images/` with archival images, maps, or screenshots
5. Tune the camera for each step until the narrative feels intentional rather than generic

## Adapting this to your thesis or reporting project

This structure works especially well if your story is built around a few recurring questions, for example:

- When did Harvard acquire specific parcels or corridors?
- How did planning documents frame the institution's future?
- What neighborhood groups, state actors, or city boards pushed back?
- Where do current projects repeat older patterns of institutional land use?

## Credits and reuse

This repo is a fresh, generalized starter intended for your own reporting or research site. Replace the placeholder images, text, and sample geometries before publication.

import { chapters, siteConfig } from "./config.js";

const DATA_PATH = "./data/properties.geojson";
const OVERLAYS_PATH = "./data/overlays.geojson";
const CURRENT_COLOR = "#a51c30";
const FORMER_COLOR = "#111111";
const OUTLINE_COLOR = "rgba(255,255,255,0.95)";
const HIGHLIGHT_COLOR = "#ffb15c";
const DEFAULT_POPUP_HTML = "<strong>Parcel</strong>";

let map;
let popup;
let overlayRegistry = [];
let stepLookup = new Map();
let activeStepId = null;

const stepList = chapters.flatMap((chapter) =>
  chapter.subsections.map((step, index) => ({
    ...step,
    chapterId: chapter.id,
    chapterTitle: chapter.chapterTitle,
    chapterImage: chapter.image,
    chapterImageAlt: chapter.imageAlt,
    chapterImageCredit: chapter.imageCredit,
    order: `${chapter.id}-${index}`,
  }))
);

stepLookup = new Map(stepList.map((step) => [step.id, step]));

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getMediaConfig(step) {
  if (step?.media) {
    return step.media;
  }

  if (step?.chapterImage) {
    return {
      type: "image",
      src: step.chapterImage,
      alt: step.chapterImageAlt || "",
      credit: step.chapterImageCredit || "",
      caption: "",
    };
  }

  return null;
}

function buildCompareMarkup(media) {
  return `
    <div class="compare-card">
      <div class="compare-shell" data-compare>
        <img class="compare-image base" src="${escapeHtml(media.afterSrc)}" alt="${escapeHtml(media.alt || "")}" />
        <div class="compare-overlay" data-compare-overlay style="width: 50%;">
          <img class="compare-image" src="${escapeHtml(media.beforeSrc)}" alt="${escapeHtml(media.alt || "")}" />
        </div>
        <div class="compare-divider" data-compare-divider style="left: 50%;"></div>
        <div class="compare-label before">${escapeHtml(media.beforeLabel || "Before")}</div>
        <div class="compare-label after">${escapeHtml(media.afterLabel || "After")}</div>
      </div>
      <label class="compare-range-label" for="compare-range">Adjust comparison</label>
      <input id="compare-range" class="compare-range" type="range" min="0" max="100" value="50" />
    </div>
  `;
}

function renderStoryMedia(step) {
  const mediaRoot = byId("story-media-content");
  const title = byId("story-media-title");
  const note = byId("story-media-note");
  const media = getMediaConfig(step);

  title.textContent = step?.chapterTitle || siteConfig.title;
  note.textContent = step?.timelineYear ? `Media tied to ${step.timelineYear}` : "";

  if (!media) {
    mediaRoot.innerHTML = "<p class="media-empty">Add images, map scans, or before/after comparisons in assets/images and reference them in config.js.</p>";
    return;
  }

  if (media.type === "compare") {
    mediaRoot.innerHTML = `
      ${buildCompareMarkup(media)}
      ${media.caption ? `<p class="media-caption">${escapeHtml(media.caption)}</p>` : ""}
      ${media.credit ? `<p class="media-credit">${escapeHtml(media.credit)}</p>` : ""}
    `;
    wireCompareSlider();
    return;
  }

  mediaRoot.innerHTML = `
    <figure class="media-figure">
      <img class="media-image" src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt || "")}" />
      ${media.caption ? `<figcaption class="media-caption">${escapeHtml(media.caption)}</figcaption>` : ""}
      ${media.credit ? `<p class="media-credit">${escapeHtml(media.credit)}</p>` : ""}
    </figure>
  `;
}

function wireCompareSlider() {
  const range = byId("compare-range");
  const overlay = document.querySelector("[data-compare-overlay]");
  const divider = document.querySelector("[data-compare-divider]");

  if (!range || !overlay || !divider) {
    return;
  }

  const sync = () => {
    const value = `${range.value}%`;
    overlay.style.width = value;
    divider.style.left = value;
  };

  sync();
  range.addEventListener("input", sync);
}

function renderStory() {
  document.title = siteConfig.title;
  byId("eyebrow").textContent = siteConfig.eyebrow;
  byId("site-title").textContent = siteConfig.title;
  byId("site-subtitle").textContent = siteConfig.subtitle;
  byId("slider-label").textContent = siteConfig.selectedYearLabel;

  const container = byId("chapters-container");
  container.innerHTML = "";

  chapters.forEach((chapter) => {
    const intro = document.createElement("section");
    intro.className = "story-block chapter-card";
    intro.innerHTML = `
      <p class="chapter-kicker">${escapeHtml(chapter.chapterYears)}</p>
      <h2>${escapeHtml(chapter.chapterTitle)}</h2>
      ${chapter.image ? `<img class="chapter-image" src="${escapeHtml(chapter.image)}" alt="${escapeHtml(chapter.imageAlt || "")}" />` : ""}
      ${chapter.imageCredit ? `<p class="image-credit">${escapeHtml(chapter.imageCredit)}</p>` : ""}
    `;
    container.appendChild(intro);

    chapter.subsections.forEach((step, index) => {
      const element = document.createElement("section");
      element.className = "story-block step-card";
      element.id = step.id;
      element.dataset.stepId = step.id;
      element.dataset.chapterId = chapter.id;
      element.dataset.stepIndex = String(index);

      const quoteHtml = step.quote
        ? `
          <blockquote class="quote-block">
            <p>${escapeHtml(step.quote)}</p>
            ${step.quoteAuthor ? `<footer>${escapeHtml(step.quoteAuthor)}</footer>` : ""}
            ${step.quoteSource ? `<p class="quote-source">${escapeHtml(step.quoteSource)}</p>` : ""}
          </blockquote>`
        : "";

      const tags = [];
      if (step.timelineYear) tags.push(`<span>${escapeHtml(step.timelineYear)}</span>`);
      if (step.showLayers?.length) tags.push(`<span>${escapeHtml(step.showLayers.join(" • "))}</span>`);

      element.innerHTML = `
        <div class="step-meta">${tags.join("")}</div>
        <p>${step.text}</p>
        ${quoteHtml}
      `;

      container.appendChild(element);
    });
  });
}

function propertyFilter(year) {
  return [
    "all",
    ["<=", ["coalesce", ["get", "year_start"], 0], year],
    [
      "any",
      [">=", ["coalesce", ["get", "year_end"], 9999], year],
      ["==", ["coalesce", ["get", "currently_exists"], true], true],
    ],
  ];
}

function propertyColorExpression(year) {
  return [
    "case",
    [
      "all",
      ["<", ["coalesce", ["get", "year_end"], 9999], year],
      ["==", ["coalesce", ["get", "currently_owned"], true], false],
    ],
    FORMER_COLOR,
    CURRENT_COLOR,
  ];
}

function propertyHighlightFilter(ids = []) {
  if (!ids.length) {
    return ["==", ["get", "id"], "__none__"];
  }

  return ["match", ["get", "id"], ids, true, false];
}

function popupHtml(properties) {
  const rows = [
    properties.name ? `<strong>${escapeHtml(properties.name)}</strong>` : DEFAULT_POPUP_HTML,
    properties.address ? escapeHtml(properties.address) : "",
    properties.year_start ? `Start: ${escapeHtml(properties.year_start)}` : "",
    properties.year_end ? `End: ${escapeHtml(properties.year_end)}` : "Active through present",
    typeof properties.currently_owned === "boolean"
      ? `Currently owned: ${properties.currently_owned ? "Yes" : "No"}`
      : "",
  ].filter(Boolean);

  return rows.join("<br />");
}

async function loadJson(path, fallback = { type: "FeatureCollection", features: [] }) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Could not load ${path}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(error);
    return fallback;
  }
}

function uniqueOverlayIds(overlays) {
  return [...new Set((overlays.features || []).map((feature) => feature?.properties?.layer_id).filter(Boolean))];
}

function geometryKinds(features, layerId) {
  return new Set(
    features
      .filter((feature) => feature?.properties?.layer_id === layerId)
      .map((feature) => feature?.geometry?.type)
  );
}

function representativeStyle(features, layerId) {
  return (
    features.find((feature) => feature?.properties?.layer_id === layerId)?.properties || {
      stroke: "#1f6f8b",
      fill: "#1f6f8b",
      opacity: 0.2,
      line_width: 2,
    }
  );
}

function addOverlayLayers(mapInstance, overlays) {
  overlayRegistry = [];
  const features = overlays.features || [];

  uniqueOverlayIds(overlays).forEach((layerId) => {
    const geometrySet = geometryKinds(features, layerId);
    const style = representativeStyle(features, layerId);
    const filter = ["==", ["get", "layer_id"], layerId];

    if (geometrySet.has("Polygon") || geometrySet.has("MultiPolygon")) {
      const fillId = `overlay-fill-${layerId}`;
      mapInstance.addLayer({
        id: fillId,
        type: "fill",
        source: "overlays",
        filter,
        layout: { visibility: "none" },
        paint: {
          "fill-color": style.fill || style.stroke || "#1f6f8b",
          "fill-opacity": typeof style.opacity === "number" ? style.opacity : 0.12,
        },
      });
      overlayRegistry.push({ layerId, mapLayerId: fillId });

      const outlineId = `overlay-outline-${layerId}`;
      mapInstance.addLayer({
        id: outlineId,
        type: "line",
        source: "overlays",
        filter,
        layout: { visibility: "none" },
        paint: {
          "line-color": style.stroke || style.fill || "#1f6f8b",
          "line-width": style.line_width || 2,
          "line-opacity": 0.95,
        },
      });
      overlayRegistry.push({ layerId, mapLayerId: outlineId });
    }

    if (geometrySet.has("LineString") || geometrySet.has("MultiLineString")) {
      const lineId = `overlay-line-${layerId}`;
      mapInstance.addLayer({
        id: lineId,
        type: "line",
        source: "overlays",
        filter,
        layout: { visibility: "none" },
        paint: {
          "line-color": style.stroke || "#1f6f8b",
          "line-width": style.line_width || 3,
          "line-opacity": typeof style.opacity === "number" ? Math.min(style.opacity, 1) : 0.9,
        },
      });
      overlayRegistry.push({ layerId, mapLayerId: lineId });
    }

    if (geometrySet.has("Point") || geometrySet.has("MultiPoint")) {
      const pointId = `overlay-point-${layerId}`;
      mapInstance.addLayer({
        id: pointId,
        type: "circle",
        source: "overlays",
        filter,
        layout: { visibility: "none" },
        paint: {
          "circle-radius": 6,
          "circle-color": style.stroke || style.fill || "#1f6f8b",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1.5,
        },
      });
      overlayRegistry.push({ layerId, mapLayerId: pointId });
    }
  });
}

function setOverlayVisibility(visibleIds = []) {
  const visible = new Set(visibleIds);
  overlayRegistry.forEach(({ layerId, mapLayerId }) => {
    if (!map.getLayer(mapLayerId)) {
      return;
    }
    map.setLayoutProperty(mapLayerId, "visibility", visible.has(layerId) ? "visible" : "none");
  });

  const text = visibleIds.length ? visibleIds.join(", ") : "None";
  byId("overlay-status").textContent = text;
}

function updateYear(year) {
  byId("slider-year").textContent = String(year);
  byId("map-slider").value = String(year);

  if (!map || !map.getLayer("properties-fill")) {
    return;
  }

  map.setFilter("properties-fill", propertyFilter(year));
  map.setFilter("properties-outline", propertyFilter(year));
  map.setPaintProperty("properties-fill", "fill-color", propertyColorExpression(year));
}

function updateStepClasses(stepId) {
  document.querySelectorAll(".step-card").forEach((element) => {
    element.classList.toggle("active", element.id === stepId);
  });
}

function updateMapState(step) {
  if (!step || !map) {
    return;
  }

  updateYear(step.timelineYear || siteConfig.initialYear);
  renderStoryMedia(step);
  setOverlayVisibility(step.showLayers || []);
  byId("map-state-title").textContent = step.chapterTitle || siteConfig.title;
  byId("map-state-step").textContent = step.timelineYear
    ? `Focused on ${step.timelineYear}`
    : "Focused step";

  if (map.getLayer("properties-highlight")) {
    map.setFilter("properties-highlight", propertyHighlightFilter(step.focusPropertyIds || []));
  }

  const camera = { ...siteConfig.defaultCamera, ...(step.camera || {}) };
  map.flyTo({
    center: camera.center,
    zoom: camera.zoom,
    bearing: camera.bearing || 0,
    pitch: camera.pitch || 0,
    speed: 0.65,
    curve: 1.3,
    essential: true,
  });
}

function activateStep(stepId) {
  if (!stepId || stepId === activeStepId) {
    return;
  }

  activeStepId = stepId;
  const step = stepLookup.get(stepId);
  updateStepClasses(stepId);
  updateMapState(step);
}

function setupObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateStep(entry.target.id);
        }
      });
    },
    {
      root: null,
      rootMargin: "-20% 0px -56% 0px",
      threshold: 0,
    }
  );

  document.querySelectorAll(".step-card").forEach((card) => observer.observe(card));
}

function setupSlider() {
  const slider = byId("map-slider");
  slider.min = String(siteConfig.startYear);
  slider.max = String(siteConfig.endYear);
  slider.value = String(siteConfig.initialYear);
  byId("slider-year").textContent = String(siteConfig.initialYear);

  slider.addEventListener("input", (event) => {
    const year = Number(event.target.value);
    updateYear(year);
  });
}

function setupNavigation() {
  byId("jump-first-step").addEventListener("click", () => {
    const firstStep = stepList[0];
    if (!firstStep) return;
    document.getElementById(firstStep.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function attachPropertyHover() {
  const hoverLayers = ["properties-fill", "properties-highlight"];

  hoverLayers.forEach((layerId) => {
    map.on("mousemove", layerId, (event) => {
      const feature = event.features?.[0];
      if (!feature) {
        return;
      }
      map.getCanvas().style.cursor = "pointer";
      popup
        .setLngLat(event.lngLat)
        .setHTML(popupHtml(feature.properties || {}))
        .addTo(map);
    });
  });

  hoverLayers.forEach((layerId) => {
    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  });
}

async function init() {
  renderStory();
  setupSlider();
  setupNavigation();

  const [properties, overlays] = await Promise.all([
    loadJson(DATA_PATH),
    loadJson(OVERLAYS_PATH),
  ]);

  map = new maplibregl.Map({
    container: "map",
    center: siteConfig.defaultCamera.center,
    zoom: siteConfig.defaultCamera.zoom,
    bearing: siteConfig.defaultCamera.bearing || 0,
    pitch: siteConfig.defaultCamera.pitch || 0,
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap contributors",
        },
      },
      layers: [
        {
          id: "osm",
          type: "raster",
          source: "osm",
        },
      ],
    },
  });

  map.addControl(new maplibregl.NavigationControl(), "top-right");
  popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });

  map.on("load", () => {
    map.addSource("properties", {
      type: "geojson",
      data: properties,
    });

    map.addSource("overlays", {
      type: "geojson",
      data: overlays,
    });

    map.addLayer({
      id: "properties-fill",
      type: "fill",
      source: "properties",
      paint: {
        "fill-color": propertyColorExpression(siteConfig.initialYear),
        "fill-opacity": 0.7,
      },
      filter: propertyFilter(siteConfig.initialYear),
    });

    map.addLayer({
      id: "properties-outline",
      type: "line",
      source: "properties",
      paint: {
        "line-color": OUTLINE_COLOR,
        "line-width": 1.6,
        "line-opacity": 1,
      },
      filter: propertyFilter(siteConfig.initialYear),
    });

    addOverlayLayers(map, overlays);

    map.addLayer({
      id: "properties-highlight",
      type: "line",
      source: "properties",
      paint: {
        "line-color": HIGHLIGHT_COLOR,
        "line-width": 4,
        "line-opacity": 1,
      },
      filter: propertyHighlightFilter([]),
    });

    attachPropertyHover();
    setupObserver();
    if (stepList[0]) {
      activateStep(stepList[0].id);
    }
  });
}

init();

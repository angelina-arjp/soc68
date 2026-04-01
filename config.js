export const siteConfig = {
  title: "Harvard Property Storymap",
  eyebrow: "Advanced GitHub-ready starter",
  subtitle:
    "A reusable scroll-driven map for tracing campus landholdings, planning documents, neighborhood conflict, and expansion over time.",
  selectedYearLabel: "Selected year",
  startYear: 1636,
  endYear: 2026,
  initialYear: 2026,
  defaultCamera: {
    center: [-71.1205, 42.3675],
    zoom: 12.7,
    pitch: 0,
    bearing: 0,
  },
};

export const chapters = [
  {
    id: "chapter-1",
    chapterTitle: "1636–1900: Foundations in Cambridge",
    chapterYears: "1636–1900",
    image: "./assets/images/harvard-yard.svg",
    imageAlt: "Placeholder image for Harvard Yard.",
    imageCredit: "Replace with your own archival source credit.",
    subsections: [
      {
        id: "chapter-1-step-1",
        timelineYear: 1636,
        text:
          "Use an opening step like this to introduce Harvard's earliest institutional geography, the colonial landscape, or the original concentration of land and buildings in Cambridge.",
        camera: {
          center: [-71.1169, 42.3747],
          zoom: 15.1,
        },
        showLayers: ["cambridge-core"],
        focusPropertyIds: ["yard-001"],
        media: {
          type: "image",
          src: "./assets/images/harvard-yard.svg",
          alt: "Placeholder media for Harvard Yard.",
          caption: "Swap in a campus map, insurance atlas plate, or archival photograph.",
          credit: "Placeholder media",
        },
      },
      {
        id: "chapter-1-step-2",
        timelineYear: 1885,
        text:
          "This second step shows how each chapter can move the map, toggle overlays, and keep the narrative centered on a single argument rather than a generic timeline.",
        quote: "Sample archival quote goes here.",
        quoteAuthor: "Planner, donor, resident, or historian",
        quoteSource: "Document title or newspaper citation",
        camera: {
          center: [-71.1182, 42.3741],
          zoom: 14.6,
          bearing: -8,
        },
        showLayers: ["cambridge-core"],
        focusPropertyIds: ["yard-001"],
        media: {
          type: "image",
          src: "./assets/images/harvard-yard.svg",
          alt: "A second Harvard Yard placeholder.",
          caption: "Pair a map change with a caption, quote, or archival note.",
          credit: "Placeholder media",
        },
      },
    ],
  },
  {
    id: "chapter-2",
    chapterTitle: "1900–1970: Planning, infrastructure, and institutional reach",
    chapterYears: "1900–1970",
    image: "./assets/images/allston-rail-yard.svg",
    imageAlt: "Placeholder image for Allston.",
    imageCredit: "Replace with your own source credit.",
    subsections: [
      {
        id: "chapter-2-step-1",
        timelineYear: 1955,
        text:
          "Use the middle section for land assembly, planning reports, zoning fights, road projects, or the kinds of infrastructural shifts that changed how Harvard related to the surrounding city.",
        camera: {
          center: [-71.1271, 42.3628],
          zoom: 14.2,
        },
        showLayers: ["allston-corridor", "river-edge"],
        focusPropertyIds: ["allston-001", "allston-002"],
        media: {
          type: "compare",
          beforeSrc: "./assets/images/allston-before.svg",
          afterSrc: "./assets/images/allston-after.svg",
          beforeLabel: "Earlier landscape",
          afterLabel: "Later plan",
          alt: "Illustrative before and after comparison.",
          caption: "The sticky media frame updates as the reader scrolls. You can use this for before/after maps or site plans.",
          credit: "Placeholder media",
        },
      },
      {
        id: "chapter-2-step-2",
        timelineYear: 1970,
        text:
          "Overlay visibility is config-driven. Add a new overlay feature to overlays.geojson, give it a layer_id, and reference that id in showLayers for any step that should reveal it.",
        camera: {
          center: [-71.1248, 42.3612],
          zoom: 14.6,
          pitch: 20,
        },
        showLayers: ["allston-corridor", "river-edge"],
        focusPropertyIds: ["allston-001", "river-001"],
        media: {
          type: "image",
          src: "./assets/images/allston-rail-yard.svg",
          alt: "Placeholder image for Allston planning.",
          caption: "Good place for a planning diagram, article clipping, or annotated map.",
          credit: "Placeholder media",
        },
      },
    ],
  },
  {
    id: "chapter-3",
    chapterTitle: "1970–present: Allston, redevelopment, and public conflict",
    chapterYears: "1970–present",
    image: "./assets/images/allston-after.svg",
    imageAlt: "Placeholder image for the current era.",
    imageCredit: "Replace with your own source credit.",
    subsections: [
      {
        id: "chapter-3-step-1",
        timelineYear: 2003,
        text:
          "Bring the reader forward with acquisitions, rezoning, lab development, community organizing, affordability debates, or fights over whose future the land is being planned for.",
        camera: {
          center: [-71.1210, 42.3606],
          zoom: 14.4,
          bearing: 12,
        },
        showLayers: ["allston-corridor", "river-edge"],
        focusPropertyIds: ["river-001"],
        media: {
          type: "image",
          src: "./assets/images/allston-after.svg",
          alt: "Placeholder current era image.",
          caption: "You can pair this step with a hearing photo, rendering, or campaign graphic.",
          credit: "Placeholder media",
        },
      },
      {
        id: "chapter-3-step-2",
        timelineYear: 2026,
        text:
          "The final steps can narrow the frame to a single corridor, project site, or claim. That usually reads better than trying to summarize every parcel at once.",
        camera: {
          center: [-71.1263, 42.3624],
          zoom: 15,
          pitch: 28,
          bearing: -10,
        },
        showLayers: ["allston-corridor", "river-edge"],
        focusPropertyIds: ["allston-001", "river-001"],
        media: {
          type: "compare",
          beforeSrc: "./assets/images/allston-before.svg",
          afterSrc: "./assets/images/allston-after.svg",
          beforeLabel: "Then",
          afterLabel: "Now",
          alt: "Illustrative then and now comparison.",
          caption: "Use the comparison state for historical aerials, zoning maps, or renderings layered against earlier conditions.",
          credit: "Placeholder media",
        },
      },
    ],
  },
];

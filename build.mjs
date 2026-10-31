// Zero-dependency modular compiler: assembles src/styles/*, src/regions/*, and src/components/* into index.html
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function readTsStringExport(relPath, exportName) {
  const raw = fs.readFileSync(path.join(root, relPath), "utf8");
  const re = new RegExp("export const " + exportName + "\\s*=\\s*(\"[\\s\\S]*?\"|`[\\s\\S]*?`);");
  const m = raw.match(re);
  if (!m) throw new Error("Missing export " + exportName + " in " + relPath);
  if (m[1].startsWith("`")) {
    return m[1].slice(1, -1);
  }
  return JSON.parse(m[1]);
}

const css = fs.readFileSync(path.join(root, "src/styles/app.css"), "utf8");
const controllerJs = fs.readFileSync(path.join(root, "src/components/mapAndTabsController.js"), "utf8");

const hero = readTsStringExport("src/regions/munich/MunichHeader.ts", "MunichHeroHtml");
const alerts = readTsStringExport("src/regions/munich/MunichHeader.ts", "MunichAlertsHtml");
const mapShell = readTsStringExport("src/regions/munich/MunichHeader.ts", "MunichMapShellHtml");
const tabsNav = readTsStringExport("src/regions/munich/MunichHeader.ts", "MunichTabsNavHtml");

const secItinerary = readTsStringExport("src/regions/munich/MunichItinerarySection.ts", "MunichItinerarySection");
const secBookingsPacking = readTsStringExport("src/regions/munich/MunichBookingsAndPackingSection.ts", "MunichBookingsAndPackingSection");
const secBerlin = readTsStringExport("src/regions/berlin/BerlinSection.ts", "BerlinSectionHtml");
const secBlackForest = readTsStringExport("src/regions/blackforest/BlackForestSection.ts", "BlackForestSectionHtml");
const secGmaps = readTsStringExport("src/regions/munich/MunichGmapsAuditSection.ts", "MunichGmapsAuditSection");
const secFoodBeer = readTsStringExport("src/regions/munich/MunichFoodBeerSection.ts", "MunichFoodBeerSection");
const secTrails = readTsStringExport("src/regions/munich/MunichTrailsSection.ts", "MunichTrailsSection");
const secMuseums = readTsStringExport("src/regions/munich/MunichMuseumsHoodsSection.ts", "MunichMuseumsHoodsSection");
const secTransport = readTsStringExport("src/regions/munich/MunichTransportSection.ts", "MunichTransportSection");
const secHk = readTsStringExport("src/regions/munich/MunichHkHiccupsSection.ts", "MunichHkHiccupsSection");

const hasLocalConfig = fs.existsSync(path.join(root, "local-config.js"));
const localConfigTag = hasLocalConfig ? '<script src="local-config.js"></script>\n' : '';

const html0 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Munich &amp; Bavaria Autumn-Winter Trip Planner | 13–19 Nov 2026</title>
  <link rel="stylesheet" href="assets/vendor/leaflet.css">
  <style>
${css}
  </style>
</head>
<body>
${hero}

<div class="container">
  ${alerts}

  ${mapShell}

  ${tabsNav}

  ${secBookingsPacking}

  ${secBerlin}

  ${secBlackForest}

  ${secItinerary}

  ${secGmaps}

  ${secFoodBeer}

  ${secTrails}

  ${secMuseums}

  ${secTransport}

  ${secHk}

  <footer>
    <p>Munich &amp; Bavaria Bespoke Interactive Planner (13–19 November 2026) · Prepared for Tak Hin Lee &amp; Yun Yu Tang · Modular Component Architecture</p>
  </footer>
</div>

${localConfigTag}<script src="assets/vendor/leaflet.js"></script>
<script>
${controllerJs}
</script>
</body>
</html>
`;

// Mobile responsiveness: wrap wide tables in horizontally scrollable containers
const html = html0.replace(
  /(<table class="fare-table">[\s\S]*?<\/table>)/g,
  '<div class="table-scroll">$1</div>'
);

fs.writeFileSync(path.join(root, "index.html"), html, "utf8");
console.log("Built index.html from modular src/ components (" + Buffer.byteLength(html, "utf8") + " bytes)");

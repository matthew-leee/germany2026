// Modular Munich Region Assembly
import { MunichHeroHtml, MunichAlertsHtml, MunichMapShellHtml, MunichTabsNavHtml } from "./MunichHeader";
import { MunichItinerarySection } from "./MunichItinerarySection";
import { MunichGmapsAuditSection } from "./MunichGmapsAuditSection";
import { MunichFoodBeerSection } from "./MunichFoodBeerSection";
import { MunichTrailsSection } from "./MunichTrailsSection";
import { MunichMuseumsHoodsSection } from "./MunichMuseumsHoodsSection";
import { MunichTransportSection } from "./MunichTransportSection";
import { MunichHkHiccupsSection } from "./MunichHkHiccupsSection";

export function renderMunichRegionHtml(): string {
  return [
    MunichHeroHtml,
    '<div class="container">',
    MunichAlertsHtml,
    MunichMapShellHtml,
    MunichTabsNavHtml,
    MunichItinerarySection,
    MunichGmapsAuditSection,
    MunichFoodBeerSection,
    MunichTrailsSection,
    MunichMuseumsHoodsSection,
    MunichTransportSection,
    MunichHkHiccupsSection,
    '  <footer>',
    '    <p>Munich &amp; Bavaria Bespoke Interactive Planner (13–19 November 2026) · Prepared for Tak Hin Lee &amp; Yun Yu Tang · Modular Component Architecture</p>',
    '  </footer>',
    '</div>'
  ].join("\n");
}

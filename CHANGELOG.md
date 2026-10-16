# Changelog

## [1.0.1] - 2026-10-16
### Added
- Added `.github/workflows/deploy-pages.yml` to inject the `CARTO_API_KEY` environment secret into `local-config.js` during GitHub Pages deployment, with automatic fallback to keyless **Esri World Street Map** if `local-config.js` is not loaded yet.

## [1.0.0] - 2026-10-15
### Added
- Full 3-leg Germany & Alsace interactive planner (5–19 Nov 2026): **Leg 1 Berlin** (5–8 Nov), **Leg 2 Freiburg, Black Forest, Baden-Baden & Colmar/Turckheim** (9–13 Nov), and **Leg 3 Munich & Bavaria** (13–19 Nov).
- Confirmed accommodations integrated with photos and transit routing: **Karlito Apartmenthaus** (Berlin-Mitte), **Mathildenstraße 14 Airbnb** (Freiburg, with 06:35 AM early luggage drop), **Hôtel Saint-Martin** (Colmar), and **Timehouse Munich** (Schwabing).
- Confirmed **Domaine François Baur** biodynamic wine tour in Turckheim (Fri 13 Nov 10:00 AM, Ref `815D4A45A0E85F6C`).
- Non-negotiable Berlin stops locked in with verified opening hours: **#48 Mampe Berlin** (Thu 5 Nov 16:30), **#14 Fleischerei Domke** (Fri 6 Nov 16:45), and **#63 Berlin Zoological Garden** (Sat 7 Nov 09:00–13:30).
- Strict 1:1 chronological alignment between map pins and written daily itineraries across all 15 days, plus a dedicated `✖ Show Omitted Pins Only` filter.
- Removed hardcoded map API keys from tracked files for safe public GitHub Pages deployment.

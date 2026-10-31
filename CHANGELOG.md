# Changelog

## [1.2.0] - 2026-10-31
### Added
- **Master Bookings & Confirmation Wallet (`sec-bookings`):** Added a dedicated interactive section housing all 12 confirmed flight, accommodation, rail, dining, and tour reservations (Wed 4 Nov – Fri 20 Nov 2026) with category filters (`All`, `Flights`, `Hotels & Airbnbs`, `Trains`, `Dining & Tours`) and 1-click clipboard copy buttons for every confirmation number (`7AK639`, `5126078467`, `0698 9390 6002 7647`, `HMKTPHQE4H`, `6935982825`, `815D4A45A0E85F6C`, `NZM3KL`, `5210364141`, `6724144172`, `39901.1056944`).
- **Interactive Packing Checklist & 3-Stop Laundromat Guide (`sec-packing`):** Added a 35-item interactive packing checklist tailored to a 5-to-6-day November thermal capsule washed 2–3 times across the trip, with `localStorage` persistence, real-time progress bar, category/unchecked filters, and print-friendly layout.
- **Verified Laundromat Strategy:** Mapped walking-distance self-service laundromats (*SB-Waschsalon*) and apartment facilities across all 3 legs: **Waschsalon Schleudertraum Mitte** (`Memhardstraße 1`, open Sundays 06:00–22:00) & **Waschsalon 115** (`Torstraße 115`) in Berlin, **30°grad SB Waschsalon** (`Lehener Straße 27`) & **Wasch & Fun** (`Egonstraße 25`) in Freiburg-Stühlinger, and **Timehouse Munich's in-building guest laundry room (*Waschküche*)** + **SB Waschsalon Schwabing** (`Leopoldstraße 100`) in Munich.
- **UI/UX Convenience Upgrades:** Added a top Quick-Jump Command Bar with live packing completion percentage, 1-click region/tab switching, and a map collapse toggle (`Hide/Show Map`) for faster mobile reading.

### Changed
- Updated all itinerary sections and map pins with the latest confirmed booking details:
  - Outbound flights: **Etihad EY 871** (Wed 4 Nov 19:35 HKG → 00:25 AUH) + **Condor DE 2553** (Thu 5 Nov 02:20 AUH → 06:20 BER, Ref `7AK639`).
  - Berlin: **Karlito Apartmenthaus** Family Apartment with Balcony (`5126078467`) and confirmed **Friday 6 Nov 18:30 dinner reservation at Yorckschlösschen** (`Yorckstraße 15`, pinned as #12 on Friday's route after Fleischerei Domke).
  - Freiburg & Colmar: **ÖBB Nightjet** (`0698 9390 6002 7647`), **Schlossbergblick 1-Zimmer Dachgeschoss Apartment** hosted by Mario & Nadine (`HMKTPHQE4H`), **Logis Hôtel Saint-Martin** Superior Room (`6935982825`), and **Domaine François Baur** biodynamic wine tour shifted to **Fri 13 Nov at 10:00 AM**.
  - Munich: Highlighted the overlapping hotel bookings (**Bob W Munich City Centre** `#5210364141` at `Schwanthalerstr. 61` vs **Timehouse Serviced Apartments** `#6724144172` at `Leopoldstraße 204a` with WhatsApp late check-in), **Neuschwanstein Castle Tour #475 at 14:15** on Sun 15 Nov (Invoice `39901.1056944`, mandatory 14:00 courtyard arrival), and return flights **Etihad EY 126** (10:30 MUC → 19:30 AUH) + **EY 870** (21:15 AUH → 08:30 HKG on Fri 20 Nov, Ref `7AK639`).

## [1.1.0] - 2026-10-17
### Changed
- Full mobile responsiveness pass verified with gstack headless Chromium ($B) at 320/360/375/390/414/768/1280 px: zero horizontal page overflow at every width (was 2px leak at 320px from a nowrap Google Maps button).
- Grids now scale below their card min-widths (`minmax(min(340px, 100%), 1fr)`), wide fare/audit tables sit in horizontally scrollable `.table-scroll` wrappers, tab & filter bars become swipe-scrollable below 620px, map popups shrink to `min(248px, 74vw)`, and the timeline collapses to single-column.
- Bundled missing Leaflet layer-control icons (`assets/vendor/images/`) that caused a blank map button and 404s; console is now error-free.
- Added 25 QA screenshots (mobile 320/390, tablet 768, desktop 1280) under `test/mobile-screenshots/`.

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

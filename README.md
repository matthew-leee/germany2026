# Germany & Alsace 2026 Interactive Trip Planner (Berlin → Black Forest & Colmar → Munich)

Interactive, self-contained HTML5 & Leaflet/CARTO route planner for **Tak Hin Lee & Yun Yu Tang** (5–19 November 2026).

## Live GitHub Pages Deployment
Once GitHub Pages is enabled on the `main` branch (root `/`), this planner is accessible on any phone, tablet, or desktop browser at:
- `https://matthew-leee.github.io/germany2026/`

## Trip Coverage (4–20 November 2026)
- **Master Bookings & Confirmation Wallet (`sec-bookings`):** Centralised 12-card wallet with 1-click clipboard copy for all flight PNRs (`7AK639`), hotel booking numbers (`5126078467`, `HMKTPHQE4H`, `6935982825`, `5210364141`, `6724144172`), ÖBB Nightjet code (`0698 9390 6002 7647`), SNCF TGV reference (`NZM3KL`), Yorckschlösschen Fri 6 Nov 18:30 dinner reservation, Domaine François Baur tasting (`815D4A45A0E85F6C`), and Neuschwanstein Castle Tour #475 (`39901.1056944`).
- **Interactive Packing Checklist & 3-Stop Laundromat Guide (`sec-packing`):** 35-item interactive checklist across 7 categories with `localStorage` persistence, real-time progress bar, category/unchecked filters, and a verified 3-wash laundromat strategy across Berlin (**Waschsalon Schleudertraum Mitte** & **Waschsalon 115**), Freiburg (**30°grad SB Waschsalon Lehener Str. 27** & **Wasch & Fun Egonstraße 25**), and Munich (**Timehouse in-building Waschküche** & **SB Waschsalon Schwabing**).
1. **Leg 1 — Berlin (Wed 4 Nov 19:35 HKG Departure / Thu 5 Nov 06:20 AM BER Arrival – Sun 8 Nov 20:52 Sleeper · Base: Karlito Apartmenthaus, Linienstraße 60, Booking #5126078467):**
   - Outbound flights: **Etihad EY 871** (HKG 19:35 → AUH 00:25) + **Condor DE 2553** (AUH 02:20 → BER 06:20, Ref `7AK639`).
   - 20 saved pins + **confirmed Yorckschlösschen dinner reservation** (Fri 6 Nov 18:30, `Yorckstraße 15`) integrated in strict 1:1 chronological alignment between map pins and written timeline.
   - Non-negotiables locked in: **#48 Mampe Berlin** (Thu 5 Nov 16:30), **#14 Fleischerei Domke** (Fri 6 Nov 16:30 before 18:00 weekday close and 18:30 Yorckschlösschen dinner), and **#63 Berlin Zoological Garden** (Sat 7 Nov 09:00–13:30).
   - Outbound sleeper: **ÖBB Nightjet NJ 408** (Sun 8 Nov 20:52 Berlin Hbf Tiefgeschoß Track 3 → Mon 9 Nov 06:17 Freiburg Hbf, Booking Code `0698 9390 6002 7647`, Coach 309, Berths 52/56).
2. **Leg 2 — Freiburg, Baden-Baden, Lake Titisee & Colmar/Turckheim (Mon 9 Nov – Fri 13 Nov 16:45 TGV):**
   - Bases: **Freiburg Airbnb — Schlossbergblick 1-Zimmer Dachgeschoss Apartment (Mathildenstraße 14, hosted by Mario & Nadine, Code `HMKTPHQE4H`)** with confirmed 06:35 AM early luggage drop (Mon 9 – Thu 12 Nov) and **Logis Hôtel Saint-Martin Colmar (38 Grand'Rue, Booking #`6935982825`)** (Thu 12 – Fri 13 Nov).
   - Scheduled excursions: **Freiburg Old Town & Zibärtle tasting** (Mon 9 Nov), **Baden-Baden Friedrichsbad & Café König** (Tue 10 Nov), **Lake Titisee via Höllentalbahn** (Wed 11 Nov, replacing the November-closed Schauinsland cable car), **Colmar Petite Venise** (Thu 12 Nov), and confirmed **10:00 AM Biodynamic Wine Tour at Domaine François Baur in Turckheim** (Fri 13 Nov, shifted from Nov 12 to Nov 13, Ref `815D4A45A0E85F6C`).
3. **Leg 3 — Munich & Alpine Bavaria (Fri 13 Nov 21:46 TGV Arrival – Thu 19 Nov 10:30 AM Etihad EY 126 Flight · Dual Hotel Bookings: Timehouse Munich `#6724144172` & Bob W Munich City Centre `#5210364141`):**
   - Inbound rail: **TGV INOUI 2362** (16:45 Colmar → 17:12 Strasbourg) + **TGV INOUI 9577** (17:46 Strasbourg → 21:46 München Hbf, Ref `NZM3KL`).
   - Mandatory day trips & markets: **Neuschwanstein Castle** (Sun 15 Nov via Bayern-Ticket, **Confirmed 14:15 Tour #475**, Invoice `39901.1056944`, courtyard 15 mins prior at 14:00), **Dachau Memorial Site** (Mon 16 Nov via MVV Zone M-1), and **Weihnachtsdorf im Kaiserhof der Residenz** (Tue 17 Nov).
   - Return flights: **Etihad Airways EY 126** (Thu 19 Nov 10:30 MUC → 19:30 AUH) + **Etihad Airways EY 870** (21:15 AUH → Fri 20 Nov 08:30 HKG, Ref `7AK639`).
   - Specialist trails for Bavarian delicacies, wooden-barrel beer halls (*Augustiner Bräustuben & Augustiner Bürgerheim*), sourdough bakeries (*Julius Brantner, Café Frischhut, Dompierre*), Franconian/German/Spanish/Italian wine (*Weinhaus Neuner, Pfälzer Residenz Weinstube, Bar Mural, Feinkost Olé, GARIBALDI*), antiques (*Kunst-Oase Ottostraße*), and vintage/Leica cameras (*Leica Store Maffeistraße, Foto Dinkel, Calumet/Sauter*).

## Map Tile Configuration (`CARTO_API_KEY` Secret)
- **GitHub Pages (`.github/workflows/deploy-pages.yml`):** Automatically injects `secrets.CARTO_API_KEY` from the `github-pages` environment into `local-config.js` at deploy time so **CARTO Voyager** loads with your key (without committing the key to Git). In GitHub **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
- **Local `file://` mode:** Uses git-ignored `local-config.js` locally, or falls back to **Esri World Street Map** if absent.

## Mobile Responsiveness (QA-Verified)
Responsive from 320px phones to desktop: swipe-scrollable tab/filter bars, single-column cards & timeline on phones, 2-column on tablet, horizontally scrollable fare tables, and responsive map popups. Verified screenshots live in `test/mobile-screenshots/` (320/390 mobile, 768 tablet, 1280 desktop) captured with gstack's headless Chromium (`$B responsive` / `$B viewport` / `$B screenshot`), with zero horizontal overflow and zero console errors at all tested widths.

## Build & Verification
```bash
npm run build   # Compiles modular src/ components into index.html (<0.1s)
npm test        # Runs 146-check pytest suite against index.html and local image assets
```

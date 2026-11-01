# Germany & Alsace 2026 Interactive Trip Planner (Berlin → Black Forest & Colmar → Munich)

Interactive, self-contained HTML5 & Leaflet/CARTO route planner for **Tak Hin Lee & Yun Yu Tang**, covering the whole **4–20 November 2026** trip: Berlin (4–8 Nov) → ÖBB Nightjet → Freiburg, Black Forest, Baden-Baden & Colmar (9–13 Nov) → Munich & Bavaria (13–19 Nov) → return flights to Hong Kong on Fri 20 Nov.

## Live GitHub Pages Deployment
Once GitHub Pages is enabled on the `main` branch (root `/`), this planner is accessible on any phone, tablet, or desktop browser at:
- `https://matthew-leee.github.io/germany2026/`

## Trip Coverage (4–20 November 2026)
- **Master Bookings & Confirmation Wallet (`sec-bookings`):** Centralised **11 confirmed** booking cards with 1-click clipboard copy for all flight PNRs (`7AK639`), hotel booking numbers (`5126078467`, `HMKTPHQE4H`, `6935982825`, `6724144172`), ÖBB Nightjet code (`0698 9390 6002 7647`), SNCF TGV reference (`NZM3KL`), Yorckschlösschen Fri 6 Nov 18:30 dinner reservation, Domaine François Baur tasting (`815D4A45A0E85F6C`), and Neuschwanstein Castle Tour #475 (`39901.1056944`). The cancelled Bob W booking (`5210364141`) is kept as a single archived record only — there is nothing left to cancel.

## Pre-Trip Action Checklist (open items, checked 1 Nov 2026)
- ☎️ **Fleischerei Domke** `+49 30 291 76 35` — ask whether fresh Hackepeter/Mettbrötchen are on the counter on **Fri 6 Nov morning** (strongly evidenced, but a 30-second call removes the last doubt).
- ☎️ **Hamy** (Vietnamese, Hasenheide 10) `+49 30 61625959` — reconfirm the daily 12:00–23:30 hours before relying on the **Sat 7 Nov ~19:00** dinner (website is offline; hours come from OpenStreetMap).
- 🥨 **Café Frischhut** has no official site — confirm opening hours on the day of the **Sat 14 Nov 14:15** Schmalznudel visit.
- 🖨️ Print the **ÖBB Nightjet NJ 408** ticket on white A4 (20:52 Berlin Hbf, Bahnsteig 3) and carry photo ID.
- 🏷️ Attach SNCF name/phone luggage tags before boarding the **Fri 13 Nov 16:45** TGV at Colmar.
- 🚆 Confirm the exact **RB 68 München Hbf → Füssen** departure for Sun 15 Nov the day before (direct ~2h, otherwise change at Buchloe).

## Verification Status (1 Nov 2026)
- `node build.mjs` assembles `index.html` from the modular `src/` components deterministically.
- `python3 -m pytest tests/test_trip_planner.py -q` → **169 assertions green** (content, hours, bookings, map/pin day alignment).
- Headless-Chrome spot checks at 1440×900, 1440×740, 390×844 and 320×568 archived (git-ignored) in `artifacts/ui-audit/20261101__session-01a19578/` with an `INDEX.md` ledger; no console errors, no broken images, no horizontal overflow.
- **Interactive Packing Checklist & 3-Stop Laundromat Guide (`sec-packing`):** 35-item interactive checklist across 7 categories with `localStorage` persistence, real-time progress bar, category/unchecked filters, and a verified 3-wash laundromat strategy across Berlin (**Waschsalon Schleudertraum Mitte** & **Waschsalon 115**), Freiburg (**30°grad SB Waschsalon Lehener Str. 27** & **Wasch & Fun Egonstraße 25**), and Munich (**Timehouse in-building Waschküche** & **SB Waschsalon Schwabing**).
1. **Leg 1 — Berlin (Wed 4 Nov 19:35 HKG Departure / Thu 5 Nov 06:20 AM BER Arrival – Sun 8 Nov 20:52 Sleeper · Base: Karlito Apartmenthaus, Linienstraße 60, Booking #5126078467):**
   - Outbound flights: **Etihad EY 871** (HKG 19:35 → AUH 00:25) + **Condor DE 2553** (AUH 02:20 → BER 06:20, Ref `7AK639`).
   - Every written stop has its numbered map pin (23 active pins + 1 optional off-route pub), with de-listed pins kept behind the `✖ Show Omitted Pins Only` filter so they never clutter a daily route. The **confirmed Yorckschlösschen dinner reservation** (Fri 6 Nov 18:30, `Yorckstraße 15`, 2 people) is integrated in strict 1:1 chronological alignment between pins and written timeline.
   - **Thu 5 Nov:** Zeit für Brot (Mon–Fri 07:00–20:00) → Holocaust Memorial, Brandenburg Gate & Reichstag exterior → **#48 Mampe Berlin** (16:15–17:45, Mon–Fri 10:00–18:00) → **#57 BRLO Brwhouse** (~19:30, Mon closed).
   - **Fri 6 Nov:** **#14 Fleischerei Domke** ~09:30 Hackepeter/Mettbrötchen breakfast (opens 06:00) → Safelight + Mitte camera shops → **#11 Mały Książę** Polish groceries → confirmed 18:30 Yorckschlösschen.
   - **Sat 7 Nov:** **#63 Berlin Zoological Garden** (November hours 09:00–16:30, last admission 15:30) → **#03 Foto-Meyer** (Mon–Sat 10:00–19:00) → **C/O Berlin at Amerika Haus** → Vietnamese dinner at **Hamy** in Kreuzberg (replaces Ständige Vertretung).
   - **Sun 8 Nov:** Berlin Wall Memorial at Bernauer Straße → **#44 Mauerpark** Sunday flea market (verified Sun 10:00–18:00) → flexible Prenzlauer Berg wander.
   - Outbound sleeper: **ÖBB Nightjet NJ 408** (Sun 8 Nov **20:52** Berlin Hbf Tiefgeschoß **Bahnsteig 3** → Mon 9 Nov **06:17** Freiburg Hbf, Booking Code `0698 9390 6002 7647`, Coach 309, Berths 52/56).
2. **Leg 2 — Freiburg, Baden-Baden, Lake Titisee & Colmar/Turckheim (Mon 9 Nov – Fri 13 Nov 16:45 TGV):**
   - Bases: **Freiburg Airbnb — Schlossbergblick 1-Zimmer Dachgeschoss Apartment (Mathildenstraße 14, hosted by Mario & Nadine, Code `HMKTPHQE4H`)** with confirmed 06:35 AM early luggage drop (Mon 9 – Thu 12 Nov) and **Logis Hôtel Saint-Martin Colmar (38 Grand'Rue, Booking #`6935982825`)** (Thu 12 – Fri 13 Nov).
   - Scheduled excursions: **Freiburg Old Town & Zibärtle tasting** (Mon 9 Nov, breakfast at **#38 Kolben Kaffee**, Mon–Sat 07:30–18:00), **Baden-Baden Friedrichsbad & Café König** (Tue 10 Nov), **Lake Titisee via Höllentalbahn** (Wed 11 Nov — the day you chose instead of Schauinsland), **Colmar Petite Venise** (Thu 12 Nov), and confirmed **10:00 AM Biodynamic Wine Tour at Domaine François Baur in Turckheim** (Fri 13 Nov, shifted from Nov 12 to Nov 13, Ref `815D4A45A0E85F6C`).
   - **Corrected opening hours:** **#09 Freiburgs Finest** moved off Monday evening to **Thu 12 Nov 10:00** because it closes at 18:00. The 5 Schauinsland pins (#32–#36) are omitted because the **Museums-Bergwerk mine** closed for the season and **Schniederlihof** is May–Oct only — **not** because of the cable car, which is open until **15 Nov** (2026 fall revision 16 Nov – 4 Dec).
3. **Leg 3 — Munich & Alpine Bavaria (Fri 13 Nov 21:46 TGV Arrival – Thu 19 Nov 10:30 AM Etihad EY 126 Flight · Confirmed Base: Timehouse Munich `#6724144172`):**
   - Inbound rail: **TGV INOUI 2362** (16:45 Colmar → 17:12 Strasbourg) + **TGV INOUI 9577** (17:46 Strasbourg → 21:46 München Hbf, Ref `NZM3KL`).
   - **Single confirmed Munich hotel:** **Timehouse Serviced Apartments** (Leopoldstraße 204a, 80804 München-Schwabing, Booking `#6724144172`) for all 6 nights, with WhatsApp late check-in against the 22:30 reception close and a 24/7 keybox backup. The former **Bob W Munich City Centre** booking (`#5210364141`) was cancelled and appears **only** as an archived record — there is no overlap left to act on.
   - Mandatory day trips & markets: **Neuschwanstein Castle** (Sun 15 Nov via Bayern-Ticket, **Confirmed 14:15 Tour #475**, Invoice `39901.1056944`, courtyard 15 mins prior at 14:00), **Dachau Memorial Site** (Mon 16 Nov via MVV Zone M-1), and **Weihnachtsdorf im Kaiserhof der Residenz** (Tue 17 Nov).
   - Return flights: **Etihad Airways EY 126** (Thu 19 Nov **10:30** MUC → 19:30 AUH) + **Etihad Airways EY 870** (21:15 AUH → Fri 20 Nov 08:30 HKG, Ref `7AK639`).
   - Specialist trails for Bavarian delicacies, wooden-barrel beer halls (*Augustiner Bräustuben & Augustiner Bürgerheim*), sourdough bakeries (*Julius Brantner, Café Frischhut, Dompierre*), Franconian/German/Spanish/Italian wine (*Weinhaus Neuner, Pfälzer Residenz Weinstube, Bar Mural, Feinkost Olé on Wed 18 Nov, GARIBALDI*), antiques (*Kunst-Oase Ottostraße*), and vintage/Leica cameras (*Leica Store Maffeistraße, **Foto Erhardt (ehem. Foto Dinkel)**, Landwehrstraße 6 — Mon–Fri 09:30–18:30 / Sat 10:00–16:00, and merged Calumet / Foto-Video Sauter at Sonnenstraße 21*).

## Google Maps List Audit (81 Places)
- Your shared **"Trip 2026"** Google Maps list now holds **81 saved places**, up from the **66** of the first snapshot (16 additions, Nördlingen removed as an impractical detour).
- Current split: **36 Berlin · 20 Freiburg & Black Forest · 16 Munich & Bavaria · 6 Baden-Baden & Alsace · 3 Kraków (Poland)**.
- The 3 Kraków pins are stale leftovers from earlier Poland research: they are **out of scope** for this 4–20 Nov route, get no itinerary action, and are listed separately from the in-plan pins in the `sec-gmaps` audit table.

## Map Tile Configuration (`CARTO_API_KEY` Secret)
- **GitHub Pages (`.github/workflows/deploy-pages.yml`):** Automatically injects `secrets.CARTO_API_KEY` from the `github-pages` environment into `local-config.js` at deploy time so **CARTO Voyager** loads with your key (without committing the key to Git). In GitHub **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
- **Local `file://` mode:** Uses git-ignored `local-config.js` locally, or falls back to **Esri World Street Map** if absent.

## Mobile Responsiveness (QA-Verified)
Responsive from 320px phones to desktop: swipe-scrollable tab/filter bars, single-column cards & timeline on phones, 2-column on tablet, horizontally scrollable fare tables, and responsive map popups. Verified screenshots live in `test/mobile-screenshots/` (320/390 mobile, 768 tablet, 1280 desktop) captured with gstack's headless Chromium (`$B responsive` / `$B viewport` / `$B screenshot`), with zero horizontal overflow and zero console errors at all tested widths.

## Build & Verification
```bash
node build.mjs                                  # Compiles src/styles, src/regions and src/components into index.html (<0.1s)
python3 -m pytest tests/test_trip_planner.py -q # Runs the pytest acceptance suite against index.html
npm run build && npm test                       # Same two steps via package.json scripts
```
The suite currently runs **169 checks**: every requirement REQ-01…REQ-10 plus the 1 Nov 2026 itinerary revision (Berlin leg rewrite, corrected opening hours, 81-pin list audit, Hamy and Foto Erhardt renames), HTML5 validity, no duplicate ids, no remote dependencies, and every local `assets/images/` reference existing as a real image file > 10 KB with valid magic bytes.

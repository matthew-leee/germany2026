# Germany & Alsace 2026 Interactive Trip Planner (Berlin → Black Forest & Colmar → Munich)

Interactive, self-contained HTML5 & Leaflet/CARTO route planner for **Tak Hin Lee & Yun Yu Tang** (5–19 November 2026).

## Live GitHub Pages Deployment
Once GitHub Pages is enabled on the `main` branch (root `/`), this planner is accessible on any phone, tablet, or desktop browser at:
- `https://matthew-leee.github.io/germany2026/`

## Trip Coverage (5–19 November 2026)
1. **Leg 1 — Berlin (Thu 5 Nov 06:00 AM – Sun 8 Nov 20:52 Sleeper · Base: Karlito Apartmenthaus, Linienstraße 60):**
   - 20 saved pins integrated across 4 days in strict 1:1 chronological alignment between map pins and written timeline.
   - Non-negotiables locked in: **#48 Mampe Berlin** (Thu 5 Nov 16:30), **#14 Fleischerei Domke** (Fri 6 Nov 16:45 before 18:00 weekday close), and **#63 Berlin Zoological Garden** (Sat 7 Nov 09:00–13:30).
   - Outbound sleeper: **ÖBB Nightjet NJ 408** (Sun 8 Nov 20:52 Berlin Hbf Track 3 → Mon 9 Nov 06:17 Freiburg Hbf, Coach 309, Berths 52/56).
2. **Leg 2 — Freiburg, Baden-Baden, Lake Titisee & Colmar/Turckheim (Mon 9 Nov – Fri 13 Nov 16:45 TGV):**
   - Bases: **Freiburg Airbnb (Mathildenstraße 14)** with confirmed 06:35 AM early luggage drop (Mon 9 – Thu 12 Nov) and **Hôtel Saint-Martin Colmar (38 Grand'Rue)** (Thu 12 – Fri 13 Nov).
   - Scheduled excursions: **Freiburg Old Town & Zibärtle tasting** (Mon 9 Nov), **Baden-Baden Friedrichsbad & Café König** (Tue 10 Nov), **Lake Titisee via Höllentalbahn** (Wed 11 Nov, replacing the November-closed Schauinsland cable car), **Colmar Petite Venise** (Thu 12 Nov), and confirmed **10:00 AM Biodynamic Wine Tour at Domaine François Baur in Turckheim** (Fri 13 Nov, Ref `815D4A45A0E85F6C`).
3. **Leg 3 — Munich & Alpine Bavaria (Fri 13 Nov 21:46 TGV Arrival – Thu 19 Nov 10:00 AM Flight · Base: Timehouse Munich, Leopoldstraße 204a):**
   - Inbound rail: **TGV INOUI 2362** (16:45 Colmar → 17:12 Strasbourg) + **TGV INOUI 9577** (17:46 Strasbourg → 21:46 München Hbf).
   - Mandatory day trips & markets: **Neuschwanstein Castle** (Sun 15 Nov via Bayern-Ticket), **Dachau Memorial Site** (Mon 16 Nov via MVV Zone M-1), and **Weihnachtsdorf im Kaiserhof der Residenz** (Tue 17 Nov).
   - Specialist trails for Bavarian delicacies, wooden-barrel beer halls (*Augustiner Bräustuben & Augustiner Bürgerheim*), sourdough bakeries (*Julius Brantner, Café Frischhut, Dompierre*), Franconian/German/Spanish/Italian wine (*Weinhaus Neuner, Pfälzer Residenz Weinstube, Bar Mural, Feinkost Olé, GARIBALDI*), antiques (*Kunst-Oase Ottostraße*), and vintage/Leica cameras (*Leica Store Maffeistraße, Foto Dinkel, Calumet/Sauter*).

## Map Tile Configuration (`CARTO_API_KEY` Secret)
- **GitHub Pages (`.github/workflows/deploy-pages.yml`):** Automatically injects `secrets.CARTO_API_KEY` from the `github-pages` environment into `local-config.js` at deploy time so **CARTO Voyager** loads with your key (without committing the key to Git). In GitHub **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
- **Local `file://` mode:** Uses git-ignored `local-config.js` locally, or falls back to **Esri World Street Map** if absent.

## Build & Verification
```bash
npm run build   # Compiles modular src/ components into index.html (<0.1s)
npm test        # Runs 133-check pytest suite against index.html and local image assets
```

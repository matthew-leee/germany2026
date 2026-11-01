// 1. Main section tabs
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelectorAll('.section-panel').forEach(function(p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var target = document.getElementById(btn.getAttribute('data-tab'));
      if (target) target.classList.add('active');
    });
  });

  // 2. Day filter subtabs + sync with Map
  document.querySelectorAll('[data-day]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-day]').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var day = btn.getAttribute('data-day');
      document.querySelectorAll('[data-day-card]').forEach(function(card) {
        if (day === 'all' || card.getAttribute('data-day-card') === day) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
      if (window.setMapFilter) window.setMapFilter(day);
    });
  });

  // 2b. Berlin & Black Forest day filter subtabs + sync with Map
  document.querySelectorAll('[data-berlin-day]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-berlin-day]').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var day = btn.getAttribute('data-berlin-day');
      document.querySelectorAll('[data-berlin-card]').forEach(function(card) {
        card.style.display = (day === 'region-berlin' || card.getAttribute('data-berlin-card') === day) ? '' : 'none';
      });
      if (window.setMapFilter) window.setMapFilter(day);
    });
  });

  document.querySelectorAll('[data-bf-day]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-bf-day]').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var day = btn.getAttribute('data-bf-day');
      document.querySelectorAll('[data-bf-card]').forEach(function(card) {
        card.style.display = (day === 'region-blackforest' || card.getAttribute('data-bf-card') === day) ? '' : 'none';
      });
      if (window.setMapFilter) window.setMapFilter(day);
    });
  });

  // 3. Specialist trail filter + search
  var activeTrail = 'all';
  var searchInput = document.getElementById('trail-search');

  function filterTrails() {
    var q = (searchInput ? searchInput.value : '').toLowerCase().trim();
    document.querySelectorAll('[data-trail-card]').forEach(function(card) {
      var cat = card.getAttribute('data-trail-card');
      var text = card.textContent.toLowerCase();
      var matchesCat = (activeTrail === 'all' || cat === activeTrail);
      var matchesQuery = (!q || text.indexOf(q) !== -1);
      card.style.display = (matchesCat && matchesQuery) ? '' : 'none';
    });
  }

  document.querySelectorAll('[data-trail]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-trail]').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeTrail = btn.getAttribute('data-trail');
      filterTrails();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterTrails);
  }

  // 4. Interactive Multi-Pin Map (Leaflet + OpenStreetMap + 1-Click Google Maps Route Links)
  var POIS = [
    {"id": 159, "name": "★ #59 Karlito Apartmenthaus (Berlin Base)", "lat": 52.52891, "lng": 13.405415, "region": "region-berlin", "days": ["day-05", "day-06", "day-07", "day-08"], "saved": true, "cat": "cat-hotel", "color": "#067647", "hours": "Check-in Thu 5 Nov 14:00–23:00 · Checkout Sun 8 Nov 08:00–10:00", "addr": "Linienstraße 60, 10119 Berlin-Mitte (U2 Rosa-Luxemburg-Platz)", "img": "assets/images/hotel_karlito_berlin.jpg", "note": "[Thu 5 – Sun 8 Nov Home Base] ~08:00 bag drop on Thu 5 Nov (early luggage storage unconfirmed; Berlin Hbf lockers backup). Checkout Sun 8 Nov 08:00–10:00 — ask about bag storage for the day (Hbf lockers backup). 3 mins walk to #45 Zeit für Brot & 5 mins to #04 FOTOIMPEX; direct U2 line to Berlin Zoo."},
    {"id": 145, "name": "★ #45 Zeit für Brot ('nice 包包')", "lat": 52.528015, "lng": 13.408607, "region": "region-berlin", "days": ["day-05"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Fri 07:00–20:00, Sat 08:00–20:00, Sun 08:00–18:00 (VERIFIED)", "addr": "Alte Schönhauser Str. 4, 10119 Berlin-Mitte", "img": "assets/images/berlin_zeit_fuer_brot.jpg", "note": "[Thu 5 Nov · 09:30 MUST-HAVE cinnamon roll (Zimtschnecke)] 250m from Karlito. Warm organic Zimtschnecken fresh from the oven — light snack before lunch. Verified hours: Mon–Fri 07:00–20:00, Sat 08:00–20:00, Sun 08:00–18:00."},
    {"id": 171, "name": "Holocaust Memorial, Brandenburg Gate & Reichstag", "lat": 52.5163, "lng": 13.3777, "region": "region-berlin", "days": ["day-05"], "cat": "cat-sight", "color": "#005f87", "hours": "24/7 (Reichstag Dome requires advance booking)", "addr": "Pariser Platz / Platz der Republik, 10117 Berlin", "img": "assets/images/odeonsplatz.jpg", "note": "[Thu 5 Nov · 10:30–13:00] Walk from the Memorial to the Murdered Jews of Europe through Brandenburg Gate to the Reichstag — exterior visit only, the dome needs an advance booking. One relaxed lunch in Mitte follows at 13:00, then 14:00 check-in and rest at Karlito."},
    {"id": 148, "name": "★ #48 Mampe Berlin (NON-NEGOTIABLE MUST-GO!)", "lat": 52.488876, "lng": 13.38728, "region": "region-berlin", "days": ["day-05"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Mon–Fri 10:00–18:00, Sat 12:00–18:00 (Closed Sun) — VERIFIED", "addr": "Am Tempelhofer Berg 6, 10965 Berlin-Kreuzberg", "img": "assets/images/berlin_brlo.jpg", "note": "[Thu 5 Nov · 16:15–17:45 MUST-GO] Berlin's oldest spirits house (since 1831) inside the historic Viktoria-Quartier brewery courtyard! Taste & buy Halb & Halb bitter-orange herbal liqueur, Elefantenkümmel & Kreuzberg Gin."},
    {"id": 157, "name": "★ #57 BRLO Brwhouse ('Brewery tour & beer garden!')", "lat": 52.500197, "lng": 13.3737, "region": "region-berlin", "days": ["day-05"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Mon closed · Tue–Fri 17:00–00:00 · Sat 12:00–00:00 · Sun 12:00–22:00 (kitchen to 22:00)", "addr": "Schöneberger Str. 16, 10963 Berlin (Park am Gleisdreieck)", "img": "assets/images/berlin_brlo.jpg", "note": "[Thu 5 Nov · ~19:30 Dinner] 12 mins walk (or 1 stop) from Mampe Berlin. Day-of alternative: Street Food Thursday at Markthalle Neun (17:00–22:00) — your choice on the day."},
    {"id": 114, "name": "★ #14 Fleischerei Domke (NON-NEGOTIABLE MUST-GO!)", "lat": 52.510477, "lng": 13.452073, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Mon–Fri 06:00–21:00, Sat 07:00–21:00, Sun 09:00–21:00 (VERIFIED)", "addr": "Warschauer Str. 64, 10243 Berlin-Friedrichshain", "img": "assets/images/schweinshaxe.jpg", "note": "[Fri 6 Nov · ~09:30 BREAKFAST MUST-GO!] Hackepeter / Mettbrötchen breakfast — evidenced by Domke's own Instagram bio (Belegtes Brötchen / Mettbrötchen 1,30 €) and a VICE article. Still advise a courtesy call on +49 30 291 76 35. Fallback: Gut Kerkow, Tucholskystr. 31 (Mon–Fri 08:00–19:00)."},
    {"id": 112, "name": "◇ #12 Silo Coffee (OPTIONAL — off-route, not a meal stop)", "lat": 52.510075, "lng": 13.458378, "region": "region-berlin", "days": [], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Daily 08:30–16:00 / 16:30", "addr": "Gabriel-Max-Straße 4, 10245 Berlin-Friedrichshain", "img": "assets/images/berlin_zeit_fuer_brot.jpg", "note": "[Fri 6 Nov · ~11:00 OPTIONAL Coffee] Aussie-style third-wave specialty coffee right off Boxhagener Platz — only if you still want coffee after the Domke Mettbrötchen breakfast."},
    {"id": 119, "name": "★ #19 RAW-Gelände & Michelberger Bar (for #50 MXPSM Schnaps)", "lat": 52.507686, "lng": 13.451869, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open 24/7", "addr": "Revaler Str. 99 / Warschauer Str. 39, 10245 Berlin", "img": "assets/images/berlin_mauerpark.webp", "note": "[Fri 6 Nov · 10:30–11:30 · Choose One or Two] 4 mins walk south of Domke: the gritty 1867 railway repair compound, plus MXPSM herbal spirits at the Michelberger Hotel bar across the street."},
    {"id": 120, "name": "★ #20 Boxhagener Platz", "lat": 52.510876, "lng": 13.459713, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open 24/7 (Neighborhood Square)", "addr": "Boxhagener Platz, 10245 Berlin-Friedrichshain", "img": "assets/images/berlin_mauerpark.webp", "note": "[Fri 6 Nov · 10:30–11:30 · Choose One or Two] Heart of Friedrichshain, 200m from Silo Coffee & Fleischerei Domke — the leafy Kiez option in the RAW / Boxhagener / East Side cluster."},
    {"id": 121, "name": "★ #21 East Side Gallery (1.3km Painted Berlin Wall)", "lat": 52.505022, "lng": 13.439695, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open 24/7", "addr": "Mühlenstraße, 10243 Berlin-Friedrichshain", "img": "assets/images/berlin_mauerpark.webp", "note": "[Fri 6 Nov · 10:30–11:30 · Choose One or Two] The longest surviving section of the Berlin Wall along the Spree — 4 mins from Warschauer Straße, so pair it with RAW-Gelände if you have time."},
    {"id": 105, "name": "★ #05 Safelight Berlin (Analog Camera Shop & Film Lab)", "lat": 52.551031, "lng": 13.411217, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-camera", "color": "#067647", "hours": "Tue–Sat 11:00–19:00 (CLOSED SUN & MON!) — VERIFIED", "addr": "Schivelbeiner Str. 9, 10439 Berlin (S/U Schönhauser Allee)", "img": "assets/images/berlin_fotoimpex.jpg", "note": "[Fri 6 Nov · 12:15–13:15] U2 north to Schönhauser Allee, then across to Mitte for a light lunch at ~13:45. Cult indie film camera store & lab (Fri/Sat only — closed Sunday)."},
    {"id": 146, "name": "★ #46 Hackesche Höfe", "lat": 52.524022, "lng": 13.402413, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Courtyards Open Daily (EAT BERLIN Mon–Sat 11:00–19:00)", "addr": "Rosenthaler Str. 40, 10178 Berlin-Mitte", "img": "assets/images/berlin_hackesche.jpg", "note": "[Fri 6 Nov · 14:45–15:45] 8 interconnected restored Art Nouveau (Jugendstil) courtyards with boutiques and cafes — EAT BERLIN inside the Höfe is open Mon–Sat 11:00–19:00."},
    {"id": 147, "name": "★ #47 Rosenthaler Str. 39 (Haus Schwarzenberg)", "lat": 52.524562, "lng": 13.401827, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open Daily (Otto Weidt Museum 10:00–20:00)", "addr": "Rosenthaler Str. 39, 10178 Berlin-Mitte (Dead Chicken Alley)", "img": "assets/images/berlin_hackesche.jpg", "note": "[Fri 6 Nov · ~15:00, right after the Höfe] Dead Chicken Alley / Haus Schwarzenberg, 1 min from Hackesche Höfe — the gritty non-commercial street-art alley housing the free Otto Weidt Workshop for the Blind Museum & Monsterkabinett."},
    {"id": 104, "name": "★ #04 FOTOIMPEX GmbH (Analog Film Mecca)", "lat": 52.525347, "lng": 13.406865, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-camera", "color": "#067647", "hours": "Mon–Sat 12:00–20:00 (Closed Sun) — VERIFIED", "addr": "Alte Schönhauser Str. 32B, 10119 Berlin-Mitte", "img": "assets/images/berlin_fotoimpex.jpg", "note": "[Fri 6 Nov · ~15:45] Europe's #1 analog film, Adox & darkroom flagship store—just 5 mins walk from Karlito Apartmenthaus!"},
    {"id": 177, "name": "★ #11 Mały Książę Polish Groceries", "lat": 52.49245, "lng": 13.38925, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-food", "color": "#7c3aed", "hours": "Mon–Sat 11:00–20:00, Sun 10:00–20:00 (VERIFIED)", "addr": "Lilienthalstraße 6, 10965 Berlin-Kreuzberg", "img": "assets/images/viktualienmarkt.jpg", "note": "[Fri 6 Nov · 16:15–17:00] Polish grocery shopping — NOT a meal: kiełbasa, pierogi, Polish chocolate & condiments to take home. 17:00–18:15 buffer before the confirmed 18:30 Yorckschlösschen dinner, ~550m away."},
    {"id": 174, "name": "★ Yorckschlösschen (CONFIRMED 18:30 Dinner Reservation!)", "lat": 52.4931, "lng": 13.3812, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-food", "color": "#067647", "hours": "CONFIRMED TABLE: Fri 6 Nov 2026 at 18:30 (2 People)", "addr": "Yorckstraße 15, 10965 Berlin-Kreuzberg (S/U Yorckstraße)", "img": "assets/images/berlin_brlo.jpg", "note": "[Fri 6 Nov · 18:30 CONFIRMED DINNER] Legendary 1902 Berlin jazz & soul tavern in Kreuzberg! Reservation confirmed for 2 people at 18:30 — ~20 mins from Mały Książę and the 17:00–18:15 buffer."},
    {"id": 163, "name": "★ #63 Berlin Zoological Garden (MANDATORY MUST-DO!)", "lat": 52.50783, "lng": 13.339416, "region": "region-berlin", "days": ["day-07"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "November: Daily 09:00–16:30, last admission 15:30 (VERIFIED)", "addr": "Hardenbergplatz 8, 10787 Berlin (Direct U2 from Karlito!)", "img": "assets/images/berlin_zoo.jpg", "note": "[Sat 7 Nov · 09:30–13:30 MUST-DO] Direct ~18-min U2 ride from Karlito! Four unhurried hours for Giant Pandas, glass-domed Hippo House & giraffes — November closes 16:30 with last admission 15:30, so you are well inside the window."},
    {"id": 103, "name": "★ #03 Foto-Meyer Digital Imaging", "lat": 52.496226, "lng": 13.341651, "region": "region-berlin", "days": ["day-07"], "saved": true, "cat": "cat-camera", "color": "#067647", "hours": "Mon–Sat 10:00–19:00 (CORRECTED — the old note wrongly claimed a 15:00 Saturday close)", "addr": "Welserstraße 1, 10777 Berlin (U Viktoria-Luise-Platz)", "img": "assets/images/berlin_fotoimpex.jpg", "note": "[Sat 7 Nov · 14:00–15:00] Just 2 U-Bahn stops south of Berlin Zoo — open Mon–Sat 10:00–19:00, so there is no 15:00 deadline to rush for."},
    {"id": 176, "name": "C/O Berlin at Amerika Haus (Photography Exhibitions)", "lat": 52.5068, "lng": 13.3310, "region": "region-berlin", "days": ["day-07"], "cat": "cat-sight", "color": "#005f87", "hours": "Daily 11:00–20:00", "addr": "Hardenbergstraße 22, 10623 Berlin (Zoo S-Bahn)", "img": "assets/images/berlin_fotoimpex.jpg", "note": "[Sat 7 Nov · 15:15–16:15] Berlin's leading photography exhibition house, 5 mins from Foto-Meyer. Optional: HIT Supermarkt next door, or swap in Bildband Berlin (Tue–Sat 11:00–18:00)."},
    {"id": 175, "name": "★ Hamy Vietnamese Kitchen (Locals' Canteen — Replaces StäV)", "lat": 52.4872958, "lng": 13.4220776, "region": "region-berlin", "days": ["day-07"], "saved": true, "cat": "cat-food", "color": "#067647", "hours": "Daily 12:00–23:30 (reconfirm +49 30 61625959)", "addr": "Hasenheide 10, 10967 Berlin-Kreuzberg", "img": "assets/images/berlin_brlo.jpg", "note": "[Sat 7 Nov · ~19:00 Dinner] Vietnamese locals' canteen in Kreuzberg. Hours per OpenStreetMap (check_date 2024-08) daily 12:00–23:30; website is down, so reconfirm on +49 30 61625959. Backup: District Mot, Rosenthaler Str. 62."},
    {"id": 172, "name": "Berlin Wall Memorial at Bernauer Straße", "lat": 52.5351, "lng": 13.3903, "region": "region-berlin", "days": ["day-08"], "cat": "cat-sight", "color": "#005f87", "hours": "Outdoor Memorial & Watchtower Open Daily 08:00–22:00 (Visitor Center Tue–Sun 10:00–18:00)", "addr": "Bernauer Str. 111, 13355 Berlin", "img": "assets/images/dachau.jpg", "note": "[Sun 8 Nov · 09:30–11:00] Walk 15 mins from Karlito to the preserved Berlin Wall death-strip & watchtower, then walk straight up Bernauer Straße into Mauerpark!"},
    {"id": 144, "name": "★ #44 Mauerpark Flohmarkt ('Sunday flea market')", "lat": 52.541388, "lng": 13.402366, "region": "region-berlin", "days": ["day-08"], "saved": true, "cat": "cat-sight", "color": "#b42318", "hours": "Sundays 10:00–18:00 (VERIFIED via berlin.de)", "addr": "Bernauer Str. 64, 13355 Berlin (U2 Eberswalder Str.)", "img": "assets/images/berlin_mauerpark.webp", "note": "[Sun 8 Nov · 11:00–13:00] Berlin's famous Sunday flea market for vintage cameras, lenses, DDR antiques, street food & buskers. Never link mauerparkmarkt.de — that domain is hijacked by casino spam."},
    {"id": 173, "name": "Berlin Hauptbahnhof (Track 3 — 20:52 Nightjet NJ 408 to Freiburg)", "lat": 52.5251, "lng": 13.3694, "region": "region-berlin", "days": ["day-08"], "cat": "cat-transit", "color": "#b42318", "hours": "Departs Sun 8 Nov at 20:52 (Bahnsteig 3)", "addr": "Europaplatz 1, 10557 Berlin", "img": "assets/images/tgv_train.jpg", "note": "[Sun 8 Nov · 20:25 Boarding / 20:52 Departure] Board ÖBB Nightjet NJ 408 on Bahnsteig 3 (Coach 309, Berths 52/56, Double Deluxe with shower/WC, breakfast included) → Freiburg (Brsg) Hbf Mon 06:17. Print the ticket on white A4 and carry photo ID."},
    {"id": 115, "name": "◇ #15 Ständige Vertretung (OPTIONAL alternative — replaced by Hamy)", "lat": 52.521272, "lng": 13.385517, "region": "region-berlin", "days": [], "saved": true, "cat": "cat-food", "color": "#9a3412", "hours": "Daily 11:00–24:00 (optional, off the day routes)", "addr": "Schiffbauerdamm 8, 10117 Berlin (S Friedrichstraße)", "img": "assets/images/berlin_hackesche.jpg", "note": "OPTIONAL ONLY: Hamy (Hasenheide 10) is the Sat 7 Nov dinner, so StäV is off every day route — keep it as a wet-weather or Hamy-backup pub serving Gaffel Kölsch & Rhenish Sauerbraten."},
    {"id": 170, "name": "✖ Topography of Terror (OMITTED — Not in the Approved Thu 5 Nov Plan)", "lat": 52.5065, "lng": 13.3835, "region": "region-berlin", "days": [], "omitted": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "Omitted from daily routes (site itself open daily 10:00–20:00, free)", "addr": "Niederkirchnerstraße 8, 10963 Berlin", "img": "assets/images/dachau.jpg", "note": "OMITTED: The approved Thu 5 Nov plan runs Holocaust Memorial → Brandenburg Gate → Reichstag exterior (10:30–13:00) and does not include Topography of Terror. It sits 600m from the Memorial, so it is the obvious rainy-day swap if you want it."},
    {"id": 122, "name": "✖ #22 DDR Museum (OMITTED — Tourist Trap)", "lat": 52.519337, "lng": 13.402307, "region": "region-berlin", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "Omitted from Itinerary", "addr": "Karl-Liebknecht-Str. 1, 10178 Berlin", "img": "assets/images/berlin_hackesche.jpg", "note": "OMITTED: Cramped, school-group-heavy basement attraction. Replaced by the authentic Berlin Wall Memorial at Bernauer Straße on Sun 8 Nov!"},
    {"id": 150, "name": "✖ #50 MXPSM Wedding Distillery Storefront (OMITTED — Drink at Michelberger Bar Instead)", "lat": 52.545376, "lng": 13.343464, "region": "region-berlin", "days": [], "omitted": true, "saved": true, "cat": "cat-wine", "color": "#9ca3af", "hours": "Omitted Storefront Detour", "addr": "Seestraße 13, 13353 Berlin-Wedding", "img": "assets/images/berlin_brlo.jpg", "note": "OMITTED DETOUR: Industrial Wedding site with restricted hours. Drink their exact MXPSM schnaps at Michelberger Hotel bar opposite #19 RAW-Gelände on Fri 6 Nov!"},
    {"id": 149, "name": "✖ #49 Dr. Kochan Liquor Culture (OMITTED — Sunday Hours Closed/Unconfirmed)", "lat": 52.532875, "lng": 13.422737, "region": "region-berlin", "days": [], "omitted": true, "saved": true, "cat": "cat-wine", "color": "#9ca3af", "hours": "Omitted from daily routes — closed or unconfirmed on Sundays", "addr": "Immanuelkirchstraße 4, 10405 Berlin (Prenzlauer Berg)", "img": "assets/images/berlin_brlo.jpg", "note": "OMITTED: Sunday hours are closed or unconfirmed, so the Sun 8 Nov 14:00–17:00 Prenzlauer Berg window is a flexible wander (Bildband and L'Épicerie are also closed/unconfirmed on Sundays)."},
    {"id": 113, "name": "✖ #13 Avci Bistro (OMITTED — Old Fri 18:00 Tea Stop, Off the New Plan)", "lat": 52.510585, "lng": 13.452151, "region": "region-berlin", "days": [], "omitted": true, "saved": true, "cat": "cat-food", "color": "#9ca3af", "hours": "Omitted from daily routes (still a handy lunch fallback next door to Domke)", "addr": "Kopernikusstraße 30, 10245 Berlin-Friedrichshain", "img": "assets/images/berlin_brlo.jpg", "note": "OMITTED: Friday now runs Domke breakfast (~09:30) → Mitte camera shops → Mały Książę → confirmed 18:30 Yorckschlösschen, so the old 18:00 tea stop is gone. Still 20m around the corner from Domke if the butcher counter is shut."},
    {"id": 160, "name": "✖ #60 The Berlin Art Market by the Zeughaus (OMITTED — Not in the Approved Sat 7 Nov Plan)", "lat": 52.518129, "lng": 13.397811, "region": "region-berlin", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "Omitted from daily routes (market itself Sat & Sun 11:00–17:00)", "addr": "Am Zeughaus 1-2, 10117 Berlin (Museum Island)", "img": "assets/images/berlin_hackesche.jpg", "note": "OMITTED: The approved Sat 7 Nov plan gives the 15:15–16:15 slot to C/O Berlin at Amerika Haus, so the Zeughaus art market is no longer on the route."},
    {"id": 300, "name": "★ Freiburg Airbnb Base (Mathildenstraße 14 — 06:35 AM Early Bag Drop!)", "lat": 48.0004, "lng": 7.8371, "region": "region-blackforest", "days": ["day-09", "day-10", "day-11", "day-12"], "cat": "cat-hotel", "color": "#067647", "hours": "Mon 9 Nov (06:35 AM Bag Drop / 15:00 Check-In) – Thu 12 Nov (12:00 PM Checkout)", "addr": "Mathildenstraße 14, 79106 Freiburg im Breisgau (6 mins walk from Freiburg Hbf)", "img": "assets/images/sourdough_bakery.jpg", "note": "[Mon 9 – Thu 12 Nov Base] Walk 6 mins from Nightjet Platform 3 at Freiburg Hbf to drop your luggage early with the host!"},
    {"id": 227, "name": "★ #27 Günter Coffee Store | Specialty Coffee", "lat": 47.997118, "lng": 7.849407, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Fri 10:00–17:00, Sat 09:00–18:00", "addr": "Grünwälderstraße / Belfortstraße, Freiburg", "img": "assets/images/sourdough_bakery.jpg", "note": "[Mon 9 Nov · Browse, NOT breakfast] Roastery store, Mon–Fri 10:00–17:00 / Sat 09:00–18:00 — buy beans here after the Kolben Kaffee breakfast; do not rely on it for an early breakfast."},
    {"id": 238, "name": "★ #38 Kolben Kaffee", "lat": 47.993722, "lng": 7.849127, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Sat 07:30–18:00", "addr": "Kaiser-Joseph-Straße 233, 79098 Freiburg", "img": "assets/images/sourdough_bakery.jpg", "note": "[Mon 9 Nov · Breakfast] Mon–Sat 07:30–18:00 — the day-09 breakfast stop, tucked inside an arcade courtyard on Freiburg's main avenue."},
    {"id": 231, "name": "★ #31 Markthalle Freiburg", "lat": 47.994173, "lng": 7.849836, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Mon–Thu 11:00–20:00, Fri–Sat 11:00–24:00", "addr": "Grünwälderstraße 4, 79098 Freiburg", "img": "assets/images/viktualienmarkt.jpg", "note": "[Mon 9 Nov · 12:00 Lunch] Indoor food & champagne hall inside a historic newspaper printing building."},
    {"id": 239, "name": "★ #39 Confiserie Gmeiner", "lat": 47.993312, "lng": 7.849204, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Sat 09:30–18:30", "addr": "Kaiser-Joseph-Straße 243, 79098 Freiburg", "img": "assets/images/kaiserschmarrn.jpg", "note": "[Mon 9 Nov · 13:30 Cake] Master patisserie famous for authentic Schwarzwälder Kirschtorte (Black Forest cherry cake)."},
    {"id": 226, "name": "★ #26 café hinterzimmer.", "lat": 47.993976, "lng": 7.851482, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Afternoon Cozy Living-Room Café", "addr": "Grünwälderstraße 23, 79098 Freiburg", "img": "assets/images/sourdough_bakery.jpg", "note": "[Mon 9 Nov · 14:15] Charming indie café right down the street from Markthalle before your 15:00 Airbnb check-in."},
    {"id": 209, "name": "★ #09 Freiburgs Finest Flagship Store ('must go for Zibärtle')", "lat": 47.994709, "lng": 7.85314, "region": "region-blackforest", "days": ["day-12"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Mon–Sat 10:00–18:00 (never evening)", "addr": "Schusterstraße, 79098 Freiburg", "img": "assets/images/franken_wine.jpg", "note": "[Thu 12 Nov · Morning MUST-GO] Your Note: must go for a regional spirit called Zibärtle! Rare wild Black Forest plum eau-de-vie. Mon–Sat 10:00–18:00 only, so this is a morning stop before the 12:00 checkout and the train to Colmar — never an evening visit."},
    {"id": 211, "name": "★ #11 Alte Wache Freiburg - Haus der badischen Weine", "lat": 47.995341, "lng": 7.853432, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Mon–Sat 10:30–21:00", "addr": "Münsterplatz 38, 79098 Freiburg", "img": "assets/images/franken_wine.jpg", "note": "[Mon 9 Nov · 17:30 Sunset Wine] Sip Baden Grauburgunder & Spätburgunder right on Freiburg's cathedral square."},
    {"id": 210, "name": "★ #10 Hausbrauerei Feierling", "lat": 47.993311, "lng": 7.852726, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Daily 11:00–24:00", "addr": "Gerberau 46, 79098 Freiburg", "img": "assets/images/augustiner.jpg", "note": "[Mon 9 Nov · 19:00 Dinner] Freiburg's beloved brewery tavern pouring unfiltered organic Inselhopf lager."},
    {"id": 206, "name": "★ #06 Friedrichsbad - Das Römisch-Irische Bad (Baden-Baden)", "lat": 48.762994, "lng": 8.242079, "region": "region-blackforest", "days": ["day-10"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Daily 09:00–22:00", "addr": "Römerplatz 1, 76530 Baden-Baden", "img": "assets/images/residenz_antiquarium.jpg", "note": "[Tue 10 Nov · 10:00–13:30] Scheduled Bathhouse Day! 17-step Roman-Irish thermal bath ritual inside an 1877 Renaissance temple."},
    {"id": 240, "name": "★ #40 Café König (Baden-Baden)", "lat": 48.760186, "lng": 8.240137, "region": "region-blackforest", "days": ["day-10"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Wed–Mon 09:00–18:00 (Check Tue hours / backup: Café Beek at Luisenstr. 14)", "addr": "Lichtentaler Str. 12, 76530 Baden-Baden", "img": "assets/images/kaiserschmarrn.jpg", "note": "[Tue 10 Nov · 14:00 Cake & Hot Chocolate] Grand 18th-century Baden-Baden chocolatier & patisserie salon 6 mins walk from Friedrichsbad."},
    {"id": 298, "name": "Lake Titisee (High Black Forest — Scheduled Wed 11 Nov)", "lat": 47.9016, "lng": 8.1565, "region": "region-blackforest", "days": ["day-11"], "cat": "cat-sight", "color": "#005f87", "hours": "38 mins via S1 Höllentalbahn from Freiburg Hbf", "addr": "Seestraße, 79822 Titisee-Neustadt", "img": "assets/images/neuschwanstein.jpg", "note": "[Wed 11 Nov · 10:00–14:00] Scenic train ride through the Ravenna Gorge to Lake Titisee (replaces the November-closed Schauinsland cable car!)."},
    {"id": 237, "name": "★ #37 Schloss-Café Freiburg (Schlossberg Viewpoint)", "lat": 47.981206, "lng": 7.838612, "region": "region-blackforest", "days": ["day-11"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Daily 10:00–18:00", "addr": "Kapellenweg 1 / Schlossberg, 79100 Freiburg", "img": "assets/images/kaiserschmarrn.jpg", "note": "[Wed 11 Nov · 15:00 Viewpoint] Panoramic terrace café on Freiburg's Schlossberg hill overlooking the cathedral spire."},
    {"id": 230, "name": "★ #30 Johanneskirche (Freiburg-Wiehre)", "lat": 47.989003, "lng": 7.846426, "region": "region-blackforest", "days": ["day-11"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Daily 09:00–18:00", "addr": "Kirchstraße 4, 79100 Freiburg-Wiehre", "img": "assets/images/viktualienmarkt.jpg", "note": "[Wed 11 Nov · 16:15 Stroll] Twin-spired Neo-Romanesque church just across the Dreisam river in Freiburg-Wiehre."},
    {"id": 225, "name": "★ #25 Bäckerei Bühler (Freiburg-Wiehre)", "lat": 47.986924, "lng": 7.850732, "region": "region-blackforest", "days": ["day-11"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Fri 06:15–18:30, Sat 06:15–13:00", "addr": "Zasiusstraße 9, 79102 Freiburg-Wiehre", "img": "assets/images/sourdough_bakery.jpg", "note": "[Wed 11 Nov · 16:45 Bakery] Traditional artisan neighborhood bakery 4 mins walk from Johanneskirche."},
    {"id": 224, "name": "★ #24 SAMS Café (Freiburg Final Morning Coffee)", "lat": 47.996073, "lng": 7.852673, "region": "region-blackforest", "days": ["day-12"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Sat 08:30–18:00", "addr": "Herrenstraße / Münsterplatz, Freiburg", "img": "assets/images/sourdough_bakery.jpg", "note": "[Thu 12 Nov · Breakfast] Mon–Sat 08:30–18:00 — final Freiburg breakfast before the 12:00 checkout at Mathildenstraße 14 and the train to Colmar."},
    {"id": 299, "name": "★ Hôtel Saint-Martin Colmar (Confirmed Colmar Base)", "lat": 48.0761, "lng": 7.3586, "region": "region-blackforest", "days": ["day-12", "day-13"], "cat": "cat-hotel", "color": "#067647", "hours": "Check-in Thu 12 Nov – Checkout Fri 13 Nov (16:45 TGV)", "addr": "38 Grand'Rue, 68000 Colmar, France", "img": "assets/images/hotel_saint_martin_colmar.webp", "note": "[Thu 12 – Fri 13 Nov Base] Right in the medieval heart of Colmar steps from Petite Venise!"},
    {"id": 241, "name": "★ #41 Porte de Munster (Obertor), Turckheim", "lat": 48.086232, "lng": 7.271595, "region": "region-blackforest", "days": ["day-13-colmar"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open 24/7 (100m from Domaine François Baur!)", "addr": "Grand'Rue, 68230 Turckheim, France", "img": "assets/images/haidhausen.jpg", "note": "[Fri 13 Nov · 09:45 AM] Medieval fortified gate of Turckheim—you walk straight through this arch to reach Domaine François Baur 100m ahead!"},
    {"id": 242, "name": "★ #42 Domaine François Baur (CONFIRMED 10:00 AM Wine Tour!)", "lat": 48.086706, "lng": 7.277337, "region": "region-blackforest", "days": ["day-13-colmar"], "saved": true, "cat": "cat-wine", "color": "#067647", "hours": "CONFIRMED: Fri 13 Nov 2026 at 10:00 AM (Ref: 815D4A45A0E85F6C)", "addr": "3 Grand'Rue, 68230 Turckheim, France", "img": "assets/images/franken_wine.jpg", "note": "[Fri 13 Nov · 10:00–11:30 AM CONFIRMED] Biodynamic Grand Cru Brand Riesling & Crémant tasting for 2 adults (€24.00 via Winalist)."},
    {"id": 243, "name": "★ #43 CELLAR TURCKHEIM (Cave Vinicole de Turckheim)", "lat": 48.086409, "lng": 7.2657, "region": "region-blackforest", "days": ["day-13-colmar"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Mon–Sat 09:00–12:00 & 14:00–18:00", "addr": "16 Rue des Tuileries, 68230 Turckheim, France", "img": "assets/images/franken_wine.jpg", "note": "[Fri 13 Nov · 11:35 AM] Historic Turckheim wine cooperative 5 mins walk from Domaine Baur before returning to Colmar for your 16:45 TGV to Munich!"},
    {"id": 207, "name": "✖ #07 Geroldsauer Mühle (OMITTED — Out-of-Town Bus Detour)", "lat": 48.734878, "lng": 8.254101, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-food", "color": "#9ca3af", "hours": "Omitted from Tue 10 Nov", "addr": "Geroldsauer Str. 54, 76534 Baden-Baden", "img": "assets/images/neuschwanstein.jpg", "note": "OMITTED: Requires local Bus 204 into the woods as 16:30 sunset hits after Friedrichsbad + Café König."},
    {"id": 208, "name": "✖ #08 Weingut Faber (OMITTED — Suburban Bottle-Pickup Address)", "lat": 47.977932, "lng": 7.791389, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-wine", "color": "#9ca3af", "hours": "Omitted from Freiburg Days", "addr": "Blumenstraße 19, 79111 Freiburg-St. Georgen", "img": "assets/images/franken_wine.jpg", "note": "OMITTED: 4km southwest in suburban St. Georgen; taste 30+ Baden wines right on Münsterplatz at #11 Alte Wache instead!"},
    {"id": 228, "name": "✖ #28 Hakuna Matata (OMITTED — Casual Suburban Spot)", "lat": 47.98658, "lng": 7.847847, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-food", "color": "#9ca3af", "hours": "Omitted", "addr": "Günterstalstraße 35a, 79102 Freiburg", "img": "assets/images/obatzda.jpg", "note": "OMITTED: Casual student African-fusion café; replaced by #10 Feierling & #31 Markthalle."},
    {"id": 229, "name": "✖ #29 Pizzeria Grüner Baum (OMITTED — Neighborhood Pizzeria)", "lat": 47.98493, "lng": 7.845081, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-food", "color": "#9ca3af", "hours": "Omitted", "addr": "Lorettostraße 12, 79100 Freiburg", "img": "assets/images/kaesespaetzle.jpg", "note": "OMITTED: Neighborhood pizzeria in South Wiehre."},
    {"id": 232, "name": "✖ #32 Museums-Bergwerk Schauinsland (OMITTED — Winter-Closed)", "lat": 47.909542, "lng": 7.898384, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "CLOSED Nov 1 – April", "addr": "Schauinslandstraße 390, 79254 Oberried", "img": "assets/images/dachau.jpg", "note": "OMITTED: The silver mine is winter-closed (Nov 1 – April), which is the real reason the Schauinsland cluster is off the plan. Replaced by Lake Titisee on Wed 11 Nov."},
    {"id": 233, "name": "✖ #33 Schniederlihof (OMITTED — Winter-Closed)", "lat": 47.907148, "lng": 7.900239, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "CLOSED Nov 1 – April", "addr": "Gegendrumweg 3, 79254 Oberried-Hofsgrund", "img": "assets/images/dachau.jpg", "note": "OMITTED: The 1592 farmhouse museum is winter-closed (Nov 1 – April). This — together with the Bergwerk — is why Schauinsland was dropped in favour of Titisee."},
    {"id": 234, "name": "✖ #34 Holzschlägermatte (OMITTED — With the Winter-Closed Cluster)", "lat": 47.91512, "lng": 7.880996, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "Omitted (top-station stop reached by the open cable car)", "addr": "Schauinslandstraße 359, 79100 Freiburg", "img": "assets/images/neuschwanstein.jpg", "note": "OMITTED: Mountain-pass stop on Schauinsland. The cable car is actually open 9–13 Nov (the Herbstrevision only starts 16 Nov 2026), but Museums-Bergwerk and Schniederlihof are winter-closed and you chose Titisee instead."},
    {"id": 235, "name": "✖ #35 Schauinslandbahn Cable Car (OMITTED — Actually OPEN 9–13 Nov)", "lat": 47.936043, "lng": 7.865329, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "OPEN 9–13 Nov 2026 (fall revision only starts 16 Nov)", "addr": "Bohrerstraße 11, 79289 Horben", "img": "assets/images/neuschwanstein.jpg", "note": "OMITTED BY CHOICE, NOT BY CLOSURE: the cable car and Bergstation are open 9–13 Nov 2026 — the Herbstrevision only begins 16 Nov 2026. It is off the plan because Museums-Bergwerk and Schniederlihof are winter-closed and you chose Lake Titisee for Wed 11 Nov."},
    {"id": 236, "name": "✖ #36 Die Bergstation Schauinsland (OMITTED — Actually OPEN 9–13 Nov)", "lat": 47.90966, "lng": 7.891262, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "OPEN 9–13 Nov 2026 (fall revision only starts 16 Nov)", "addr": "Schauinslandstraße 390, 79117 Freiburg", "img": "assets/images/neuschwanstein.jpg", "note": "OMITTED BY CHOICE: top station of the Schauinsland cable car, reachable 9–13 Nov 2026. Dropped because the Bergwerk and Schniederlihof above are winter-closed and Titisee is the Wed 11 Nov plan."},
    {"id": 1, "name": "Timehouse Munich (Confirmed Munich Base · Booking #6724144172)", "lat": 48.1765, "lng": 11.5923, "days": ["day-13", "day-14", "day-15", "day-16", "day-17", "day-18", "day-19"], "cat": "cat-hotel", "color": "#005f87", "hours": "Reception 06:30–22:30 (WhatsApp Late Check-In / 24/7 Keybox)", "addr": "Leopoldstraße 204a, 80804 München (U6 Nordfriedhof)", "img": "assets/images/timehouse_room.jpg", "note": "[Fri 13 – Thu 19 Nov Base · Ref 6724144172] Serviced apartment in Schwabing with full designer kitchen, laundry room & 6 mins walk to Lufthansa Express Bus."},
    {"id": 2, "name": "München Hauptbahnhof (Hbf)", "lat": 48.1402, "lng": 11.5586, "days": ["day-13", "day-15", "day-16"], "cat": "cat-transit", "color": "#475467", "hours": "24/7 Rail Hub", "addr": "Bayerstraße 10A, 80335 München", "img": "assets/images/tgv_train.jpg", "note": "[Fri 13 Nov 21:46 TGV Arrival & Sun 15 Nov 07:52 Füssen Train] Tracks 27–36 for BRB RB 68 to Füssen."},
    {"id": 3, "name": "Julius Brantner Brothandwerk (Sat-Only Croissants!)", "lat": 48.1518, "lng": 11.5761, "days": ["day-14"], "cat": "cat-bakery", "color": "#b8860b", "hours": "Tue–Sat 08:30–18:30 (Closed Sun/Mon)", "addr": "Adalbertstraße 25, Maxvorstadt (U6 Universität)", "img": "assets/images/sourdough_bakery.jpg", "note": "[Sat 14 Nov · 09:15] Famous 54-layer Butter Croissant & Sourdough Baguette are Fri/Sat specials!"},
    {"id": 25, "name": "★ #01 Zum Franziskaner ('傳統德國嘢？')", "lat": 48.1394, "lng": 11.5772, "days": ["day-14"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Daily 10:00–24:00 (Frühschoppen 10:00–11:30)", "addr": "Residenzstraße 9, 80333 München", "img": "assets/images/zum_franziskaner.jpg", "note": "[Sat 14 Nov · 10:30 Option A] Famous 10:00–11:30 Weißwurst/Leberkäse Frühschoppen (€12.90 incl. 0.5L beer) & house sweet mustard."},
    {"id": 4, "name": "Schneider Bräuhaus (Im Tal 7)", "lat": 48.1363, "lng": 11.5784, "days": ["day-14"], "cat": "cat-food", "color": "#d97706", "hours": "Daily 08:00–23:30", "addr": "Tal 7, 80331 München (Marienplatz)", "img": "assets/images/weisswurst.jpg", "note": "[Sat 14 Nov · 10:30 Option B] Traditional Weißwurstfrühstück (must be eaten before 12:00 noon!) + TAP6 Aventinus wheat beer."},
    {"id": 5, "name": "★ #17 Marienplatz, Rathaus-Glockenspiel, Frauenkirche & Alter Peter", "lat": 48.1374, "lng": 11.5755, "days": ["day-14"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Glockenspiel chimes 11:00 & 12:00 daily", "addr": "Marienplatz 1, 80331 München", "img": "assets/images/marienplatz.jpg", "note": "[Sat 14 Nov · 12:00] Watch the 12:00 Glockenspiel, visit Frauenkirche & climb Alter Peter tower."},
    {"id": 28, "name": "★ #52 GARIBALDI Marienplatz (Upgraded from Petuelring Warehouse)", "lat": 48.1378, "lng": 11.5774, "days": ["day-14"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Mon–Sat 10:00–20:00", "addr": "Burgstraße 2, 80331 München (2 mins from Marienplatz)", "img": "assets/images/garibaldi_wein.jpg", "note": "[Sat 14 Nov · 12:20] Central Old Town branch of your saved GARIBALDI wine & cheese merchant."},
    {"id": 6, "name": "★ #56 Viktualienmarkt & Biergarten ('Farmer market')", "lat": 48.1353, "lng": 11.5763, "days": ["day-14"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Mon–Sat 08:00–20:00 (Closed Sun)", "addr": "Viktualienmarkt 3, 80331 München", "img": "assets/images/viktualienmarkt.jpg", "note": "[Sat 14 Nov · 12:45] Open-air gourmet market & central rotating-tap beer garden under chestnut trees."},
    {"id": 7, "name": "★ #02 Schmalznudel - Café Frischhut ('炸包')", "lat": 48.1345, "lng": 11.5747, "days": ["day-14"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Hours unverified — confirm on the day (planned Sat 14 Nov 14:15)", "addr": "Prälat-Zistl-Straße 8, 80331 München", "img": "assets/images/schmalznudel.jpg", "note": "[Sat 14 Nov · 14:15] Hot hand-stretched Schmalznudel (Auszogne) fried to order right off Viktualienmarkt."},
    {"id": 8, "name": "Leica Store & Leica Galerie Munich", "lat": 48.1399, "lng": 11.5742, "days": ["day-14"], "cat": "cat-camera", "color": "#067647", "hours": "Mon–Sat 10:00–18:00 (Closed Sun)", "addr": "Maffeistraße 4, 80333 München", "img": "assets/images/leica_camera.jpg", "note": "[Sat 14 Nov · 15:15] Flagship Leica boutique, pre-owned M/Q glass & free fine-art photography gallery."},
    {"id": 9, "name": "Kunst-Oase Antiques at Ottostraße", "lat": 48.1434, "lng": 11.5688, "days": ["day-14"], "cat": "cat-camera", "color": "#067647", "hours": "Mon–Fri 11:00–18:00, Sat 10:00–16:00 (Closed Sun)", "addr": "Ottostraße 6, 80333 München", "img": "assets/images/antique_market.jpg", "note": "[Sat 14 Nov · 16:00] 30+ specialist antique dealers under one roof near Karolinenplatz."},
    {"id": 29, "name": "★ #18 Karlsplatz (Stachus)", "lat": 48.139246, "lng": 11.566021, "days": ["day-14"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open 24/7", "addr": "Karlsplatz, 80335 München", "img": "assets/images/marienplatz.jpg", "note": "[Sat 14 Nov · 16:50] Grand square & medieval Karlstor gate directly between Kunst-Oase Ottostraße and Calumet/Sauter."},
    {"id": 10, "name": "Sauter Calumet München (Sonnenstraße 21)", "lat": 48.1355, "lng": 11.5642, "days": ["day-14"], "cat": "cat-camera", "color": "#067647", "hours": "Mon–Sat 10:00–19:00 (Closed Sun)", "addr": "Sonnenstraße 21, 80331 München", "img": "assets/images/calumet_sauter.webp", "note": "[Sat 14 Nov · 17:10] Merged Calumet + Sauter superstore at Sonnenstraße 21 for analog film & used camera bodies."},
    {"id": 11, "name": "Haxnbauer (Reopened at Im Tal 38!)", "lat": 48.1357, "lng": 11.5806, "days": ["day-14"], "cat": "cat-food", "color": "#d97706", "hours": "Daily 11:30–23:00", "addr": "Tal 38, 80331 München (New Address!)", "img": "assets/images/schweinshaxe.jpg", "note": "[Sat 14 Nov · 19:00 Dinner] Reopened by Kuffler at Im Tal 38! Famous 24-hr brined Schweinshaxe & Kalbshaxe."},
    {"id": 12, "name": "★ #62 Schloss Neuschwanstein (CONFIRMED 14:15 Tour #475!)", "lat": 47.5576, "lng": 10.7498, "days": ["day-15"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Winter Hours: 10:00–16:00 · CONFIRMED Tour #475 at 14:15 (Courtyard 14:00!)", "addr": "Neuschwansteinstraße 20, 87645 Schwangau (Ticket Center Hohenschwangau)", "img": "assets/images/neuschwanstein.jpg", "note": "[Sun 15 Nov · 14:15 Tour #475 · Invoice 39901.1056944] Must be in the courtyard 15 mins prior (14:00)! Covered by Bayern-Ticket (€44 for 2)."},
    {"id": 13, "name": "KZ-Gedenkstätte Dachau (Memorial Site)", "lat": 48.2701, "lng": 11.4683, "days": ["day-16"], "cat": "cat-sight", "color": "#005f87", "hours": "Open Daily 09:00–17:00 (Including Mondays!)", "addr": "Alte Römerstraße 75, 85221 Dachau", "img": "assets/images/dachau.jpg", "note": "[Mon 16 Nov · 10:30–14:15] 11:00 English Guided Tour. Covered by MVV Zone M-1 Group Day Ticket (€21.20)."},
    {"id": 14, "name": "Foto Erhardt (ehem. Foto Dinkel)", "lat": 48.1369, "lng": 11.5608, "days": ["day-16"], "cat": "cat-camera", "color": "#067647", "hours": "Mon–Fri 09:30–18:30, Sat 10:00–16:00 (open Saturdays!)", "addr": "Landwehrstraße 6, 80336 München", "img": "assets/images/foto_dinkel.jpg", "note": "[Mon 16 Nov · 15:00] Right off Hbf after returning from Dachau on S2. Now trading as Foto Erhardt (formerly Foto Dinkel) — and it IS open on Saturdays (10:00–16:00), so it need not be squeezed into a weekday."},
    {"id": 15, "name": "★ #54 Augustiner Bräustuben (Holzfass Beer Hall)", "lat": 48.1389, "lng": 11.5442, "days": ["day-16"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Daily 10:00–24:00", "addr": "Landsberger Straße 19, 80339 München (Hackerbrücke)", "img": "assets/images/augustiner.jpg", "note": "[Mon 16 Nov · 17:00] Locals' favorite brewery taproom pouring Edelstoff & Helles from wooden barrels (Holzfass)."},
    {"id": 26, "name": "★ #23 Augustiner Bürgerheim (Westend Art Nouveau Wirtshaus)", "lat": 48.136, "lng": 11.5374, "days": ["day-16"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Daily 11:00–24:00 (Kitchen 12:00–21:30)", "addr": "Bergmannstraße 33, 80339 München (Westend)", "img": "assets/images/augustiner_buergerheim.jpg", "note": "[Mon 16 Nov · 19:00] Just 7 mins walk (600m) from Augustiner Bräustuben! 1899 Wirtshaus famous for Münchner Schnitzel & Holzfass beer."},
    {"id": 30, "name": "★ #16 Odeonsplatz & Hofgarten", "lat": 48.142778, "lng": 11.58, "days": ["day-17"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open Daily", "addr": "Odeonsplatz / Hofgartenstraße, 80539 München", "img": "assets/images/odeonsplatz.jpg", "note": "[Tue 17 Nov · 09:45] Arrive on U6 Odeonsplatz and walk through the Renaissance Hofgarten arcades toward the Englischer Garten."},
    {"id": 16, "name": "Eisbachwelle Surfers & Chinesischer Turm (Englischer Garten)", "lat": 48.1439, "lng": 11.5877, "days": ["day-17"], "cat": "cat-sight", "color": "#005f87", "hours": "Park Open 24/7", "addr": "Prinzregentenstraße / Englischer Garten", "img": "assets/images/englischer_garten.jpg", "note": "[Tue 17 Nov · 10:30–12:00] Watch river surfers at Eisbachwelle and walk to Chinesischer Turm beer garden."},
    {"id": 17, "name": "★ #58 Munich Residenz (Antiquarium & Treasury)", "lat": 48.1412, "lng": 11.579, "days": ["day-17"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Winter Hours: 10:00–17:00 daily", "addr": "Residenzstraße 1, 80333 München", "img": "assets/images/residenz_antiquarium.jpg", "note": "[Tue 17 Nov · 13:00 Museum #1] 66m Renaissance Antiquarium & Royal Schatzkammer (Treasury)."},
    {"id": 18, "name": "★ #58 Weihnachtsdorf im Kaiserhof der Residenz ('Xmas market 16/11-22/12')", "lat": 48.1418, "lng": 11.5781, "days": ["day-17"], "saved": true, "cat": "cat-sight", "color": "#b42318", "hours": "16 Nov–22 Dec 2026: Daily 11:00–21:00", "addr": "Kaiserhof der Residenz (Odeonsplatz Entrance)", "img": "assets/images/residenz_christmas.jpg", "note": "[Tue 17 Nov · 16:00 Dusk] Must-Do Christmas Market (or flexible swap to 16/18 Nov). Glühwein & Eierpunsch!"},
    {"id": 19, "name": "Pfälzer Residenz Weinstube", "lat": 48.1422, "lng": 11.5778, "days": ["day-17"], "cat": "cat-wine", "color": "#7c3aed", "hours": "Daily 11:30–24:00", "addr": "Residenzstraße 1, 80333 München", "img": "assets/images/pfaelzer_weinstube.jpg", "note": "[Tue 17 Nov · 19:00 Option A] Right inside the Residenz palace arches; 50+ German Rieslings & Spätburgunders by the glass."},
    {"id": 20, "name": "Weinhaus Neuner (Franken Silvaner Bocksbeutel)", "lat": 48.1381, "lng": 11.5681, "days": ["day-17"], "cat": "cat-wine", "color": "#7c3aed", "hours": "Mon–Sun 12:00–24:00 (Open Sundays in Winter!)", "addr": "Herzogspitalstraße 8, 80331 München", "img": "assets/images/weinhaus_neuner.jpg", "note": "[Tue 17 Nov · 19:30 Option B] Munich's oldest wine tavern (1452). Drink dry Franken Silvaner from a Bocksbeutel bottle!"},
    {"id": 21, "name": "Boulangerie Dompierre", "lat": 48.1489, "lng": 11.5758, "days": ["day-18"], "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Sat 07:30–18:30", "addr": "Türkenstraße 21, 80799 München (Maxvorstadt)", "img": "assets/images/dompierre.jpg", "note": "[Wed 18 Nov · 09:15] French-butter croissants & baguettes in Maxvorstadt."},
    {"id": 27, "name": "★ #51 Feinkost Olé - Spanische Weine & Spezialitäten", "lat": 48.1551, "lng": 11.5751, "days": ["day-18"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Tue–Fri 10:00–19:00, Sat 10:00–14:00 (closed Sun/Mon)", "addr": "Georgenstraße 43, 80799 München (Maxvorstadt)", "img": "assets/images/garibaldi_wein.jpg", "note": "[Wed 18 Nov · Maxvorstadt] Spanish wine, sherry, jamón Ibérico & Manchego, 4 mins walk north of Boulangerie Dompierre. Closed Sundays & Mondays, so Wednesday is the day."},
    {"id": 22, "name": "Deutsches Museum (Classical Optics & Photography)", "lat": 48.1299, "lng": 11.5834, "days": ["day-18"], "cat": "cat-sight", "color": "#005f87", "hours": "Daily 09:00–17:00", "addr": "Museumsinsel 1, 80538 München", "img": "assets/images/deutsches_museum.jpg", "note": "[Wed 18 Nov · 10:30 Museum #2] Classical Optics & Photography and Film permanent exhibitions."},
    {"id": 31, "name": "Wiener Platz (Haidhausen 'French Quarter')", "lat": 48.1338, "lng": 11.5955, "days": ["day-18"], "cat": "cat-sight", "color": "#005f87", "hours": "Open Daily", "addr": "Wiener Platz, 81667 München-Haidhausen", "img": "assets/images/haidhausen.jpg", "note": "[Wed 18 Nov · 13:15] Village-like market square and beer garden East of the Isar in Haidhausen."},
    {"id": 32, "name": "Bar Mural (Glockenbachviertel Natural Wine Bar)", "lat": 48.1352, "lng": 11.5694, "days": ["day-18"], "cat": "cat-wine", "color": "#7c3aed", "hours": "Wed–Sat from 17:00 / Aperitivo", "addr": "Hotterstraße 12, 80331 München", "img": "assets/images/bar_mural.jpg", "note": "[Wed 18 Nov · 15:30 / 17:00] Trendy natural wine & bottle shop adored by young Munich locals."},
    {"id": 23, "name": "Alte Utting (Steamship on a Railway Bridge in Sendling)", "lat": 48.1197, "lng": 11.5562, "days": ["day-18"], "cat": "cat-sight", "color": "#005f87", "hours": "Wed–Thu from 16:00, Fri–Sun earlier", "addr": "Lagerhausstraße 15, 81371 München-Sendling", "img": "assets/images/alte_utting.jpg", "note": "[Wed 18 Nov · 16:30] Retired excursion steamship craned onto a railway bridge with craft beer & street food stalls!"},
    {"id": 33, "name": "Hofbräuhaus am Platzl (Historic Schwemme Brass Band)", "lat": 48.1376, "lng": 11.5799, "days": ["day-18"], "cat": "cat-food", "color": "#d97706", "hours": "Daily 09:00–24:00", "addr": "Platzl 9, 80331 München", "img": "assets/images/hofbrauhaus.jpg", "note": "[Wed 18 Nov · 19:00 Farewell Evening] Step into the historic vaulted Schwemme hall for live Bavarian brass band music."},
    {"id": 24, "name": "Lufthansa Express Bus Stop (Schwabing / Nordfriedhof → MUC)", "lat": 48.1731, "lng": 11.5968, "days": ["day-19"], "cat": "cat-transit", "color": "#b42318", "hours": "Every 20 mins (05:33–20:13)", "addr": "Ungererstraße / Nordfriedhof (6 mins walk from Timehouse)", "img": "assets/images/timehouse_kitchen.webp", "note": "[Thu 19 Nov · 06:33 or 06:53] Non-stop 25-min bus to Munich Airport (MUC) for your Etihad EY 126 departing MUC at 10:30!"},
    {"id": 53, "name": "✖ #53 Hofbräu am Oberwiesenfeld (OMITTED — Residential Block Restaurant)", "lat": 48.166153, "lng": 11.561895, "days": [], "omitted": true, "saved": true, "cat": "cat-food", "color": "#9ca3af", "hours": "Omitted", "addr": "Hildeboldstraße 23, 80797 München", "img": "assets/images/hofbrauhaus.jpg", "note": "OMITTED: Modern residential-block restaurant; replaced by Augustiner Bräustuben, Augustiner Bürgerheim & Zum Franziskaner."},
    {"id": 55, "name": "✖ #55 Königssee (OMITTED — ≥2.5h Each Way, No Free Day)", "lat": 47.55418, "lng": 12.978374, "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "Omitted — impractical on this trip", "addr": "83471 Schönau am Königssee", "img": "assets/images/neuschwanstein.jpg", "note": "OMITTED (impractical): at least 2.5 hours each way from Munich and there is no free day to absorb it — every day of the 13–19 Nov leg is already committed."},
    {"id": 61, "name": "✖ #61 Nördlingen (OMITTED — 4.5-Hr Round Trip)", "lat": 48.850816, "lng": 10.489491, "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "Omitted", "addr": "86720 Nördlingen", "img": "assets/images/haidhausen.jpg", "note": "OMITTED: Preserves your 3 full city days in Munich."}
  ];

  var DAY_GMAPS = {
    "all": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/Julius+Brantner+Brothandwerk,+Adalbertstra%C3%9Fe+25,+M%C3%BCnchen/Schneider+Br%C3%A4uhaus,+Tal+7,+M%C3%BCnchen/Marienplatz,+M%C3%BCnchen/Viktualienmarkt,+M%C3%BCnchen/Caf%C3%A9+Frischhut,+Pr%C3%A4lat-Zistl-Stra%C3%9Fe+8,+M%C3%BCnchen/Leica+Store+M%C3%BCnchen,+Maffeistra%C3%9Fe+4/Kunst-Oase,+Ottostra%C3%9Fe+6,+M%C3%BCnchen/Sauter+Calumet+M%C3%BCnchen,+Sonnenstra%C3%9Fe+21/Haxnbauer,+Tal+38,+M%C3%BCnchen",
    "day-05": "https://www.google.com/maps/dir/Linienstra%C3%9Fe+60,+10119+Berlin/Zeit+f%C3%BCr+Brot,+Alte+Sch%C3%B6nhauser+Str.+4,+Berlin/Memorial+to+the+Murdered+Jews+of+Europe,+Berlin/Brandenburger+Tor,+Berlin/Reichstag,+Berlin/Mampe+Berlin,+Am+Tempelhofer+Berg+6,+Berlin/BRLO+Brwhouse,+Sch%C3%B6neberger+Str.+16,+Berlin",
    "day-06": "https://www.google.com/maps/dir/Linienstra%C3%9Fe+60,+10119+Berlin/Fleischerei+Domke,+Warschauer+Str.+64,+Berlin/RAW-Gel%C3%A4nde,+Berlin/Boxhagener+Platz,+Berlin/East+Side+Gallery,+Berlin/Safelight+Berlin,+Schivelbeiner+Str.+9,+Berlin/Hackesche+H%C3%B6fe,+Berlin/Haus+Schwarzenberg,+Rosenthaler+Str.+39,+Berlin/FOTOIMPEX,+Alte+Sch%C3%B6nhauser+Str.+32B,+Berlin/Ma%C5%82y+Ks%C4%85%C5%BC%C4%99,+Lilienthalstra%C3%9Fe+6,+Berlin/Yorckschl%C3%B6sschen,+Yorckstra%C3%9Fe+15,+10965+Berlin",
    "day-07": "https://www.google.com/maps/dir/Linienstra%C3%9Fe+60,+10119+Berlin/Zoologischer+Garten+Berlin/Foto-Meyer,+Welserstra%C3%9Fe+1,+Berlin/C%2FO+Berlin+at+Amerika+Haus,+Hardenbergstra%C3%9Fe+22,+Berlin/Hamy,+Hasenheide+10,+Berlin",
    "day-08": "https://www.google.com/maps/dir/Linienstra%C3%9Fe+60,+10119+Berlin/Gedenkst%C3%A4tte+Berliner+Mauer,+Bernauer+Str./Mauerpark+Flohmarkt,+Berlin/Linienstra%C3%9Fe+60,+10119+Berlin/Berlin+Hbf",
    "day-09": "https://www.google.com/maps/dir/Freiburg+Hbf/Mathildenstra%C3%9Fe+14,+79106+Freiburg/G%C3%BCnter+Coffee+Store,+Freiburg/Kolben+Kaffee,+Kaiser-Joseph-Stra%C3%9Fe+233,+Freiburg/Markthalle,+Freiburg/Confiserie+Gmeiner,+Freiburg/caf%C3%A9+hinterzimmer,+Freiburg/Alte+Wache,+Freiburg/Hausbrauerei+Feierling,+Freiburg",
    "day-10": "https://www.google.com/maps/dir/Mathildenstra%C3%9Fe+14,+79106+Freiburg/Freiburg+Hbf/Friedrichsbad,+R%C3%B6merplatz+1,+Baden-Baden/Caf%C3%A9+K%C3%B6nig,+Lichtentaler+Str.+12,+Baden-Baden",
    "day-11": "https://www.google.com/maps/dir/Mathildenstra%C3%9Fe+14,+79106+Freiburg/Freiburg+Hbf/Titisee,+Titisee-Neustadt/Schloss-Caf%C3%A9+Freiburg/Johanneskirche,+Freiburg/B%C3%A4ckerei+B%C3%BChler,+Zasiusstra%C3%9Fe+9,+Freiburg",
    "day-12": "https://www.google.com/maps/dir/Mathildenstra%C3%9Fe+14,+79106+Freiburg/SAMS+Caf%C3%A9,+Freiburg/Freiburgs+Finest,+Schusterstra%C3%9Fe,+Freiburg/Freiburg+Hbf/H%C3%B4tel+Saint-Martin,+38+Grand'Rue,+Colmar",
    "day-13-colmar": "https://www.google.com/maps/dir/H%C3%B4tel+Saint-Martin,+38+Grand'Rue,+Colmar/Porte+de+Munster,+Turckheim/Domaine+Fran%C3%A7ois+Baur,+3+Grand'Rue,+68230+Turckheim/Cave+Vinicole+de+Turckheim/Gare+de+Colmar",
    "day-13": "https://www.google.com/maps/dir/M%C3%BCnchen+Hbf/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen",
    "day-14": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/Julius+Brantner+Brothandwerk,+Adalbertstra%C3%9Fe+25,+M%C3%BCnchen/Schneider+Br%C3%A4uhaus,+Tal+7,+M%C3%BCnchen/Marienplatz,+M%C3%BCnchen/Viktualienmarkt,+M%C3%BCnchen/Caf%C3%A9+Frischhut,+Pr%C3%A4lat-Zistl-Stra%C3%9Fe+8,+M%C3%BCnchen/Leica+Store+M%C3%BCnchen,+Maffeistra%C3%9Fe+4/Kunst-Oase,+Ottostra%C3%9Fe+6,+M%C3%BCnchen/Sauter+Calumet+M%C3%BCnchen,+Sonnenstra%C3%9Fe+21/Haxnbauer,+Tal+38,+M%C3%BCnchen",
    "day-15": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/M%C3%BCnchen+Hbf/F%C3%BCssen+Bahnhof/Schloss+Neuschwanstein",
    "day-16": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/KZ-Gedenkst%C3%A4tte+Dachau/Foto+Erhardt,+Landwehrstra%C3%9Fe+6,+M%C3%BCnchen/Augustiner+Br%C3%A4ustuben,+Landsberger+Stra%C3%9Fe+19,+M%C3%BCnchen",
    "day-17": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/Odeonsplatz,+M%C3%BCnchen/Eisbachwelle,+M%C3%BCnchen/Residenz+M%C3%BCnchen/Weihnachtsdorf+im+Kaiserhof+der+Residenz/Pf%C3%A4lzer+Residenz+Weinstube/Weinhaus+Neuner,+Herzogspitalstra%C3%9Fe+8,+M%C3%BCnchen",
    "day-18": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/Boulangerie+Dompierre,+T%C3%BCrkenstra%C3%9Fe+21,+M%C3%BCnchen/Feinkost+Ol%C3%A9,+Georgenstra%C3%9Fe+43,+M%C3%BCnchen/Deutsches+Museum,+Museumsinsel+1,+M%C3%BCnchen/Wiener+Platz,+M%C3%BCnchen/Bar+Mural,+Hotterstra%C3%9Fe+12,+M%C3%BCnchen/Alte+Utting,+Lagerhausstra%C3%9Fe+15,+M%C3%BCnchen/Hofbr%C3%A4uhaus+M%C3%BCnchen",
    "day-19": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/Nordfriedhof,+M%C3%BCnchen/Munich+Airport+(MUC)"
  };

  if (typeof L !== 'undefined' && document.getElementById('munich-map')) {
    var map = L.map('munich-map').setView([48.145, 11.575], 13);
    var rawCartoKey = (window.LOCAL_MAP_CONFIG && window.LOCAL_MAP_CONFIG.cartoKey) || window.CARTO_API_KEY || '';
    var cartoKey = rawCartoKey ? ('?key=' + encodeURIComponent(rawCartoKey)) : '';
    var esriStreet = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri & OpenStreetMap contributors',
      maxZoom: 19
    });
    var openTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenTopoMap & OpenStreetMap contributors',
      maxZoom: 17
    });
    var cartoVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' + cartoKey, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    });
    if (cartoKey) {
      cartoVoyager.addTo(map);
    } else {
      esriStreet.addTo(map);
    }
    var baseLayers = {
      "CARTO Voyager": cartoVoyager,
      "Esri World Street Map": esriStreet,
      "OpenTopoMap (Terrain)": openTopo
    };
    L.control.layers(baseLayers).addTo(map);

    var markerGroup = L.layerGroup().addTo(map);
    var routeLine = null;
    var sidebar = document.getElementById('map-poi-list');
    var gmapsBtn = document.getElementById('gmaps-day-route-link');

    function renderMap(filterKey) {
      markerGroup.clearLayers();
      if (routeLine) { map.removeLayer(routeLine); routeLine = null; }
      if (sidebar) sidebar.innerHTML = '';

      if (gmapsBtn && DAY_GMAPS[filterKey]) {
        gmapsBtn.href = DAY_GMAPS[filterKey];
      }

      var filtered = POIS.filter(function(p) {
        if (filterKey === 'omitted-pins') return !!p.omitted;
        if (p.omitted) return false; // Omitted pins never clutter active itinerary maps!
        if (filterKey === 'region-berlin') return p.region === 'region-berlin';
        if (filterKey === 'region-blackforest') return p.region === 'region-blackforest';
        if (filterKey.indexOf('day-') === 0) {
          return p.days.indexOf(filterKey) !== -1;
        }
        if (p.region) return false; // default Munich filters show Munich stops
        if (filterKey === 'all') return true;
        if (filterKey === 'saved-list') return !!p.saved;
        if (filterKey.indexOf('cat-') === 0) return p.cat === filterKey;
        return true;
      });

      var coords = [];
      var bounds = [];

      filtered.forEach(function(p, idx) {
        var stepNum = idx + 1;
        var iconHtml = '<div style="background:' + p.color + ';color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);">' + stepNum + '</div>';
        var icon = L.divIcon({ html: iconHtml, className: '', iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14] });

        var gmapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.name + ' ' + p.addr);
        var popupHtml = '<div style="width:min(248px, 74vw);font-family:sans-serif;">' +
          '<img src="' + p.img + '" alt="' + p.name + '" style="width:100%;max-width:100%;height:110px;object-fit:cover;border-radius:6px;margin-bottom:6px;">' +
          '<strong style="font-size:14px;color:#003d59;">' + stepNum + '. ' + p.name + '</strong><br>' +
          '<span style="font-size:11px;color:#b42318;font-weight:600;">Hours: ' + p.hours + '</span><br>' +
          '<span style="font-size:11px;color:#5a6577;">' + p.addr + '</span>' +
          '<p style="font-size:12px;margin:6px 0;">' + p.note + '</p>' +
          '<a href="' + gmapUrl + '" target="_blank" rel="noopener" style="display:inline-block;background:#1a73e8;color:#fff;text-decoration:none;padding:4px 8px;border-radius:5px;font-size:11px;font-weight:600;">Open in Google Maps ↗</a>' +
          '</div>';

        var marker = L.marker([p.lat, p.lng], { icon: icon }).bindPopup(popupHtml);
        markerGroup.addLayer(marker);

        coords.push([p.lat, p.lng]);
        bounds.push([p.lat, p.lng]);

        if (sidebar) {
          var item = document.createElement('div');
          item.className = 'poi-item';
          item.innerHTML = '<h5><span class="pin-dot" style="background:' + p.color + ';"></span>' + stepNum + '. ' + p.name + '</h5>' +
            '<p><strong>' + p.hours + '</strong> · ' + p.addr + '</p>' +
            '<p style="margin-top:2px;">' + p.note + '</p>';
          item.addEventListener('click', function() {
            map.setView([p.lat, p.lng], 15);
            marker.openPopup();
          });
          sidebar.appendChild(item);
        }
      });

      if (filterKey.indexOf('day-') === 0 && coords.length > 1) {
        routeLine = L.polyline(coords, { color: '#005f87', weight: 3, dashArray: '6, 8', opacity: 0.85 }).addTo(map);
      }

      if (bounds.length > 0) {
        // For "all", focus on Munich city core so Neuschwanstein doesn't zoom out too far
        if (filterKey === 'all') {
          map.setView([48.143, 11.575], 13);
        } else {
          map.fitBounds(bounds, { padding: [35, 35], maxZoom: 15 });
        }
      }
    }

    window.setMapFilter = function(filterKey) {
      document.querySelectorAll('[data-map-filter]').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-map-filter') === filterKey);
      });
      renderMap(filterKey);
    };

    document.querySelectorAll('[data-map-filter]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        window.setMapFilter(btn.getAttribute('data-map-filter'));
      });
    });

    renderMap('all');
  }

  // 5. Quick-Jump Pills & Map Collapse Toggle
  function activateTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.section-panel').forEach(function(p) {
      p.classList.toggle('active', p.id === tabId);
    });
    var target = document.getElementById(tabId);
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  document.querySelectorAll('[data-jump-tab]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var tabId = btn.getAttribute('data-jump-tab');
      activateTab(tabId);
      if (tabId === 'sec-berlin' && window.setMapFilter) window.setMapFilter('region-berlin');
      if (tabId === 'sec-blackforest' && window.setMapFilter) window.setMapFilter('region-blackforest');
      if (tabId === 'sec-itinerary' && window.setMapFilter) window.setMapFilter('all');
    });
  });

  var toggleMapBtn = document.getElementById('toggle-map-btn');
  var mapBox = document.getElementById('interactive-map-box');
  if (toggleMapBtn && mapBox) {
    toggleMapBtn.addEventListener('click', function() {
      var isHidden = mapBox.style.display === 'none';
      mapBox.style.display = isHidden ? '' : 'none';
      toggleMapBtn.textContent = isHidden ? '🗺️ Hide/Show Map' : '🗺️ Show Interactive Map';
    });
  }

  // 6. Bookings Category Filter & 1-Click Copy Confirmation Codes
  document.querySelectorAll('[data-booking-filter]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-booking-filter]').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-booking-filter');
      document.querySelectorAll('[data-booking-card]').forEach(function(card) {
        card.style.display = (cat === 'all' || card.getAttribute('data-booking-card') === cat) ? '' : 'none';
      });
    });
  });

  document.querySelectorAll('.copy-code-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var code = btn.getAttribute('data-copy') || '';
      var orig = btn.innerHTML;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).catch(function() {});
      }
      btn.classList.add('copied');
      btn.textContent = '✓ Copied: ' + code;
      setTimeout(function() {
        btn.classList.remove('copied');
        btn.innerHTML = orig;
      }, 1800);
    });
  });

  // 7. Interactive Packing Checklist with LocalStorage Persistence
  var PACK_STORAGE_KEY = 'germany2026_packing_v1';
  var savedPackState = {};
  try {
    var rawPack = localStorage.getItem(PACK_STORAGE_KEY);
    if (rawPack) savedPackState = JSON.parse(rawPack) || {};
  } catch (e) {}

  var hideCheckedItems = false;
  var packCheckboxes = document.querySelectorAll('input[type="checkbox"][data-pack-id]');

  function saveAndRenderPacking() {
    var total = packCheckboxes.length;
    var checkedCount = 0;
    packCheckboxes.forEach(function(cb) {
      var id = cb.getAttribute('data-pack-id');
      var isChecked = !!cb.checked;
      savedPackState[id] = isChecked;
      if (isChecked) checkedCount++;
      var itemLi = cb.closest('.pack-item');
      if (itemLi) {
        itemLi.classList.toggle('checked', isChecked);
        itemLi.style.display = (hideCheckedItems && isChecked) ? 'none' : '';
      }
    });
    try {
      localStorage.setItem(PACK_STORAGE_KEY, JSON.stringify(savedPackState));
    } catch (e) {}

    var pct = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
    var countEl = document.getElementById('pack-count-text');
    var pctEl = document.getElementById('pack-pct-text');
    var quickPctEl = document.getElementById('quick-pack-pct');
    var fillEl = document.getElementById('pack-progress-fill');
    var barEl = document.getElementById('pack-progressbar');
    if (countEl) countEl.textContent = checkedCount + ' / ' + total;
    if (pctEl) pctEl.textContent = pct + '%';
    if (quickPctEl) quickPctEl.textContent = pct + '%';
    if (fillEl) fillEl.style.width = pct + '%';
    if (barEl) barEl.setAttribute('aria-valuenow', String(pct));
  }

  packCheckboxes.forEach(function(cb) {
    var id = cb.getAttribute('data-pack-id');
    if (savedPackState[id]) cb.checked = true;
    cb.addEventListener('change', saveAndRenderPacking);
    var itemLi = cb.closest('.pack-item');
    if (itemLi) {
      itemLi.addEventListener('click', function(ev) {
        if (ev.target !== cb) {
          cb.checked = !cb.checked;
          saveAndRenderPacking();
        }
      });
    }
  });

  var toggleUncheckedBtn = document.getElementById('pack-toggle-unchecked');
  if (toggleUncheckedBtn) {
    toggleUncheckedBtn.addEventListener('click', function() {
      hideCheckedItems = !hideCheckedItems;
      toggleUncheckedBtn.textContent = hideCheckedItems ? '👁️ Show All Items' : '👁️ Hide Checked Items';
      saveAndRenderPacking();
    });
  }

  var checkAllBtn = document.getElementById('pack-check-all');
  if (checkAllBtn) {
    checkAllBtn.addEventListener('click', function() {
      packCheckboxes.forEach(function(cb) { cb.checked = true; });
      saveAndRenderPacking();
    });
  }

  var resetAllBtn = document.getElementById('pack-reset-all');
  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', function() {
      packCheckboxes.forEach(function(cb) { cb.checked = false; });
      saveAndRenderPacking();
    });
  }

  document.querySelectorAll('[data-pack-filter]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-pack-filter]').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-pack-filter');
      document.querySelectorAll('[data-pack-cat]').forEach(function(card) {
        card.style.display = (cat === 'all' || card.getAttribute('data-pack-cat') === cat) ? '' : 'none';
      });
    });
  });

  saveAndRenderPacking();

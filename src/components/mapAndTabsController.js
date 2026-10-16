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
    {"id": 159, "name": "★ #59 Karlito Apartmenthaus (Berlin Base)", "lat": 52.52891, "lng": 13.405415, "region": "region-berlin", "days": ["day-05", "day-06", "day-07", "day-08"], "saved": true, "cat": "cat-hotel", "color": "#067647", "hours": "Check-in Thu 5 Nov (Bag drop 07:30 AM) – Checkout Sun 8 Nov", "addr": "Linienstraße 60, 10119 Berlin-Mitte (U2 Rosa-Luxemburg-Platz)", "img": "assets/images/hotel_karlito_berlin.jpg", "note": "[Thu 5 – Sun 8 Nov Home Base] 3 mins walk to #45 Zeit für Brot & 5 mins to #04 FOTOIMPEX; direct U2 line to Berlin Zoo & Gleisdreieck."},
    {"id": 145, "name": "★ #45 Zeit für Brot ('nice 包包')", "lat": 52.528015, "lng": 13.408607, "region": "region-berlin", "days": ["day-05"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Daily 07:30–20:00", "addr": "Alte Schönhauser Str. 4, 10119 Berlin-Mitte", "img": "assets/images/berlin_zeit_fuer_brot.jpg", "note": "[Thu 5 Nov · 08:15 Breakfast] Just 250m from Karlito! Famous warm gooey organic Zimtschnecken (cinnamon rolls) fresh out of the oven."},
    {"id": 170, "name": "Topography of Terror (WWII Gestapo/SS HQ)", "lat": 52.5065, "lng": 13.3835, "region": "region-berlin", "days": ["day-05"], "cat": "cat-sight", "color": "#005f87", "hours": "Daily 10:00–20:00 (Free entry)", "addr": "Niederkirchnerstraße 8, 10963 Berlin", "img": "assets/images/dachau.jpg", "note": "[Thu 5 Nov · 10:00] Priority WWII history museum on the site of the former Gestapo and SS headquarters (direct U2 to Potsdamer Platz)."},
    {"id": 171, "name": "Holocaust Memorial, Brandenburg Gate & Reichstag", "lat": 52.5163, "lng": 13.3777, "region": "region-berlin", "days": ["day-05"], "cat": "cat-sight", "color": "#005f87", "hours": "24/7 (Reichstag Dome requires advance booking)", "addr": "Pariser Platz / Platz der Republik, 10117 Berlin", "img": "assets/images/odeonsplatz.jpg", "note": "[Thu 5 Nov · 12:00–14:00] Iconic walk from the Memorial to the Murdered Jews of Europe through Brandenburg Gate to the Reichstag."},
    {"id": 148, "name": "★ #48 Mampe Berlin (NON-NEGOTIABLE MUST-GO!)", "lat": 52.488876, "lng": 13.38728, "region": "region-berlin", "days": ["day-05"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Thu–Sat 12:00–18:00 (Bergmannkiez Manufactory)", "addr": "Am Tempelhofer Berg 6, 10965 Berlin-Kreuzberg", "img": "assets/images/berlin_brlo.jpg", "note": "[Thu 5 Nov · 16:30 MUST-GO] Berlin's oldest spirits house (since 1831) inside the historic Viktoria-Quartier brewery courtyard! Taste & buy Halb & Halb bitter-orange herbal liqueur, Elefantenkümmel & Kreuzberg Gin."},
    {"id": 157, "name": "★ #57 BRLO Brwhouse ('Brewery tour & beer garden!')", "lat": 52.500197, "lng": 13.3737, "region": "region-berlin", "days": ["day-05"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Thu–Fri from 16:00, Sat–Sun from 12:00", "addr": "Schöneberger Str. 16, 10963 Berlin (Park am Gleisdreieck)", "img": "assets/images/berlin_brlo.jpg", "note": "[Thu 5 Nov · 18:30 Dinner] Just 12 mins walk (or 1 stop) from Mampe Berlin! Shipping-container craft brewery & smokehouse; ride U2 Gleisdreieck straight back to Karlito."},
    {"id": 105, "name": "★ #05 Safelight Berlin (Analog Camera Shop & Film Lab)", "lat": 52.551031, "lng": 13.411217, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-camera", "color": "#067647", "hours": "Tue–Sat 12:00–19:00 (CLOSED SUN & MON!)", "addr": "Schivelbeiner Str. 9, 10439 Berlin (S/U Schönhauser Allee)", "img": "assets/images/berlin_fotoimpex.jpg", "note": "[Fri 6 Nov · 12:00] Ride U2 2 stops north from Karlito! Cult indie film camera store & lab (must visit Fri/Sat as it is closed Sunday)."},
    {"id": 104, "name": "★ #04 FOTOIMPEX GmbH (Analog Film Mecca)", "lat": 52.525347, "lng": 13.406865, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-camera", "color": "#067647", "hours": "Mon–Sat 12:00–19:00 (Closed Sun)", "addr": "Alte Schönhauser Str. 32B, 10119 Berlin-Mitte", "img": "assets/images/berlin_fotoimpex.jpg", "note": "[Fri 6 Nov · 13:15] Europe's #1 analog film, Adox & darkroom flagship store—just 5 mins walk from Karlito Apartmenthaus!"},
    {"id": 146, "name": "★ #46 Hackesche Höfe", "lat": 52.524022, "lng": 13.402413, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Courtyards Open Daily", "addr": "Rosenthaler Str. 40, 10178 Berlin-Mitte", "img": "assets/images/berlin_hackesche.jpg", "note": "[Fri 6 Nov · 14:30] 8 interconnected restored Art Nouveau (Jugendstil) courtyards with boutiques and cafes."},
    {"id": 147, "name": "★ #47 Rosenthaler Str. 39 (Haus Schwarzenberg)", "lat": 52.524562, "lng": 13.401827, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open Daily (Otto Weidt Museum 10:00–20:00)", "addr": "Rosenthaler Str. 39, 10178 Berlin-Mitte", "img": "assets/images/berlin_hackesche.jpg", "note": "[Fri 6 Nov · 15:15] Right next door to Hackesche Höfe! Gritty non-commercial street-art alley housing the free Otto Weidt Workshop for the Blind Museum & Monsterkabinett."},
    {"id": 120, "name": "★ #20 Boxhagener Platz", "lat": 52.510876, "lng": 13.459713, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open 24/7 (Neighborhood Square)", "addr": "Boxhagener Platz, 10245 Berlin-Friedrichshain", "img": "assets/images/berlin_mauerpark.webp", "note": "[Fri 6 Nov · 16:15] Heart of Friedrichshain! Just 200m from Silo Coffee, Fleischerei Domke & Avci Bistro."},
    {"id": 112, "name": "★ #12 Silo Coffee", "lat": 52.510075, "lng": 13.458378, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Daily 08:30–16:00 / 16:30", "addr": "Gabriel-Max-Straße 4, 10245 Berlin-Friedrichshain", "img": "assets/images/berlin_zeit_fuer_brot.jpg", "note": "[Fri 6 Nov · 15:45 Coffee Stop] Aussie-style third-wave specialty coffee & cake right off Boxhagener Platz."},
    {"id": 114, "name": "★ #14 Fleischerei Domke (NON-NEGOTIABLE MUST-GO!)", "lat": 52.510477, "lng": 13.452073, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Mon–Fri 06:30–18:00, Sat 06:30–14:00 (Closed Sun)", "addr": "Warschauer Str. 64, 10243 Berlin-Friedrichshain", "img": "assets/images/schweinshaxe.jpg", "note": "[Fri 6 Nov · 16:45 MUST-GO!] Because Domke closes at 14:00 on Sat (when you're at Berlin Zoo), visiting Friday afternoon (open until 18:00!) lets you feast on their legendary hot butcher counter: Eisbein, Schnitzel, Bouletten & Currywurst!"},
    {"id": 113, "name": "★ #13 Avci Bistro", "lat": 52.510585, "lng": 13.452151, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Daily until late", "addr": "Kopernikusstraße 30, 10245 Berlin-Friedrichshain", "img": "assets/images/berlin_brlo.jpg", "note": "[Fri 6 Nov · 18:00] Literally right around the corner (20 meters!) from Fleischerei Domke for Turkish-Berlin grilled plates & tea."},
    {"id": 119, "name": "★ #19 RAW-Gelände & Michelberger Bar (for #50 MXPSM Schnaps)", "lat": 52.507686, "lng": 13.451869, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open 24/7", "addr": "Revaler Str. 99 / Warschauer Str. 39, 10245 Berlin", "img": "assets/images/berlin_mauerpark.webp", "note": "[Fri 6 Nov · 19:00] 4 mins walk south of Domke/Avci! Explore the gritty 1867 railway repair compound & sip MXPSM herbal spirits at Michelberger Hotel bar across the street."},
    {"id": 121, "name": "★ #21 East Side Gallery (1.3km Painted Berlin Wall)", "lat": 52.505022, "lng": 13.439695, "region": "region-berlin", "days": ["day-06"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open 24/7 (Illuminated in evening)", "addr": "Mühlenstraße, 10243 Berlin-Friedrichshain", "img": "assets/images/berlin_mauerpark.webp", "note": "[Fri 6 Nov · 20:00] Walk the longest surviving section of the Berlin Wall along the Spree from Warschauer Straße to Ostbahnhof."},
    {"id": 163, "name": "★ #63 Berlin Zoological Garden (MANDATORY MUST-DO!)", "lat": 52.50783, "lng": 13.339416, "region": "region-berlin", "days": ["day-07"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Winter Hours: Daily 09:00–16:30 (Animal houses close 16:00; Aquarium til 18:00)", "addr": "Hardenbergplatz 8, 10787 Berlin (Direct U2 from Karlito!)", "img": "assets/images/berlin_zoo.jpg", "note": "[Sat 7 Nov · 09:00–13:30 MUST-DO] Direct 18-min U2 ride from Karlito! 4.5 hours for Giant Pandas, glass-domed Hippo House & giraffes."},
    {"id": 103, "name": "★ #03 Foto-Meyer Digital Imaging", "lat": 52.496226, "lng": 13.341651, "region": "region-berlin", "days": ["day-07"], "saved": true, "cat": "cat-camera", "color": "#067647", "hours": "Mon–Fri 10:00–18:30, Sat 10:00–15:00 (Closed Sun)", "addr": "Welserstraße 1, 10777 Berlin (U Viktoria-Luise-Platz)", "img": "assets/images/berlin_fotoimpex.jpg", "note": "[Sat 7 Nov · 13:45–14:45] Just 2 U-Bahn stops south of Berlin Zoo—hit this right after the Zoo before its 15:00 Saturday close!"},
    {"id": 160, "name": "★ #60 The Berlin Art Market by the Zeughaus", "lat": 52.518129, "lng": 13.397811, "region": "region-berlin", "days": ["day-07"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Sat & Sun Only 11:00–17:00", "addr": "Am Zeughaus 1-2, 10117 Berlin (Museum Island)", "img": "assets/images/berlin_hackesche.jpg", "note": "[Sat 7 Nov · 15:30–17:00] Open-air art, print, vintage book & craft market beside the Zeughaus on Museum Island."},
    {"id": 115, "name": "★ #15 Ständige Vertretung (StäV)", "lat": 52.521272, "lng": 13.385517, "region": "region-berlin", "days": ["day-07"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Daily 11:00–24:00", "addr": "Schiffbauerdamm 8, 10117 Berlin (S Friedrichstraße)", "img": "assets/images/berlin_hackesche.jpg", "note": "[Sat 7 Nov · 18:30 Dinner] Walk 7 mins along the Spree from Zeughaus Art Market (#60)! Legendary political pub serving Gaffel Kölsch beer & Rhenish Sauerbraten."},
    {"id": 172, "name": "Berlin Wall Memorial at Bernauer Straße", "lat": 52.5351, "lng": 13.3903, "region": "region-berlin", "days": ["day-08"], "cat": "cat-sight", "color": "#005f87", "hours": "Outdoor Memorial & Watchtower Open Daily 08:00–22:00 (Visitor Center Tue–Sun 10:00–18:00)", "addr": "Bernauer Str. 111, 13355 Berlin", "img": "assets/images/dachau.jpg", "note": "[Sun 8 Nov · 09:30–11:00] Walk 15 mins from Karlito to the preserved Berlin Wall death-strip & watchtower, then walk straight up Bernauer Straße into Mauerpark!"},
    {"id": 144, "name": "★ #44 Mauerpark Flohmarkt ('Sunday flea market')", "lat": 52.541388, "lng": 13.402366, "region": "region-berlin", "days": ["day-08"], "saved": true, "cat": "cat-sight", "color": "#b42318", "hours": "Sundays Only 08:00–18:00", "addr": "Bernauer Str. 64, 13355 Berlin (U2 Eberswalder Str.)", "img": "assets/images/berlin_mauerpark.webp", "note": "[Sun 8 Nov · 11:00–15:00] Berlin's famous Sunday flea market for vintage cameras, lenses, DDR antiques, street food & buskers."},
    {"id": 149, "name": "★ #49 Dr. Kochan Liquor Culture", "lat": 52.532875, "lng": 13.422737, "region": "region-berlin", "days": ["day-08"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Prenzlauer Berg Spirit Apothecary (Check afternoon hours or visit Sat/Fri)", "addr": "Immanuelkirchstraße 4, 10405 Berlin (Prenzlauer Berg)", "img": "assets/images/berlin_brlo.jpg", "note": "[Sun 8 Nov · 15:30–17:00] Artisanal barrel-aged cocktail & spirit manufactory just 12 mins walk from Karlito Apartmenthaus."},
    {"id": 173, "name": "Berlin Hauptbahnhof (Track 3 — 20:52 Nightjet NJ 408 to Freiburg)", "lat": 52.5251, "lng": 13.3694, "region": "region-berlin", "days": ["day-08"], "cat": "cat-transit", "color": "#b42318", "hours": "Departs Sun 8 Nov at 20:52 (Bahnsteig 3)", "addr": "Europaplatz 1, 10557 Berlin", "img": "assets/images/tgv_train.jpg", "note": "[Sun 8 Nov · 20:25 Boarding / 20:52 Departure] Board ÖBB Nightjet NJ 408 (Coach 309, Berths 52/56, Double Deluxe with shower/WC). Bring printed A4 paper ticket!"},
    {"id": 122, "name": "✖ #22 DDR Museum (OMITTED — Tourist Trap)", "lat": 52.519337, "lng": 13.402307, "region": "region-berlin", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "Omitted from Itinerary", "addr": "Karl-Liebknecht-Str. 1, 10178 Berlin", "img": "assets/images/berlin_hackesche.jpg", "note": "OMITTED: Cramped, school-group-heavy basement attraction. Replaced by the authentic Berlin Wall Memorial at Bernauer Straße on Sun 8 Nov!"},
    {"id": 150, "name": "✖ #50 MXPSM Wedding Distillery Storefront (OMITTED — Drink at Michelberger Bar Instead)", "lat": 52.545376, "lng": 13.343464, "region": "region-berlin", "days": [], "omitted": true, "saved": true, "cat": "cat-wine", "color": "#9ca3af", "hours": "Omitted Storefront Detour", "addr": "Seestraße 13, 13353 Berlin-Wedding", "img": "assets/images/berlin_brlo.jpg", "note": "OMITTED DETOUR: Industrial Wedding site with restricted hours. Drink their exact MXPSM schnaps at Michelberger Hotel bar opposite #19 RAW-Gelände on Fri 6 Nov!"},
    {"id": 300, "name": "★ Freiburg Airbnb Base (Mathildenstraße 14 — 06:35 AM Early Bag Drop!)", "lat": 48.0004, "lng": 7.8371, "region": "region-blackforest", "days": ["day-09", "day-10", "day-11", "day-12"], "cat": "cat-hotel", "color": "#067647", "hours": "Mon 9 Nov (06:35 AM Bag Drop / 15:00 Check-In) – Thu 12 Nov (12:00 PM Checkout)", "addr": "Mathildenstraße 14, 79106 Freiburg im Breisgau (6 mins walk from Freiburg Hbf)", "img": "assets/images/sourdough_bakery.jpg", "note": "[Mon 9 – Thu 12 Nov Base] Walk 6 mins from Nightjet Platform 3 at Freiburg Hbf to drop your luggage early with the host!"},
    {"id": 227, "name": "★ #27 Günter Coffee Store | Specialty Coffee", "lat": 47.997118, "lng": 7.849407, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Sat 08:00–18:00", "addr": "Grünwälderstraße / Belfortstraße, Freiburg", "img": "assets/images/sourdough_bakery.jpg", "note": "[Mon 9 Nov · 08:00 Coffee] First stop after dropping bags at Mathildenstraße 14! Freiburg's top specialty coffee roaster."},
    {"id": 238, "name": "★ #38 Kolben Kaffee", "lat": 47.993722, "lng": 7.849127, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Sat 09:00–18:00", "addr": "Kaiser-Joseph-Straße 233, 79098 Freiburg", "img": "assets/images/sourdough_bakery.jpg", "note": "[Mon 9 Nov · 09:30 Espresso] Tucked inside an arcade courtyard on Freiburg's main avenue."},
    {"id": 231, "name": "★ #31 Markthalle Freiburg", "lat": 47.994173, "lng": 7.849836, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Mon–Thu 11:00–20:00, Fri–Sat 11:00–24:00", "addr": "Grünwälderstraße 4, 79098 Freiburg", "img": "assets/images/viktualienmarkt.jpg", "note": "[Mon 9 Nov · 12:00 Lunch] Indoor food & champagne hall inside a historic newspaper printing building."},
    {"id": 239, "name": "★ #39 Confiserie Gmeiner", "lat": 47.993312, "lng": 7.849204, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Sat 09:30–18:30", "addr": "Kaiser-Joseph-Straße 243, 79098 Freiburg", "img": "assets/images/kaiserschmarrn.jpg", "note": "[Mon 9 Nov · 13:30 Cake] Master patisserie famous for authentic Schwarzwälder Kirschtorte (Black Forest cherry cake)."},
    {"id": 226, "name": "★ #26 café hinterzimmer.", "lat": 47.993976, "lng": 7.851482, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Afternoon Cozy Living-Room Café", "addr": "Grünwälderstraße 23, 79098 Freiburg", "img": "assets/images/sourdough_bakery.jpg", "note": "[Mon 9 Nov · 14:15] Charming indie café right down the street from Markthalle before your 15:00 Airbnb check-in."},
    {"id": 209, "name": "★ #09 Freiburgs Finest Flagship Store ('must go for Zibärtle')", "lat": 47.994709, "lng": 7.85314, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Mon–Sat 10:00–18:30", "addr": "Schusterstraße, 79098 Freiburg", "img": "assets/images/franken_wine.jpg", "note": "[Mon 9 Nov · 16:45 MUST-GO] Your Note: must go for a regional spirit called Zibärtle! Rare wild Black Forest plum eau-de-vie."},
    {"id": 211, "name": "★ #11 Alte Wache Freiburg - Haus der badischen Weine", "lat": 47.995341, "lng": 7.853432, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Mon–Sat 10:30–21:00", "addr": "Münsterplatz 38, 79098 Freiburg", "img": "assets/images/franken_wine.jpg", "note": "[Mon 9 Nov · 17:30 Sunset Wine] Sip Baden Grauburgunder & Spätburgunder right on Freiburg's cathedral square."},
    {"id": 210, "name": "★ #10 Hausbrauerei Feierling", "lat": 47.993311, "lng": 7.852726, "region": "region-blackforest", "days": ["day-09"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Daily 11:00–24:00", "addr": "Gerberau 46, 79098 Freiburg", "img": "assets/images/augustiner.jpg", "note": "[Mon 9 Nov · 19:00 Dinner] Freiburg's beloved brewery tavern pouring unfiltered organic Inselhopf lager."},
    {"id": 206, "name": "★ #06 Friedrichsbad - Das Römisch-Irische Bad (Baden-Baden)", "lat": 48.762994, "lng": 8.242079, "region": "region-blackforest", "days": ["day-10"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Daily 09:00–22:00", "addr": "Römerplatz 1, 76530 Baden-Baden", "img": "assets/images/residenz_antiquarium.jpg", "note": "[Tue 10 Nov · 10:00–13:30] Scheduled Bathhouse Day! 17-step Roman-Irish thermal bath ritual inside an 1877 Renaissance temple."},
    {"id": 240, "name": "★ #40 Café König (Baden-Baden)", "lat": 48.760186, "lng": 8.240137, "region": "region-blackforest", "days": ["day-10"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Wed–Mon 09:00–18:00 (Check Tue hours / backup: Café Beek at Luisenstr. 14)", "addr": "Lichtentaler Str. 12, 76530 Baden-Baden", "img": "assets/images/kaiserschmarrn.jpg", "note": "[Tue 10 Nov · 14:00 Cake & Hot Chocolate] Grand 18th-century Baden-Baden chocolatier & patisserie salon 6 mins walk from Friedrichsbad."},
    {"id": 298, "name": "Lake Titisee (High Black Forest — Scheduled Wed 11 Nov)", "lat": 47.9016, "lng": 8.1565, "region": "region-blackforest", "days": ["day-11"], "cat": "cat-sight", "color": "#005f87", "hours": "38 mins via S1 Höllentalbahn from Freiburg Hbf", "addr": "Seestraße, 79822 Titisee-Neustadt", "img": "assets/images/neuschwanstein.jpg", "note": "[Wed 11 Nov · 10:00–14:00] Scenic train ride through the Ravenna Gorge to Lake Titisee (replaces the November-closed Schauinsland cable car!)."},
    {"id": 237, "name": "★ #37 Schloss-Café Freiburg (Schlossberg Viewpoint)", "lat": 47.981206, "lng": 7.838612, "region": "region-blackforest", "days": ["day-11"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Daily 10:00–18:00", "addr": "Kapellenweg 1 / Schlossberg, 79100 Freiburg", "img": "assets/images/kaiserschmarrn.jpg", "note": "[Wed 11 Nov · 15:00 Viewpoint] Panoramic terrace café on Freiburg's Schlossberg hill overlooking the cathedral spire."},
    {"id": 230, "name": "★ #30 Johanneskirche (Freiburg-Wiehre)", "lat": 47.989003, "lng": 7.846426, "region": "region-blackforest", "days": ["day-11"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Daily 09:00–18:00", "addr": "Kirchstraße 4, 79100 Freiburg-Wiehre", "img": "assets/images/viktualienmarkt.jpg", "note": "[Wed 11 Nov · 16:15 Stroll] Twin-spired Neo-Romanesque church just across the Dreisam river in Freiburg-Wiehre."},
    {"id": 225, "name": "★ #25 Bäckerei Bühler (Freiburg-Wiehre)", "lat": 47.986924, "lng": 7.850732, "region": "region-blackforest", "days": ["day-11"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Fri 06:15–18:30, Sat 06:15–13:00", "addr": "Zasiusstraße 9, 79102 Freiburg-Wiehre", "img": "assets/images/sourdough_bakery.jpg", "note": "[Wed 11 Nov · 16:45 Bakery] Traditional artisan neighborhood bakery 4 mins walk from Johanneskirche."},
    {"id": 224, "name": "★ #24 SAMS Café (Freiburg Final Morning Coffee)", "lat": 47.996073, "lng": 7.852673, "region": "region-blackforest", "days": ["day-12"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Sat 09:00–18:00", "addr": "Herrenstraße / Münsterplatz, Freiburg", "img": "assets/images/sourdough_bakery.jpg", "note": "[Thu 12 Nov · 09:30 Breakfast] Final Freiburg coffee before 12:00 PM checkout at Mathildenstraße 14 and crossing the Rhine to Colmar."},
    {"id": 299, "name": "★ Hôtel Saint-Martin Colmar (Confirmed Colmar Base)", "lat": 48.0761, "lng": 7.3586, "region": "region-blackforest", "days": ["day-12", "day-13"], "cat": "cat-hotel", "color": "#067647", "hours": "Check-in Thu 12 Nov – Checkout Fri 13 Nov (16:45 TGV)", "addr": "38 Grand'Rue, 68000 Colmar, France", "img": "assets/images/hotel_saint_martin_colmar.webp", "note": "[Thu 12 – Fri 13 Nov Base] Right in the medieval heart of Colmar steps from Petite Venise!"},
    {"id": 241, "name": "★ #41 Porte de Munster (Obertor), Turckheim", "lat": 48.086232, "lng": 7.271595, "region": "region-blackforest", "days": ["day-13-colmar"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open 24/7 (100m from Domaine François Baur!)", "addr": "Grand'Rue, 68230 Turckheim, France", "img": "assets/images/haidhausen.jpg", "note": "[Fri 13 Nov · 09:45 AM] Medieval fortified gate of Turckheim—you walk straight through this arch to reach Domaine François Baur 100m ahead!"},
    {"id": 242, "name": "★ #42 Domaine François Baur (CONFIRMED 10:00 AM Wine Tour!)", "lat": 48.086706, "lng": 7.277337, "region": "region-blackforest", "days": ["day-13-colmar"], "saved": true, "cat": "cat-wine", "color": "#067647", "hours": "CONFIRMED: Fri 13 Nov 2026 at 10:00 AM (Ref: 815D4A45A0E85F6C)", "addr": "3 Grand'Rue, 68230 Turckheim, France", "img": "assets/images/franken_wine.jpg", "note": "[Fri 13 Nov · 10:00–11:30 AM CONFIRMED] Biodynamic Grand Cru Brand Riesling & Crémant tasting for 2 adults (€24.00 via Winalist)."},
    {"id": 243, "name": "★ #43 CELLAR TURCKHEIM (Cave Vinicole de Turckheim)", "lat": 48.086409, "lng": 7.2657, "region": "region-blackforest", "days": ["day-13-colmar"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Mon–Sat 09:00–12:00 & 14:00–18:00", "addr": "16 Rue des Tuileries, 68230 Turckheim, France", "img": "assets/images/franken_wine.jpg", "note": "[Fri 13 Nov · 11:35 AM] Historic Turckheim wine cooperative 5 mins walk from Domaine Baur before returning to Colmar for your 16:45 TGV to Munich!"},
    {"id": 207, "name": "✖ #07 Geroldsauer Mühle (OMITTED — Out-of-Town Bus Detour)", "lat": 48.734878, "lng": 8.254101, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-food", "color": "#9ca3af", "hours": "Omitted from Tue 10 Nov", "addr": "Geroldsauer Str. 54, 76534 Baden-Baden", "img": "assets/images/neuschwanstein.jpg", "note": "OMITTED: Requires local Bus 204 into the woods as 16:30 sunset hits after Friedrichsbad + Café König."},
    {"id": 208, "name": "✖ #08 Weingut Faber (OMITTED — Suburban Bottle-Pickup Address)", "lat": 47.977932, "lng": 7.791389, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-wine", "color": "#9ca3af", "hours": "Omitted from Freiburg Days", "addr": "Blumenstraße 19, 79111 Freiburg-St. Georgen", "img": "assets/images/franken_wine.jpg", "note": "OMITTED: 4km southwest in suburban St. Georgen; taste 30+ Baden wines right on Münsterplatz at #11 Alte Wache instead!"},
    {"id": 228, "name": "✖ #28 Hakuna Matata (OMITTED — Casual Suburban Spot)", "lat": 47.98658, "lng": 7.847847, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-food", "color": "#9ca3af", "hours": "Omitted", "addr": "Günterstalstraße 35a, 79102 Freiburg", "img": "assets/images/obatzda.jpg", "note": "OMITTED: Casual student African-fusion café; replaced by #10 Feierling & #31 Markthalle."},
    {"id": 229, "name": "✖ #29 Pizzeria Grüner Baum (OMITTED — Neighborhood Pizzeria)", "lat": 47.98493, "lng": 7.845081, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-food", "color": "#9ca3af", "hours": "Omitted", "addr": "Lorettostraße 12, 79100 Freiburg", "img": "assets/images/kaesespaetzle.jpg", "note": "OMITTED: Neighborhood pizzeria in South Wiehre."},
    {"id": 232, "name": "✖ #32 Museums-Bergwerk Schauinsland (CLOSED IN NOVEMBER!)", "lat": 47.909542, "lng": 7.898384, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "CLOSED Nov 1 – April", "addr": "Schauinslandstraße 390, 79254 Oberried", "img": "assets/images/dachau.jpg", "note": "OMITTED: Silver mine is closed for winter in November. Replaced by Lake Titisee on Wed 11 Nov!"},
    {"id": 233, "name": "✖ #33 Schniederlihof (CLOSED IN NOVEMBER!)", "lat": 47.907148, "lng": 7.900239, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "CLOSED Nov 1 – April", "addr": "Gegendrumweg 3, 79254 Oberried-Hofsgrund", "img": "assets/images/dachau.jpg", "note": "OMITTED: 1592 farmhouse museum is closed for winter in November."},
    {"id": 234, "name": "✖ #34 Holzschlägermatte (OMITTED — Cable Car Closed in Nov)", "lat": 47.91512, "lng": 7.880996, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "Omitted", "addr": "Schauinslandstraße 359, 79100 Freiburg", "img": "assets/images/neuschwanstein.jpg", "note": "OMITTED: Mountain pass stop on Schauinsland."},
    {"id": 235, "name": "✖ #35 Schauinslandbahn Cable Car (CLOSED IN NOV FOR MAINTENANCE!)", "lat": 47.936043, "lng": 7.865329, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "CLOSED Every November for Herbstrevision", "addr": "Bohrerstraße 11, 79289 Horben", "img": "assets/images/neuschwanstein.jpg", "note": "OMITTED: Cable car shuts down every November for mandatory annual cable inspection. Replaced by Lake Titisee!"},
    {"id": 236, "name": "✖ #36 Die Bergstation Schauinsland (CLOSED IN NOV!)", "lat": 47.90966, "lng": 7.891262, "region": "region-blackforest", "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "CLOSED during Nov Cable Car Maintenance", "addr": "Schauinslandstraße 390, 79117 Freiburg", "img": "assets/images/neuschwanstein.jpg", "note": "OMITTED: Top station of the Schauinsland cable car."},
    {"id": 1, "name": "Timehouse Munich (Hotel Base)", "lat": 48.1765, "lng": 11.5923, "days": ["day-13", "day-14", "day-15", "day-16", "day-17", "day-18", "day-19"], "cat": "cat-hotel", "color": "#005f87", "hours": "Reception 06:30–22:30 (24/7 Keybox)", "addr": "Leopoldstraße 204a, 80804 München (U6 Nordfriedhof)", "img": "assets/images/timehouse_room.jpg", "note": "[Fri 13 – Thu 19 Nov Base] Serviced apartment in Schwabing with full designer kitchen; 6 mins walk to Lufthansa Express Bus."},
    {"id": 2, "name": "München Hauptbahnhof (Hbf)", "lat": 48.1402, "lng": 11.5586, "days": ["day-13", "day-15", "day-16"], "cat": "cat-transit", "color": "#475467", "hours": "24/7 Rail Hub", "addr": "Bayerstraße 10A, 80335 München", "img": "assets/images/tgv_train.jpg", "note": "[Fri 13 Nov 21:46 TGV Arrival & Sun 15 Nov 07:52 Füssen Train] Tracks 27–36 for BRB RB 68 to Füssen."},
    {"id": 3, "name": "Julius Brantner Brothandwerk (Sat-Only Croissants!)", "lat": 48.1518, "lng": 11.5761, "days": ["day-14"], "cat": "cat-bakery", "color": "#b8860b", "hours": "Tue–Sat 08:30–18:30 (Closed Sun/Mon)", "addr": "Adalbertstraße 25, Maxvorstadt (U6 Universität)", "img": "assets/images/sourdough_bakery.jpg", "note": "[Sat 14 Nov · 09:15] Famous 54-layer Butter Croissant & Sourdough Baguette are Fri/Sat specials!"},
    {"id": 27, "name": "★ #51 Feinkost Olé - Spanische Weine & Spezialitäten", "lat": 48.1551, "lng": 11.5751, "days": ["day-14"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Tue–Fri 11:00–19:00, Sat 10:00–16:00", "addr": "Georgenstraße 43, 80799 München (Maxvorstadt)", "img": "assets/images/garibaldi_wein.jpg", "note": "[Sat 14 Nov · 09:50] 4 mins walk north of Julius Brantner! Spanish wine, sherry, jamón Ibérico & Manchego."},
    {"id": 25, "name": "★ #01 Zum Franziskaner ('傳統德國嘢？')", "lat": 48.1394, "lng": 11.5772, "days": ["day-14"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Daily 10:00–24:00 (Frühschoppen 10:00–11:30)", "addr": "Residenzstraße 9, 80333 München", "img": "assets/images/zum_franziskaner.jpg", "note": "[Sat 14 Nov · 10:30 Option A] Famous 10:00–11:30 Weißwurst/Leberkäse Frühschoppen (€12.90 incl. 0.5L beer) & house sweet mustard."},
    {"id": 4, "name": "Schneider Bräuhaus (Im Tal 7)", "lat": 48.1363, "lng": 11.5784, "days": ["day-14"], "cat": "cat-food", "color": "#d97706", "hours": "Daily 08:00–23:30", "addr": "Tal 7, 80331 München (Marienplatz)", "img": "assets/images/weisswurst.jpg", "note": "[Sat 14 Nov · 10:30 Option B] Traditional Weißwurstfrühstück (must be eaten before 12:00 noon!) + TAP6 Aventinus wheat beer."},
    {"id": 5, "name": "★ #17 Marienplatz, Rathaus-Glockenspiel, Frauenkirche & Alter Peter", "lat": 48.1374, "lng": 11.5755, "days": ["day-14"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Glockenspiel chimes 11:00 & 12:00 daily", "addr": "Marienplatz 1, 80331 München", "img": "assets/images/marienplatz.jpg", "note": "[Sat 14 Nov · 12:00] Watch the 12:00 Glockenspiel, visit Frauenkirche & climb Alter Peter tower."},
    {"id": 28, "name": "★ #52 GARIBALDI Marienplatz (Upgraded from Petuelring Warehouse)", "lat": 48.1378, "lng": 11.5774, "days": ["day-14"], "saved": true, "cat": "cat-wine", "color": "#7c3aed", "hours": "Mon–Sat 10:00–20:00", "addr": "Burgstraße 2, 80331 München (2 mins from Marienplatz)", "img": "assets/images/garibaldi_wein.jpg", "note": "[Sat 14 Nov · 12:20] Central Old Town branch of your saved GARIBALDI wine & cheese merchant."},
    {"id": 6, "name": "★ #56 Viktualienmarkt & Biergarten ('Farmer market')", "lat": 48.1353, "lng": 11.5763, "days": ["day-14"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Mon–Sat 08:00–20:00 (Closed Sun)", "addr": "Viktualienmarkt 3, 80331 München", "img": "assets/images/viktualienmarkt.jpg", "note": "[Sat 14 Nov · 12:45] Open-air gourmet market & central rotating-tap beer garden under chestnut trees."},
    {"id": 7, "name": "★ #02 Schmalznudel - Café Frischhut ('炸包')", "lat": 48.1345, "lng": 11.5747, "days": ["day-14"], "saved": true, "cat": "cat-bakery", "color": "#b8860b", "hours": "Tue–Sat 09:00–17:00 (Closed Sun/Mon)", "addr": "Prälat-Zistl-Straße 8, 80331 München", "img": "assets/images/schmalznudel.jpg", "note": "[Sat 14 Nov · 14:15] Hot hand-stretched Schmalznudel (Auszogne) fried to order right off Viktualienmarkt."},
    {"id": 8, "name": "Leica Store & Leica Galerie Munich", "lat": 48.1399, "lng": 11.5742, "days": ["day-14"], "cat": "cat-camera", "color": "#067647", "hours": "Mon–Sat 10:00–18:00 (Closed Sun)", "addr": "Maffeistraße 4, 80333 München", "img": "assets/images/leica_camera.jpg", "note": "[Sat 14 Nov · 15:15] Flagship Leica boutique, pre-owned M/Q glass & free fine-art photography gallery."},
    {"id": 9, "name": "Kunst-Oase Antiques at Ottostraße", "lat": 48.1434, "lng": 11.5688, "days": ["day-14"], "cat": "cat-camera", "color": "#067647", "hours": "Mon–Fri 11:00–18:00, Sat 10:00–16:00 (Closed Sun)", "addr": "Ottostraße 6, 80333 München", "img": "assets/images/antique_market.jpg", "note": "[Sat 14 Nov · 16:00] 30+ specialist antique dealers under one roof near Karolinenplatz."},
    {"id": 29, "name": "★ #18 Karlsplatz (Stachus)", "lat": 48.139246, "lng": 11.566021, "days": ["day-14"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open 24/7", "addr": "Karlsplatz, 80335 München", "img": "assets/images/marienplatz.jpg", "note": "[Sat 14 Nov · 16:50] Grand square & medieval Karlstor gate directly between Kunst-Oase Ottostraße and Calumet/Sauter."},
    {"id": 10, "name": "Calumet Photographic / Foto-Video Sauter", "lat": 48.1355, "lng": 11.5642, "days": ["day-14"], "cat": "cat-camera", "color": "#067647", "hours": "Mon–Sat 10:00–19:00 (Closed Sun)", "addr": "Sonnenstraße 26, 80331 München", "img": "assets/images/calumet_sauter.webp", "note": "[Sat 14 Nov · 17:10] Merged Calumet + Sauter superstore for analog film & used camera bodies."},
    {"id": 11, "name": "Haxnbauer (Reopened at Im Tal 38!)", "lat": 48.1357, "lng": 11.5806, "days": ["day-14"], "cat": "cat-food", "color": "#d97706", "hours": "Daily 11:30–23:00", "addr": "Tal 38, 80331 München (New Address!)", "img": "assets/images/schweinshaxe.jpg", "note": "[Sat 14 Nov · 19:00 Dinner] Reopened by Kuffler at Im Tal 38! Famous 24-hr brined Schweinshaxe & Kalbshaxe."},
    {"id": 12, "name": "★ #62 Schloss Neuschwanstein & Hohenschwangau", "lat": 47.5576, "lng": 10.7498, "days": ["day-15"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Winter Hours: 10:00–16:00 daily", "addr": "Neuschwansteinstraße 20, 87645 Schwangau", "img": "assets/images/neuschwanstein.jpg", "note": "[Sun 15 Nov · 10:30–15:30] Full-Day Alpine Excursion via Bayern-Ticket (€44 for 2) + RVA Bus 73/78 from Füssen."},
    {"id": 13, "name": "KZ-Gedenkstätte Dachau (Memorial Site)", "lat": 48.2701, "lng": 11.4683, "days": ["day-16"], "cat": "cat-sight", "color": "#005f87", "hours": "Open Daily 09:00–17:00 (Including Mondays!)", "addr": "Alte Römerstraße 75, 85221 Dachau", "img": "assets/images/dachau.jpg", "note": "[Mon 16 Nov · 10:30–14:15] 11:00 English Guided Tour. Covered by MVV Zone M-1 Group Day Ticket (€21.20)."},
    {"id": 14, "name": "Foto Dinkel (Weekday Pro Camera Shop)", "lat": 48.1369, "lng": 11.5608, "days": ["day-16"], "cat": "cat-camera", "color": "#067647", "hours": "Mon–Fri 09:00–17:30 (CLOSED SAT/SUN!)", "addr": "Landwehrstraße 6, 80336 München", "img": "assets/images/foto_dinkel.jpg", "note": "[Mon 16 Nov · 15:00] Right off Hbf after returning from Dachau on S2. Pro used gear & analog film."},
    {"id": 15, "name": "★ #54 Augustiner Bräustuben (Holzfass Beer Hall)", "lat": 48.1389, "lng": 11.5442, "days": ["day-16"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Daily 10:00–24:00", "addr": "Landsberger Straße 19, 80339 München (Hackerbrücke)", "img": "assets/images/augustiner.jpg", "note": "[Mon 16 Nov · 17:00] Locals' favorite brewery taproom pouring Edelstoff & Helles from wooden barrels (Holzfass)."},
    {"id": 26, "name": "★ #23 Augustiner Bürgerheim (Westend Art Nouveau Wirtshaus)", "lat": 48.136, "lng": 11.5374, "days": ["day-16"], "saved": true, "cat": "cat-food", "color": "#d97706", "hours": "Daily 11:00–24:00 (Kitchen 12:00–21:30)", "addr": "Bergmannstraße 33, 80339 München (Westend)", "img": "assets/images/augustiner_buergerheim.jpg", "note": "[Mon 16 Nov · 19:00] Just 7 mins walk (600m) from Augustiner Bräustuben! 1899 Wirtshaus famous for Münchner Schnitzel & Holzfass beer."},
    {"id": 30, "name": "★ #16 Odeonsplatz & Hofgarten", "lat": 48.142778, "lng": 11.58, "days": ["day-17"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Open Daily", "addr": "Odeonsplatz / Hofgartenstraße, 80539 München", "img": "assets/images/odeonsplatz.jpg", "note": "[Tue 17 Nov · 09:45] Arrive on U6 Odeonsplatz and walk through the Renaissance Hofgarten arcades toward the Englischer Garten."},
    {"id": 16, "name": "Eisbachwelle Surfers & Chinesischer Turm (Englischer Garten)", "lat": 48.1439, "lng": 11.5877, "days": ["day-17"], "cat": "cat-sight", "color": "#005f87", "hours": "Park Open 24/7", "addr": "Prinzregentenstraße / Englischer Garten", "img": "assets/images/englischer_garten.jpg", "note": "[Tue 17 Nov · 10:30–12:00] Watch river surfers at Eisbachwelle and walk to Chinesischer Turm beer garden."},
    {"id": 17, "name": "★ #58 Munich Residenz (Antiquarium & Treasury)", "lat": 48.1412, "lng": 11.579, "days": ["day-17"], "saved": true, "cat": "cat-sight", "color": "#005f87", "hours": "Winter Hours: 10:00–17:00 daily", "addr": "Residenzstraße 1, 80333 München", "img": "assets/images/residenz_antiquarium.jpg", "note": "[Tue 17 Nov · 13:00 Museum #1] 66m Renaissance Antiquarium & Royal Schatzkammer (Treasury)."},
    {"id": 18, "name": "★ #58 Weihnachtsdorf im Kaiserhof der Residenz ('Xmas market 16/11-22/12')", "lat": 48.1418, "lng": 11.5781, "days": ["day-17"], "saved": true, "cat": "cat-sight", "color": "#b42318", "hours": "16 Nov–22 Dec 2026: Daily 11:00–21:00", "addr": "Kaiserhof der Residenz (Odeonsplatz Entrance)", "img": "assets/images/residenz_christmas.jpg", "note": "[Tue 17 Nov · 16:00 Dusk] Must-Do Christmas Market (or flexible swap to 16/18 Nov). Glühwein & Eierpunsch!"},
    {"id": 19, "name": "Pfälzer Residenz Weinstube", "lat": 48.1422, "lng": 11.5778, "days": ["day-17"], "cat": "cat-wine", "color": "#7c3aed", "hours": "Daily 11:30–24:00", "addr": "Residenzstraße 1, 80333 München", "img": "assets/images/pfaelzer_weinstube.jpg", "note": "[Tue 17 Nov · 19:00 Option A] Right inside the Residenz palace arches; 50+ German Rieslings & Spätburgunders by the glass."},
    {"id": 20, "name": "Weinhaus Neuner (Franken Silvaner Bocksbeutel)", "lat": 48.1381, "lng": 11.5681, "days": ["day-17"], "cat": "cat-wine", "color": "#7c3aed", "hours": "Mon–Sun 12:00–24:00 (Open Sundays in Winter!)", "addr": "Herzogspitalstraße 8, 80331 München", "img": "assets/images/weinhaus_neuner.jpg", "note": "[Tue 17 Nov · 19:30 Option B] Munich's oldest wine tavern (1452). Drink dry Franken Silvaner from a Bocksbeutel bottle!"},
    {"id": 21, "name": "Boulangerie Dompierre", "lat": 48.1489, "lng": 11.5758, "days": ["day-18"], "cat": "cat-bakery", "color": "#b8860b", "hours": "Mon–Sat 07:30–18:30", "addr": "Türkenstraße 21, 80799 München (Maxvorstadt)", "img": "assets/images/dompierre.jpg", "note": "[Wed 18 Nov · 09:15] French-butter croissants & baguettes in Maxvorstadt."},
    {"id": 22, "name": "Deutsches Museum (Classical Optics & Photography)", "lat": 48.1299, "lng": 11.5834, "days": ["day-18"], "cat": "cat-sight", "color": "#005f87", "hours": "Daily 09:00–17:00", "addr": "Museumsinsel 1, 80538 München", "img": "assets/images/deutsches_museum.jpg", "note": "[Wed 18 Nov · 10:30 Museum #2] Classical Optics & Photography and Film permanent exhibitions."},
    {"id": 31, "name": "Wiener Platz (Haidhausen 'French Quarter')", "lat": 48.1338, "lng": 11.5955, "days": ["day-18"], "cat": "cat-sight", "color": "#005f87", "hours": "Open Daily", "addr": "Wiener Platz, 81667 München-Haidhausen", "img": "assets/images/haidhausen.jpg", "note": "[Wed 18 Nov · 13:15] Village-like market square and beer garden East of the Isar in Haidhausen."},
    {"id": 32, "name": "Bar Mural (Glockenbachviertel Natural Wine Bar)", "lat": 48.1352, "lng": 11.5694, "days": ["day-18"], "cat": "cat-wine", "color": "#7c3aed", "hours": "Wed–Sat from 17:00 / Aperitivo", "addr": "Hotterstraße 12, 80331 München", "img": "assets/images/bar_mural.jpg", "note": "[Wed 18 Nov · 15:30 / 17:00] Trendy natural wine & bottle shop adored by young Munich locals."},
    {"id": 23, "name": "Alte Utting (Steamship on a Railway Bridge in Sendling)", "lat": 48.1197, "lng": 11.5562, "days": ["day-18"], "cat": "cat-sight", "color": "#005f87", "hours": "Wed–Thu from 16:00, Fri–Sun earlier", "addr": "Lagerhausstraße 15, 81371 München-Sendling", "img": "assets/images/alte_utting.jpg", "note": "[Wed 18 Nov · 16:30] Retired excursion steamship craned onto a railway bridge with craft beer & street food stalls!"},
    {"id": 33, "name": "Hofbräuhaus am Platzl (Historic Schwemme Brass Band)", "lat": 48.1376, "lng": 11.5799, "days": ["day-18"], "cat": "cat-food", "color": "#d97706", "hours": "Daily 09:00–24:00", "addr": "Platzl 9, 80331 München", "img": "assets/images/hofbrauhaus.jpg", "note": "[Wed 18 Nov · 19:00 Farewell Evening] Step into the historic vaulted Schwemme hall for live Bavarian brass band music."},
    {"id": 24, "name": "Lufthansa Express Bus Stop (Schwabing / Nordfriedhof → MUC)", "lat": 48.1731, "lng": 11.5968, "days": ["day-19"], "cat": "cat-transit", "color": "#b42318", "hours": "Every 20 mins (05:33–20:13)", "addr": "Ungererstraße / Nordfriedhof (6 mins walk from Timehouse)", "img": "assets/images/timehouse_kitchen.webp", "note": "[Thu 19 Nov · 06:33 or 06:53] Non-stop 25-min bus to Munich Airport (MUC) for your 10:00 AM flight!"},
    {"id": 53, "name": "✖ #53 Hofbräu am Oberwiesenfeld (OMITTED — Residential Block Restaurant)", "lat": 48.166153, "lng": 11.561895, "days": [], "omitted": true, "saved": true, "cat": "cat-food", "color": "#9ca3af", "hours": "Omitted", "addr": "Hildeboldstraße 23, 80797 München", "img": "assets/images/hofbrauhaus.jpg", "note": "OMITTED: Modern residential-block restaurant; replaced by Augustiner Bräustuben, Augustiner Bürgerheim & Zum Franziskaner."},
    {"id": 55, "name": "✖ #55 Königssee (OMITTED — 6-Hr Round Trip & Obersee Closed in Nov)", "lat": 47.55418, "lng": 12.978374, "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "Omitted", "addr": "83471 Schönau am Königssee", "img": "assets/images/neuschwanstein.jpg", "note": "OMITTED: Boats do not sail to Obersee in November and round-trip takes 6+ hours."},
    {"id": 61, "name": "✖ #61 Nördlingen (OMITTED — 4.5-Hr Round Trip)", "lat": 48.850816, "lng": 10.489491, "days": [], "omitted": true, "saved": true, "cat": "cat-sight", "color": "#9ca3af", "hours": "Omitted", "addr": "86720 Nördlingen", "img": "assets/images/haidhausen.jpg", "note": "OMITTED: Preserves your 3 full city days in Munich."}
  ];

  var DAY_GMAPS = {
    "all": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/Julius+Brantner+Brothandwerk,+Adalbertstra%C3%9Fe+25,+M%C3%BCnchen/Schneider+Br%C3%A4uhaus,+Tal+7,+M%C3%BCnchen/Marienplatz,+M%C3%BCnchen/Viktualienmarkt,+M%C3%BCnchen/Caf%C3%A9+Frischhut,+Pr%C3%A4lat-Zistl-Stra%C3%9Fe+8,+M%C3%BCnchen/Leica+Store+M%C3%BCnchen,+Maffeistra%C3%9Fe+4/Kunst-Oase,+Ottostra%C3%9Fe+6,+M%C3%BCnchen/Calumet+Photographic+M%C3%BCnchen,+Sonnenstra%C3%9Fe+26/Haxnbauer,+Tal+38,+M%C3%BCnchen",
    "day-05": "https://www.google.com/maps/dir/Linienstra%C3%9Fe+60,+10119+Berlin/Zeit+f%C3%BCr+Brot,+Alte+Sch%C3%B6nhauser+Str.+4,+Berlin/Topographie+des+Terrors,+Berlin/Brandenburger+Tor,+Berlin/Reichstag,+Berlin/Mampe+Berlin,+Am+Tempelhofer+Berg+6,+Berlin/BRLO+Brwhouse,+Sch%C3%B6neberger+Str.+16,+Berlin",
    "day-06": "https://www.google.com/maps/dir/Linienstra%C3%9Fe+60,+10119+Berlin/Safelight+Berlin,+Schivelbeiner+Str.+9,+Berlin/FOTOIMPEX,+Alte+Sch%C3%B6nhauser+Str.+32B,+Berlin/Hackesche+H%C3%B6fe,+Berlin/Haus+Schwarzenberg,+Rosenthaler+Str.+39,+Berlin/Silo+Coffee,+Gabriel-Max-Stra%C3%9Fe+4,+Berlin/Boxhagener+Platz,+Berlin/Fleischerei+Domke,+Warschauer+Str.+64,+Berlin/Avci+Bistro,+Kopernikusstra%C3%9Fe+30,+Berlin/RAW-Gel%C3%A4nde,+Berlin/East+Side+Gallery,+Berlin",
    "day-07": "https://www.google.com/maps/dir/Linienstra%C3%9Fe+60,+10119+Berlin/Zoologischer+Garten+Berlin/Foto-Meyer,+Welserstra%C3%9Fe+1,+Berlin/Am+Zeughaus+1-2,+Berlin/St%C3%A4ndige+Vertretung,+Schiffbauerdamm+8,+Berlin",
    "day-08": "https://www.google.com/maps/dir/Linienstra%C3%9Fe+60,+10119+Berlin/Gedenkst%C3%A4tte+Berliner+Mauer,+Bernauer+Str./Mauerpark+Flohmarkt,+Berlin/Dr.+Kochan+Liquor+Culture,+Immanuelkirchstra%C3%9Fe+4,+Berlin/Am+Zeughaus+1-2,+Berlin/Berlin+Hbf",
    "day-09": "https://www.google.com/maps/dir/Freiburg+Hbf/Mathildenstra%C3%9Fe+14,+79106+Freiburg/G%C3%BCnter+Coffee+Store,+Freiburg/Markthalle,+Freiburg/Confiserie+Gmeiner,+Freiburg/caf%C3%A9+hinterzimmer,+Freiburg/Freiburgs+Finest,+Freiburg/Alte+Wache,+Freiburg/Hausbrauerei+Feierling,+Freiburg",
    "day-10": "https://www.google.com/maps/dir/Mathildenstra%C3%9Fe+14,+79106+Freiburg/Freiburg+Hbf/Friedrichsbad,+R%C3%B6merplatz+1,+Baden-Baden/Caf%C3%A9+K%C3%B6nig,+Lichtentaler+Str.+12,+Baden-Baden",
    "day-11": "https://www.google.com/maps/dir/Mathildenstra%C3%9Fe+14,+79106+Freiburg/Freiburg+Hbf/Titisee,+Titisee-Neustadt/Schloss-Caf%C3%A9+Freiburg/Johanneskirche,+Freiburg/B%C3%A4ckerei+B%C3%BChler,+Zasiusstra%C3%9Fe+9,+Freiburg",
    "day-12": "https://www.google.com/maps/dir/Mathildenstra%C3%9Fe+14,+79106+Freiburg/SAMS+Caf%C3%A9,+Freiburg/Freiburg+Hbf/H%C3%B4tel+Saint-Martin,+38+Grand'Rue,+Colmar",
    "day-13-colmar": "https://www.google.com/maps/dir/H%C3%B4tel+Saint-Martin,+38+Grand'Rue,+Colmar/Porte+de+Munster,+Turckheim/Domaine+Fran%C3%A7ois+Baur,+3+Grand'Rue,+68230+Turckheim/Cave+Vinicole+de+Turckheim/Gare+de+Colmar",
    "day-13": "https://www.google.com/maps/dir/M%C3%BCnchen+Hbf/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen",
    "day-14": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/Julius+Brantner+Brothandwerk,+Adalbertstra%C3%9Fe+25,+M%C3%BCnchen/Schneider+Br%C3%A4uhaus,+Tal+7,+M%C3%BCnchen/Marienplatz,+M%C3%BCnchen/Viktualienmarkt,+M%C3%BCnchen/Caf%C3%A9+Frischhut,+Pr%C3%A4lat-Zistl-Stra%C3%9Fe+8,+M%C3%BCnchen/Leica+Store+M%C3%BCnchen,+Maffeistra%C3%9Fe+4/Kunst-Oase,+Ottostra%C3%9Fe+6,+M%C3%BCnchen/Calumet+Photographic+M%C3%BCnchen,+Sonnenstra%C3%9Fe+26/Haxnbauer,+Tal+38,+M%C3%BCnchen",
    "day-15": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/M%C3%BCnchen+Hbf/F%C3%BCssen+Bahnhof/Schloss+Neuschwanstein",
    "day-16": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/KZ-Gedenkst%C3%A4tte+Dachau/Foto+Dinkel,+Landwehrstra%C3%9Fe+6,+M%C3%BCnchen/Augustiner+Br%C3%A4ustuben,+Landsberger+Stra%C3%9Fe+19,+M%C3%BCnchen",
    "day-17": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/Odeonsplatz,+M%C3%BCnchen/Eisbachwelle,+M%C3%BCnchen/Residenz+M%C3%BCnchen/Weihnachtsdorf+im+Kaiserhof+der+Residenz/Pf%C3%A4lzer+Residenz+Weinstube/Weinhaus+Neuner,+Herzogspitalstra%C3%9Fe+8,+M%C3%BCnchen",
    "day-18": "https://www.google.com/maps/dir/Timehouse+Munich,+Leopoldstra%C3%9Fe+204a,+80804+M%C3%BCnchen/Boulangerie+Dompierre,+T%C3%BCrkenstra%C3%9Fe+21,+M%C3%BCnchen/Deutsches+Museum,+Museumsinsel+1,+M%C3%BCnchen/Wiener+Platz,+M%C3%BCnchen/Bar+Mural,+Hotterstra%C3%9Fe+12,+M%C3%BCnchen/Alte+Utting,+Lagerhausstra%C3%9Fe+15,+M%C3%BCnchen/Hofbr%C3%A4uhaus+M%C3%BCnchen",
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
        var popupHtml = '<div style="width:240px;font-family:sans-serif;">' +
          '<img src="' + p.img + '" alt="' + p.name + '" style="width:100%;height:110px;object-fit:cover;border-radius:6px;margin-bottom:6px;">' +
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

// Modular Berlin Section (5-8 Nov 2026) + chronological map route
// Written to the 3 Nov 2026 user decisions (Street Food Thursday on Thu 5 Nov,
// Museum Island + Mampe on Fri 6 Nov, zoo-all-day + BRLO on Sat 7 Nov, Domke
// Sunday lunch before the 20:52 Nightjet) and revised after the follow-up audit:
// coordinates re-taken from the saved Google pins / OpenStreetMap addresses,
// realistic travel and rest buffers, alternatives discoverable per day but kept
// off the route line, and museum/restaurant facts re-checked at the source.
export const BerlinSectionHtml = `  <!-- SECTION: BERLIN LEG (5–8 NOV 2026) · TIMED ITINERARY + DAY-FILTERED MAP -->
  <section id="sec-berlin" class="section-panel">
    <h2 style="margin-bottom:0.45rem;">Leg 1: Berlin Itinerary (Thu 5 Nov 06:20 AM Arrival – Sun 8 Nov 20:52 Sleeper) · Base: Karlito Apartmenthaus</h2>
    <p style="margin-bottom:1rem;">
      <strong>Outbound Flights (Booking Ref: <code>7AK639</code>):</strong> <strong>Wed 4 Nov 19:35 HKG → 00:25+1 AUH (Etihad EY 871)</strong> + <strong>Thu 5 Nov 02:20 AUH → 06:20 BER (Condor DE 2553)</strong>.<br>
      <strong>Verified Base Hotel (#59 on Your List · Booking #<code>5126078467</code>):</strong> <strong>Karlito Apartmenthaus</strong> (<code>Linienstraße 60, 10119 Berlin-Mitte</code>, Family Apartment with Balcony · Check-in Thu 5 Nov 14:00–23:00, Check-out Sun 8 Nov 08:00–10:00 · U2 <em>Rosa-Luxemburg-Platz</em>).<br>
      <strong>What is actually confirmed in Berlin:</strong> the <strong>Karlito booking</strong>, the <strong>CONFIRMED 18:30 Yorckschlösschen table on Fri 6 Nov</strong> (2 people) and the <strong>20:52 ÖBB Nightjet NJ 408 on Sun 8 Nov</strong>. The Yorckschlösschen table is your <em>only confirmed Berlin restaurant reservation</em>. Everything else — the €24 Museum Island pass, the BRLO table, the Markthalle Neun market evening and any luggage storage — is <strong>unbooked</strong>.<br>
      <strong>The fixed points of this leg:</strong> <strong>Street Food Thursday at Markthalle Neun</strong> (Thu 5 Nov 17:00–22:00, first choice), <strong>#48 Mampe Berlin Fri 6 Nov ~16:15–17:30</strong> (the Hofladen closes 18:00, so this one is non-negotiable on Friday), the <strong>CONFIRMED 18:30 Yorckschlösschen table</strong> (<code>Yorckstraße 15</code>), <strong>#63 Berlin Zoological Garden</strong> coming in around <strong>09:30 until 16:30 on Sat 7 Nov</strong> (leaving the apartment ~09:00) with <strong>#57 BRLO Brwhouse</strong> as the only planned dinner, and the <strong>20:52 ÖBB Nightjet NJ 408</strong> on Sun 8 Nov (Berlin Hbf Bahnsteig 3 → Freiburg Mon 06:17).<br>
      <strong>How to read the map — and how honest it is:</strong> the numbered pins of each day follow the written timeline, and the dashed line follows those numbers in order. The <strong>Thursday return to Karlito</strong> (check-in + rest) and the <strong>conditional Sunday bag pickup</strong> are the same address as Pin 1, so they are drawn as <strong>unnumbered ↩ return waypoints</strong> rather than fake second venues — and both are listed in the map sidebar. <strong>Optional and backup places</strong> (Thursday's two lunches and Anjoy, Friday's Steak Döner and CANAL, Saturday's KaDeWe <em>A</em> and C/O Berlin <em>B</em>) appear in their day's filter and sidebar, each with its own Google Maps address search, but they <strong>never join the route line or the day's Google directions</strong>. The one flexible lunch each day, and the Thursday rest, are deliberately <strong>unpinned</strong>, so this is a chronological itinerary sketch with approximate timings — not a turn-by-turn or minute-accurate route.
    </p>

    <div class="grid-2" style="margin-bottom:1.25rem;">
      <div class="card">
        <img src="assets/images/hotel_karlito_berlin.jpg" alt="Karlito Apartmenthaus Linienstrasse 60 Berlin Mitte">
        <div class="card-body">
          <div class="badge-row"><span class="badge success">Your Berlin Base · Booking #5126078467</span><span class="badge">Family Apt with Balcony</span></div>
          <h4>Karlito Apartmenthaus (Linienstraße 60, 10119 Berlin-Mitte)</h4>
          <p><strong>Airport Transfer (Thu 5 Nov 06:20 AM arrival):</strong> take the <strong>FEX / RE20 to <em>Potsdamer Platz</em></strong>, then the <strong>U2 to <em>Rosa-Luxemburg-Platz</em></strong> (the old &quot;FEX to Hbf then U2&quot; and &quot;RE8 to Alexanderplatz&quot; notes were both wrong and are gone). Buy an <strong>ABC ticket</strong> because BER sits in zone C, <strong>validate the paper ticket in the red/yellow machine before boarding</strong>, and treat the exact departure as <strong>subject to a live check on the BVG/DB app</strong> that morning.<br>
          <strong>~07:45–08:00 bag drop</strong> at Linienstraße 60 is <em>unconfirmed</em> — ask at reception, and keep <strong>Berlin Hbf lockers as the backup</strong>; nothing has been reserved or guaranteed. Official check-in is 14:00–23:00, so the route comes back here at <strong>~15:30 to check in and rest</strong> before dinner. Check-out Sun 8 Nov 08:00–10:00: if the apartment cannot keep the bags for the day, use <strong>Hbf lockers</strong> and go straight to the station at the end — the bag pickup at Karlito only happens if they stored them. Walk 3 mins to <strong>#45 Zeit für Brot</strong> and 5 mins to <strong>#04 FOTOIMPEX</strong>.</p>
        </div>
      </div>

      <div class="card">
        <img src="assets/images/berlin_zoo.jpg" alt="Berlin Zoological Garden Hippo House">
        <div class="card-body">
          <div class="badge-row"><span class="badge gold">Confirmed Fri 6 Nov 18:30</span><span class="badge">Museum Island → Mampe → Yorckschlösschen</span></div>
          <h4>How Friday 6 Nov Fits: Bakery → Museum Island → Mampe ~16:15 → 18:30 Yorckschlösschen</h4>
          <p>• <strong>From ~08:45 — one bakery, no second breakfast:</strong> <strong>SammyS</strong> (<code>Sophienstraße 30-31</code>, listings say 09:00 but <em>opening time is subject to check</em>), or a repeat at <strong>Zeit für Brot</strong> (07:00), or <strong>CANAL</strong> (<code>Sophienstraße 5</code>, opens 10:00). Pick one.<br>
          • <strong>10:00–15:45 — Museum Island:</strong> one <strong>€24 per person one-day Museum Island pass</strong> covering the island museums; the <strong>Pergamonmuseum main building itself is closed</strong>, and the only Pergamon display it includes is the separately housed <strong>Das Panorama</strong> exhibition — a separate exhibition venue, <strong>not a separate paid ticket</strong>. Large special exhibitions <strong>may</strong> need an additional free time slot booked with the pass. The pass is <strong>not booked</strong>: buy it online in advance or at the desk on arrival (<a href="https://www.smb.museum/en/plan-your-visit/prices-tickets/" target="_blank" rel="noopener">smb.museum ticket page</a>). One flexible lunch inside this block (the saved <strong>The Steak Döner</strong>, <code>Spandauer Str. 4</code>, is a <em>suggestion only — not booked, not fixed</em>).<br>
          • <strong>15:45–16:00 leave the island</strong> and allow <strong>30–40 min</strong> to Mampe: arrival <strong>~16:15–16:40</strong>, staying <strong>up to ~17:30</strong> (the Hofladen closes 18:00), then a <strong>15–20 min walk to the confirmed 18:30 Yorckschlösschen</strong> table. No Domke and no East Side Gallery on Friday.</p>
        </div>
      </div>
    </div>

    <div class="day-subtabs">
      <button class="sub-btn active" data-berlin-day="region-berlin">Show All 4 Berlin Days (scheduled stops + optional/backup pins)</button>
      <button class="sub-btn" data-berlin-day="day-05">Thu 5 Nov (Arrival → Memorial/Gate → one lunch → Höfe &amp; Otto Weidt → FOTOIMPEX → check-in &amp; rest → Street Food Thursday)</button>
      <button class="sub-btn" data-berlin-day="day-06">Fri 6 Nov (Bakery → Museum Island → Mampe ~16:15 → 18:30 Yorckschlösschen)</button>
      <button class="sub-btn" data-berlin-day="day-07">Sat 7 Nov (Leave 09:00 → Zoo ~09:30–16:30 → BRLO, optional A/B add-on)</button>
      <button class="sub-btn" data-berlin-day="day-08">Sun 8 Nov (Wall Memorial → Mauerpark → Domke lunch → East Side → 20:52 NJ 408)</button>
    </div>

    <h3 style="margin:1.1rem 0 0.75rem;">4-Day Berlin Schedule (timeline order = numbered map pins · ↩ return legs marked · all timings approximate)</h3>
    <div class="timeline" style="margin-bottom:1.5rem;">
      <div class="tl-item" data-berlin-card="day-05">
        <div class="tl-time">Thu 5 Nov · Day 1<br><span style="font-size:0.78rem; color:#5a6577;">(Arrival, one lunch, rest, Street Food Thursday)</span></div>
        <div><strong>06:20 Land BER → Karlito bag drop → Zeit für Brot → Holocaust Memorial / Brandenburg Gate / Reichstag exteriors → one lunch in Mitte → Hackesche Höfe → Dead Chicken Alley / Otto Weidt → FOTOIMPEX → back to Karlito to check in &amp; rest → Street Food Thursday at Markthalle Neun:</strong><br>
        • <strong>Pin 1 — ★ #59 Karlito Apartmenthaus (~07:45–08:00 bag drop · Booking #<code>5126078467</code>):</strong> <strong>FEX / RE20 to <em>Potsdamer Platz</em>, then U2 to <em>Rosa-Luxemburg-Platz</em></strong> — the earlier &quot;FEX to Hbf then U2&quot; and &quot;RE8 to Alexanderplatz&quot; routings were wrong. <strong>ABC ticket (BER is zone C), validate the paper ticket before boarding, timetable subject to a live check.</strong> The early bag drop at <code>Linienstraße 60</code> is <strong>unconfirmed</strong> — ask at reception, with <strong>Berlin Hbf lockers as the backup</strong>. Check-in is only from 14:00.<br>
        • <strong>Pin 2 — ★ #45 Zeit für Brot (~09:00 · MUST-HAVE cinnamon roll / Zimtschnecke):</strong> 3 mins from Karlito at <code>Alte Schönhauser Str. 4</code> — a warm organic <em>Zimtschnecke</em>, a snack rather than the meal. <strong>Verified hours: Mon–Fri 07:00–20:00, Sat 08:00–20:00, Sun 08:00–18:00.</strong> Then allow ~20–30 min on foot or by S/U-Bahn to the memorial.<br>
        • <strong>Pin 3 — Holocaust Memorial → Brandenburg Gate → Reichstag exteriors (10:15–11:45):</strong> Walk the Field of Stelae, through the Gate, to the Reichstag outside. The dome needs an advance booking, so this is an exterior visit only.<br>
        • <strong>~12:15–13:15 — One relaxed lunch in Mitte, flexible and unpinned by design:</strong> first choice <strong>Ständige Vertretung</strong> (<code>Schiffbauerdamm 8</code>, <strong>daily 11:00–01:00</strong> per <a href="https://www.staev.de/berlin-mitte.html" target="_blank" rel="noopener">staev.de</a>), second choice <strong>Sophien 11</strong> (<code>Sophienstraße 11</code>). One lunch only — never both, and neither is reserved. Both have their own optional pin in the Thu filter so you can navigate to whichever you choose.<br>
        • <strong>Pin 4 — ★ #46 Hackesche Höfe (~13:15–14:15):</strong> Eight restored Jugendstil courtyards at <code>Rosenthaler Str. 40</code>, 10 mins from Karlito — EAT BERLIN inside is open Mon–Sat 11:00–19:00.<br>
        • <strong>Pin 5 — Dead Chicken Alley / Rosenthaler Str. 39 (~14:15–14:30 · #47 · Otto Weidt visit optional):</strong> The street-art alley next door to the Höfe. The free <strong>Otto Weidt Workshop for the Blind</strong> museum is open <strong>weekdays 09:00–18:00 and weekends 10:00–18:00</strong> (<a href="https://www.museum-blindenwerkstatt.de/en/" target="_blank" rel="noopener">museum-blindenwerkstatt.de</a>) — go in if you still have energy, otherwise walk through and keep moving.<br>
        • <strong>Pin 6 — ★ #04 FOTOIMPEX GmbH (~14:45–15:15):</strong> <code>Alte Schönhauser Str. 32B</code>, 5 mins from the apartment. <strong>Verified hours: Mon–Sat 11:00–19:00 (closed Sun).</strong> Europe's analog film &amp; darkroom flagship.<br>
        • <strong>↩ Return to Karlito (~15:30 · unnumbered waypoint):</strong> check in (from 14:00) and <strong>actually rest for ~2h+ until ~17:45</strong> after the overnight flights. This is the same address as Pin 1, so the map draws it as an <strong>↩ return waypoint</strong> instead of inventing a second pin.<br>
        • <strong>Pin 7 — ★ Markthalle Neun · Street Food Thursday (17:00–22:00 · FIRST-CHOICE DINNER, dinner ~18:30/19:00):</strong> <code>Eisenbahnstraße 42-43</code>, Kreuzberg — leave the apartment around 17:45. Walk-in only: <strong>no table reservation, nothing booked</strong>. <strong>Backup only (never both):</strong> <strong>Anjoy</strong>, <code>Rykestraße 11</code> in Prenzlauer Berg — a separate optional pin in the Thu filter, never on this route line. <strong>No Mampe and no BRLO on Thursday.</strong><br>
        • <strong>If the flight lands late:</strong> slide the whole afternoon by the delay and <strong>trim the optional parts</strong> (courtyard browsing, the Otto Weidt visit, the film-shop browse) — never the one lunch and never the rest before dinner.
        </div>
      </div>

      <div class="tl-item" data-berlin-card="day-06">
        <div class="tl-time">Fri 6 Nov · Day 2<br><span style="font-size:0.78rem; color:#5a6577;">(Leaving the island 15:45–16:00, 30–40 min to Mampe)</span></div>
        <div><strong>~08:45 One bakery → Museum Island from 10:00 (€24/person one-day pass, not booked) → one flexible lunch inside that block → leave 15:45–16:00 → Mampe ~16:15–16:40 until ~17:30 → CONFIRMED 18:30 Yorckschlösschen:</strong><br>
        • <strong>Pin 1 — ★ #59 Karlito Apartmenthaus (~08:45 leave):</strong> Walk ~12–15 mins to Sophienstraße via <em>Rosa-Luxemburg-Platz</em> and <em>Hackescher Markt</em> (or U2 one stop to <em>Alexanderplatz</em>), then ~5 mins on foot from SammyS to Museum Island.<br>
        • <strong>Pin 2 — ★ SammyS Bakery (~09:00 · bakery choice A):</strong> <code>Sophienstraße 30-31</code>. Listings say it opens 09:00 but <strong>the opening time is subject to check on the day</strong>. The other no-extra-meal options are a <strong>Zeit für Brot repeat</strong> (Mon–Fri 07:00–20:00) or <strong>CANAL</strong>, <code>Sophienstraße 5</code> (opens 10:00). <strong>Pick one</strong> — this is not a second breakfast.<br>
        • <strong>Pin 3 — ★ Museum Island (10:00–15:45 · start at Neues Museum):</strong> <code>Bodestraße 1</code>, 10178 Berlin-Mitte. One <strong>€24 per person one-day pass</strong> covers the island museums; the <strong>Pergamonmuseum main building itself is closed</strong>, and the only Pergamon display it includes is the separately housed <strong>Das Panorama</strong> exhibition — a <strong>separate exhibition venue, not a separate paid ticket</strong>. Large special exhibitions <strong>may</strong> require an additional free time slot booked with the pass. The pass is <strong>not booked</strong>: buy it online beforehand or at the desk on arrival — either is fine (<a href="https://www.smb.museum/en/plan-your-visit/prices-tickets/" target="_blank" rel="noopener">smb.museum prices &amp; tickets</a>). <strong>~12:30–13:30 — one flexible lunch near the island:</strong> your saved <strong>The Steak Döner</strong> (<code>Spandauer Str. 4</code>) is a <em>suggestion, not booked and not fixed</em>, and its optional pin keeps it navigable without making it a stop.<br>
        • <strong>Leave the island 15:45–16:00 — do not force a premature exit.</strong> Museum Island → Mampe is <strong>30–40 min</strong> by U/S-Bahn plus a short walk.<br>
        • <strong>Pin 4 — ★ #48 Mampe Berlin (~16:15–16:40 arrive, stay up to ~17:30 · NON-NEGOTIABLE ON FRIDAY):</strong> <code>Am Tempelhofer Berg 6</code>, Kreuzberg. <strong>Verified hours: Mon–Fri 10:00–18:00 (Hofladen closes 18:00), Sat 12:00–18:00.</strong> Berlin's oldest 1831 spirits manufactory in the historic brewery courtyard — taste &amp; buy <em>Halb &amp; Halb</em>, <em>Elefantenkümmel</em> &amp; Kreuzberg Gin. It is a shop visit, <strong>nothing reserved</strong>.<br>
        • <strong>Pin 5 — ★ CONFIRMED 18:30 Dinner: Yorckschlösschen (18:30–21:30 · 2 people):</strong> <code>Yorckstraße 15, 10965 Berlin-Kreuzberg</code>, a <strong>15–20 min walk</strong> from Mampe (S/U-Bahn as the lazy backup). Your only confirmed Berlin restaurant table, and finishing Mampe around 17:30 leaves a comfortable margin. <strong>No Domke stop and no East Side Gallery on Friday.</strong></div>
      </div>

      <div class="tl-item" data-berlin-card="day-07">
        <div class="tl-time">Sat 7 Nov · Day 3<br><span style="font-size:0.78rem; color:#5a6577;">(Leave 09:00 · zoo ~09:30–16:30 · at most one optional add-on)</span></div>
        <div><strong>Leave the apartment ~09:00 → Berlin Zoo ~09:30–16:30 (#63) with a proper lunch inside → ~19:00 BRLO Brwhouse (#57), the only planned dinner/beer stop of the day:</strong><br>
        • <strong>Pin 1 — ★ #59 Karlito Apartmenthaus (~09:00 departure):</strong> Direct ~18-min U2 ride to <em>Zoologischer Garten</em>, so you walk in around 09:30.<br>
        • <strong>Pin 2 — ★ #63 Berlin Zoological Garden (~09:30–16:30 · THE WHOLE DAY):</strong> <code>Hardenbergplatz 8</code>. <strong>Verified November hours: 09:00–16:30, last admission 15:30</strong>, and the <strong>houses and zoo restaurants close at 16:00</strong> — plan the animals first and eat in between. Giant Pandas, glass-domed Hippo House, primates &amp; giraffes at an unhurried pace. <strong>Lunch is a proper meal inside the zoo (e.g. Waldschänke), not an extra stop.</strong><br>
        • <strong>16:30–18:15 — at most ONE optional add-on, and neither is a required stop:</strong> <em>Option A</em> the <strong>KaDeWe gourmet floor</strong> (<code>Tauentzienstraße 21-24</code>, a few minutes from the zoo), or <em>Option B</em> <strong>C/O Berlin at Amerika Haus</strong> (<code>Hardenbergstraße 22</code>, daily 11:00–20:00). On the map they are the labelled <strong>A</strong> and <strong>B</strong> optional pins (visible in the Sat filter, each with its own Google Maps search) and they are <strong>never both stops</strong>: neither joins the zoo → BRLO route line, and each has its own separate "Alternative A / Alternative B" directions link next to the map.<br>
        • <strong>Pin 3 — ★ #57 BRLO Brwhouse (~19:00 · ONLY PLANNED DINNER/BEER):</strong> <code>Schöneberger Str. 16</code> (Park am Gleisdreieck) for craft beer and the BRWHouse kitchen's <strong>current seasonal, vegetable-focused shared plates</strong> (<a href="https://www.brlo.de/gastronomien/brlo-brwhouse" target="_blank" rel="noopener">brlo.de</a>) — the older "smokehouse plates" framing is not the current default. <strong>Sat hours are normal (12:00–24:00, kitchen to 22:00), but booking availability is unverified and nothing is reserved</strong> — walk in, or call ahead on the day. No second pub and no extra meal on Saturday.<br>
        • <strong>About Hamy:</strong> it was a <em>restaurant suggestion, not one of your saved Google list places</em>, and it is <strong>not scheduled on any day</strong> of this trip. If it ever happens it would only ever be an unscheduled Saturday dinner — and Saturday is already the zoo all day plus BRLO.</div>
      </div>

      <div class="tl-item" data-berlin-card="day-08">
        <div class="tl-time">Sun 8 Nov · Day 4<br><span style="font-size:0.78rem; color:#5a6577;">(Checkout 08:00–09:00 · conditional bag run · Hbf 20:15)</span></div>
        <div><strong>08:00–09:00 Karlito pack + checkout (window 08:00–10:00) → Berlin Wall Memorial 09:20–10:15 → #44 Mauerpark Sunday flea market 10:30–12:15 → Domke lunch 13:00–13:45 → East Side Gallery 14:00–15:30 → early dinner / train food ~17:30 → conditional bag run → Berlin Hbf 20:15 for the 20:52 ÖBB Nightjet NJ 408:</strong><br>
        • <strong>Pin 1 — ★ #59 Karlito Apartmenthaus (08:00–09:00 pack + checkout):</strong> Checkout is 08:00–10:00, so pack and settle the bill before you leave for Bernauer Straße (Booking #<code>5126078467</code>). <strong>Ask about keeping bags for the day; that storage is unconfirmed and Berlin Hbf lockers are the backup.</strong> Nothing is booked.<br>
        • <strong>Pin 2 — Berlin Wall Memorial at Bernauer Straße (09:20–10:15, ~20 min from Karlito):</strong> <code>Bernauer Str. 111</code> — preserved Cold War death-strip, watchtower &amp; outdoor exhibition (visitor centre Tue–Sun 10:00–18:00; the outdoor site is open daily).<br>
        • <strong>Pin 3 — ★ #44 Mauerpark Flohmarkt (10:30–12:15 · Sunday only):</strong> Walk up Bernauer Straße to <code>Bernauer Str. 64</code>. <strong>Verified Sundays 10:00–18:00 via berlin.de.</strong> Vintage cameras, lenses, DDR antiques, street food &amp; buskers. <em>Note: never link mauerparkmarkt.de — that domain is hijacked by casino spam.</em><br>
        • <strong>12:15–13:00 — travel to Friedrichshain, allow 45–60 min</strong> from the flea market to Domke.<br>
        • <strong>Pin 4 — ★ #14 Fleischerei Domke (13:00–13:45 · SUNDAY LUNCH):</strong> <code>Warschauer Str. 64</code>, Friedrichshain. <strong>Verified hours: Sun 09:00–21:00</strong> (Mon–Fri 06:00–21:00, Sat 07:00–21:00). <strong>Mettbrötchen availability at Sunday lunchtime is NOT confirmed</strong> — call <strong>+49 30 291 76 35</strong> beforehand and treat the counter as a request, not a guarantee.<br>
        • <strong>Pin 5 — ★ #21 East Side Gallery (14:00–15:30 · in daylight):</strong> <code>Mühlenstraße</code>, the 1.3 km painted Berlin Wall, 10 mins from Domke and the natural close to the Friedrichshain loop before sunset.<br>
        • <strong>15:30–17:30 — a slow hour or two (coffee, a gallery, or simply resting), then ~17:30 early dinner or train food (no extra pin).</strong><br>
        • <strong>↩ Return to Karlito (~18:15–19:00 · unnumbered and conditional):</strong> this only happens <strong>if the apartment stored your bags</strong>. If you chose <strong>Berlin Hbf lockers</strong>, skip this waypoint and ride straight to the station — no storage arrangement is assumed anywhere.<br>
        • <strong>Pin 6 — Berlin Hauptbahnhof (20:15 with bags · 20:52 Departure):</strong> Board <strong>ÖBB Nightjet NJ 408, Bahnsteig 3</strong> → Freiburg (Brsg) Hbf Mon 06:17 (Coach 309, berths 52/56, Double Deluxe with shower/WC, breakfast included). <strong>Print the ticket on white A4 and carry photo ID.</strong> No Prenzlauer Berg afternoon wander and no closed-Sunday shops on this route. The 45-minute buffer to 20:15 absorbs a delayed lunch or a slow bag run.</div>
      </div>
    </div>

    <h3 style="margin:1.2rem 0 0.75rem;">Berlin Complete Scorecard: Included, Optional, Pending &amp; De-listed Places</h3>
    <table class="fare-table">
      <thead>
        <tr>
          <th>Status</th>
          <th># in List</th>
          <th>Saved Berlin Pin / Confirmed Booking</th>
          <th>Assigned Day &amp; Why Included / Omitted</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="badge success">INCLUDED (Base)</span></td>
          <td><strong>#59</strong></td>
          <td><strong>Karlito Apartmenthaus (Linienstr. 60 · Booking #<code>5126078467</code>)</strong></td>
          <td><strong>Thu 5 – Sun 8 Nov Base:</strong> Family Apartment with Balcony. Check-in Nov 5 from 14:00, check-out Nov 8 08:00–10:00. Early bag drop and day-of-checkout storage are both <em>unconfirmed</em> (Hbf lockers backup). Pinned on all 4 days, and the Thursday check-in/rest plus the Sunday bag pickup appear as <strong>↩ return waypoints</strong>, not extra pins.</td>
        </tr>
        <tr>
          <td><span class="badge success">CONFIRMED TABLE</span></td>
          <td><strong>18:30 Res.</strong></td>
          <td><strong>Yorckschlösschen (Yorckstraße 15, 10965 Berlin)</strong></td>
          <td><strong>Fri 6 Nov (18:30 confirmed for 2 people):</strong> Historic Kreuzberg jazz &amp; soul tavern and your <strong>only confirmed Berlin restaurant reservation</strong>, a 15–20 min walk from Mampe after the ~16:15–17:30 spirits window.</td>
        </tr>
        <tr>
          <td><span class="badge success">INCLUDED (Non-Negotiable)</span></td>
          <td><strong>#48</strong></td>
          <td><strong>Mampe Berlin (Am Tempelhofer Berg 6)</strong></td>
          <td><strong>Fri 6 Nov (~16:15–16:40 arrive, up to ~17:30):</strong> Verified Mon–Fri 10:00–18:00, Hofladen closes 18:00, and 30–40 min from Museum Island. Deliberately not on Thursday — Thursday ends with Street Food Thursday instead.</td>
        </tr>
        <tr>
          <td><span class="badge success">INCLUDED (Sat 7 Nov)</span></td>
          <td><strong>#63</strong></td>
          <td><strong>Berlin Zoological Garden</strong></td>
          <td><strong>Sat 7 Nov (leave 09:00 · ~09:30–16:30):</strong> Verified November hours, last admission 15:30, houses and zoo restaurants close 16:00. Proper lunch inside the zoo (e.g. Waldschänke) instead of an extra stop.</td>
        </tr>
        <tr>
          <td><span class="badge success">INCLUDED (Sat 7 Nov)</span></td>
          <td><strong>#57</strong></td>
          <td><strong>BRLO Brwhouse (Schöneberger Str. 16)</strong></td>
          <td><strong>Sat 7 Nov (~19:00):</strong> The sole planned dinner/beer stop of the day, with the current <strong>seasonal vegetable-focused shared plates</strong> (brlo.de) rather than the old smokehouse framing. Sat 12:00–24:00 are normal hours, but <strong>booking availability is unverified — nothing is reserved</strong>.</td>
        </tr>
        <tr>
          <td><span class="badge success">INCLUDED (Sun 8 Nov)</span></td>
          <td><strong>#14</strong></td>
          <td><strong>Fleischerei Domke (Warschauer Str. 64)</strong></td>
          <td><strong>Sun 8 Nov (13:00–13:45 Sunday lunch):</strong> Verified Sun 09:00–21:00, 45–60 min from Mauerpark. <strong>Mettbrötchen availability at Sunday lunchtime is unconfirmed</strong> — call +49 30 291 76 35. No Silo and no second restaurant is scheduled after Domke.</td>
        </tr>
        <tr>
          <td><span class="badge success">INCLUDED (Thu 5 Nov)</span></td>
          <td><strong>#45, #46, #47, #04, Markthalle Neun + Memorial</strong></td>
          <td><strong>Zeit für Brot (#45), Holocaust Memorial/Brandenburg Gate/Reichstag exteriors, Hackesche Höfe (#46), Dead Chicken Alley / Otto Weidt (#47), FOTOIMPEX (#04), Markthalle Neun Street Food Thursday</strong></td>
          <td><strong>Thu 5 Nov:</strong> Memorial/Gate 10:15–11:45, one lunch 12:15–13:15, courtyards + alley + FOTOIMPEX 13:15–15:15, <strong>Karlito check-in and a ~2h+ rest to ~17:45</strong>, dinner ~18:30/19:00. The lunch and the rest are deliberately unpinned. Street Food Thursday is walk-in only — no reservation.</td>
        </tr>
        <tr>
          <td><span class="badge success">INCLUDED (Fri 6 Nov)</span></td>
          <td><strong>SammyS + Museum Island</strong></td>
          <td><strong>SammyS (Sophienstraße 30-31), Museum Island one-day pass (€24/person, start at Neues Museum, Bodestraße 1)</strong></td>
          <td><strong>Fri 6 Nov:</strong> One bakery only (SammyS ~09:00, opening subject to check; alternatives = Zeit repeat or CANAL at 10:00), then museum wandering 10:00–15:45. Pass <strong>not booked</strong> (online or on arrival); the Pergamonmuseum main building is closed, the only Pergamon display the pass includes is the separately housed Das Panorama exhibition, and that is a separate venue rather than a separate paid ticket.</td>
        </tr>
        <tr>
          <td><span class="badge success">INCLUDED (Sun 8 Nov)</span></td>
          <td><strong>#44, #21 + Wall &amp; Hbf</strong></td>
          <td><strong>Berlin Wall Memorial, Mauerpark Flohmarkt (#44), East Side Gallery (#21), Berlin Hbf (Nightjet NJ 408, Coach 309, berths 52/56)</strong></td>
          <td><strong>Sun 8 Nov:</strong> Wall Memorial 09:20–10:15, Mauerpark 10:30–12:15, Domke 13:00–13:45, East Side 14:00–15:30, early dinner/train food ~17:30, <strong>conditional</strong> Karlito bag pickup ~18:15–19:00, Berlin Hbf with bags by 20:15 for the 20:52 departure.</td>
        </tr>
        <tr>
          <td><span class="badge">OPTIONAL (Thu 5 Nov lunch)</span></td>
          <td><strong>#15 + Sophien 11</strong></td>
          <td><strong>Ständige Vertretung (Schiffbauerdamm 8)</strong> and <strong>Sophien 11 (Sophienstraße 11)</strong></td>
          <td><strong>One lunch only:</strong> Ständige Vertretung is first choice (<strong>daily 11:00–01:00</strong>, <a href="https://www.staev.de/berlin-mitte.html" target="_blank" rel="noopener">staev.de</a>), Sophien 11 the second. Neither is booked. Both are visible as optional pins in the Thu filter and sidebar for navigation, and neither appears on the Thu route line.</td>
        </tr>
        <tr>
          <td><span class="badge">BACKUP (Thu 5 Nov dinner)</span></td>
          <td><strong>Anjoy</strong></td>
          <td><strong>Anjoy (Rykestraße 11, Prenzlauer Berg)</strong></td>
          <td><strong>Backup dinner only:</strong> Street Food Thursday at Markthalle Neun is the first choice. Do one, never both. Anjoy was a suggestion rather than a saved Google list place; it is discoverable in the Thu filter but excluded from the Thursday route line.</td>
        </tr>
        <tr>
          <td><span class="badge">OPTIONAL (Fri 6 Nov)</span></td>
          <td><strong>The Steak Döner + CANAL</strong></td>
          <td><strong>The Steak Döner (Spandauer Str. 4)</strong>, <strong>CANAL (Sophienstraße 5)</strong></td>
          <td><strong>Suggestions only:</strong> The Steak Döner is the flexible island lunch idea (not booked, not fixed, saved pin); CANAL is bakery option C because it opens 10:00. Both are optional pins in the Fri filter with individual navigation and both stay outside the Friday route line.</td>
        </tr>
        <tr>
          <td><span class="badge">OPTIONAL A / B (Sat 7 Nov)</span></td>
          <td><strong>KaDeWe or C/O Berlin</strong></td>
          <td><strong>KaDeWe gourmet floor (Tauentzienstraße 21-24)</strong> and <strong>C/O Berlin at Amerika Haus (Hardenbergstraße 22)</strong></td>
          <td><strong>At most ONE, and neither is required:</strong> the default Saturday route is zoo → BRLO. They are the labelled <strong>A</strong> and <strong>B</strong> optional pins (discoverable in the Sat filter and sidebar) that never join the main polyline, and each has its own separately labelled alternative directions link.</td>
        </tr>
        <tr>
          <td><span class="badge gold">PENDING (not scheduled)</span></td>
          <td><strong>#11</strong></td>
          <td><strong>Mały Książę Polish Groceries (Lilienthalstraße 6, by Südstern)</strong></td>
          <td><strong>Unresolved trip priority:</strong> your Polish-grocery must-do (kiełbasa, pierogi, chocolate) stays on the list but has <strong>no assigned day and no fixed time</strong> — so no day route claims it. TRUE saved coordinates <code>52.488025, 13.407631</code>; it is roughly <strong>1.9 km / 25-min walk from Yorckschlösschen</strong> — the old pin near Mampe and the &quot;550 m&quot; claim were wrong. Plan it separately.</td>
        </tr>
        <tr>
          <td><span class="badge">SAVED ONLY (no day)</span></td>
          <td><strong>Hamy · #12 Silo · #19 RAW · #20 Boxhagener · #05 Safelight · #03 Foto-Meyer · Super Shawarma · Stasi Museum</strong></td>
          <td><strong>Hamy (Hasenheide 10 — a suggestion, not a saved Google list pin), Silo Coffee (Gabriel-Max-Str. 4), RAW-Gelände (#19), Boxhagener Platz (#20), Safelight (#05), Foto-Meyer (#03), Super Shawarma, Stasi Museum</strong></td>
          <td><strong>Kept for discoverability, not scheduled:</strong> Saturday is zoo all day + BRLO and Friday is Museum Island + Mampe, so there is no Hamy meal, no Silo coffee stop, no Friedrichshain café loop, no second camera shop and no Stasi Museum visit. Hamy is only ever a hypothetical unscheduled Saturday dinner and was never one of your saved Google list places. The 3 Nov 2026 snapshot added The Steak Döner, Super Shawarma and Stasi Museum to your list; only The Steak Döner has a (suggestion-only) role.</td>
        </tr>
        <tr>
          <td><span class="badge danger">OMITTED #1</span></td>
          <td><strong>#22</strong></td>
          <td><strong>DDR Museum</strong></td>
          <td><strong>Hidden from daily maps (view via &quot;Show Omitted Pins&quot;):</strong> Cramped tourist basement; replaced by the authentic Berlin Wall Memorial on Sun 8 Nov.</td>
        </tr>
        <tr>
          <td><span class="badge danger">OMITTED #2</span></td>
          <td><strong>#50</strong></td>
          <td><strong>MXPSM Wedding Distillery Storefront (Seestraße 13)</strong></td>
          <td><strong>Hidden from daily maps:</strong> Far west of Mitte. Taste MXPSM schnaps at the Michelberger Hotel bar by RAW-Gelände instead of detouring to Wedding.</td>
        </tr>
        <tr>
          <td><span class="badge danger">OMITTED #3</span></td>
          <td><strong>Topography</strong></td>
          <td><strong>Topography of Terror (Niederkirchnerstraße 8)</strong></td>
          <td><strong>Hidden from daily maps:</strong> The Thu 5 Nov morning is fixed as Memorial → Brandenburg Gate → Reichstag exteriors, then lunch and the Mitte courtyards. It sits 600m from the Memorial, so it remains the obvious rainy-day swap.</td>
        </tr>
        <tr>
          <td><span class="badge danger">OMITTED #4</span></td>
          <td><strong>#13</strong></td>
          <td><strong>Avci Bistro (Kopernikusstraße 30)</strong></td>
          <td><strong>Hidden from daily maps:</strong> Friday now runs bakery → Museum Island → Mampe → Yorckschlösschen, so the old tea stop is gone. Still handy around the corner from Domke if the Sunday butcher counter is shut.</td>
        </tr>
        <tr>
          <td><span class="badge danger">OMITTED #5</span></td>
          <td><strong>#60</strong></td>
          <td><strong>The Berlin Art Market by the Zeughaus (Am Zeughaus 1-2)</strong></td>
          <td><strong>Hidden from daily maps:</strong> Saturday is given entirely to the zoo and BRLO. The market (Sat &amp; Sun 11:00–17:00) is a swap option only if you drop both optional Saturday add-ons.</td>
        </tr>
        <tr>
          <td><span class="badge danger">OMITTED #6</span></td>
          <td><strong>#49</strong></td>
          <td><strong>Dr. Kochan Liquor Culture (Immanuelkirchstraße 4)</strong></td>
          <td><strong>Hidden from daily maps:</strong> Sunday hours are closed/unconfirmed, and Sunday no longer includes a Prenzlauer Berg shop crawl — it runs Wall Memorial → Mauerpark → Domke → East Side Gallery → Nightjet.</td>
        </tr>
      </tbody>
    </table>

    <div class="audit-banner" style="margin-top:1.1rem;">
      <strong>PLAN HONESTY — WHAT IS AND IS NOT CONFIRMED IN BERLIN:</strong><br>
      • <strong>Confirmed:</strong> the Karlito apartment booking (#<code>5126078467</code>), the <strong>Fri 6 Nov 18:30 Yorckschlösschen table</strong> (2 people) and the <strong>Sun 8 Nov 20:52 Nightjet NJ 408</strong>. The Yorckschlösschen table is the <strong>only confirmed Berlin restaurant reservation</strong>. <strong>Nothing else is booked</strong>: no Museum Island pass, no BRLO table, no Markthalle Neun table, no restaurant booking for Ständige Vertretung, Sophien 11, Anjoy, The Steak Döner or CANAL.<br>
      • <strong>Unconfirmed and to ask on the day:</strong> Karlito's early bag drop (Thu) and day storage (Sun) — <strong>no luggage-storage arrangement has been agreed or confirmed</strong>, so the Sunday bag pickup is conditional and Hbf lockers are the fallback; <strong>Domke's Sunday Mettbrötchen availability</strong>; the BRLO table; and the museum pass, which is simply unbooked (buy online or on arrival).<br>
      • <strong>Hours are as published, not as promised:</strong> SammyS opening (~09:00, subject to check), FOTOIMPEX (Mon–Sat 11:00–19:00), Otto Weidt (<strong>weekdays 09:00–18:00, weekends 10:00–18:00</strong>), Ständige Vertretung (<strong>daily 11:00–01:00</strong>) and the <strong>BER → Potsdamer Platz FEX/RE20 + U2 routing is subject to a live timetable check</strong> (ABC ticket, paper ticket validated before boarding).<br>
      • <strong>Route honesty:</strong> the dashed line follows the numbered stops of that day, including the <strong>unnumbered ↩ return waypoints</strong> for the Thursday check-in/rest and the conditional Sunday bag run. Flexible lunches and the Thursday rest are unpinned, so the line skips them; optional/backup pins are shown per day but never join the line or the day's Google directions. <strong>Timings are approximate and every block is subject to transport and opening-hour variation.</strong><br>
      • <strong>Media honesty (REQ-09 media gap):</strong> several places added or re-pinned in this revision have <strong>no verified photograph</strong>. Their map popups deliberately show <strong>no image</strong> rather than a stand-in picture that would misrepresent the venue.<br>
      • <strong>Deliberately absent:</strong> the old Prenzlauer Berg Sunday afternoon wander, Mampe/BRLO on Thursday, Domke/East Side on Friday, a second restaurant after Domke, Hamy as a scheduled meal, and every closed-Sunday shop. The <strong>Polish-grocery priority (Mały Książę)</strong> remains <strong>pending with no assigned day</strong>.
    </div>
  </section>
`;

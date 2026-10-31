// Modular Master Bookings, Confirmation Wallet, Interactive Packing Checklist & Laundromat Guide
export const MunichBookingsAndPackingSection = `  <!-- SECTION: MASTER BOOKINGS & CONFIRMATION WALLET (4–20 NOV 2026) -->
  <section id="sec-bookings" class="section-panel">
    <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:0.75rem; margin-bottom:0.85rem;">
      <div>
        <h2 style="margin-bottom:0.25rem;">📋 Master Bookings &amp; Confirmation Wallet (Wed 4 Nov – Fri 20 Nov 2026)</h2>
        <p style="color:var(--muted); font-size:0.92rem;">All 12 confirmed flights, apartments, hotels, sleeper/high-speed trains, restaurant reservations &amp; timed tickets in chronological order. Click any confirmation code to copy it to your clipboard.</p>
      </div>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <button class="sub-btn active" data-booking-filter="all">All Bookings (12)</button>
        <button class="sub-btn" data-booking-filter="flight">✈️ Flights (2)</button>
        <button class="sub-btn" data-booking-filter="hotel">🏨 Hotels &amp; Airbnbs (5)</button>
        <button class="sub-btn" data-booking-filter="train">🚆 Trains (2)</button>
        <button class="sub-btn" data-booking-filter="activity">🍷 Dining &amp; Tours (3)</button>
      </div>
    </div>

    <div class="alert-banner" style="margin-bottom:1.25rem;">
      <strong>⚠️ ACTION REQUIRED — OVERLAPPING MUNICH HOTEL BOOKINGS (13–19 NOV 2026):</strong><br>
      You currently hold <strong>two active hotel reservations</strong> for the exact same 6 nights in Munich (Fri 13 Nov – Thu 19 Nov 2026):<br>
      • <strong>Option 1 — Bob W Munich City Centre</strong> (<code>Schwanthalerstr. 61, 80336 München</code> · Booking #<code>5210364141</code>): 4 mins walk south of München Hbf; frictionless 24/7 online check-in form &amp; digital door code (zero stress if TGV 9577 is delayed past 22:30).<br>
      • <strong>Option 2 — Timehouse Serviced Apartments</strong> (<code>Leopoldstraße 204a, 80804 München-Schwabing</code> · Booking #<code>6724144172</code>): Spacious Schwabing apartment with full designer kitchen, in-building laundry room, and 6-min walk to the 25-min Lufthansa Express Bus to MUC. Reception closes at <strong>22:30</strong>; you requested late check-in and they instructed you to <strong>message their WhatsApp on arrival</strong>.<br>
      👉 <em>Check your Booking.com free-cancellation deadline and cancel whichever backup option you decide not to use!</em>
    </div>

    <div class="booking-grid">
      <div class="booking-card flight" data-booking-card="flight">
        <div class="badge-row">
          <span class="badge">Wed 4 – Thu 5 Nov 2026</span>
          <span class="badge success">2 Passengers Confirmed</span>
        </div>
        <h4>1. Outbound Flights: Hong Kong (HKG) → Abu Dhabi (AUH) → Berlin (BER)</h4>
        <p>
          • <strong>Leg 1 (Wed 4 Nov):</strong> <strong>Etihad Airways EY 871</strong> · Departs HKG <strong>19:35</strong> → Arrives AUH <strong>00:25</strong> (Thu 5 Nov).<br>
          • <strong>Transit at AUH:</strong> 1 hr 55 mins connection.<br>
          • <strong>Leg 2 (Thu 5 Nov):</strong> <strong>Condor DE 2553</strong> · Departs AUH <strong>02:20</strong> → Arrives Berlin Brandenburg (BER) <strong>06:20 AM</strong>.
        </p>
        <div style="margin-top:auto; padding-top:0.45rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.8rem; color:var(--muted);">PNR / Booking Ref:</span>
          <button type="button" class="copy-code-btn" data-copy="7AK639" title="Click to copy Booking Reference">📋 7AK639</button>
        </div>
      </div>

      <div class="booking-card hotel" data-booking-card="hotel">
        <div class="badge-row">
          <span class="badge success">Thu 5 – Sun 8 Nov 2026 (3 Nights)</span>
          <span class="badge">Berlin-Mitte Base</span>
        </div>
        <h4>2. Berlin Accommodation: Karlito Apartmenthaus</h4>
        <p>
          • <strong>Address:</strong> <code>Linienstraße 60, 10119 Berlin-Mitte</code> (U2 <em>Rosa-Luxemburg-Platz</em>).<br>
          • <strong>Unit:</strong> Family Apartment with Balcony.<br>
          • <strong>Check-in:</strong> Thu 5 Nov (<strong>14:00 – 23:00</strong>; early bag drop at 07:45 AM after 06:20 BER arrival).<br>
          • <strong>Check-out:</strong> Sun 8 Nov (<strong>08:00 – 10:00</strong>).
        </p>
        <div style="margin-top:auto; padding-top:0.45rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.8rem; color:var(--muted);">Booking Number:</span>
          <button type="button" class="copy-code-btn" data-copy="5126078467" title="Click to copy Booking Number">📋 5126078467</button>
        </div>
      </div>

      <div class="booking-card activity" data-booking-card="activity">
        <div class="badge-row">
          <span class="badge gold">Fri 6 Nov 2026 · 18:30</span>
          <span class="badge success">Table Confirmed (2 Pax)</span>
        </div>
        <h4>3. Berlin Dinner Reservation: Yorckschlösschen</h4>
        <p>
          • <strong>Address:</strong> <code>Yorckstraße 15, 10965 Berlin-Kreuzberg</code> (S1/S2/S25/S26/U7 <em>Yorckstraße</em>).<br>
          • <strong>Details:</strong> Confirmed dinner table for <strong>2 people at 18:30</strong> on Friday, 6 November 2026.<br>
          • <strong>Route Fit:</strong> Head straight here on the S-Bahn (~20 mins) after your 16:30 afternoon hot-counter tasting at <strong>#14 Fleischerei Domke</strong>!
        </p>
        <div style="margin-top:auto; padding-top:0.45rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.8rem; color:var(--muted);">Reservation Time:</span>
          <button type="button" class="copy-code-btn" data-copy="Yorckschlösschen, Yorckstraße 15, 10965 Berlin (Fri 6 Nov 18:30, 2 Pax)">📋 Fri 6 Nov · 18:30 (2 Pax)</button>
        </div>
      </div>

      <div class="booking-card train" data-booking-card="train">
        <div class="badge-row">
          <span class="badge">Sun 8 Nov → Mon 9 Nov 2026</span>
          <span class="badge success">Overnight Sleeper (2 Pax)</span>
        </div>
        <h4>4. Overnight Sleeper Train: ÖBB Nightjet NJ 408 (Berlin → Freiburg)</h4>
        <p>
          • <strong>Route:</strong> <strong>Berlin Hbf (Tiefgeschoß / Track 3, dep. 20:52)</strong> → <strong>Freiburg(Breisgau) Hbf (arr. 06:17 AM Mon 9 Nov)</strong>.<br>
          • <strong>Accommodation:</strong> Coach 309, Berths 52 &amp; 56 (Double Deluxe Sleeper Cabin with private shower/WC &amp; breakfast).<br>
          • <strong>Packing Note:</strong> Carry printed A4 PDF ticket + keep overnight washbag/pajamas in your top backpack!
        </p>
        <div style="margin-top:auto; padding-top:0.45rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.8rem; color:var(--muted);">ÖBB Booking Code:</span>
          <button type="button" class="copy-code-btn" data-copy="0698 9390 6002 7647" title="Click to copy ÖBB Code">📋 0698 9390 6002 7647</button>
        </div>
      </div>

      <div class="booking-card hotel" data-booking-card="hotel">
        <div class="badge-row">
          <span class="badge success">Mon 9 – Thu 12 Nov 2026 (3 Nights)</span>
          <span class="badge">Freiburg Base</span>
        </div>
        <h4>5. Freiburg Airbnb: Schlossbergblick 1-Zimmer Dachgeschoss Apartment</h4>
        <p>
          • <strong>Hosts:</strong> Mario &amp; Nadine · Entire home for 2 adults.<br>
          • <strong>Location:</strong> <code>Mathildenstraße 14, 79106 Freiburg im Breisgau (Stühlinger)</code> — 6 mins walk from Freiburg Hbf!<br>
          • <strong>Check-in:</strong> Mon 9 Nov (After <strong>15:00</strong>; early luggage drop confirmed at <strong>06:35 AM</strong> right off the Nightjet!).<br>
          • <strong>Check-out:</strong> Thu 12 Nov (By <strong>12:00 PM</strong>).
        </p>
        <div style="margin-top:auto; padding-top:0.45rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.8rem; color:var(--muted);">Airbnb Confirmation Code:</span>
          <button type="button" class="copy-code-btn" data-copy="HMKTPHQE4H" title="Click to copy Airbnb Code">📋 HMKTPHQE4H</button>
        </div>
      </div>

      <div class="booking-card hotel" data-booking-card="hotel">
        <div class="badge-row">
          <span class="badge gold">Thu 12 – Fri 13 Nov 2026 (1 Night)</span>
          <span class="badge">Colmar Old Town Base</span>
        </div>
        <h4>6. Colmar Hotel: Logis Hôtel Saint-Martin</h4>
        <p>
          • <strong>Address:</strong> <code>38, Grand'Rue, 68000 Colmar, France</code> (Heart of Old Town &amp; Petite Venise).<br>
          • <strong>Room:</strong> Superior Double or Twin Room.<br>
          • <strong>Check-in:</strong> Thu 12 Nov (<strong>15:00 – 00:00</strong>).<br>
          • <strong>Check-out:</strong> Fri 13 Nov (<strong>01:00 – 11:00</strong>; leave bags at reception during your 10:00 AM Turckheim wine tour).
        </p>
        <div style="margin-top:auto; padding-top:0.45rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.8rem; color:var(--muted);">Booking Number:</span>
          <button type="button" class="copy-code-btn" data-copy="6935982825" title="Click to copy Booking Number">📋 6935982825</button>
        </div>
      </div>

      <div class="booking-card activity" data-booking-card="activity">
        <div class="badge-row">
          <span class="badge gold">Fri 13 Nov 2026 · 10:00 AM</span>
          <span class="badge success">Shifted from Nov 12 → Nov 13</span>
        </div>
        <h4>7. Alsace Wine Tour: Biodynamic Tasting at Domaine François Baur</h4>
        <p>
          • <strong>Address:</strong> <code>3 Grand'Rue, 68230 Turckheim, France</code> (100m inside medieval <em>Porte de Munster</em>).<br>
          • <strong>Details:</strong> Rebooked/shifted from Nov 12 to <strong>Friday, 13 Nov 2026 at 10:00 AM</strong> for 2 adults (€24.00 via Winalist).<br>
          • <strong>Timing:</strong> 10:00–11:30 AM tasting → optional 11:40 Cave de Turckheim → lunch in Colmar → 16:45 TGV.
        </p>
        <div style="margin-top:auto; padding-top:0.45rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.8rem; color:var(--muted);">Winalist Ref:</span>
          <button type="button" class="copy-code-btn" data-copy="815D4A45A0E85F6C" title="Click to copy Winalist Reference">📋 815D4A45A0E85F6C</button>
        </div>
      </div>

      <div class="booking-card train" data-booking-card="train">
        <div class="badge-row">
          <span class="badge">Fri 13 Nov 2026 · 16:45–21:46</span>
          <span class="badge success">1st Class · 2 Pax</span>
        </div>
        <h4>8. High-Speed Rail: SNCF Connect TGV INOUI (Colmar → Strasbourg → Munich)</h4>
        <p>
          • <strong>Leg 1 (16:45 – 17:12):</strong> <strong>TGV INOUI 2362</strong> Colmar → Strasbourg (1st Class, Coach 13, Seats 308 &amp; 307).<br>
          • <strong>Transfer:</strong> 34 mins at Strasbourg Gare Centrale.<br>
          • <strong>Leg 2 (17:46 – 21:46):</strong> <strong>TGV INOUI 9577</strong> Strasbourg → München Hbf (1st Class, Coach 13 Lower Deck, Seats 304 &amp; 305).<br>
          • <strong>Mandatory Rule:</strong> Attach physical SNCF name/phone luggage tags to every bag!
        </p>
        <div style="margin-top:auto; padding-top:0.45rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.8rem; color:var(--muted);">SNCF Folder Reference:</span>
          <button type="button" class="copy-code-btn" data-copy="NZM3KL" title="Click to copy SNCF Reference">📋 NZM3KL</button>
        </div>
      </div>

      <div class="booking-card conflict" data-booking-card="hotel">
        <div class="badge-row">
          <span class="badge danger">Overlap Option 1 · 13–19 Nov</span>
          <span class="badge">Near München Hbf</span>
        </div>
        <h4>9A. Munich Hotel Option 1: Bob W Munich City Centre</h4>
        <p>
          • <strong>Address:</strong> <code>Schwanthalerstr. 61, 80336 München</code> (4 mins walk south of München Hbf).<br>
          • <strong>Check-in:</strong> From <strong>15:00</strong> via online check-in form &amp; 24/7 digital door code.<br>
          • <strong>Pros/Cons:</strong> Zero 22:30 reception cutoff stress after your 21:46 TGV arrival, right at Hbf; more compact studio than Timehouse Schwabing.
        </p>
        <div style="margin-top:auto; padding-top:0.45rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.8rem; color:var(--muted);">Booking Number:</span>
          <button type="button" class="copy-code-btn" data-copy="5210364141" title="Click to copy Bob W Booking Number">📋 5210364141</button>
        </div>
      </div>

      <div class="booking-card conflict" data-booking-card="hotel">
        <div class="badge-row">
          <span class="badge danger">Overlap Option 2 · 13–19 Nov</span>
          <span class="badge success">Late Check-in Requested</span>
        </div>
        <h4>9B. Munich Hotel Option 2: Timehouse Serviced Apartments (Schwabing)</h4>
        <p>
          • <strong>Address:</strong> <code>Leopoldstraße 204a, 80804 München</code> (U6 <em>Nordfriedhof</em> / <em>Alte Heide</em>).<br>
          • <strong>Check-in:</strong> <strong>15:00 – 22:30</strong>. <strong>Late Check-In Protocol:</strong> You requested late check-in and Timehouse asked you to <strong>message their WhatsApp on arrival</strong> (plus 24/7 Keybox backup).<br>
          • <strong>Pros:</strong> Full designer kitchen, basement laundry room, and 6 mins walk to the 25-min Lufthansa Express Bus to MUC!
        </p>
        <div style="margin-top:auto; padding-top:0.45rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.8rem; color:var(--muted);">Booking Number:</span>
          <button type="button" class="copy-code-btn" data-copy="6724144172" title="Click to copy Timehouse Booking Number">📋 6724144172</button>
        </div>
      </div>

      <div class="booking-card activity" data-booking-card="activity">
        <div class="badge-row">
          <span class="badge success">Sun 15 Nov 2026 · 14:15 Tour</span>
          <span class="badge danger">Courtyard 15 Mins Prior (14:00!)</span>
        </div>
        <h4>10. Neuschwanstein Castle Tour #475 (Ticket Center Hohenschwangau)</h4>
        <p>
          • <strong>Tour Time &amp; Number:</strong> <strong>14:15 · Tour Number 475</strong> (Sunday, 15 November 2026).<br>
          • <strong>Mandatory Rule:</strong> You <strong>must be in the castle courtyard 15 minutes prior (by 14:00 sharp)</strong>.<br>
          • <strong>Pacing:</strong> Arrive Hohenschwangau ~10:15 via Bayern-Ticket (€44 for 2), stroll Alpsee &amp; lunch, then begin walking up (~40 mins) or taking the shuttle bus/carriage by <strong>12:45–13:00</strong>.
        </p>
        <div style="margin-top:auto; padding-top:0.45rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.8rem; color:var(--muted);">Invoice / Tour #475:</span>
          <button type="button" class="copy-code-btn" data-copy="39901.1056944" title="Click to copy Invoice Number">📋 39901.1056944 (Tour #475)</button>
        </div>
      </div>

      <div class="booking-card flight" data-booking-card="flight">
        <div class="badge-row">
          <span class="badge danger">Thu 19 – Fri 20 Nov 2026</span>
          <span class="badge success">2 Passengers Confirmed</span>
        </div>
        <h4>11. Return Flights: Munich (MUC) → Abu Dhabi (AUH) → Hong Kong (HKG)</h4>
        <p>
          • <strong>Leg 1 (Thu 19 Nov):</strong> <strong>Etihad Airways EY 126</strong> · Departs Munich (MUC) at <strong>10:30 AM</strong> (10:00 AM boarding) → Arrives Abu Dhabi (AUH) at <strong>19:30</strong>.<br>
          • <strong>Transit at AUH:</strong> 1 hr 45 mins connection.<br>
          • <strong>Leg 2 (Thu 19 – Fri 20 Nov):</strong> <strong>Etihad Airways EY 870</strong> · Departs AUH at <strong>21:15</strong> → Arrives HKG at <strong>08:30 AM on Friday, 20 Nov 2026</strong>.
        </p>
        <div style="margin-top:auto; padding-top:0.45rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
          <span style="font-size:0.8rem; color:var(--muted);">PNR / Booking Ref:</span>
          <button type="button" class="copy-code-btn" data-copy="7AK639" title="Click to copy Booking Reference">📋 7AK639</button>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION: INTERACTIVE PACKING CHECKLIST & 3-STOP LAUNDROMAT STRATEGY -->
  <section id="sec-packing" class="section-panel">
    <h2 style="margin-bottom:0.4rem;">🧳 Interactive Germany &amp; Alsace Packing Checklist + 3-Wash Laundromat Strategy</h2>
    <p style="margin-bottom:1rem; color:var(--muted);">
      Designed for <strong>16 days away from Hong Kong (4–20 Nov 2026, 0°C–8°C outdoors vs 22°C heated trains/beer halls)</strong> using a <strong>5-to-6-day thermal capsule wardrobe</strong> washed 2–3 times along the route. Your checkmarks save automatically in your browser (<code>localStorage</code>) on your phone or laptop!
    </p>

    <div class="pack-dashboard">
      <div class="pack-progress-wrap">
        <div style="display:flex; justify-content:space-between; align-items:baseline; gap:0.5rem;">
          <strong style="font-size:1.05rem;">Packing Progress: <span id="pack-count-text">0 / 0</span> Items Packed (<span id="pack-pct-text">0%</span>)</strong>
          <span style="font-size:0.8rem; color:#d8e6f2;">Auto-saved to this device</span>
        </div>
        <div class="pack-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="pack-progressbar">
          <div class="pack-progress-fill" id="pack-progress-fill"></div>
        </div>
        <p style="font-size:0.82rem; color:#d8e6f2;">Tip: Filter by category below, or use "Hide Checked Items" on packing night to see only what's left.</p>
      </div>
      <div class="pack-controls">
        <button type="button" class="pack-btn" id="pack-toggle-unchecked">👁️ Hide Checked Items</button>
        <button type="button" class="pack-btn" id="pack-check-all">✅ Check All</button>
        <button type="button" class="pack-btn" id="pack-reset-all">🔄 Reset All</button>
        <button type="button" class="pack-btn" onclick="window.print()">🖨️ Print Checklist</button>
      </div>
    </div>

    <div class="filter-bar" style="margin-bottom:1.15rem;">
      <button class="sub-btn active" data-pack-filter="all">All 7 Categories</button>
      <button class="sub-btn" data-pack-filter="docs">1. Docs, Tickets &amp; Cash</button>
      <button class="sub-btn" data-pack-filter="clothing">2. 5-Day Thermal Capsule &amp; Laundry</button>
      <button class="sub-btn" data-pack-filter="footwear">3. Footwear, Bathhouse &amp; Weather</button>
      <button class="sub-btn" data-pack-filter="rail">4. Nightjet Sleeper &amp; TGV Bag Prep</button>
      <button class="sub-btn" data-pack-filter="camera">5. Analog Cameras, Film &amp; Power</button>
      <button class="sub-btn" data-pack-filter="shopping">6. Wine, Spirits &amp; VAT Refund</button>
      <button class="sub-btn" data-pack-filter="toiletry">7. Winter Skincare &amp; First-Aid</button>
    </div>

    <div class="grid-2" id="packing-grid" style="margin-bottom:1.6rem;">
      <!-- Category 1: Docs, Tickets & Cash -->
      <div class="pack-cat-card" data-pack-cat="docs">
        <div class="pack-cat-header">
          <h3>🛂 1. Passports, Printed Tickets, Pens &amp; Cash</h3>
          <span class="badge">Critical Carry-On</span>
        </div>
        <ul class="pack-list">
          <li class="pack-item"><input type="checkbox" data-pack-id="doc-1"><div class="pack-label"><span class="pack-label-title">HK SAR / BNO Passports (valid &gt;6 months) + 2 physical copies</span><span class="pack-label-sub">Required for hotel check-ins, cross-border TGV checks (Colmar/Strasbourg → Munich), Bayern-Ticket ID checks, and VAT tax-free forms.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="doc-2"><div class="pack-label"><span class="pack-label-title">Printed A4 PDF of ÖBB Nightjet NJ 408 Ticket (Code: 0698 9390 6002 7647)</span><span class="pack-label-sub">Sun 8 Nov (20:52 Berlin Hbf Tiefgeschoß → 06:17 Freiburg Hbf). Sleeper attendants collect/verify paper tickets at boarding for breakfast &amp; wake-up service.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="doc-3"><div class="pack-label"><span class="pack-label-title">Printed SNCF TGV e-Tickets (Ref: NZM3KL) + Neuschwanstein Tour #475 Invoice (39901.1056944)</span><span class="pack-label-sub">Fri 13 Nov TGV 2362/9577 (Coach 13) + Sun 15 Nov 14:15 Neuschwanstein voucher (collect physical tickets at Hohenschwangau Ticket Center).</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="doc-4"><div class="pack-label"><span class="pack-label-title">2 Non-Erasable Blue/Black Ballpoint Pens (Kugelschreiber) in Daypack</span><span class="pack-label-sub">MANDATORY for writing both passenger names (Tak Hin Lee &amp; Yun Yu Tang) in ink on your paper Bayern-Ticket on Sun 15 Nov to avoid a €60 fine!</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="doc-5"><div class="pack-label"><span class="pack-label-title">€250–€350 Cash in Small Notes (€5, €10, €20) + Coin Pouch for €0.50 / €1 / €2 Coins</span><span class="pack-label-sub">Essential for Fleischerei Domke, Café Frischhut, Mauerpark Flohmarkt, Residenz Christmas Village Pfand (€5 mug deposit), Sanifair toilets (€1), and coin laundromats.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="doc-6"><div class="pack-label"><span class="pack-label-title">Physical Visa / Mastercard with 4-Digit PIN + Apple Pay + Travel Insurance PDF</span><span class="pack-label-sub">German ticket machines (DB/MVV) often require a physical chip-and-PIN card rather than contactless phone tap.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="doc-7"><div class="pack-label"><span class="pack-label-title">Pre-Installed Apps: DB Navigator, MVGO (Munich), BVG Fahrinfo (Berlin), SNCF Connect &amp; WhatsApp</span><span class="pack-label-sub">WhatsApp is needed on Fri 13 Nov evening to message Timehouse Munich (Booking #6724144172) upon arrival at 21:46.</span></div></li>
        </ul>
      </div>

      <!-- Category 2: 5-Day Thermal Capsule & Laundry Kit -->
      <div class="pack-cat-card" data-pack-cat="clothing">
        <div class="pack-cat-header">
          <h3>🧥 2. 5-to-6-Day Thermal Capsule &amp; Laundry Kit</h3>
          <span class="badge gold">Wash 2–3× Strategy</span>
        </div>
        <ul class="pack-list">
          <li class="pack-item"><input type="checkbox" data-pack-id="clo-1"><div class="pack-label"><span class="pack-label-title">4–5× Merino Wool or Uniqlo Heattech Base-Layer Tops + 2× Thermal Leggings/Tights (Per Person)</span><span class="pack-label-sub">Mid-November is 0°C–8°C with windchill at Dachau Appellplatz, Neuschwanstein gorge &amp; Berlin Wall Memorial, while beer halls/trains are heated to 22°C. Peelable layers are key!</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="clo-2"><div class="pack-label"><span class="pack-label-title">2–3× Mid-Layers (Fleece Zip-Up / Merino Sweater / Cardigan) + 3× Long-Sleeve Shirts</span><span class="pack-label-sub">Easy to take off inside warm wooden-barrel Wirtshäuser (Augustiner, Yorckschlösschen, Feierling) without overheating in a single heavy sweater.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="clo-3"><div class="pack-label"><span class="pack-label-title">1× Windproof &amp; Waterproof Outer Shell Jacket + 1× Packable Down/Puffer Jacket</span><span class="pack-label-sub">Layering a packable down jacket under a waterproof Gore-Tex/rain shell beats carrying one bulky winter parka through 4 train transfers.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="clo-4"><div class="pack-label"><span class="pack-label-title">3× Pairs of Trousers/Jeans (Include 1× Wind/Water-Resistant Lined Pants for Alps &amp; Titisee)</span><span class="pack-label-sub">Jeans stay cold when damp; wear thermal leggings underneath on Sun 15 Nov (Neuschwanstein) and Wed 11 Nov (Lake Titisee).</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="clo-5"><div class="pack-label"><span class="pack-label-title">6× Pairs of Warm Merino Wool Crew Socks + 6× Quick-Dry Underwear (Per Person)</span><span class="pack-label-sub">6 days of socks/underwear comfortably bridges Berlin (Days 1–4) to your first Freiburg laundromat wash on Mon 9 / Tue 10 Nov!</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="clo-6"><div class="pack-label"><span class="pack-label-title">Touchscreen-Friendly Warm Gloves (Thin Liner Gloves!) + Knit Beanie + Scarf/Neck Gaiter</span><span class="pack-label-sub">Thin merino/touchscreen liner gloves let you operate Leica/analog camera dials and shutter buttons in 2°C cold without freezing your fingers.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="clo-7"><div class="pack-label"><span class="pack-label-title">Laundry Kit: 8–10 Paper Laundry Detergent Sheets + Foldable Nylon Laundry Bag + 1 Delicates Mesh Bag</span><span class="pack-label-sub">Paper detergent sheets weigh zero grams, never leak in flights, and work in Timehouse's laundry room, Freiburg laundromats, or quick sink washes.</span></div></li>
        </ul>
      </div>

      <!-- Category 3: Footwear, Bathhouse & Weather -->
      <div class="pack-cat-card" data-pack-cat="footwear">
        <div class="pack-cat-header">
          <h3>🥾 3. Footwear, Baden-Baden Bathhouse &amp; Rain Gear</h3>
          <span class="badge">Cobblestones &amp; Spa</span>
        </div>
        <ul class="pack-list">
          <li class="pack-item"><input type="checkbox" data-pack-id="foot-1"><div class="pack-label"><span class="pack-label-title">2 Pairs of Broken-In Waterproof Walking Shoes/Boots (Wear Bulkier Pair on Plane!)</span><span class="pack-label-sub">You will walk 12,000–18,000 steps/day on wet cobblestones and uphill to Neuschwanstein Castle (40-min incline). Alternating 2 pairs prevents blisters and lets damp shoes dry.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="foot-2"><div class="pack-label"><span class="pack-label-title">1 Pair of Ultralight Waterproof Flip-Flops / EVA Slides (For Hotel Rooms, Nightjet &amp; Spa)</span><span class="pack-label-sub">German hotels/apartments (Karlito, Freiburg Airbnb, Saint-Martin, Timehouse) rarely provide disposable slippers; also essential for the Nightjet sleeper floor and spa poolside.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="foot-3"><div class="pack-label"><span class="pack-label-title">1× Swimsuit / Swim Trunks + Small Microfiber Quick-Dry Towel</span><span class="pack-label-sub">Note: Baden-Baden's <strong>#06 Friedrichsbad</strong> (Tue 10 Nov) is a traditional textile-free Roman-Irish bath that provides all bath sheets/towels &amp; soap free of charge, but bring swimwear if you also visit <em>Caracalla Therme</em> or Titisee's <em>Badeparadies Schwarzwald</em>!</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="foot-4"><div class="pack-label"><span class="pack-label-title">2× Sturdy Windproof Compact Umbrellas</span><span class="pack-label-sub">November drizzle and gusty squalls are common in Berlin and the Black Forest.</span></div></li>
        </ul>
      </div>

      <!-- Category 4: Nightjet Sleeper & TGV Luggage Prep -->
      <div class="pack-cat-card" data-pack-cat="rail">
        <div class="pack-cat-header">
          <h3>🚆 4. Nightjet Sleeper Pouch &amp; SNCF TGV Luggage Rules</h3>
          <span class="badge">4 Rail Transfers</span>
        </div>
        <ul class="pack-list">
          <li class="pack-item"><input type="checkbox" data-pack-id="rail-1"><div class="pack-label"><span class="pack-label-title">Dedicated "Nightjet Overnight Pouch" Packed on Top of Backpack (For Sun 8 Nov Sleeper)</span><span class="pack-label-sub">In your Double Deluxe cabin (Coach 309, Berths 52/56), large suitcases slide under the bottom bunk/recess. Keep 1 change of clothes, pajamas, toothbrush, deodorant &amp; USB-C cable in a small pouch so you never open big suitcases in the narrow corridor!</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="rail-2"><div class="pack-label"><span class="pack-label-title">4× Physical SNCF-Compliant Luggage Tags Attached to Every Suitcase &amp; Daypack</span><span class="pack-label-sub">French law on TGV INOUI 2362 &amp; 9577 (Fri 13 Nov Colmar → Strasbourg → Munich) strictly requires visible physical tags with First/Last Name &amp; Phone (+852) on ALL bags.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="rail-3"><div class="pack-label"><span class="pack-label-title">Compact 15L–20L Daypack (Must NOT Be a Bulky Hiking Rucksack for Neuschwanstein!)</span><span class="pack-label-sub">Neuschwanstein Castle strictly prohibits backpacks/rucksacks larger than 40×40×20 cm inside Tour #475. Bring a sleek packable daypack or crossbody camera bag.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="rail-4"><div class="pack-label"><span class="pack-label-title">Apple AirTags / Smart Trackers Inside Checked Suitcases + Retractable Cable Luggage Lock</span><span class="pack-label-sub">Peace of mind for the HKG–AUH–BER (Etihad/Condor) and MUC–AUH–HKG baggage transfers plus securing suitcases on TGV lower-deck luggage racks.</span></div></li>
        </ul>
      </div>

      <!-- Category 5: Analog Cameras, Film & Power -->
      <div class="pack-cat-card" data-pack-cat="camera">
        <div class="pack-cat-header">
          <h3>📷 5. Analog Cameras, Film CT-Scanner Prep &amp; EU Power</h3>
          <span class="badge success">Film Safe</span>
        </div>
        <ul class="pack-list">
          <li class="pack-item"><input type="checkbox" data-pack-id="cam-1"><div class="pack-label"><span class="pack-label-title">Clear Resealable Ziploc Bags Labeled "35mm/120 Film — Do Not X-Ray / Hand Check Please (Bitte Handkontrolle)"</span><span class="pack-label-sub">HKG, AUH, BER &amp; MUC airports increasingly use <strong>CT carry-on scanners</strong> that permanently fog unexposed AND exposed analog film in a single pass! Never put film in checked luggage; hand-carry in a clear bag and politely request a hand-check (or buy fresh film at #04 FOTOIMPEX &amp; #05 Safelight on Fri 6 Nov).</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="cam-2"><div class="pack-label"><span class="pack-label-title">3–4× Extra Camera Batteries + LR44 / CR1/3N / CR2 Meter Cells (Keep in Inner Coat Pocket!)</span><span class="pack-label-sub">Sub-5°C November weather drains lithium and silver-oxide camera batteries 40%–50% faster. Keep spare batteries warm against your body.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="cam-3"><div class="pack-label"><span class="pack-label-title">Lens Microfiber Cloths + Rocket Air Blower + 1× Ziploc Bag for Cold-to-Warm Condensation</span><span class="pack-label-sub">Stepping from 2°C outdoor air into a humid 22°C Bavarian beer hall or Friedrichsbad lobby instantly fogs cold Leica/vintage brass lenses—seal the camera in your bag for 15 mins to warm up gradually.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="cam-4"><div class="pack-label"><span class="pack-label-title">2–3× EU Type C / Type F (Schuko Round 2-Pin) Plug Adapters + 1× Multi-Port GaN USB-C Charger</span><span class="pack-label-sub">Hong Kong uses UK 3-pin Type G plugs; Germany &amp; France (Colmar) use recessed round 2-pin Type C/F sockets (same 230V/50Hz voltage as HK—no transformer needed).</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="cam-5"><div class="pack-label"><span class="pack-label-title">1–2× 10,000–20,000 mAh Power Banks (&lt;100Wh, Carry-On Only!)</span><span class="pack-label-sub">With 16:30 sunset, cold weather, live Google Maps navigation, and digital rail tickets, phone batteries drain fast on 12-hour sightseeing days.</span></div></li>
        </ul>
      </div>

      <!-- Category 6: Wine, Spirits & VAT Tax-Refund Prep -->
      <div class="pack-cat-card" data-pack-cat="shopping">
        <div class="pack-cat-header">
          <h3>🍷 6. Wine/Spirits Bottle Protection &amp; HK Duty-Free Rules</h3>
          <span class="badge gold">Mampe · Zibärtle · Wine</span>
        </div>
        <ul class="pack-list">
          <li class="pack-item"><input type="checkbox" data-pack-id="shop-1"><div class="pack-label"><span class="pack-label-title">4–6× Inflatable Wine Bottle Protector Sleeves ("Wine Skins") + Heavy Ziploc Bags</span><span class="pack-label-sub">You are visiting <strong>#48 Mampe Berlin</strong> (Halb &amp; Halb schnaps), <strong>#49 Dr. Kochan</strong>, <strong>#09 Freiburgs Finest</strong> (Zibärtle plum spirit), <strong>#42 Domaine François Baur</strong> (Alsace Riesling), and <strong>Feinkost Olé / GARIBALDI</strong>! All bottles &gt;100ml MUST be checked in your suitcase for the MUC→AUH→HKG flights.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="shop-2"><div class="pack-label"><span class="pack-label-title">Know Hong Kong Customs Duty-Free Liquor vs. Wine Rules (2 Adults)</span><span class="pack-label-sub">• <strong>Wine &amp; Beer (&le;30% ABV):</strong> <strong>0% Duty in Hong Kong!</strong> You can bring back Alsace Riesling, Crémant &amp; Franken Silvaner duty-free.<br>• <strong>Hard Liquor / Spirits (&gt;30% ABV, e.g., Zibärtle ~42% or Mampe ~31%–40%):</strong> HK Customs allows <strong>1 liter per adult passenger (2L total for the two of you)</strong> duty-free!</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="shop-3"><div class="pack-label"><span class="pack-label-title">1× Packable Zippered Duffle Bag + 2× Foldable Reusable Totebags</span><span class="pack-label-sub">German supermarkets (REWE, EDEKA) charge for bags, and if your suitcases fill up with vintage cameras, antiques &amp; wine bottles, you can check your hard suitcases and carry clothes onto Etihad in the foldable duffle.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="shop-4"><div class="pack-label"><span class="pack-label-title">Dedicated Folder for Global Blue / Planet VAT Tax-Refund Forms (Min. €50.01 per Receipt in Germany)</span><span class="pack-label-sub">When buying cameras/lenses (Foto-Meyer, Leica, Calumet, Foto Dinkel) or wine &gt;€50.01, ask for a <strong>Tax-Free Form</strong>. At MUC Airport on Thu 19 Nov morning (07:20 AM), get the <strong>Zoll (Customs) stamp BEFORE checking in suitcases</strong> containing those items!</span></div></li>
        </ul>
      </div>

      <!-- Category 7: Winter Skincare, Meds & Toiletries -->
      <div class="pack-cat-card" data-pack-cat="toiletry">
        <div class="pack-cat-header">
          <h3>🧴 7. Dry-Heated Winter Skincare, Toiletries &amp; Meds</h3>
          <span class="badge">HK Humidity → Dry 2°C</span>
        </div>
        <ul class="pack-list">
          <li class="pack-item"><input type="checkbox" data-pack-id="med-1"><div class="pack-label"><span class="pack-label-title">Heavy Lip Balm + Rich Hand Cream + Facial Moisturizer + Saline Nasal Spray</span><span class="pack-label-sub">Coming from Hong Kong's 75% humidity, German radiator-heated apartments and 2°C outdoor air cause chapped lips and dry nasal passages within 48 hours.</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="med-2"><div class="pack-label"><span class="pack-label-title">Toothbrushes, Toothpaste &amp; Deodorant in Easy-Access Toiletry Pouch</span><span class="pack-label-sub">European eco-regulations mean German/French hotels (including Logis Saint-Martin, Karlito &amp; Timehouse) do NOT provide disposable toothbrushes or toothpaste in rooms!</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="med-3"><div class="pack-label"><span class="pack-label-title">Digestive Enzymes / Pepcid / Po Chai Pills + Ibuprofen/Paracetamol + Blister Plasters (Compeed)</span><span class="pack-label-sub">Rich Bavarian pork knuckle (Schweinshaxe), Eisbein, Obatzda cheese, and beer are heavy on the stomach—and remember German pharmacies (<em>Apotheke</em>) are 100% closed on Sundays!</span></div></li>
          <li class="pack-item"><input type="checkbox" data-pack-id="med-4"><div class="pack-label"><span class="pack-label-title">Pocket Tissue Packs (Tempo) + Wet Wipes + Small Hand Sanitizer</span><span class="pack-label-sub">Essential for Christmas market street food, Mauerpark flea market browsing, and regional train restrooms.</span></div></li>
        </ul>
      </div>
    </div>

    <!-- VERIFIED 3-STOP LAUNDROMAT & WASHING GUIDE -->
    <h3 style="margin:1.4rem 0 0.6rem;">🧺 Verified 3-Stop Laundry Guide: Where &amp; How to Wash Across Berlin, Freiburg &amp; Munich</h3>
    <p style="margin-bottom:0.9rem;">
      Because you are travelling for 16 days across 4 cities without in-room washing machines in Berlin or Freiburg, here are the <strong>exact verified self-service laundromats (<em>SB-Waschsalon</em>) and apartment laundry facilities</strong> next to your bases—plus how German machines work:
    </p>

    <table class="fare-table">
      <thead>
        <tr>
          <th>Wash Window</th>
          <th>City &amp; Base</th>
          <th>Nearest Verified Laundromat / Facility</th>
          <th>Walking Distance, Hours &amp; Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="badge">Wash #1 (Optional · Day 3–4)</span><br><strong>Sat 7 or Sun 8 Nov</strong></td>
          <td><strong>Berlin-Mitte</strong><br>Karlito Apartmenthaus<br>(<code>Linienstraße 60</code>)</td>
          <td>
            <strong>Option A (Open Sundays!): Waschsalon Schleudertraum Mitte</strong> (<code>Memhardstraße 1, 10178 Berlin</code> — right by Alexanderplatz / Rosa-Luxemburg-Platz).<br>
            <strong>Option B: Waschsalon 115 GmbH</strong> (<code>Torstraße 115, 10119 Berlin</code>).
          </td>
          <td>
            • <strong>Walk:</strong> 4–7 mins from Karlito!<br>
            • <strong>Hours (Schleudertraum):</strong> <strong>Daily 06:00 – 22:00 (including Sunday 8 Nov before your 20:52 Nightjet!)</strong>.<br>
            • <strong>Price:</strong> 7kg wash <strong>€7.00</strong> / 8kg wash <strong>€8.50</strong> (<strong>detergent &amp; softener automatically included!</strong>). Commercial dryer: <strong>€2.00 per 10 mins</strong> (20–30 mins dries a full load).
          </td>
        </tr>
        <tr>
          <td><span class="badge success">Wash #2 (Best Mid-Trip Reset · Day 5–7)</span><br><strong>Mon 9, Tue 10 or Wed 11 Nov Evening</strong></td>
          <td><strong>Freiburg (Stühlinger)</strong><br>Schlossbergblick Airbnb<br>(<code>Mathildenstraße 14</code>)</td>
          <td>
            <strong>1) 30°grad SB Waschsalon Freiburg</strong> (<code>Lehener Straße 27, 79106 Freiburg-Stühlinger</code>).<br>
            <strong>2) Waschsalon Wasch &amp; Fun</strong> (<code>Egonstraße 25, 79106 Freiburg-Stühlinger</code>).
          </td>
          <td>
            • <strong>Walk:</strong> Both are in your exact <strong>Stühlinger</strong> neighborhood just <strong>4–5 minutes' walk (350m–450m) west of Mathildenstraße 14</strong>!<br>
            • <strong>Hours (30°grad Lehener Str. 27):</strong> <strong>Mon–Sat 06:00 – 23:00</strong> (Closed Sun). Modern Electrolux self-service washers &amp; high-speed dryers (~€5–€7 wash + €1.50–€2/10-min dry; ~60 mins total).
          </td>
        </tr>
        <tr>
          <td><span class="badge gold">Wash #3 (Final Reset · Day 10–13)</span><br><strong>Sun 15, Mon 16 or Tue 17 Nov Evening</strong></td>
          <td><strong>Munich</strong><br>Timehouse (<code>Leopoldstr. 204a</code>) or Bob W (<code>Schwanthalerstr. 61</code>)</td>
          <td>
            <strong>At Timehouse Munich:</strong> <strong>In-Building Guest Laundry Room (<em>Waschküche</em>)</strong> inside Leopoldstraße 204a (washers &amp; dryers on site!), backed up by <strong>SB Waschsalon München Schwabing</strong> (<code>Leopoldstraße 100</code>, U6 Giselastraße).<br>
            <strong>At Bob W Munich City Centre:</strong> <strong>Eco-Express Waschsalon</strong> (<code>Senefelderstraße / Goethestraße</code> area near Hbf).
          </td>
          <td>
            • <strong>Timehouse Advantage:</strong> You don't even have to leave the building—throw a load in the basement <em>Waschküche</em> after returning from Neuschwanstein or Dachau while relaxing in your apartment!<br>
            • <strong>Packable Backup:</strong> Use your packed paper detergent sheets and €1/€2 coins (or app/card payment at Timehouse).
          </td>
        </tr>
      </tbody>
    </table>

    <div class="grid-3" style="margin-top:1.15rem;">
      <div class="card">
        <div class="card-body">
          <div class="badge-row"><span class="badge">German Laundromat Rule #1</span></div>
          <h4>Temperature &amp; Cycle Decoder</h4>
          <p>
            • <strong>30°C / 40°C Pflegeleicht (Easy-Care / Synthetics) or Buntwäsche (Coloreds):</strong> Use this for 95% of your travel clothes (merino base layers, shirts, socks, jeans). Runs ~35–40 minutes.<br>
            • <strong>NEVER select 60°C or 90°C Kochwäsche (Boil Wash):</strong> It runs for 70+ minutes and will shrink wool/Heattech!
          </p>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="badge-row"><span class="badge gold">German Laundromat Rule #2</span></div>
          <h4>Central Payment Terminal (Kassenautomat)</h4>
          <p>
            In German <em>SB-Waschsalons</em>, you do <strong>not</strong> put coins into the washing machine door! Instead:<br>
            1) Load your clothes &amp; close the door firmly.<br>
            2) Note the <strong>Machine Number</strong> (e.g., <em>Maschine Nr. 4</em>).<br>
            3) Walk to the central wall payment box (<em>Kassenautomat</em>), press <strong>#4</strong>, insert coins/notes (€1, €2, €5, €10), and press Start on the machine.
          </p>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="badge-row"><span class="badge danger">German Laundromat Rule #3</span></div>
          <h4>Merino &amp; Heattech Drying Warning</h4>
          <p>
            Commercial gas dryers (<em>Trockner</em>) at German laundromats run hot. Put cotton socks, underwear, t-shirts, and jeans in the dryer on <strong>Schonend / Niedrige Temperatur (Low/Medium Heat)</strong> for 20 minutes, and hang your thin merino wool / Uniqlo Heattech tops on hangers in your heated apartment overnight (they dry in 3 hours on radiators!).
          </p>
        </div>
      </div>
    </div>
  </section>
`;

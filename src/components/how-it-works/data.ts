// @ts-nocheck — ported from the Claude Design prototype (handoff_how_it_works, 2026-10-06), kept
// close to the reference so later handoffs diff cleanly. The site-facing seams are typed in HowItWorks.astro.
// How it works — the timeline as data. Same shape idea as STREAM in beckstage-web/src/data/site.ts:
// one array the animation reads; nothing here knows how it is drawn.
// A beat: { id, n, title, dur (ms), cap, steps }. A step: { t (ms into the beat), L?, R? (full screen state
// for that phone), act ('L' | 'R' | 'both'), ping? { side, id } (the one cross-phone signal), inset? { side, id }
// (mobile: the other phone's reacting region), cap? (caption override), cut? (show-day card), key? (static frame label) }.

export const HIW_AV = { harbour: '/avatars/artist-3.webp', meridian: '/avatars/agency-1.webp', maya: '/avatars/crew-light.webp', petr: '/avatars/crew-driver.webp', rui: '/avatars/crew-foh.webp', nils: '/avatars/user-4.webp', dan: '/avatars/crew-tm.webp', band: '/avatars/artist-1.webp' };
export const HIW_PEOPLE = {
  maya: { name: 'Maya Sundowner', role: 'Artist · booking organizer' },
  petr: { name: 'Petr Novak', role: 'Driver', fee: 200, user: 'petr.novak' },
  rui: { name: 'Rui Pacheco', role: 'Sound Engineer', fee: 300 },
  nils: { name: 'Nils Bergman', role: 'Lighting Designer', fee: 250 },
  dan: { name: 'Dan Whitaker', role: 'Tour Manager', fee: 350 },
};
export const HIW_VENUE = { rider: 'Aurora Hall – Tech Rider.pdf', contact: { name: 'Lena Hartmann', role: 'Production Manager', phone: '+49 30 5557 2190', email: 'lena@aurorahall.de' }, contact2: { name: 'Jonas Becker', role: 'Stage Manager', phone: '+49 30 5557 2194', email: 'jonas@aurorahall.de' }, loadIn: 'Rear entrance · dock on Schillingbrücke side', parking: 'One van in the courtyard. Gate code from the house manager.' };

export const HIW_COPY = { eyebrow: 'How it works', h2: ['One show, from ', 'booked to settled', '.'], line: '', end: ['Where ', 'live music', ' works.'] };

// Show day, in order. The load-in is the one beat 5 moves.
export const HIW_ITIN = [
  { start: '09:30', end: '12:15', color: '#2563a8', title: 'Travel to Berlin', place: 'Leipzig → Aurora Hall', who: ['maya', 'nils'] },
  { start: 'LOADIN', color: '#9c4a17', title: 'Load-in', place: 'Aurora Hall, Berlin', id: 'loadin', who: ['dan', 'rui', 'nils', 'petr'] },
  { start: '17:00', end: '17:45', color: '#9c4a17', title: 'Soundcheck', place: 'Aurora Hall, Berlin', who: ['maya', 'rui', 'nils'] },
  { start: '18:30', color: '#7d4ea3', title: 'Catering', place: 'Aurora Hall, Berlin', who: ['maya', 'dan', 'rui', 'nils', 'petr'] },
  { start: '20:00', color: '#9c4a17', title: 'Doors', place: 'Aurora Hall, Berlin', who: ['dan'] },
  { start: '21:00', end: '22:30', color: '#9c4a17', title: 'Show', place: 'Aurora Hall, Berlin', who: ['maya', 'rui', 'nils', 'dan'] },
];
// Creation order: the load-in first (through the form), then the rest. Lists always read chronologically.
export const HIW_CREATE_ORDER = [1, 2, 0, 3, 4, 5]; // load-in (New item form) → soundcheck (quick add) → the rest
export function hiwItinItems(n = HIW_ITIN.length) { const made = new Set(HIW_CREATE_ORDER.slice(0, n)); return HIW_ITIN.filter((_, i) => made.has(i)); }
export const C0 = { dan: 'i', rui: 'i', nils: 'i', petr: 'i' };
export const C4 = { dan: 'c', rui: 'c', nils: 'c', petr: 'c' };
export const ov = (crew, x = {}) => ({ scr: 'ov', crew, ...x });
export const cr = (f, x = {}) => ({ scr: 'create', f, ...x });
export const inv = (p, press) => ({ scr: 'invite', who: p, p, press });
export const OFF = { scr: 'off', p: null };

export const BEATS = [
  { id: 'born', n: 1, title: 'The booking is born', dur: 8000, cap: 'Maya creates the show and hands production to the tour manager.', steps: [
    { t: 0, L: cr(0), R: OFF, act: 'L', inset: null, key: 'New booking — artist set', say: { L: 'New booking', R: '' } },
    { t: 900, L: cr(1) },
    { t: 1900, L: cr(2), key: 'Date and venue' },
    { t: 3000, L: cr(2, { scroll: 330 }) },
    { t: 3800, L: cr(3, { scroll: 330, press: 'prod' }), key: 'Who else can edit → Tour manager · Production' },
    { t: 4800, L: cr(4, { scroll: 330, press: 'status' }) },
    { t: 5600, L: cr(4, { scroll: 330, press: 'save' }), key: 'Confirmed · Save' },
    { t: 6100, L: { scr: 'ovEmpty' }, key: 'Lands on the empty booking', say: { L: 'Booking created' } },
    { t: 7300, L: { scr: 'ovEmpty', press: 'invite' } },
  ] },
  { id: 'invite', n: 2, title: 'The invite', dur: 7600, cap: 'She invites four people in one send.', steps: [
    { t: 0, L: { scr: 'ovEmpty', sheet: { s: 0 } }, act: 'L', key: 'Invite crew — Casa Capitão · 12 Jun', say: { L: 'Inviting the crew' } },
    { t: 900, L: { scr: 'ovEmpty', sheet: { s: 1 } }, key: 'Select all — role and fee carried' },
    { t: 2000, L: { scr: 'ovEmpty', sheet: { s: 2 } }, key: '@petr — RESULTS · 1' },
    { t: 2800, L: { scr: 'ovEmpty', sheet: { s: 3 } }, key: 'No history: Set a role and fee' },
    { t: 3600, L: { scr: 'ovEmpty', sheet: { s: 3.1 } }, key: 'Driver — Set a fee for 1 person' },
    { t: 4200, L: { scr: 'ovEmpty', sheet: { s: 3.15 } } },
    { t: 4450, L: { scr: 'ovEmpty', sheet: { s: 3.2 } } },
    { t: 4650, L: { scr: 'ovEmpty', sheet: { s: 3.3 } } },
    { t: 4850, L: { scr: 'ovEmpty', sheet: { s: 3.4 } }, key: 'She types his fee — €200' },
    { t: 5500, L: { scr: 'ovEmpty', sheet: { s: 4 } }, key: 'Driver · €200 → Send 4 invites' },
    { t: 6300, L: { scr: 'ovEmpty', sheet: { s: 5 } } },
    { t: 6900, L: ov(C0), key: 'Overview — 0 confirmed · 4 invited', say: { L: 'Sent 4 invites' } },
  ] },
  { id: 'answers', n: 3, title: 'Four answers', dur: 9700, cap: 'Each one sees their date, their role, their fee before accepting.', steps: [
    // The four answer one after another; Maya's phone is shown once, at the end, with the whole crew confirmed.
    { t: 0, L: ov(C0), R: inv('petr'), act: 'R', inset: null, key: 'Petr’s invite — €200', say: { L: 'Sent 4 invites', R: 'Invite from Maya' } },
    { t: 1200, R: inv('petr', true), L: ov({ ...C0, petr: 'c' }), say: { R: 'Accepted' } },
    { t: 1500, R: inv('rui'), key: 'Rui’s invite — €300', say: { R: 'Invite from Maya' } },
    { t: 2700, R: inv('rui', true), L: ov({ ...C0, petr: 'c', rui: 'c' }), say: { R: 'Accepted' } },
    { t: 3000, R: inv('nils'), key: 'Nils’s invite — €250', say: { R: 'Invite from Maya' } },
    { t: 4200, R: inv('nils', true), L: ov({ ...C0, petr: 'c', rui: 'c', nils: 'c' }), say: { R: 'Accepted' } },
    { t: 4500, R: inv('dan'), cap: 'As tour manager, Dan runs production — Maya handed it over when she created the booking.', key: 'Dan’s invite — Eligible for delegation', say: { R: 'Invite from Maya' } },
    { t: 6000, R: inv('dan', true), L: ov(C4), say: { R: 'Accepted' } },
    { t: 6300, R: { scr: 'dov', p: 'dan', toast: true }, say: { R: 'Runs production' } },
    { t: 6700, R: { scr: 'dov', p: 'dan', toast: true }, ping: { side: 'R', id: 'strip' }, key: 'Dan’s booking — You can edit production' },
    { t: 8300, L: ov(C4), ping: { side: 'L', id: 'crew', also: ['crew-dan', 'crew-rui', 'crew-nils', 'crew-petr'] }, inset: { side: 'L', id: 'crew-strip' }, key: 'Maya: all four confirmed', say: { L: '4 of 4 accepted' } },
  ] },
  { id: 'production', n: 4, title: 'Production', dur: 21600, cap: 'Dan fills in the venue, the contacts and the itinerary. Maya’s overview syncs automatically.', steps: [
    // Dan enters everything first; then Maya's Overview, with every block he filled already there.
    { t: 0, L: ov(C4), R: { scr: 'venue', p: 'dan', f: 0 }, act: 'R', inset: null, key: 'Dan · Venue', say: { L: '', R: 'Filling in the venue' } },
    { t: 700, R: { scr: 'venue', p: 'dan', f: 1 } },
    { t: 1500, R: { scr: 'venue', p: 'dan', f: 2, editing: true } },
    { t: 2100, R: { scr: 'venue', p: 'dan', f: 2 }, L: ov(C4, { venue: 1 }), key: 'Load in · Parking' },
    { t: 2700, R: { scr: 'venue', p: 'dan', f: 3 }, say: { R: 'Adding the venue rider' } },
    { t: 3200, R: { scr: 'venue', p: 'dan', f: 4 }, L: ov(C4, { venue: 1, riders: 1 }), key: 'Venue Riders — Tech Rider' },
    { t: 4000, R: { scr: 'contacts', p: 'dan', f: 0 }, say: { R: 'Adding the venue contact' } },
    { t: 4700, R: { scr: 'contacts', p: 'dan', f: 1 } },
    { t: 5300, R: { scr: 'contacts', p: 'dan', f: 2 }, key: 'Add contact — Production Manager' },
    { t: 5900, R: { scr: 'contacts', p: 'dan', f: 3 } },
    { t: 6200, R: { scr: 'contacts', p: 'dan', f: 4 }, L: ov(C4, { venue: 1, riders: 1, contacts: 1 }) },
    { t: 6600, R: { scr: 'contacts', p: 'dan', f: 5 }, L: ov(C4, { venue: 1, riders: 1, contacts: 2 }), key: 'Second contact — Stage Manager' },
    { t: 8300, R: { scr: 'itin', p: 'dan', n: 0 }, key: 'Dan · Itinerary — empty', say: { R: 'Starting the itinerary' } },
    { t: 9700, R: { scr: 'itin', p: 'dan', n: 0, press: true } },
    // The first item through the full New item form; the rest appear as if he had just made them too.
    { t: 10200, R: { scr: 'item', p: 'dan', mode: 'new', f: 0 }, key: 'Dan · New item', say: { R: 'Adding the load-in' } },
    { t: 10800, R: { scr: 'item', p: 'dan', mode: 'new', f: 1 } },
    { t: 11400, R: { scr: 'item', p: 'dan', mode: 'new', f: 2, editing: true }, key: 'New item — Load-in · 15:00' },
    { t: 12100, R: { scr: 'item', p: 'dan', mode: 'new', f: 3 } },
    { t: 12500, R: { scr: 'item', p: 'dan', mode: 'new', f: 3, press: true } },
    { t: 12800, R: { scr: 'itin', p: 'dan', n: 1 }, L: ov(C4, { venue: 1, riders: 1, contacts: 2, itin: 1, itinN: 1 }), key: 'Load-in 15:00' },
    { t: 13300, R: { scr: 'itin', p: 'dan', n: 1, qa: 0 }, key: 'Quick add on the same day', say: { R: 'Adding the soundcheck' } },
    { t: 13900, R: { scr: 'itin', p: 'dan', n: 1, qa: 1 }, key: 'Quick add — Soundcheck · 17:00' },
    { t: 14500, R: { scr: 'itin', p: 'dan', n: 1, qa: 2 } },
    { t: 14800, R: { scr: 'itin', p: 'dan', n: 2 }, L: ov(C4, { venue: 1, riders: 1, contacts: 2, itin: 1, itinN: 2 }) },
    { t: 15400, R: { scr: 'itin', p: 'dan', n: 3 }, L: ov(C4, { venue: 1, riders: 1, contacts: 2, itin: 1, itinN: 3 }), say: { R: 'Building the day' } },
    { t: 15800, R: { scr: 'itin', p: 'dan', n: 4 }, L: ov(C4, { venue: 1, riders: 1, contacts: 2, itin: 1, itinN: 4 }) },
    { t: 16200, R: { scr: 'itin', p: 'dan', n: 5 }, L: ov(C4, { venue: 1, riders: 1, contacts: 2, itin: 1, itinN: 5 }) },
    { t: 16600, R: { scr: 'itin', p: 'dan', n: 6 }, L: ov(C4, { venue: 1, riders: 1, contacts: 2, itin: 1 }), key: 'The whole day — 6 items' },
    // Maya's Overview is now taller than her screen: first the day and the contact, then the venue with its rider.
    { t: 17500, L: ov(C4, { venue: 1, riders: 1, contacts: 2, itin: 1, scroll: 90 }), ping: { side: 'L', id: 'itin', also: ['contacts'] }, inset: { side: 'L', id: 'itin' }, key: 'Maya’s overview — the day and the contact', say: { L: 'Itinerary and contacts filled in by Dan' } },
    { t: 19300, L: ov(C4, { venue: 1, riders: 1, contacts: 2, itin: 1, scroll: 520 }), ping: { side: 'L', id: 'venue' }, inset: { side: 'L', id: 'venue' }, key: 'Maya’s overview — venue and rider', say: { L: 'Venue and rider filled in by Dan' } },
  ] },
  { id: 'shared', n: 5, title: 'Shared, not public', dur: 7300, cap: 'Maya sees the whole accounting. Dan sees only his fee and his expenses.', steps: [
    // Each one opens Accounting from their own Overview: the whole show, then his part.
    { t: 0, L: ov(C4, { venue: 1, riders: 1, contacts: 2, itin: 1, scroll: 9999 }), R: { scr: 'dov', p: 'dan', venue: 1, riders: 1, contacts: 2, itin: 1, scroll: 9999 }, act: 'both', inset: null, half: 'L', say: { L: '', R: '' } },
    { t: 700, L: ov(C4, { venue: 1, riders: 1, contacts: 2, itin: 1, scroll: 9999, press: 'acct' }) },
    { t: 1000, L: { scr: 'acct', scroll: 230 }, key: 'The whole show', say: { L: 'The whole show' } },
    { t: 4000, half: 'R' },
    { t: 4600, R: { ...{ scr: 'dov', p: 'dan', venue: 1, riders: 1, contacts: 2, itin: 1, scroll: 9999, press: 'acct' } } },
    { t: 4900, R: { scr: 'dacct', p: 'dan' }, key: 'His part', say: { R: 'His part' } },
  ] },
  { id: 'money', n: 6, title: 'The money', dur: 19800, cap: 'Dan submits what he spent on the road. It goes straight into the booking’s accounting.', steps: [
    { t: 0, L: { scr: 'acct' }, R: { scr: 'dacct', p: 'dan', add: 0 }, act: 'R', inset: null, key: 'Dan · Add expense', say: { L: '', R: 'Adding an expense' } },
    { t: 500, R: { scr: 'dacct', p: 'dan', add: 1 } },
    { t: 1200, R: { scr: 'dacct', p: 'dan', add: 2 } },
    { t: 1800, R: { scr: 'dacct', p: 'dan', add: 3 }, key: 'Fuel · €60 · Travel · receipt' },
    { t: 2300, R: { scr: 'dacct', p: 'dan', add: 4 } },
    { t: 2600, R: { scr: 'dacct', p: 'dan', exp: true }, L: { scr: 'acct', exp: true }, ping: { side: 'L', id: 'exp-new' }, inset: { side: 'L', id: 'exp-new' }, key: 'Maya’s EXPENSES gains it', say: { L: 'New expense from Dan · €60', R: 'Expense added' } },
    // After show day, books still open: Maya's register first, then Dan's — his fee and expense are already in his Balance.
    { t: 3600, L: { scr: 'acct', exp: true }, act: 'L', inset: null, key: 'Maya’s Accounting, books open', say: { L: 'Books still open', R: '' } },
    { t: 6600, R: { scr: 'dacct', p: 'dan', exp: true, credited: true }, act: 'R', ping: { side: 'R', id: 'fee', also: ['exp-bal'] }, key: 'Dan · This fee is in your Balance', cap: 'After the show, Dan’s fee and expenses land in his Balance. He requests, she records, it’s settled.', say: { R: 'In his Balance · €410' } },
    { t: 8600, R: { scr: 'dacct', p: 'dan', exp: true, credited: true, pressOpen: true }, key: 'Open Balance' },
    { t: 9000, R: { scr: 'dbal', p: 'dan', s: 'list' }, key: 'Dan’s Balance — who owes him', say: { R: 'Owed by three' } },
    { t: 11300, R: { scr: 'dbal', p: 'dan', s: 'detail' }, key: 'The Sundowners — where the €410 comes from', say: { R: 'Crew fee + fuel · €410' } },
    { t: 13400, R: { scr: 'dbal', p: 'dan', s: 'form' }, key: 'Request €410' },
    { t: 14000, R: { scr: 'dbal', p: 'dan', s: 'form', doc: 0 }, say: { R: 'Attaching his invoice' } },
    { t: 14500, R: { scr: 'dbal', p: 'dan', s: 'form', doc: 1 }, key: 'Invoice attached' },
    { t: 15400, R: { scr: 'dbal', p: 'dan', s: 'form', doc: 1, press: true } },
    { t: 15700, R: { scr: 'dbal', p: 'dan', s: 'sent' }, L: { scr: 'bal', req: true }, ping: { side: 'L', id: 'req' }, inset: { side: 'L', id: 'req' }, key: 'Maya’s Balance — €410 requested', say: { L: 'Dan requested €410', R: 'Requested €410' } },
    { t: 16700, L: { scr: 'bal', req: true, s: 'detail' }, act: 'L', inset: null, say: { L: 'Recording the payment' } },
    { t: 17300, L: { scr: 'bal', req: true, s: 'form' }, key: 'Maya · Record payment' },
    { t: 17800, L: { scr: 'bal', req: true, s: 'form', press: true } },
    { t: 18100, L: { scr: 'bal', s: 'done' }, R: { scr: 'dbal', p: 'dan', s: 'settled' }, ping: { side: 'R', id: 'settled' }, inset: { side: 'R', id: 'settled' }, key: 'Dan · Settled', say: { L: 'Recorded €410', R: 'Settled' } },
  ] },
];
export const HIW_END_MS = 3000;
// Tempo: every step time is authored in brief-scale ms and multiplied here. 1.2 after the rhythm pass.
export const HIW_TEMPO = 1.2;
BEATS.forEach((beat) => { beat.dur = Math.round(beat.dur * HIW_TEMPO); beat.steps.forEach((s) => { s.t = Math.round(s.t * HIW_TEMPO); }); });
export const HIW_PING_MS = 2200;
export const HIW_FLY_MS = Math.round(560 * HIW_TEMPO); // an invite / an answer crossing between the phones

// One line per screen: what in beckstage-fe it reproduces.
export const HIW_SOURCES = {
  off: 'Phone dark — not on anything yet',
  create: 'app/create-booking.tsx · booking-form/{FieldCard, PickerRow, VenueRow, AddressRow, OrganizerPicker, DelegationsCard, StatusChips}',
  ovEmpty: 'components/BookingDetail.tsx · BookingHero.tsx · booking/overview/CrewFirstCard.tsx',
  sheet: 'components/crew/add/{CrewAddSheet, CrewAddBody, CrewAddRow}.tsx · crewAddReceipt.ts · invite/identityResolve.ts',
  ov: 'BookingDetail.tsx · booking/BookingOverviewTab.tsx · overview/{OverviewBlock, OverviewCrewBody, OverviewPerson, OverviewItineraryBlock, OverviewVenueBody}.tsx',
  invite: 'app/booking-invite/[inviteId].tsx · forms/crewInviteSlots.tsx (TourManagerNote)',
  dov: 'BookingDetail.tsx · booking/DelegationStrip.tsx · utils/viewerDelegateStatus.ts',
  venue: 'app/(tabs)/bookings/[id]/venue/ · components/venue/{sections.ts, RidersBlockMobile, RiderRow, UploadDropzone}.tsx',
  contacts: 'components/ContactsSection.tsx · forms/{ContactForm, ContactFields}.tsx · contacts/ContactLink.tsx',
  itin: 'app/(tabs)/bookings/[id]/itinerary/ · itinerary/ItineraryPlannerRow.tsx · constants/itineraryTypes.ts',
  item: 'ItineraryItemFormSection.tsx · constants/itineraryTypes.ts (TIME_LABELS, ADD_END_LABELS)',
  acct: 'accounting/index.tsx · accounting/AccountingWorksheet.tsx · ledger/{WaterfallSummary, ExpenseLedger, SheetLabel}.tsx',
  dacct: 'AccountingWorksheet.tsx (crew) · ledger/WorksheetNotes.tsx (CrewFeeCard) · balance/{BalanceNote.tsx, balanceLine.ts}',
  add: 'accounting/add-expense.tsx · AddAccountingExpenseSection.tsx',
  bal: 'app/(tabs)/balance.tsx · balance/counterparty/{CounterpartyList, CounterpartyDetail, CounterpartyActionBar}.tsx',
  dbal: 'app/(tabs)/balance.tsx · balance/counterparty/{CounterpartyList, CounterpartyDetail, CounterpartyActionBar}.tsx',
};
export function hiwSource(st) { if (!st) return ''; if (st.sheet) return HIW_SOURCES.sheet; if (st.add != null) return HIW_SOURCES.add; return HIW_SOURCES[st.scr] || ''; }

// State of both phones at (beat, ms). Pure: the stepper, the static frames and the player all read it.
export function hiwFrame(b, t) {
  let L = null, R = null, act = 'L', inset = null, cap = null, cut = false, ping = null, idx = 0, fly = null, say = { L: '', R: '' }, lastPing = null, actAt = -1e9, half = null;
  for (let bi = 0; bi <= b; bi++) {
    const beat = BEATS[bi];
    if (bi < b || true) cap = beat.cap;
    beat.steps.forEach((s, si) => {
      if (bi === b && s.t > t) return;
      if (s.L) L = s.L; if (s.R) R = s.R; if (s.act) act = s.act;
      if ('inset' in s) inset = s.inset; if (s.cap) cap = s.cap; if ('cut' in s) cut = s.cut;
      if (s.ping) { ping = { ...s.ping, k: bi + '-' + si, at: bi === b ? s.t : -1e9 }; lastPing = { ...ping, ord: bi * 1e6 + s.t }; }
      const ord = bi * 1e6 + s.t;
      if ((s.act && s.act !== act) || (act === 'L' && s.L && !s.ping) || (act === 'R' && s.R && !s.ping)) actAt = ord;
      if (s.L && !s.ping && act === 'R' && lastPing && lastPing.side === 'L') actAt = ord; // a quiet update is not a reaction to hold
      if ('half' in s) half = s.half;
      if (s.say) say = { ...say, ...s.say, k: bi + '-' + si };
      if (s.fly) fly = { ...s.fly, k: bi + '-' + si, at: bi === b ? s.t : -1e9 };
      if (bi === b) idx = si;
    });
    if (bi < b) cut = false;
  }
  const pingOn = !!ping && t - ping.at < HIW_PING_MS;
  const flyOn = !!fly && t - fly.at < HIW_FLY_MS;
  return { L, R, act, inset, cap, cut, ping: pingOn ? ping : null, fly: flyOn ? fly : null, say, idx, b, half: act === 'both' ? half : null,
    // Who the eye is on: a reaction holds the attention until the actor does something new.
    focus: lastPing && lastPing.side !== act && act !== 'both' && lastPing.ord >= actAt ? lastPing : null };
}
export const HIW_KEYS = BEATS.flatMap((beat, b) => beat.steps.map((s, i) => (s.key ? { b, i, t: s.t + (s.ping ? 300 : 0), label: s.key } : null)).filter(Boolean));



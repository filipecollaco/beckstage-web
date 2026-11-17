/* All site copy, in one place. English (product language).
   Ported from the Claude Design handoff (content.jsx, hero-v2.jsx,
   audience-direct.jsx, faq.jsx). Never call the org an "agency" in copy: it is
   an artist representation, and its people are representatives. */

export const LINKS = {
  signup: 'https://app.beckstage.music/signup',
  login: 'https://app.beckstage.music/login',
  email: 'hello@beckstage.music',
  instagram: 'https://www.instagram.com/beckstage.music/',
  // The apps are not public yet. The "Get the app" band renders only once
  // both of these are set.
  appStore: null as string | null,
  googlePlay: null as string | null,
};

export const mailto = (subject?: string) =>
  `mailto:${LINKS.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

// Pricing has its own page; Contact is an e-mail link.
export const NAV = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: mailto() },
];

/* ---- Hero --------------------------------------------------------------- */

export const HERO = {
  h1: ['Where', 'live music', 'works.'],
  /* The four are in the order ONE_SHOW.intro names them. */
  sub: ['Tour production and accounting, in one place.', 'Artists, managers, agents and crew on the same page.'],
  primary: 'Create your free account',
};

/* ---- One show ----------------------------------------------------------- */

/* Four moments of one show. The lines are final copy (handoff_web_home,
   2026-11): don't change a word. `loop` is how long the moment's fragment
   plays, in ms, which is also how long its bar takes to fill.

   `intro` is the one sentence on what Beckstage is: the passage from the hero
   into the four lines. Approved word by word (2026-11-17): don't change it
   either. */
export const ONE_SHOW = {
  label: 'One show',
  intro: 'Beckstage brings together artists, managers, agents and crew, making show and tour production as easy for everyone involved as it always should have been.',
  moments: [
    { id: 'invites', label: 'When the show is booked', line: 'The artist and crew said yes, knowing their role and their fee.', loop: 9900 },
    { id: 'day', label: 'Before the show', line: 'The roadbook lands on everyone’s phone. Nobody sent it.', loop: 7400 },
    { id: 'venue', label: 'Show day', line: 'Which door, where to park, who to ask for. Nobody calls you from the van.', loop: 6300 },
    { id: 'books', label: 'After the show', line: 'Books closed. On to the next one.', loop: 6300 },
  ],
} as const;

export type MomentId = (typeof ONE_SHOW.moments)[number]['id'];

/* What the four fragments show: pieces of the app as it is, with invented
   people, places and amounts (The Sundowners at Aurora Hall, Berlin). The
   avatar and the `Accepted` mark on an invite are the site's only additions
   to the app. */
export const FRAGMENTS = {
  invites: {
    eyebrow: 'The offer',
    feeNote: 'Fixed fee · this booking',
    decline: 'Decline',
    accept: 'Accept invite',
    accepted: 'Accepted',
    earnings: { title: 'Artist earnings', note: 'Paid a share of what the booking earns, not a set fee.' },
    people: [
      { role: 'Sound Engineer', icon: 'speaker', fee: '€300', avatar: '/avatars/crew-foh.webp' },
      { role: 'Driver', icon: 'truck', fee: '€200', avatar: '/avatars/crew-driver.webp' },
      // A member of the artist: paid from what the booking earns, so no fee.
      { role: 'Musician', icon: 'music', fee: null, avatar: '/avatars/user-4.webp' },
    ],
  },
  day: {
    filters: [{ label: 'All items', n: 6, active: false }, { label: 'Mine', n: 4, active: true }],
    band: { date: 'Sat 13 Sep', tag: 'Day of show' },
    items: [
      { id: 'travel', start: '09:30', end: '12:15', title: 'Travel to Berlin', place: 'Leipzig → Aurora Hall', kind: 'travel',
        who: ['/avatars/crew-driver.webp', '/avatars/crew-foh.webp', '/avatars/user-4.webp'] },
      { id: 'loadin', start: '15:00', end: '', title: 'Load-in', place: 'Aurora Hall, Berlin', kind: 'event',
        who: ['/avatars/crew-tm.webp', '/avatars/crew-foh.webp', '/avatars/user-4.webp', '/avatars/crew-driver.webp'] },
      { id: 'soundcheck', start: '17:00', end: '17:45', title: 'Soundcheck', place: 'Aurora Hall, Berlin', kind: 'event',
        who: ['/avatars/crew-light.webp', '/avatars/crew-foh.webp', '/avatars/user-4.webp'] },
      { id: 'show', start: '21:00', end: '22:30', title: 'Show', place: 'Aurora Hall, Berlin', kind: 'event',
        who: ['/avatars/crew-light.webp', '/avatars/crew-foh.webp', '/avatars/user-4.webp', '/avatars/crew-tm.webp'] },
    ],
    /* The one item that opens. */
    open: {
      item: 'loadin',
      location: { label: 'Location', address: 'Köpenicker Str. 70, 10179 Berlin', action: 'Open in maps' },
      notes: { label: 'Notes', text: 'Rear dock on the Schillingbrücke side. Ask for Jonas at the stage door.' },
      attachments: { label: 'Attachments · 1', file: 'Aurora Hall – Stage plot.pdf' },
    },
  },
  venue: {
    notes: [
      { icon: 'truck', label: 'Load in / load out', text: 'Rear dock on the Schillingbrücke side. Stage door open from 15:00 to 01:00.' },
      { icon: 'parking', label: 'Parking', text: 'One van in the courtyard. Gate code from the house manager.' },
    ],
    contact: { name: 'Jonas Becker', role: 'Stage Manager', phone: '+49 30 5557 2194', action: 'Call' },
    rider: { name: 'Aurora Hall – Tech Rider.pdf', size: '1.2 MB', action: 'Download' },
  },
  books: {
    title: 'Accounting',
    /* The fee leads; the rest of the open summary is quieter. */
    summaryOpen: { lead: '€6,000 fee', rest: ' · 3 expenses · €5,520 net' },
    summaryLocked: '€5,520 net',
    rows: [
      { op: '', label: 'Total fee', sub: 'Flat Fee', amount: '€6,000', kind: 'row' },
      { op: '−', label: 'Expenses', sub: '3 items', amount: '€480', kind: 'row' },
      { op: '=', label: 'After expenses', sub: '', amount: '€5,520', kind: 'subtotal' },
      { op: '−', label: 'Commissions', sub: '1 recipient', amount: '€900', kind: 'row' },
      { op: '=', label: 'Artist earnings', sub: '', amount: '€4,620', kind: 'accent' },
    ],
    band: 'Books still open — close to lock.',
    close: 'Close & lock',
    locked: 'LOCKED · 14 SEP',
  },
} as const;

/* ---- In their words ----------------------------------------------------- */

/* Real messages from people who use Beckstage, whole, signed with the
   person's role and nothing else: nobody is named. A quote shows only once
   its author has authorized it (`authorized: true`). With none authorized,
   the section is left out of the page. */
export const QUOTES_LABEL = 'In their words';
export const QUOTES = [
  { quote: 'I don’t send roadbooks anymore. It’s sooo good.', role: 'Booking agent', authorized: false },
  { quote: 'I booked 23 dates in two weeks. Just because I wasn’t worrying about pre-production, roadbooks and the money.', role: 'Artist manager', authorized: false },
  { quote: 'Beckstage on my laptop is incredible. On tour, I’ll only need the app.', role: 'Tour manager', authorized: false },
];

/* ---- Who's Beckstage for? ----------------------------------------------- */

export const AUDIENCE = {
  h2: 'Who’s Beckstage for?',
  items: [
    { label: 'Managers, agents, tour managers', line: 'Your artists and their crew get the roadbook and their fee, without you forwarding a thing.' },
    { label: 'Artists and bands', line: 'You always get the latest roadbook, and you’re told when it changes. You see the fee, the expenses and what you earn, on every show.' },
    { label: 'Crew', line: 'Your call times and your fees, for every artist you work with, in one account.' },
  ],
};

/* ---- Close -------------------------------------------------------------- */

export const CLOSE = {
  h2: 'Start with your next show.',
  cta: 'Create your free account',
};

/* ---- Pricing ------------------------------------------------------------ */

export type Feat = string | { t: string; cap: string };
export interface Plan {
  name: string; for: string; mo: number; yr: number;
  featured?: boolean; badge?: string; feats: Feat[]; cta: string;
}

export const PRICING = {
  h2: 'Pricing',
  lead: 'Every feature, from your first show.',
  tabs: ['For artists', 'For Artist Representatives', 'For crew'],
  rule: 'A booking counts against its organizer’s plan only (artist or representative) — never against both.',
  crewPanel: {
    label: 'Crew & individuals · Free',
    title: 'Free to work.',
    desc: 'Accept invites, log what you spend and get paid. As a tour manager, run the production of a show when it’s delegated to you. The crew plan is free: no subscription, no card.',
    feats: ['Get invited to bookings, tours & artists', 'Accept your role on each booking', 'Tour managers: run the production when it’s delegated', 'Log expenses and get reimbursed', 'See itineraries & call times', 'Receive your payments'],
    cta: 'Create your free account',
  },
  artists: [
    {
      name: 'Artist Free', for: 'For an artist booking its own shows', mo: 0, yr: 0,
      feats: [
        { t: '3 upcoming bookings', cap: 'organized by you' },
        'Unlimited members',
        'Full booking history, forever',
        'Bookings your representatives organize don’t count',
      ],
      cta: 'Create your free account',
    },
    {
      name: 'Artist Pro', for: 'One plan per artist', mo: 24, yr: 240, featured: true, badge: 'Unlimited bookings',
      feats: [
        'Everything in Free, plus:',
        { t: 'Unlimited upcoming bookings', cap: 'organized by you' },
      ],
      cta: 'Start your 30-day trial',
    },
  ] as Plan[],
  repFree: {
    name: 'Representative Free', for: 'For the solo agent or the manager with one act', mo: 0, yr: 0,
    feats: [
      { t: '1 artist', cap: 'active deal' },
      { t: '3 upcoming bookings', cap: 'organized by you' },
      'Unlimited team members',
      'Full booking history, forever',
    ],
    cta: 'Create your free account',
  } as Plan,
  repPro: {
    name: 'Representative Pro', badge: 'Unlimited bookings',
    for: 'One rule, no tiers: you pay for the artists you have an active deal with on Beckstage.',
    feats: [
      { t: 'Unlimited upcoming bookings', cap: 'organized by you' },
      'Unlimited team members',
      { t: 'The bill follows the roster on its own', cap: 'when a deal with an artist goes active, the next invoice adds one artist, pro-rated' },
    ] as Feat[],
    cta: 'Start your 30-day trial',
  },
  rules: [
    { t: 'No seats', d: 'Unlimited members and team on every plan, Free included.' },
    { t: '30 days of the Pro plan', d: 'Every new artist and representative starts there, no card. Then pay, or go back to Free with everything kept.' },
    { t: 'Downgrading is clean', d: 'Nothing is deleted, nothing stops being readable, editable or closable.' },
    { t: 'Recording money is free', d: 'Registering a payment made outside Beckstage, on every plan, forever.' },
  ],
};

/** Representative Pro, per month: artists 1–2 = €25 total, then +€5 (3rd–6th),
 *  +€4 (7th–10th), +€3 (11th–20th), +€2 (21st–60th). */
export function repPrice(n: number): number {
  let t = 0;
  for (let i = 1; i <= n; i++) t += i === 1 ? 25 : i === 2 ? 0 : i <= 6 ? 5 : i <= 10 ? 4 : i <= 20 ? 3 : 2;
  return t;
}

export const money = (n: number) => '€' + (Number.isInteger(n) ? n : n.toFixed(2));

/* ---- FAQ ---------------------------------------------------------------- */

export const FAQ_HEAD = {
  eyebrow: 'FAQ',
  h2: 'Questions',
  lead: 'About plans, the trial and who pays for what.',
};

export const FAQ = [
  { q: 'What happens at the end of the 30 days?', a: 'You choose: keep your Pro plan through a paid subscription, or go back to Free. Nothing you created is lost. The Free limits only apply to new bookings and deals.' },
  { q: 'What counts as an upcoming booking?', a: 'A booking you organize, dated today or later and not cancelled. It counts from the day you register it until its date passes. Bookings organized by someone else never count against your plan.' },
  { q: 'Who pays when a representative books my shows?', a: 'Whoever organizes the booking pays for it. A booking counts against one plan only, its organizer’s, never against two.' },
  { q: 'How does a band pay for Artist Pro?', a: 'One member pays, and the band can change who at any time. On the yearly plan the band can also split it: each member who accepts pays an equal share directly.' },
  { q: 'What counts as an active deal?', a: 'A deal the artist has accepted on Beckstage. Pending, rejected and terminated deals don’t count. When a deal ends, the next invoice drops one artist.' },
  { q: 'Is anything locked on Free?', a: 'No. Every feature is in Free. Pro lifts the limits on the number of bookings; it doesn’t unlock features.' },
  { q: 'What if I work with more than 60 artists?', a: 'Please get in touch through hello@beckstage.music' },
];

/* ---- App band, footer --------------------------------------------------- */

export const APPS = {
  label: 'GET THE APP',
  line: 'Already on Beckstage? Take it on the road.',
  legal: 'Apple and the Apple logo are trademarks of Apple Inc., registered in the U.S. and other countries. App Store is a service mark of Apple Inc. Google Play and the Google Play logo are trademarks of Google LLC.',
};

export const LEGAL_NAV = [
  { slug: 'privacy', label: 'Privacy and Cookies Policy', href: '/privacy' },
  { slug: 'terms', label: 'Terms and Conditions', href: '/terms' },
] as const;

export const FOOTER = {
  blurb: 'Where live music works.',
  copyright: '© 2026 Beckstage · Made for the road',
};

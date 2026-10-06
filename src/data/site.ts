/* All site copy, in one place. English (product language).
   Ported from the Claude Design handoff (content.jsx, hero-v2.jsx,
   audience-direct.jsx, faq.jsx). Never call the org an "agency" in copy: it is
   an artist representation, and its people are representatives. */

import type { IconName } from '../components/icons';

export const LINKS = {
  signup: 'https://app.beckstage.music/signup',
  login: 'https://app.beckstage.music/login',
  email: 'hello@beckstage.music',
  // Not linked from the nav for now (founder, 2026-10-06).
  instagram: 'https://www.instagram.com/beckstage.music/',
  // The apps are not public yet. The "Get the app" band renders only once
  // both of these are set.
  appStore: null as string | null,
  googlePlay: null as string | null,
};

export const mailto = (subject?: string) =>
  `mailto:${LINKS.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

export const NAV = [
  { label: 'Who’s Beckstage for?', href: '#audience' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

/* ---- Hero --------------------------------------------------------------- */

export const HERO = {
  h1: ['Where', 'live music', 'works.'],
  sub: ['Shows, tours and payments, centralised.', 'Your whole team on the same page.'],
  primary: 'Create your free account',
  secondary: 'See how it works',
  reach: 'For artists, their crew, and the managers and agents who book them.',
};

/* ---- Who's Beckstage for? ----------------------------------------------- */

export type Line = string | { pre: string; s: string };
export interface Category { t: string; lines: Line[] }

export const AUDIENCE = {
  h2: 'Who’s Beckstage for?',
  tabs: ['Artists/Bands', 'Touring Professionals', 'Artist Managers and Agents'],
  ctas: [
    { label: 'Create your free account', note: 'Every new artist starts with 30 days of Pro' },
    { label: 'Create your free account', note: 'Free for touring professionals' },
    { label: 'Create your free account', note: 'Every new representative starts with 30 days of Pro' },
  ],
  // Opening line per persona. The part after the first comma or colon is
  // highlighted.
  lines: [
    'Run your live career from one place: every show, every cent, every person on your team.',
    'Work with as many artists as you like, with all your dates and all your money in one place.',
    'Handle every show your artists play, from the first offer to the last payment.',
  ],
  // Text between *…* is a keyword.
  views: [
    [
      { t: 'Shows & logistics', lines: [
        'Every detail of *every show*, in *one place*.',
        'On show day, *everything you need on one screen*: call times, travel, soundcheck and stage.',
        'Your crew gets everything they need for every show, *without you forwarding a thing*.',
        'Set up your next show *in minutes*, reusing what you need from past ones.',
      ] },
      { t: 'Finances', lines: [
        'Know *exactly what you’ll earn* from every show, with *every expense accounted for*.',
        'Know *who owes you, who you owe, and how much*: promoters, representatives and crew, always up to date.',
        'See where *every cent* from your live career goes.',
        '*Request payment for any show in one tap.*',
      ] },
      { t: 'Privacy & permissions', lines: [
        '*Your fee is your business*: crew see what they need for the show, not what you’re paid.',
        '*Decide who can find you* on Beckstage: everyone, your working circle, or only people you’ve worked with.',
        'Organize each show yourself or through your representatives, and *hand production to your tour manager*.',
      ] },
      { t: 'Crew & people', lines: [
        'Your crew know *their role and fee before they accept* a show, and can reach what’s relevant to them any time.',
        'Invite your *regular crew* to all your shows *in one tap*.',
      ] },
    ],
    [
      { t: 'Shows & logistics', lines: [
        'Every show, *for every artist you work with*, in one place.',
        'Know *the date, your role and your fee* before you reply to an invite.',
        'See right away if a new invite *clashes* with a show you’ve already accepted.',
        'On show day, know *where you need to be, when, and with whom*.',
        { pre: 'Tour managers', s: 'When production is handed to you, *run the show*: crew, itinerary, venue, contacts.' },
      ] },
      { t: 'Finances', lines: [
        'Know *exactly how much you’ll earn* from every show.',
        'See *what each artist or representative owes you*, always up to date.',
        '*Request payment for any show in one tap.*',
      ] },
      { t: 'Privacy & reputation', lines: [
        'See what you need to do your job. *Your fee stays between you and whoever hired you.*',
        '*Decide who can find you* and invite you to new shows.',
      ] },
    ],
    [
      { t: 'Shows & logistics', lines: [
        'Every show, *for every artist you represent*, in one place.',
        'Spot an artist’s *double bookings before they happen*.',
        'Give every show *one clear owner*, and hand production to a tour manager without losing sight of it.',
        'You, the artist and their crew work from *the same information*. No more “which version is the latest?”',
        'Book the next show *in minutes*, pulling in everything from the last one.',
      ] },
      { t: 'Finances', lines: [
        'Know *exactly how much you’ll earn* from every show.',
        'Know *what every promoter still owes*, and *what you owe* each artist and crew member.',
      ] },
      { t: 'Members & permissions', lines: [
        'Give each member *a role* (Admin, Bookings, Production, Finance), so they see and do exactly what it allows.',
        'You and your artists work on *the same shows, with the same information*.',
      ] },
    ],
  ] as Category[][],
};

/** Splits an opening line at its first comma or colon. */
export function splitOpening(line: string): [string, string] {
  const k = line.search(/[:,]/) + 1;
  return [line.slice(0, k), line.slice(k).trim()];
}

/* ---- Privacy & permissions ---------------------------------------------- */

export const PRIVACY = {
  eyebrow: 'Privacy & permissions',
  h2: 'You see what’s relevant to you.',
  lead: 'On Beckstage, every part of a show — the venue, the deal, the fees, the itinerary, the riders — is shared only with the people it’s relevant to. Your bookings, your money and your whole career stay private and secured — shared only when, and with whom, you choose.',
  matrix: {
    title: 'Who sees what on a show',
    rows: [
      {
        who: 'The organizer', role: 'Artist or representative',
        avatars: [{ img: '/avatars/artist-1.webp' }, { img: '/avatars/mira-agency.webp', org: true }],
        level: 'full' as const, label: 'Full access',
        summary: 'The deal, every fee, the itinerary, all the riders — the whole show.',
      },
      {
        who: 'Invited to the show', role: 'Crew members',
        avatars: [{ img: '/avatars/crew-foh.webp' }, { img: '/avatars/crew-tm.webp' }],
        level: 'part' as const, label: 'Just their part',
        summary: 'Only what the organizer chooses to share.',
      },
    ],
  },
  pillars: [
    { icon: 'lock', t: 'Private by default', d: 'Every booking starts visible only to its organizer — the venue, the deal, the itinerary, the riders. It opens up to the people invited to work on it.' },
    { icon: 'eye', t: 'Everyone sees their part', d: 'Crew get the itinerary and their own fee. The full deal, every fee and the P&L stay with the artist and their representatives.' },
    { icon: 'shield', t: 'You hold the keys', d: 'Delegate the production to a tour manager, and take it back any time. When someone’s role ends, so does their access.' },
    { icon: 'user', t: 'Your work stays yours', d: 'Work with ten artists and none of them sees the others. What you earn on one show never shows up on another.' },
  ] as { icon: IconName; t: string; d: string }[],
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

export const FAQ = [
  { q: 'What happens at the end of the 30 days?', a: 'You choose: keep your Pro plan through a paid subscription, or go back to Free. Nothing you created is lost. The Free limits only apply to new bookings and deals.' },
  { q: 'What counts as an upcoming booking?', a: 'A booking you organize, dated today or later and not cancelled. It counts from the day you register it until its date passes. Bookings organized by someone else never count against your plan.' },
  { q: 'Who pays when a representative books my shows?', a: 'Whoever organizes the booking pays for it. A booking counts against one plan only, its organizer’s, never against two.' },
  { q: 'How does a band pay for Artist Pro?', a: 'One member pays, and the band can change who at any time. On the yearly plan the band can also split it: each member who accepts pays an equal share directly.' },
  { q: 'What counts as an active deal?', a: 'A deal the artist has accepted on Beckstage. Pending, rejected and terminated deals don’t count. When a deal ends, the next invoice drops one artist.' },
  { q: 'Is anything locked on Free?', a: 'No. Every feature is in Free. Pro lifts the limits on the number of bookings; it doesn’t unlock features.' },
  { q: 'What if I work with more than 60 artists?', a: 'Please get in touch through hello@beckstage.music' },
];

/* ---- Contact, app band, footer ------------------------------------------ */

export const CONTACT = {
  eyebrow: 'Contact',
  h2: 'We’re in the industry, building for the industry.',
  body: [
    'Beckstage is built by working music professionals — people who tour, book the shows, settle at the end of the night and chase the same missing rider. We’re building the tool we could never find, for the industry as a whole and not just one corner of it.',
    'And we’re building it for you. Anything you would change, anything that doesn’t match how you actually work on the road — we want to hear it. Every piece of feedback shapes what ships next.',
  ],
  primary: 'Send us feedback',
};

export const APPS = {
  label: 'GET THE APP',
  line: 'Already on Beckstage? Take it on the road.',
  legal: 'Apple and the Apple logo are trademarks of Apple Inc., registered in the U.S. and other countries. App Store is a service mark of Apple Inc. Google Play and the Google Play logo are trademarks of Google LLC.',
};

export const FOOTER = {
  blurb: 'The operating system for live music — the network where artists, representatives and crew connect and run every show together.',
  copyright: '© 2026 Beckstage · Made for the road',
};

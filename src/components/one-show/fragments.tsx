/* The four fragments of One show: pieces of the app as it is, each playing
   one short loop. Ported from the Claude Design handoff handoff_web_home
   (wh/anim.jsx); their contents live in `FRAGMENTS` (src/data/site.ts).

   The rules they follow: a fragment is a piece of a screen, never a whole
   one; no finger, no cursor, no typing; at most one thing opens or changes
   per loop; the window is as tall as what it holds and eases to each new
   height. */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  mdiAccount, mdiCheck, mdiChevronRight, mdiDownload, mdiHandshakeOutline, mdiLockOutline, mdiMapMarker,
  mdiMusic, mdiParking, mdiPhone, mdiShieldCheck, mdiSpeaker, mdiTruck, mdiTruckOutline,
} from '@mdi/js';
import { FRAGMENTS, type MomentId } from '../../data/site';

/** How a fragment plays: `still` is its still frame (reduced motion); `paused` holds it where it is. */
interface Play { still: boolean; paused?: boolean }

const ROLE_ICONS: Record<string, string> = { speaker: mdiSpeaker, truck: mdiTruckOutline, music: mdiMusic };
const VENUE_ICONS: Record<string, string> = { truck: mdiTruck, parking: mdiParking };

/** One of the app's Material Design glyphs, inlined. */
export function Glyph({ d, size = 16 }: { d: string; size?: number }) {
  return <svg className="osf-ic" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path fill="currentColor" d={d} /></svg>;
}

/** Walks through `durations` once from mount and returns the step it is on.
 *  `still` sits on one step. `paused` holds the step it is on, and goes on
 *  from there when it lifts. */
function useSteps(durations: readonly number[], still: boolean, stillStep: number, paused = false) {
  const [step, setStep] = useState(still ? stillStep : 0);
  const at = useRef(step);
  const wasStill = useRef(still);
  useEffect(() => {
    if (still) { wasStill.current = true; at.current = stillStep; setStep(stillStep); return; }
    if (wasStill.current) { wasStill.current = false; at.current = 0; setStep(0); }
    if (paused) return;
    let timer = 0;
    const next = () => {
      if (at.current >= durations.length - 1) return;
      timer = window.setTimeout(() => { at.current += 1; setStep(at.current); next(); }, durations[at.current]);
    };
    next();
    return () => window.clearTimeout(timer);
    // The durations and the still step are constants of each fragment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still, paused]);
  return step;
}

/** The fragment's window: as tall as its contents, easing to each new height.
 *  `ease={false}` is for a fragment whose contents animate their own height
 *  (the day's item opening): the window then simply follows them. */
function Win({ children, ease = true }: { children: ReactNode; ease?: boolean }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el || !ease) return;
    const read = () => setHeight(el.offsetHeight);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ease]);
  return <div className="osf" style={ease ? { height } : undefined}><div className="osf-in" ref={inner}>{children}</div></div>;
}

const Pdf = () => <span className="osf-pdf">PDF</span>;

/* ---- 1 · When the show is booked: the invites, accepted one by one --------
   The THE OFFER card of the crew invite review (app/booking-invite), and
   ProfitSplitCard for the member of the artist, who sees Artist earnings
   alone: the booking's total fee is left out, so it can't be read as the
   musician's own. The avatar and the Accepted mark are the site's. */

const INVITE_STEPS = [700, 500, 1600, 500] as const; // arrives · Accept invite is pressed · accepted · leaves

function Invites({ still, paused }: Play) {
  const f = FRAGMENTS.invites;
  const durations = f.people.flatMap(() => INVITE_STEPS);
  const step = useSteps(durations, still, (f.people.length - 1) * 4 + 2, paused);
  const who = Math.floor(step / 4);
  const phase = step % 4;
  const p = f.people[who];
  const accepted = phase >= 2;
  return (
    <Win>
      <div className="osf-ticks">
        {f.people.map((_, k) => <i key={k} className={k < who || (k === who && accepted) ? 'is-done' : k === who ? 'is-now' : ''}></i>)}
      </div>
      <div className={'osf-invite' + (phase === 3 && !still ? ' is-leaving' : '')} key={who}>
        <div className="osf-label osf-offer-label">{f.eyebrow}</div>
        <div className="osf-offer">
          <div className="osf-offer-who">
            <img className="osf-av" src={p.avatar} alt="" width={30} height={30} />
            <Glyph d={ROLE_ICONS[p.icon]} size={18} />
            <span className="osf-offer-role">{p.role}</span>
          </div>
          <div className="osf-offer-terms">
            {p.fee ? (
              <>
                <div className="osf-offer-amount">{p.fee}</div>
                <div className="osf-offer-note">{f.feeNote}</div>
              </>
            ) : (
              <div className="osf-earnings">
                <span className="osf-earnings-tile"><Glyph d={mdiHandshakeOutline} size={18} /></span>
                <div>
                  <div className="osf-earnings-title">{f.earnings.title}</div>
                  <div className="osf-earnings-note">{f.earnings.note}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="osf-answer">
          <div className={'osf-answer-btns' + (accepted ? ' is-out' : '')}>
            <span className="osf-btn is-ghost">{f.decline}</span>
            <span className={'osf-btn is-primary' + (phase === 1 ? ' is-pressed' : '')}>{f.accept}</span>
          </div>
          <div className={'osf-answer-done' + (accepted ? ' is-in' : '')}>
            <span className="osf-accepted"><Glyph d={mdiCheck} size={15} />{f.accepted}</span>
          </div>
        </div>
      </div>
    </Win>
  );
}

/* ---- 2 · Before the show: one person reads their day ----------------------
   ItineraryDaySection + ItineraryPlannerRow on Mine; one item opens onto its
   Location, Notes and Attachments. Only Load-in opens. */

const DAY_STEPS = [1200, 600, 4800, 800] as const; // closed · Load-in lights up · open · closing
const KIND_COLOR: Record<string, string> = { event: '#9c4a17', travel: '#2563a8' };

function Day({ still, paused }: Play) {
  const f = FRAGMENTS.day;
  const step = useSteps(DAY_STEPS, still, 2, paused);
  const lit = step === 1 || step === 2;
  const open = step === 2;
  return (
    <Win ease={false}>
      <div className="osf-seg">
        {f.filters.map((c) => (
          <span key={c.label} className={'osf-seg-item' + (c.active ? ' is-active' : '')}>
            {c.active ? <Glyph d={mdiAccount} size={12} /> : null}{c.label} <b>{c.n}</b>
          </span>
        ))}
      </div>
      <div className="osf-daycard">
        <div className="osf-dayband"><span className="osf-label osf-muted">{f.band.date}</span><i></i><span className="osf-label osf-fg">{f.band.tag}</span></div>
        {f.items.map((it, i) => {
          const opens = it.id === f.open.item;
          return (
            <div key={it.id} className={'osf-item' + (i % 2 ? ' is-alt' : '') + (opens && lit ? ' is-lit' : '')}>
              <div className="osf-item-row">
                <div className="osf-item-time"><span>{it.start}</span>{it.end ? <small>{it.end}</small> : null}</div>
                <i className="osf-item-bar" style={{ background: KIND_COLOR[it.kind] }}></i>
                <div className="osf-item-main"><div className="osf-item-title">{it.title}</div><div className="osf-item-place">{it.place}</div></div>
                <div className="osf-stack">
                  {it.who.slice(0, 4).map((src) => <img key={src} className="osf-av" src={src} alt="" width={18} height={18} />)}
                </div>
              </div>
              {opens ? (
                <div className={'osf-detail' + (open ? ' is-open' : '')}>
                  <div className="osf-detail-in">
                    <div className="osf-detail-body">
                      <div>
                        <div className="osf-sec-label"><span>{f.open.location.label}</span><b>{f.open.location.action}</b></div>
                        <div className="osf-surf osf-sec-row"><Glyph d={mdiMapMarker} size={16} /><span>{f.open.location.address}</span><Glyph d={mdiChevronRight} size={14} /></div>
                      </div>
                      <div>
                        <div className="osf-sec-label"><span>{f.open.notes.label}</span></div>
                        <div className="osf-surf osf-sec-note">{f.open.notes.text}</div>
                      </div>
                      <div>
                        <div className="osf-sec-label"><span>{f.open.attachments.label}</span></div>
                        <div className="osf-surf osf-sec-row is-file"><Pdf /><span>{f.open.attachments.file}</span><Glyph d={mdiChevronRight} size={14} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Win>
  );
}

/* ---- 3 · Show day: the venue's details, one after the other ---------------
   VenueSectionCardMobile (Load in / load out, Parking), ContactCard, RiderRow. */

const VENUE_STEPS = [700, 900, 900, 900, 2400, 500] as const; // one card at a time · hold · clear

function Venue({ still, paused }: Play) {
  const f = FRAGMENTS.venue;
  const step = useSteps(VENUE_STEPS, still, 4, paused);
  const cleared = step === 5;
  const count = cleared ? 1 : Math.min(step, 3) + 1;
  const cards: ReactNode[] = [
    ...f.notes.map((n) => (
      <div key={n.label} className="osf-surf osf-venue">
        <div className="osf-venue-head"><span className="osf-venue-tile"><Glyph d={VENUE_ICONS[n.icon]} size={15} /></span><span className="osf-label osf-fg">{n.label}</span></div>
        <p>{n.text}</p>
      </div>
    )),
    <div key="contact" className="osf-surf osf-contact">
      <div className="osf-contact-name">{f.contact.name}</div>
      <div className="osf-contact-role">{f.contact.role}</div>
      <div className="osf-contact-row"><span>{f.contact.phone}</span><span className="osf-pill"><Glyph d={mdiPhone} size={12} />{f.contact.action}</span></div>
    </div>,
    <div key="rider" className="osf-surf osf-rider">
      <Pdf />
      <div className="osf-rider-main"><div className="osf-rider-name">{f.rider.name}</div><div className="osf-rider-size">{f.rider.size}</div></div>
      <span className="osf-pill is-small"><Glyph d={mdiDownload} size={11} />{f.rider.action}</span>
    </div>,
  ];
  return (
    <Win>
      <div className={'osf-stack-col' + (cleared ? ' is-cleared' : '')}>{cards.slice(0, count)}</div>
    </Win>
  );
}

/* ---- 4 · After the show: the books lock ------------------------------------
   The accounting SectionHeader with its LockedPill, WaterfallSummary and
   AccountingFooterBand. The confirmation the app opens in between isn't shown. */

const BOOKS_STEPS = [2600, 500, 3200] as const; // open · Close & lock is pressed · locked

function Books({ still, paused }: Play) {
  const f = FRAGMENTS.books;
  const step = useSteps(BOOKS_STEPS, still, 2, paused);
  const locked = step === 2;
  return (
    <Win>
      <div className="osf-acct-head">
        <div className="osf-acct-main">
          <div className="osf-acct-title">{f.title}</div>
          <div className="osf-acct-sum">{locked ? f.summaryLocked : <>{f.summaryOpen.lead}<span>{f.summaryOpen.rest}</span></>}</div>
        </div>
        <span className={'osf-locked' + (locked ? ' is-in' : '')}><Glyph d={mdiLockOutline} size={11} />{f.locked}</span>
      </div>
      <div className="osf-surf osf-waterfall">
        {f.rows.map((r) => (
          <div key={r.label} className={'osf-wrow is-' + r.kind}>
            <span className={'osf-wrow-op' + (r.op === '−' ? ' is-minus' : '')}>{r.op}</span>
            <div className="osf-wrow-main"><div className="osf-wrow-label">{r.label}</div>{r.sub ? <div className="osf-wrow-sub">{r.sub}</div> : null}</div>
            <span className="osf-wrow-value">{r.amount}</span>
          </div>
        ))}
      </div>
      {locked ? null : (
        <div className="osf-band">
          <span>{f.band}</span>
          <span className={'osf-btn is-dark' + (step === 1 ? ' is-pressed' : '')}><Glyph d={mdiShieldCheck} size={15} />{f.close}</span>
        </div>
      )}
    </Win>
  );
}

const BY_ID: Record<MomentId, (p: Play) => ReactNode> = {
  invites: Invites,
  day: Day,
  venue: Venue,
  books: Books,
};

/** The fragment of one moment. Remount it (a new `key`) to play it again from the start. */
export function Fragment({ id, still, paused }: Play & { id: MomentId }) {
  const Piece = BY_ID[id];
  return <Piece still={still} paused={paused} />;
}

/* The four fragments of One show: pieces of the app as it is, each playing
   one short loop. Their contents live in `FRAGMENTS` (src/data/site.ts).

   The rules they follow (handoff_web_home): a fragment is a piece of a
   screen, never a whole one; no finger, no cursor, no typing; at most one
   thing opens or changes per loop; the window is as tall as what it holds
   and eases to each new height. */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  mdiCheck, mdiChevronRight, mdiDownload, mdiFilePdfBox, mdiGuitarElectric, mdiHandshakeOutline,
  mdiLockOutline, mdiMapMarkerOutline, mdiParking, mdiPhone, mdiShieldCheck, mdiSpeaker, mdiTruck,
  mdiTruckOutline,
} from '@mdi/js';
import { FRAGMENTS, type MomentId } from '../../data/site';

/** How a fragment plays: `still` is its still frame (reduced motion); `paused` holds it where it is. */
interface Play { still: boolean; paused?: boolean }

const ICONS: Record<string, string> = {
  speaker: mdiSpeaker,
  truck: mdiTruckOutline,
  guitar: mdiGuitarElectric,
  parking: mdiParking,
};

/** One of the app's Material Design glyphs, inlined. */
export function Glyph({ d, size = 16, color }: { d: string; size?: number; color?: string }) {
  return <svg className="osf-ic" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={color ? { color } : undefined}><path fill="currentColor" d={d} /></svg>;
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

/* ---- 1 · The invites (app: booking-invite THE OFFER card, ProfitSplitCard) --- */

const INVITE_STEPS = [700, 500, 1600, 500] as const; // arrives · Accept invite is pressed · Accepted · leaves

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
        {f.people.map((_, i) => <i key={i} className={i < who || (i === who && accepted) ? 'is-done' : ''}></i>)}
      </div>
      <div className={'osf-invite' + (phase === 3 && !still ? ' is-leaving' : '')} key={who}>
        <div className="osf-label osf-fg">{f.eyebrow}</div>
        <div className="osf-offer">
          <div className="osf-offer-who">
            <img className="osf-av" src={p.avatar} alt="" width={40} height={40} />
            <Glyph d={ICONS[p.icon]} size={18} />
            <span className="osf-offer-role">{p.role}</span>
          </div>
          {p.fee ? (
            <div className="osf-offer-fee">
              <div className="osf-offer-amount">{p.fee}</div>
              <div className="osf-cap osf-muted">{f.feeNote}</div>
            </div>
          ) : (
            <div className="osf-earnings">
              <span className="osf-earnings-tile"><Glyph d={mdiHandshakeOutline} size={18} /></span>
              <div>
                <div className="osf-earnings-title">{f.earnings.title}</div>
                <div className="osf-cap osf-body">{f.earnings.note}</div>
              </div>
            </div>
          )}
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

/* ---- 2 · The day (app: ItineraryDaySection + ItineraryPlannerRow on Mine; the item's Location, Notes, Attachments) --- */

const DAY_STEPS = [1200, 600, 4800, 800] as const; // closed · opening · open · closing
const KIND_COLOR: Record<string, string> = { event: '#9c4a17', travel: '#2563a8' };

function Day({ still, paused }: Play) {
  const f = FRAGMENTS.day;
  const step = useSteps(DAY_STEPS, still, 2, paused);
  const open = step === 1 || step === 2;
  return (
    <Win ease={false}>
      <div className="osf-filters">
        {f.filters.map((c) => <span key={c.label} className={'osf-filter' + (c.active ? ' is-active' : '')}>{c.label}<b>{c.n}</b></span>)}
      </div>
      <div className="osf-card">
        <div className="osf-dayband"><span className="osf-label osf-muted">{f.band.date}</span><i></i><span className="osf-label osf-fg">{f.band.tag}</span></div>
        {f.items.map((it, i) => {
          const isOpen = open && it.id === f.open.item;
          return (
            <div key={it.id} className={'osf-item' + (i % 2 ? ' is-alt' : '') + (isOpen ? ' is-open' : '')}>
              <div className="osf-item-row">
                <div className="osf-item-time"><span>{it.start}</span>{it.end ? <small>{it.end}</small> : null}</div>
                <i className="osf-item-bar" style={{ background: KIND_COLOR[it.kind] }}></i>
                <div className="osf-item-main"><div className="osf-item-title">{it.title}</div><div className="osf-item-place">{it.place}</div></div>
                <div className="osf-item-who">
                  {it.who.slice(0, 3).map((src) => <img key={src} className="osf-av" src={src} alt="" width={18} height={18} />)}
                  {it.who.length > 3 ? <span className="osf-item-more">+{it.who.length - 3}</span> : null}
                </div>
                <Glyph d={mdiChevronRight} size={14} />
              </div>
              {it.id === f.open.item ? (
                <div className={'osf-detail' + (step === 3 ? ' is-closing' : '')}>
                  <div className="osf-detail-in">
                    <div className="osf-label osf-fg">{f.open.location.label}</div>
                    <div className="osf-detail-row">
                      <Glyph d={mdiMapMarkerOutline} size={15} />
                      <span>{f.open.location.address}</span>
                      <span className="osf-pill">{f.open.location.action}</span>
                    </div>
                    <div className="osf-label osf-fg">{f.open.notes.label}</div>
                    <p className="osf-detail-note">{f.open.notes.text}</p>
                    <div className="osf-label osf-fg">{f.open.attachments.label}</div>
                    <div className="osf-detail-file"><Glyph d={mdiFilePdfBox} size={18} /><span>{f.open.attachments.file}</span></div>
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

/* ---- 3 · The venue (app: VenueSectionCardMobile, ContactCard, RiderRow) --- */

const VENUE_STEPS = [900, 900, 900, 3100, 500] as const; // a card every 900ms · the fourth, then the hold · clear
const VENUE_ICONS: Record<string, string> = { truck: mdiTruck, parking: mdiParking };

function Venue({ still, paused }: Play) {
  const f = FRAGMENTS.venue;
  const step = useSteps(VENUE_STEPS, still, 3, paused);
  const count = Math.min(step, 3) + 1;
  const clearing = step === 4 && !still;
  return (
    <Win>
      <div className={'osf-stack' + (clearing ? ' is-clearing' : '')}>
        {f.notes.slice(0, count).map((n) => (
          <div key={n.label} className="osf-card osf-venue">
            <div className="osf-venue-head"><span className="osf-venue-tile"><Glyph d={VENUE_ICONS[n.icon]} size={15} /></span><span className="osf-label osf-fg">{n.label}</span></div>
            <p>{n.text}</p>
          </div>
        ))}
        {count >= 3 ? (
          <div className="osf-card osf-contact">
            <div className="osf-contact-name">{f.contact.name}</div>
            <div className="osf-cap osf-muted">{f.contact.role}</div>
            <div className="osf-contact-row"><span>{f.contact.phone}</span><span className="osf-pill"><Glyph d={mdiPhone} size={12} />{f.contact.action}</span></div>
          </div>
        ) : null}
        {count >= 4 ? (
          <div className="osf-card osf-rider">
            <Glyph d={mdiFilePdfBox} size={22} />
            <div className="osf-rider-main"><div className="osf-rider-name">{f.rider.name}</div><div className="osf-cap osf-muted">{f.rider.size}</div></div>
            <span className="osf-pill"><Glyph d={mdiDownload} size={12} />{f.rider.action}</span>
          </div>
        ) : null}
      </div>
    </Win>
  );
}

/* ---- 4 · The books (app: accounting SectionHeader + LockedPill, WaterfallSummary, AccountingFooterBand) --- */

const BOOKS_STEPS = [2600, 500, 3200] as const; // open · Close & lock is pressed · locked

function Books({ still, paused }: Play) {
  const f = FRAGMENTS.books;
  const step = useSteps(BOOKS_STEPS, still, 2, paused);
  const locked = step === 2;
  return (
    <Win>
      <div className="osf-acct-head">
        <span className="osf-acct-title">{f.title}</span>
        {locked ? <span className="osf-locked"><Glyph d={mdiLockOutline} size={11} />{f.locked}</span> : null}
      </div>
      <div className="osf-acct-sum" key={locked ? 'locked' : 'open'}>{locked ? f.summaryLocked : f.summaryOpen}</div>
      <div className="osf-card osf-waterfall">
        {f.rows.map((r) => (
          <div key={r.label} className={'osf-wrow is-' + r.kind}>
            <span className="osf-wrow-op">{r.op}</span>
            <div className="osf-wrow-main"><div className="osf-wrow-label">{r.label}</div>{r.sub ? <div className="osf-cap osf-muted">{r.sub}</div> : null}</div>
            <span className="osf-money"><small>€</small>{r.amount}</span>
          </div>
        ))}
      </div>
      {locked ? null : (
        <div className="osf-band">
          <span>{f.band}</span>
          <span className={'osf-btn is-dark' + (step === 1 ? ' is-pressed' : '')}><Glyph d={mdiShieldCheck} size={16} />{f.close}</span>
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

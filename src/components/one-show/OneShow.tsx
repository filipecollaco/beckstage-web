/* One show: four moments of a show, each with its line and a small animated
   fragment of the app. From the Claude Design handoff handoff_web_home
   (2026-11).

   The four lines are always readable: they are server-rendered, and nothing
   here hides one. Desktop plays one fragment at a time on a stage beside the
   list and moves on when its loop ends. A phone is an accordion: the open
   row's fragment sits under it and loops. */
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { mdiChevronDown } from '@mdi/js';
import { ONE_SHOW } from '../../data/site';
import { Fragment, Glyph } from './fragments';

const PHONE = '(max-width: 760px)';
const REDUCED = '(prefers-reduced-motion: reduce)';
/** The fixed bar's height on a phone, plus the air under it. */
const BAR_CLEARANCE = 64 + 8;

/** A media query as state. False on the server and on the first client render. */
function useMedia(query: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const read = () => setOn(mq.matches);
    read();
    mq.addEventListener('change', read);
    return () => mq.removeEventListener('change', read);
  }, [query]);
  return on;
}

export default function OneShow() {
  const moments = ONE_SHOW.moments;
  const root = useRef<HTMLElement>(null);
  const phone = useMedia(PHONE);
  const reduced = useMedia(REDUCED);
  const [started, setStarted] = useState(false);
  /* Desktop: the moment on stage. Phone: the open row, or null with all four closed. */
  const [active, setActive] = useState<number | null>(null);
  /* Bumps to restart the active fragment and its bar from the beginning. */
  const [run, setRun] = useState(0);
  /* Phone: whether the open row's fragment is on screen. Off screen it holds
     still, so its changing height never moves what is being read below it. */
  const inline = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  const start = useCallback(() => {
    setStarted(true);
    setActive((a) => a ?? 0);
  }, []);

  /* Nothing plays until the section's top passes 70% of the viewport. Once. */
  useEffect(() => {
    const el = root.current;
    if (!el || started) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { start(); io.disconnect(); }
    }, { rootMargin: '0px 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [started, start]);

  useEffect(() => {
    const el = inline.current;
    if (!phone || active == null || !el) { setInView(true); return; }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [phone, active]);
  const held = phone && !inView;

  /* A desktop always has a moment on stage once it has started (a phone may
     have closed all four before the window was widened). */
  const shown = active ?? (started && !phone ? 0 : null);

  const advance = useCallback(() => {
    setActive((i) => ((i ?? 0) + 1) % moments.length);
    setRun((r) => r + 1);
  }, [moments.length]);
  const replay = useCallback(() => setRun((r) => r + 1), []);

  const onRow = (i: number, e: MouseEvent<HTMLButtonElement>) => {
    setStarted(true);
    if (!window.matchMedia(PHONE).matches) {
      setActive(i);
      setRun((r) => r + 1);
      return;
    }
    // Tapping the open row closes it. The row stays where it is.
    if (active === i) { setActive(null); return; }
    // Opening a row closes the one that was open. Hold the tapped row at its
    // exact screen position while the row above collapses, then glide it to
    // just under the fixed bar.
    const row = e.currentTarget.closest('li');
    if (!row) { setActive(i); setRun((r) => r + 1); return; }
    // The browser's own scroll anchoring stays out of it until the glide is over.
    const page = document.documentElement;
    page.style.overflowAnchor = 'none';
    window.setTimeout(() => { page.style.overflowAnchor = ''; }, 900);
    const before = row.getBoundingClientRect().top;
    flushSync(() => { setActive(i); setRun((r) => r + 1); });
    const moved = row.getBoundingClientRect().top - before;
    if (moved) window.scrollBy({ top: moved, behavior: 'instant' });
    const fits = row.getBoundingClientRect().bottom <= window.innerHeight;
    const nearBar = before >= BAR_CLEARANCE && before - BAR_CLEARANCE <= 140;
    if (nearBar && fits) return;
    // An absolute target: a smooth scroll started right after an instant one
    // can take its start from the offset before it, and land short or long.
    const still = window.matchMedia(REDUCED).matches;
    window.scrollTo({ top: window.scrollY + before - BAR_CLEARANCE, behavior: still ? 'instant' : 'smooth' });
  };

  return (
    <section className="os-root" ref={root} aria-label={ONE_SHOW.label}>
      <div className="bk-wrap os-grid">
        <ol className="os-list">
          {moments.map((m, i) => {
            const on = shown === i;
            // Desktop: earlier moments stay full, later ones empty. Phone: only the open row has a bar.
            const fill = !started || shown == null ? ''
              : on ? (reduced ? 'is-full' : phone ? 'is-loop' : 'is-run')
                : !phone && i < shown ? 'is-full' : '';
            return (
              <li key={m.id} className={'os-row' + (on ? ' is-active' : '')}>
                <button type="button" className="os-head" aria-expanded={phone ? on : undefined} aria-current={!phone && on ? 'true' : undefined} onClick={(e) => onRow(i, e)}>
                  <span className="os-label">
                    <i className="os-dot" aria-hidden="true"></i>
                    <span>{m.label}</span>
                    <span className="os-chev" aria-hidden="true"><Glyph d={mdiChevronDown} size={16} /></span>
                  </span>
                  <span className="os-line">{m.line}</span>
                </button>
                <span className="os-bar" aria-hidden="true">
                  <i
                    key={on ? 'run' + run : 'rest'}
                    className={'os-fill ' + fill + (on && held ? ' is-held' : '')}
                    style={on ? { animationDuration: m.loop + 'ms' } : undefined}
                    onAnimationEnd={on && fill === 'is-run' ? advance : undefined}
                    onAnimationIteration={on && fill === 'is-loop' ? replay : undefined}
                  ></i>
                </span>
                {phone && on ? (
                  <div className="os-frag os-frag-inline" ref={inline} aria-hidden="true">
                    <Fragment key={run} id={m.id} still={reduced} paused={held} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
        <div className="os-stage" aria-hidden="true">
          {!phone && shown != null ? (
            <div className="os-frag" key={moments[shown].id + run}>
              <Fragment id={moments[shown].id} still={reduced} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

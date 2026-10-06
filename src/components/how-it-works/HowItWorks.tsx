// @ts-nocheck — ported from the Claude Design prototype (handoff_how_it_works, 2026-10-06: hiw-stage.jsx +
// hiw-mobile-front.jsx). Kept close to the reference so later handoffs diff cleanly.
//
// One timeline (data.ts → BEATS, hiwFrame), two stages: desktop draws two framed phones side by side; mobile
// keeps both on one row and brings whoever the eye should be on to the front. Both are server-rendered; CSS shows
// one (≤ 760px is mobile). The hidden one never reaches 50% visible, so it never plays.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppScreen, I } from './screens';
import { BEATS, HIW_AV, HIW_COPY, HIW_KEYS, HIW_PEOPLE, hiwFrame } from './data';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Server-safe: the first render assumes motion, the effect corrects it before anything plays.
function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setR(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return r;
}

// Timeline clock. Re-renders only when the step or the ping window changes; progress bars are written directly.
function useTimeline(rootRef, { reduced }) {
  const pos = useRef({ b: 0, t: 0 });
  const [, force] = useState(0);
  const sig = useRef('');
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [hover, setHover] = useState(false);
  const [ended, setEnded] = useState(false);
  const bars = useRef([]);
  const [kIdx, setKIdx] = useState(0);

  useEffect(() => {
    const el = rootRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.intersectionRatio >= 0.5), { threshold: [0, 0.5, 1] });
    io.observe(el); return () => io.disconnect();
  }, []);
  useEffect(() => { if (visible && !started && !reduced) setStarted(true); }, [visible, started, reduced]);

  const paint = () => {
    const { b, t } = pos.current;
    bars.current.forEach((el, i) => { if (!el) return; el.style.transform = `scaleX(${ended || i < b ? 1 : i > b ? 0 : Math.min(1, t / BEATS[b].dur)})`; });
    const f = hiwFrame(b, t);
    const s = b + ':' + f.idx + ':' + (f.ping ? f.ping.k : '') + ':' + ended;
    if (s !== sig.current) { sig.current = s; force((x) => x + 1); }
  };

  const playing = started && visible && !hover && !ended && !reduced;
  useEffect(() => {
    if (!playing) { paint(); return; }
    let last = performance.now();
    const tick = () => {
      const now = performance.now(); const dt = Math.min(100, now - last); last = now;
      const p = pos.current; p.t += dt;
      if (p.t >= BEATS[p.b].dur) { if (p.b < BEATS.length - 1) { p.b += 1; p.t = 0; } else { p.t = BEATS[p.b].dur; setEnded(true); } }
      paint();
    };
    const id = setInterval(tick, 33); return () => clearInterval(id);
  }, [playing]);
  useEffect(paint, [ended]);

  const jump = (b) => { pos.current = { b: Math.max(0, Math.min(BEATS.length - 1, b)), t: 0 }; setEnded(false); setStarted(true); paint(); };
  return {
    get frame() { return reduced ? hiwFrame(HIW_KEYS[kIdx].b, HIW_KEYS[kIdx].t) : hiwFrame(pos.current.b, pos.current.t); },
    b: reduced ? HIW_KEYS[kIdx].b : pos.current.b, ended: reduced ? false : ended, playing, reduced, bars,
    jump: (b) => (reduced ? setKIdx(HIW_KEYS.findIndex((k) => k.b === b)) : jump(b)),
    next: () => (reduced ? setKIdx((i) => Math.min(HIW_KEYS.length - 1, i + 1)) : jump(pos.current.b + 1)),
    prev: () => (reduced ? setKIdx((i) => Math.max(0, i - 1)) : jump(pos.current.t > 1200 ? pos.current.b : pos.current.b - 1)),
    replay: () => jump(0), setHover, kIdx, kLen: HIW_KEYS.length,
  };
}

function Identity({ side, st }) {
  const p = side === 'L' ? 'maya' : st && st.p;
  if (!p) return <div className="hiw-id"><span className="hiw-id-ghost"></span><span className="hiw-id-wait">Not on anything yet</span></div>;
  return <div className="hiw-id"><img src={HIW_AV[p]} alt="" width={32} height={32} /><span className="hiw-id-name">{HIW_PEOPLE[p].name}</span><span className="hiw-id-role">{HIW_PEOPLE[p].role}</span></div>;
}
function Phone({ st, ping, label }) {
  return <div className="hiw-phone" role="img" aria-label={label || undefined}><div className="hiw-phone-scr"><AppScreen st={st} ping={ping} crop={st.crop} /></div><span className="hiw-island"></span></div>;
}
// Right phone: a new person slides in already on their screen; the previous one slides out. Never a morph.
function SlidingSide({ st, ping, reduced }) {
  const person = st.p || 'none';
  const [prev, setPrev] = useState(null);
  const cur = useRef({ person, st });
  useEffect(() => {
    if (cur.current.person !== person && cur.current.person !== 'none') { if (!reduced) { setPrev(cur.current); const t = setTimeout(() => setPrev(null), 430); cur.current = { person, st }; return () => clearTimeout(t); } }
    cur.current = { person, st };
  }, [person, st]);
  const label = (p) => (p && p !== 'none' ? HIW_PEOPLE[p].name + '’s phone' : 'A crew member’s phone, dark');
  return (
    <div className="hiw-slot">
      {prev ? <div className="hiw-slide out" key={'o' + prev.person}><Identity side="R" st={prev.st} /><Phone st={prev.st} label={label(prev.person)} /></div> : null}
      <div className={'hiw-slide' + (prev ? ' in' : reduced ? ' hiw-xfade' : '')} key={person}><Identity side="R" st={st} /><Phone st={st} ping={ping && ping.side === 'R' ? ping : null} label={label(person)} /></div>
    </div>
  );
}
function Progress({ tl, mobile }) {
  return (
    <div className={mobile ? 'hiwm-bars' : 'hiw-segs'} role="group" aria-label="Beats">
      {BEATS.map((beat, i) => mobile
        ? <span key={beat.id}><i ref={(el) => (tl.bars.current[i] = el)} style={{ transform: tl.reduced ? `scaleX(${i <= tl.b ? 1 : 0})` : 'scaleX(0)' }}></i></span>
        : <button key={beat.id} type="button" className="hiw-seg" onClick={() => tl.jump(i)} aria-label={`Beat ${beat.n}: ${beat.title}`} aria-current={i === tl.b ? 'step' : undefined}><span><i ref={(el) => (tl.bars.current[i] = el)} style={{ transform: tl.reduced ? `scaleX(${i <= tl.b ? 1 : 0})` : 'scaleX(0)' }}></i></span></button>)}
    </div>
  );
}
function Caption({ text }) { return <p className="hiw-cap fade" key={text} aria-live="polite">{text}</p>; }
function EndCard({ onReplay }) {
  return <div className="hiw-overlay end"><div className="hiw-end"><h3>{HIW_COPY.end[0]}<em>{HIW_COPY.end[1]}</em>{HIW_COPY.end[2]}</h3><button type="button" className="hiw-btn ghost" onClick={onReplay}><I n="replay" s={16} />Replay</button></div></div>;
}
function HiwSectionHead() { return <div className="hiw-head"><span className="hiw-eyebrow">{HIW_COPY.eyebrow}</span><h2 className="hiw-h2">{HIW_COPY.h2[0]}<em>{HIW_COPY.h2[1]}</em>{HIW_COPY.h2[2]}</h2>{HIW_COPY.line ? <p className="hiw-line">{HIW_COPY.line}</p> : null}</div>; }
function Stepper({ tl }) {
  return <div className="hiw-step"><button type="button" className="hiw-ctrl" onClick={tl.prev} aria-label="Back"><I n="chevron-left" s={18} /></button><span className="hiw-step-n">{tl.kIdx + 1} / {tl.kLen}</span><button type="button" className="hiw-ctrl" onClick={tl.next} aria-label="Next"><I n="chevron-right" s={18} /></button></div>;
}

// ── Desktop ──
function HowItWorksDesktop() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const tl = useTimeline(ref, { reduced });
  const f = tl.frame;
  const lit = (side) => f.act === 'both' || f.act === side || (f.ping && f.ping.side === side);
  const onKey = (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); tl.next(); } if (e.key === 'ArrowLeft') { e.preventDefault(); tl.prev(); } };
  return (
    <div className={'hiw-desktop' + (reduced ? ' hiw-reduced' : '')}>
      <div className="hiw-wrap">
        <HiwSectionHead />
        <div ref={ref} className="hiw-stage" tabIndex={0} onKeyDown={onKey} onMouseEnter={() => tl.setHover(true)} onMouseLeave={() => tl.setHover(false)}
          aria-label="How it works, played on two phones. Left and right arrows step through it.">
          <div className="hiw-phones">
            <div className={'hiw-side' + (lit('L') ? '' : ' dim')}><Identity side="L" /><Phone st={f.L} ping={f.ping && f.ping.side === 'L' ? f.ping : null} label="Maya Sundowner’s phone" /></div>
            <div className={'hiw-side hiw-right' + (f.R.scr === 'off' ? ' gone' : '') + (lit('R') ? '' : ' dim')} aria-hidden={f.R.scr === 'off' || undefined}><SlidingSide st={f.R} ping={f.ping} reduced={reduced} /></div>
            {tl.ended ? <EndCard onReplay={tl.replay} /> : null}
          </div>
          <div className="hiw-under">
            <Caption text={tl.ended ? '' : f.cap} />
            <div className="hiw-prog">{reduced ? <Stepper tl={tl} /> : null}<Progress tl={tl} />{reduced ? null : <button type="button" className="hiw-ctrl" onClick={tl.replay} aria-label="Replay"><I n="replay" s={16} /></button>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile — side by side, one in front ──
// Places never change (Maya left, the other right); only depth does. A reaction brings its phone forward until the
// actor does something new (hiwFrame.focus).
const FR = { W: 308, H: 642, F: 0.96, B: 0.48, stageW: 390, stageH: 698, peek: 66 }; // .hiw-phone is border-box 308 × 642

function FrUnit({ side, st, front, solo, gone, say, sayK, ping }) {
  const s = front ? FR.F : FR.B;
  const w = FR.W * s;
  let x;
  if (solo) x = (FR.stageW - w) / 2;
  else if (side === 'L') x = front ? 10 : 4;
  else x = front ? FR.stageW - w - 10 : FR.stageW - w - 4;
  if (gone) x = FR.stageW + 20;
  const y = front ? 74 : 74 + 160; // 74: progress bar (≈6) + 24 air + label (≈34) + 10 to the frame
  const p = side === 'L' ? 'maya' : st.p;
  return (
    <>
      {front ? (
        <div className="fr-label on" style={{ transform: `translate(${x + 4}px, ${y - 10}px) translateY(-100%)`, width: w - 8, opacity: gone ? 0 : 1 }}>
          {p ? <><img src={HIW_AV[p]} alt="" width={30} height={30} /><div className="fr-txt"><div className="fr-l1"><span className="n">{HIW_PEOPLE[p].name}</span><span className="r">{HIW_PEOPLE[p].role}</span></div><div className="fr-say" key={sayK + say}>{say || ' '}</div></div></> : null}
        </div>
      ) : (
        <div className={'fr-label back' + (side === 'R' ? ' right' : '')} style={{ transform: `translate(${side === 'L' ? 6 : FR.stageW - FR.peek - 6}px, ${y - 30}px)`, width: FR.peek, opacity: gone ? 0 : 1 }}>
          {p ? <><img src={HIW_AV[p]} alt="" width={22} height={22} /><span className="n">{HIW_PEOPLE[p].name.split(' ')[0]}</span></> : null}
        </div>
      )}
      <div className={'fr-unit' + (front ? ' on' : '')} style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, opacity: gone ? 0 : 1, zIndex: front ? 3 : 2 }} role="img" aria-label={p ? HIW_PEOPLE[p].name + '’s phone' : undefined}>
        <div key={side + (st.p || '')} className="ap-fade"><Phone st={st} ping={ping && ping.side === side ? ping : null} /></div>
      </div>
    </>
  );
}

// The stage is authored at 390 × 698. Scale it to the column, and to the viewport so stage + caption fill one
// screen once the section head has scrolled away (100svh − the caption).
const FR_CAPTION = 64;
function useFrScale(hostRef, probeRef) {
  const [s, setS] = useState(1);
  const measure = useCallback(() => {
    const host = hostRef.current, probe = probeRef.current; if (!host || !probe) return;
    const byW = host.clientWidth / FR.stageW;
    const byH = (probe.offsetHeight - FR_CAPTION) / FR.stageH;
    setS(Math.max(0.7, Math.min(byW, byH, 1.2)));
  }, []);
  useIsoLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (hostRef.current) ro.observe(hostRef.current);
    if (probeRef.current) ro.observe(probeRef.current);
    return () => ro.disconnect();
  }, [measure]);
  return s;
}

function HowItWorksMobile() {
  const ref = useRef(null);
  const host = useRef(null);
  const probe = useRef(null);
  const reduced = useReducedMotion();
  const tl = useTimeline(ref, { reduced });
  const s = useFrScale(host, probe);
  const f = tl.frame;
  const solo = f.R.scr === 'off';
  const react = f.focus ? f.focus.side : null;
  const eye = solo ? 'L' : f.act === 'both' ? (f.half || 'L') : react || f.act;
  return (
    <div className={'hiw-mobile hiwm' + (reduced ? ' hiw-reduced' : '')}>
      <span ref={probe} className="fr-probe" aria-hidden="true"></span>
      <div className="hiw-wrap"><HiwSectionHead /></div>
      <div ref={host} className="fr-fit" style={{ height: Math.round(FR.stageH * s) }}>
        <div ref={ref} className="fr-stage" style={{ transform: `translateX(-50%) scale(${s})` }}>
          <Progress tl={tl} mobile />
          <FrUnit side="L" st={f.L} front={eye === 'L'} solo={solo} say={f.say.L} sayK={f.say.k} ping={f.ping} />
          <FrUnit side="R" st={f.R} front={eye === 'R'} gone={solo} say={f.say.R} sayK={f.say.k} ping={f.ping} />
          {tl.ended ? <EndCard onReplay={tl.replay} /> : null}
          {reduced || tl.ended ? null : <><button type="button" className="hiwm-tap" style={{ left: 0 }} onClick={tl.prev} aria-label="Previous beat"></button><button type="button" className="hiwm-tap" style={{ right: 0 }} onClick={tl.next} aria-label="Next beat"></button></>}
        </div>
      </div>
      <div className="hiw-under fr-under"><Caption text={tl.ended ? '' : f.cap} />{reduced ? <Stepper tl={tl} /> : null}</div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <>
      <HowItWorksDesktop />
      <HowItWorksMobile />
    </>
  );
}

/* Who's Beckstage for? — desktop. Persona tabs, an opening line, category
   buttons on the left that advance every 6s, statements on the right. After
   the last category of a persona it moves to the next persona and wraps.
   Hover pauses it, and so does the section being off screen.

   The section is as tall as what is on screen (only the active persona and
   category take space); its height eases between categories so the content
   below glides instead of jumping. */
import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';
import { LineText } from './Keywords';
import { AUDIENCE, LINKS, splitOpening } from '../data/site';

const INTERVAL = 6000;

export default function AudienceDesktop() {
  const a = AUDIENCE;
  const [tab, setTab] = useState(0);
  const [cat, setCat] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [bodyH, setBodyH] = useState<number | null>(null);
  const paused = hovered || !onScreen;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBodyH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      if (cat + 1 < a.views[tab].length) setCat(cat + 1);
      else { setTab((t) => (t + 1) % a.views.length); setCat(0); }
      setCycle((c) => c + 1);
    }, INTERVAL);
    return () => clearTimeout(id);
  }, [cat, tab, cycle, paused, a.views]);

  const pickTab = (i: number) => { setTab(i); setCat(0); setCycle((c) => c + 1); };
  const pickCat = (i: number) => { setCat(i); setCycle((c) => c + 1); };

  return (
    <div ref={rootRef} className="bk-section aud-section aud-desktop">
      <div className="bk-wrap">
        <div className="aud-head">
          <h2 className="bk-h2">{a.h2}</h2>
          <div className="aud-tabs" role="tablist" aria-label="Who it’s for">
            {a.tabs.map((t, i) => (
              <button key={t} type="button" role="tab" id={`aud-tab-${i}`} aria-selected={i === tab}
                aria-controls={`aud-persona-${i}`} className={i === tab ? 'is-active' : undefined} onClick={() => pickTab(i)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="aud-body" style={bodyH == null ? undefined : { height: bodyH }}>
        <div className="aud-personas" ref={bodyRef}>
          {a.views.map((cats, ti) => {
            const active = ti === tab;
            const [lead, hl] = splitOpening(a.lines[ti]);
            const cta = a.ctas[ti];
            return (
              <div key={ti} id={`aud-persona-${ti}`} role="tabpanel" aria-labelledby={`aud-tab-${ti}`}
                className={'aud-persona' + (active ? ' is-active' : '')} aria-hidden={!active} inert={!active}>
                <p className="aud-dir-line">{lead} <span className="aud-dir-hl">{hl}</span></p>
                <div className="aud-dir" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                  <div className="aud-dir-cats">
                    {cats.map((c, i) => (
                      <button key={c.t} type="button" aria-pressed={active && i === cat}
                        className={'aud-dir-cat' + (active && i === cat ? ' is-active' : '')} onClick={() => pickCat(i)}>
                        <span className="aud-dir-num">{String(i + 1).padStart(2, '0')}</span>
                        <span className="aud-dir-t">{c.t}</span>
                      </button>
                    ))}
                  </div>
                  <div className="aud-dir-panel">
                    {cats.map((c, i) => (
                      <ul key={c.t} className={'aud-dir-lines' + (active && i === cat ? ' is-active' : '')}>
                        {c.lines.map((l, j) => (
                          <li key={j} style={{ animationDelay: j * 60 + 'ms' }}>
                            <span><LineText l={l} kwClass="aud-kw" preClass="aud-pre" /></span>
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                </div>
                <div className="aud-cta">
                  <a className="bk-btn bk-btn-primary" href={LINKS.signup}>{cta.label}<Icon name="arrow" size={17} color="#fff" /></a>
                  <span className="aud-cta-note">{cta.note}</span>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}

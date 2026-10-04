/* Hero activity stream: one show seen from eight positions. Holds three cards
   still, then steps up one. Seamless loop: the first four cards are appended
   and the track snaps back to the start without replaying the opening dwell. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Icon } from './icons';
import { ORG_LOGOS, STREAM, type StreamCard } from '../data/site';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const OPENING_DWELL = 2500;
const DWELL = 1900;
const LANDED = 640; // just past the 620ms tween

function AvatarStack({ avs, size = 44 }: { avs: string[]; size?: number }) {
  const o = Math.round(size * 0.38);
  return (
    <span className="hv2-avstack" style={{ width: size + (avs.length - 1) * (size - o), height: size }}>
      {avs.map((a, k) => (
        <img key={k} className="hv2-av stacked" src={a} alt="" width={size} height={size} decoding="async"
          style={{ left: k * (size - o), zIndex: avs.length - k }} />
      ))}
    </span>
  );
}

function Card({ c, hidden }: { c: StreamCard; hidden?: boolean }) {
  return (
    <article className="hv2-card" aria-hidden={hidden || undefined}>
      {c.avs
        ? <AvatarStack avs={c.avs} />
        : (
          <span className="hv2-avwrap">
            <img className="hv2-av" src={c.av} alt="" width={44} height={44} decoding="async" />
            {c.org ? (
              <span className="hv2-orgbadge">
                <img className="hv2-logo" src={ORG_LOGOS[c.org]} alt={c.org} width={19} height={19} decoding="async" />
              </span>
            ) : null}
          </span>
        )}
      <div className="hv2-body">
        <div className="hv2-area"><Icon name={c.icon} size={11} />{c.area}</div>
        <div className="hv2-who">
          <span className="hv2-name">{c.name}</span>
          {c.avs ? null : <span className="hv2-role">{c.role}</span>}
        </div>
        <div className="hv2-act">{c.act}</div>
        {c.meta ? <div className="hv2-meta">{c.meta}</div> : null}
        {c.invited ? (
          <div className="hv2-invited">
            {c.invited.map((p, k) => (
              <div className={'hv2-inv' + (p.mono ? ' bymail' : '')} key={k}>
                {p.mono
                  ? <span className="hv2-inv-mono">{p.mono}</span>
                  : <img className="hv2-inv-av" src={p.av} alt="" width={20} height={20} decoding="async" />}
                <span className="hv2-inv-name">{p.name}</span>
                <span className="hv2-inv-role">{p.role}</span>
                {p.status ? <span className="hv2-inv-status">{p.status}</span> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {c.pill ? (
        <div className="hv2-money">
          <span className={'hv2-pill' + (c.pillTone ? ' ' + c.pillTone : '')}>{c.pill}</span>
        </div>
      ) : null}
    </article>
  );
}

export default function HeroStream() {
  const cards = STREAM;
  const n = cards.length;
  const [i, setI] = useState(0);
  const [tween, setTween] = useState(true);
  // Card heights differ (the crew card carries the invited list, and text
  // wraps differently per width), so step distances are measured, not assumed.
  const [offs, setOffs] = useState<number[] | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstPass = useRef(true);

  useIsoLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setOffs(Array.from(el.children).map((c) => (c as HTMLElement).offsetTop));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // Wrap: snap as soon as the tween has landed, and mark the first pass done
    // so the next lap keeps the normal cadence instead of re-paying the
    // opening dwell.
    if (i >= n) {
      const t = setTimeout(() => { setTween(false); setI(0); firstPass.current = false; }, LANDED);
      return () => clearTimeout(t);
    }
    const hold = i === 0 && firstPass.current ? OPENING_DWELL : DWELL;
    const t = setTimeout(() => { setTween(true); setI(i + 1); }, hold);
    return () => clearTimeout(t);
  }, [i, n]);

  const list = cards.concat(cards.slice(0, 4));
  const at = (k: number) => (offs ? offs[Math.min(k, offs.length - 1)] - offs[0] : 0);
  // Until measured, the window keeps its CSS height and mask.
  const sized = offs
    ? (() => {
      const solid = at(3) - 12;
      const mask = `linear-gradient(to bottom, transparent 0, #000 6px, #000 ${solid}px, transparent 100%)`;
      return { height: solid + 64, WebkitMaskImage: mask, maskImage: mask };
    })()
    : undefined;

  return (
    <div className="hv2-window" style={sized}>
      <div ref={trackRef} className={'hv2-track' + (tween ? ' tween' : '')} style={{ transform: `translateY(${-at(i)}px)` }}>
        {list.map((c, k) => <Card key={k} c={c} hidden={k >= n} />)}
      </div>
    </div>
  );
}

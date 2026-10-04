/* Who's Beckstage for? — mobile. Stacked-text persona picker, then each
   category opens in place (one at a time; the first opens by default and
   whenever the persona changes). No auto-advance. */
import { useState } from 'react';
import { Icon } from './icons';
import { LineText } from './Keywords';
import { AUDIENCE, LINKS, splitOpening } from '../data/site';

export default function AudienceMobile() {
  const a = AUDIENCE;
  const [tab, setTabRaw] = useState(0);
  const [open, setOpen] = useState(0);
  const setTab = (i: number) => { setTabRaw(i); setOpen(0); };
  const [lead, hl] = splitOpening(a.lines[tab]);
  const cta = a.ctas[tab];
  return (
    <div className="bk-section audm">
      <div className="bk-wrap">
        <h2 className="bk-h2 audm-h2">{a.h2}</h2>
        <div className="audm-text-stack" role="tablist" aria-label="Who it’s for">
          {a.tabs.map((t, i) => (
            <button key={t} type="button" role="tab" aria-selected={i === tab}
              className={'audm-text-b' + (i === tab ? ' on' : '')} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>
        <p className="audm-open" key={'o' + tab}>{lead} <span className="audm-hl">{hl}</span></p>
        <div className="audm-acc" key={'a' + tab}>
          {a.views[tab].map((c, i) => (
            <div className={'audm-acc-item' + (open === i ? ' open' : '')} key={c.t}>
              <button type="button" className="audm-acc-head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span className="audm-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="audm-acc-t">{c.t}</span>
                <span className="audm-acc-ic"><Icon name="plus" size={15} /></span>
              </button>
              <div className="audm-acc-body">
                <ul className="audm-lines">
                  {c.lines.map((l, j) => <li key={j}><LineText l={l} kwClass="audm-kw" preClass="audm-pre" /></li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="audm-cta">
          <a className="bk-btn bk-btn-primary" href={LINKS.signup}>{cta.label}<Icon name="arrow" size={17} color="#fff" /></a>
          <span className="audm-cta-note">{cta.note}</span>
        </div>
      </div>
    </div>
  );
}

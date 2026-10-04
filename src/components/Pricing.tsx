/* Pricing: billing toggle (default Yearly = 10× monthly), persona tabs, and
   the Representative Pro calculator (1–60 artists with an active deal). */
import { useState } from 'react';
import { Icon } from './icons';
import { LINKS, PRICING, mailto, money, repPrice, type Feat, type Plan } from '../data/site';

type Billing = 'monthly' | 'yearly';
const cents = (n: number) => Math.round(n * 100) / 100;

function Feats({ feats }: { feats: Feat[] }) {
  return (
    <ul className="price-feats">
      {feats.map((ft, i) => {
        if (typeof ft === 'string' && ft.endsWith(', plus:')) {
          return <li key={i} className="price-feat-lead"><span style={{ width: 16 }} />{ft}</li>;
        }
        return (
          <li key={i}>
            <Icon name="check" size={15} />
            {typeof ft === 'string'
              ? <span>{ft}</span>
              : <span>{ft.t}<span className="cap"> · {ft.cap}</span></span>}
          </li>
        );
      })}
    </ul>
  );
}

function PriceCard({ p, billing }: { p: Plan; billing: Billing }) {
  const yearly = billing === 'yearly';
  return (
    <div className={'price-card' + (p.featured ? ' featured' : '')}>
      {p.badge && <div className="price-badge">{p.badge}</div>}
      <div className="price-name">{p.name}</div>
      <div className="price-for">{p.for}</div>
      <div className="price-amount">
        {p.mo === 0
          ? <span className="free">Free</span>
          : <><span className="amt">{money(cents(yearly ? p.yr / 12 : p.mo))}</span><span className="per">/mo</span></>}
      </div>
      <div className="price-yearnote">
        {p.mo === 0 ? null : (yearly ? `${money(p.yr)} billed yearly` : 'billed monthly')}
      </div>
      <div className="price-cta">
        <a className={'bk-btn ' + (p.featured ? 'bk-btn-primary' : 'bk-btn-ghost')} href={LINKS.signup}>{p.cta}</a>
      </div>
      <Feats feats={p.feats} />
    </div>
  );
}

function RepresentativePro({ billing }: { billing: Billing }) {
  const c = PRICING.repPro;
  const [n, setN] = useState(5);
  const yearly = billing === 'yearly';
  const mo = repPrice(n);
  const shown = yearly ? (mo * 10) / 12 : mo;
  return (
    <div className="price-card featured">
      <div className="price-badge">{c.badge}</div>
      <div className="price-name">{c.name}</div>
      <div className="price-for">{c.for}</div>
      <div className="calc-slider">
        <div className="calc-slider-top">
          <label className="calc-slider-label" htmlFor="rep-artists">Artists with an active deal</label>
          <span className="calc-count" aria-hidden="true">{n}{n === 60 ? '+' : ''}</span>
        </div>
        <input id="rep-artists" type="range" min={1} max={60} value={n}
          onChange={(e) => setN(+e.target.value)} aria-valuetext={`${n}${n === 60 ? ' or more' : ''} artists`} />
        <div className="calc-scale" aria-hidden="true"><span>1</span><span>20</span><span>40</span><span>60</span></div>
      </div>
      <div className="price-amount" aria-live="polite">
        <span className="amt">{money(cents(shown))}</span><span className="per">/mo</span>
      </div>
      <div className="price-yearnote">
        {yearly ? `${money(mo * 10)} billed yearly` : 'billed monthly'} · {money(cents(shown / n))} per artist
      </div>
      <div className="price-cta">
        <a className="bk-btn bk-btn-primary" href={LINKS.signup}>{c.cta}</a>
      </div>
      <Feats feats={c.feats} />
    </div>
  );
}

export default function Pricing() {
  const pr = PRICING;
  const [tab, setTab] = useState(0);
  const [billing, setBilling] = useState<Billing>('yearly');
  const isCrew = tab === 2;
  return (
    <div className="bk-wrap">
      <div className="pricing-head-row">
        <h2 className="bk-h2">{pr.h2}</h2>
        <p className="bk-lead">{pr.lead}</p>
      </div>

      <div className="pricing-controls">
        {!isCrew && (
          <div className="bill-wrap">
            <div className="seg" role="group" aria-label="Billing">
              {(['monthly', 'yearly'] as const).map((b) => (
                <button key={b} type="button" aria-pressed={billing === b} className={billing === b ? 'is-active' : undefined}
                  onClick={() => setBilling(b)}>{b === 'monthly' ? 'Monthly' : 'Yearly'}</button>
              ))}
            </div>
            <span className="bill-save" style={billing === 'yearly' ? undefined : { visibility: 'hidden' }} aria-hidden={billing !== 'yearly'}>2 months free</span>
          </div>
        )}
        <div className="seg seg-plans" role="tablist" aria-label="Plans">
          {pr.tabs.map((t, i) => (
            <button key={t} type="button" role="tab" aria-selected={i === tab} className={i === tab ? 'is-active' : undefined}
              onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>
      </div>

      {isCrew ? (
        <div className="crew-panel">
          <div className="crew-panel-main">
            <span className="crew-pill"><Icon name="checkCircle" size={14} />{pr.crewPanel.label}</span>
            <h3>{pr.crewPanel.title}</h3>
            <p>{pr.crewPanel.desc}</p>
            <ul className="crew-chips">
              {pr.crewPanel.feats.map((ft) => <li key={ft}><Icon name="check" size={15} />{ft}</li>)}
            </ul>
          </div>
          <div className="crew-panel-cta">
            <a className="bk-btn bk-btn-primary" href={LINKS.signup}>{pr.crewPanel.cta}<Icon name="arrow" size={17} color="#fff" /></a>
            <span>No subscription · no card</span>
          </div>
        </div>
      ) : (
        <>
          <div className="price-grid">
            {tab === 0
              ? pr.artists.map((p) => <PriceCard key={p.name} p={p} billing={billing} />)
              : <><PriceCard p={pr.repFree} billing={billing} /><RepresentativePro billing={billing} /></>}
          </div>
          <p className="price-rule">{pr.rule}</p>
          <ul className="price-rules">
            {pr.rules.map((r) => (
              <li key={r.t}><Icon name="check" size={15} /><div><strong>{r.t}</strong><span>{r.d}</span></div></li>
            ))}
          </ul>
          <p className="price-foot-note">{pr.footNote}<a href={mailto('More than 60 artists')}>{pr.footLink}</a>.</p>
        </>
      )}
    </div>
  );
}

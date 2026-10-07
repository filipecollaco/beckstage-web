// @ts-nocheck — ported from the Claude Design prototype (handoff_how_it_works, 2026-10-06), kept
// close to the reference so later handoffs diff cleanly.
// App screens, part 1 — primitives + Maya's booking screens. Every string is lifted from beckstage-fe (see source-notes.md).
import { useState as apUseState, useEffect as apUseEffect, useRef as apUseRef, useLayoutEffect as apUseLayout } from 'react';
import { MDI } from './mdi';
import { HIW_AV, HIW_ITIN, HIW_PEOPLE, HIW_REP, HIW_VENUE, hiwItinItems } from './data';

// Icons: the app's Material Design glyphs, inlined (see mdi.ts) instead of the reference's CDN font.
export function I({ n, s = 16, c, style }) {
  return <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden="true" style={{ color: c, flex: 'none', display: 'inline-block', ...style }}><path fill="currentColor" d={MDI[n] || ''} /></svg>;
}
export function Av({ who, s = 34, style }) {
  return <img className="ap-av" src={HIW_AV[who]} alt="" width={s} height={s} style={{ width: s, height: s, ...style }} />;
}
// Ping target: data-a marks the crop anchor for the mobile inset; `ping` restarts the ring.
export function P({ id, ping, children, round, style, className = '', tag }) {
  const on = ping && (ping.id === id || (ping.also || []).includes(id));
  const T = tag || 'div';
  return <T key={on ? 'p' + ping.k : 'n'} data-a={id} className={className + (on ? ' pg' + (round ? ' round' : '') + (ping.still ? ' static' : '') : '')} style={style}>{children}</T>;
}
export function ApStatus({ dark }) {
  return <div className="ap-sb" style={dark ? { color: '#fff' } : null}><span>9:41</span><span className="ic"><I n="signal-cellular-3" s={16} /><I n="wifi" s={16} /><I n="battery" s={18} style={{ transform: 'rotate(90deg)' }} /></span></div>;
}
export function ApTop() {
  return <div className="ap-top"><span className="ap-circle"><I n="chevron-left" s={20} /></span><span className="ap-label" style={{ color: 'var(--fg)', flex: 1, textAlign: 'center' }}>BOOKING</span><span className="ap-circle"><I n="bell-outline" s={17} /></span><span className="ap-circle"><I n="pencil-outline" s={16} /></span></div>;
}
// A scrolled screen never scrolls past its own end: y is clamped to content − viewport, so the last block sits on the bottom edge instead of over empty background.
export function ApScroll({ y = 0, children, pad }) {
  const port = apUseRef(null), inner = apUseRef(null);
  const [max, setMax] = apUseState(null);
  apUseLayout(() => {
    const m = () => { if (port.current && inner.current) setMax(Math.max(0, inner.current.offsetHeight - port.current.clientHeight)); };
    m(); const t = setTimeout(m, 300); return () => clearTimeout(t);
  });
  const yy = max == null ? y : Math.min(y, max);
  return <div className="ap-scroll" ref={port}><div className="in" ref={inner} style={{ transform: `translateY(${-yy}px)`, padding: pad }}>{children}</div></div>;
}
export function Btn({ kind = 'pri', size, icon, children, press, dis, style, full = true }) {
  return <div className={'ap-btn ' + kind + (size ? ' ' + size : '') + (dis ? ' dis' : '') + (press ? ' press' : '')} style={{ width: full ? '100%' : 'auto', padding: full ? 0 : '0 18px', ...style }}>{icon ? <I n={icon} s={16} /> : null}<span>{children}</span></div>;
}
export function Lbl({ children, c = 'var(--fg)', style }) { return <div className="ap-label" style={{ color: c, ...style }}>{children}</div>; }

// ── BookingHero (components/BookingHero.tsx, density mobile) ──
export function ApHero({ countdown = 'in 159 days' }) {
  return (
    <div style={{ padding: '14px 16px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 48, height: 48, borderRadius: 24, border: '1px solid var(--b)', overflow: 'hidden', marginTop: 4, flex: 'none' }}><Av who="band" s={48} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ap-dis" style={{ fontSize: 28, lineHeight: '34px', letterSpacing: -0.42, marginTop: 2, marginBottom: 8 }}>The Sundowners</div>
        <div className="ap-row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <span className="ap-row" style={{ gap: 6 }}><I n="calendar-blank-outline" s={13} c="var(--fg)" /><span className="ap-bsm" style={{ color: 'var(--tb)' }}>Sun 14 Mar 2027</span></span>
          {countdown ? <span className="ap-cap" style={{ color: 'var(--tmu)' }}>{countdown}</span> : null}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'flex-start' }}>
          <I n="map-marker-outline" s={13} c="var(--fg)" style={{ marginTop: 2 }} />
          <div><div className="ap-bsm" style={{ color: 'var(--fg)', fontWeight: 600 }}>Aurora Hall</div><div className="ap-row" style={{ gap: 4, marginTop: 2 }}><span className="ap-cap" style={{ color: 'var(--tmu)' }}>Köpenicker Straße 70, 10179 Berlin, Germany</span><I n="content-copy" s={13} c="var(--fg)" /></div></div>
        </div>
      </div>
    </div>
  );
}
// ── DelegationStrip (components/booking/DelegationStrip.tsx + utils/viewerDelegateStatus.ts) ──
export function ApStrip({ ping }) {
  return (
    <P id="strip" ping={ping} style={{ margin: '0 14px 12px', borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 36, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--bo)', background: 'var(--tint)' }}>
        <I n="shield-outline" s={14} c="var(--fg)" />
        <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 6, fontSize: 12.5, lineHeight: '18px' }}><span style={{ fontWeight: 600, color: 'var(--fg)' }}>You can edit production</span><span style={{ color: 'var(--tmu)' }}>· itinerary, venue, contacts, riders</span></div>
      </div>
    </P>
  );
}

// ── create-booking.tsx (mobile) ──
export function PickerRow({ icon, tileOn, avatar, label, value, placeholder, sub, trail = 'chevron-right' }) {
  return (
    <div className="ap-row" style={{ gap: 14, padding: '14px 16px' }}>
      {avatar || <span style={{ width: 32, height: 32, borderRadius: 6, background: tileOn ? 'var(--tint)' : 'var(--bg)', border: '1px solid ' + (tileOn ? 'var(--bo)' : 'var(--b)'), display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><I n={icon} s={14} c={tileOn ? 'var(--fg)' : 'var(--tb)'} /></span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Lbl>{label}</Lbl>
        <div className={value ? 'ap-typed' : ''} key={value || 'ph'} style={{ marginTop: 2, fontSize: 14, lineHeight: '20px', fontWeight: value ? 600 : 500, color: value ? 'var(--t)' : 'var(--tf)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || placeholder}</div>
        {sub && value ? <div className="ap-cap" style={{ color: 'var(--tmu)', marginTop: 1 }}>{sub}</div> : null}
      </div>
      <I n={trail} s={trail === 'magnify' ? 14 : 16} c="var(--tsu)" />
    </div>
  );
}
export const Div = () => <div style={{ height: 1, background: 'var(--b)', marginLeft: 62 }} />;
export function Toggle({ on, children, press }) {
  return <span className={'ap-pill' + (press ? ' press' : '')} style={{ gap: 4, padding: '7px 12px', border: '1.5px solid ' + (on ? 'var(--o)' : 'var(--bm)'), background: on ? 'var(--o)' : 'transparent', color: on ? '#fff' : 'var(--tb)', fontSize: 12, lineHeight: '17px', fontWeight: on ? 600 : 500 }}>{on ? <I n="check" s={11} c="#fff" /> : null}{children}</span>;
}
export function ScrCreate({ st }) {
  const f = st.f || 0;
  const ready = f >= 4;
  return (
    <div className="ap-col">
      <ApStatus />
      <div className="ap-row" style={{ justifyContent: 'space-between', padding: '10px 16px 12px' }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--tb)' }}>Cancel</span>
        <P id="save" ping={st.press === 'save' ? { id: 'save', k: 1 } : null}><span className={st.press === 'save' ? 'press' : ''} style={{ display: 'inline-block', fontSize: 14, fontWeight: 700, color: ready ? 'var(--o)' : 'var(--tf)' }}>Save</span></P>
      </div>
      <div style={{ padding: '4px 20px 14px' }}>
        <div className="ap-dis" style={{ fontSize: 28, lineHeight: '34px', letterSpacing: -0.42 }}>The Sundowners</div>
        <div className="ap-bsm" style={{ color: 'var(--tmu)', marginTop: 4 }}>Plan a show for The Sundowners.</div>
      </div>
      <ApScroll y={st.scroll || 0} pad="8px 16px 28px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><Lbl style={{ padding: '0 4px' }}>ARTIST</Lbl>
            <div className="ap-card"><PickerRow avatar={<Av who="band" s={32} />} label="ARTIST" value="The Sundowners" /></div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><Lbl style={{ padding: '0 4px' }}>WHEN · WHERE</Lbl>
            <P id="when" ping={st.ping} className="ap-card" style={{ borderRadius: 8 }}>
              <PickerRow icon="calendar-blank-outline" label="DATE" value={f >= 1 ? 'Sun, Mar 14, 2027' : ''} placeholder="Pick a date" />
              <Div />
              <PickerRow icon="map-marker" tileOn={f >= 2} label="VENUE" value={f >= 2 ? 'Aurora Hall' : ''} placeholder="Search venue, club, festival…" trail="magnify" />
              <Div />
              <PickerRow icon="home-outline" label="ADDRESS" value={f >= 2 ? 'Köpenicker Straße 70' : ''} sub="Berlin · Germany" placeholder="Enter address — or pick a venue above" trail="pencil-outline" />
            </P></div>
          <Lbl c="var(--tmu)" style={{ padding: '0 4px', marginBottom: -8 }}>RUNNING THE SHOW</Lbl>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Lbl style={{ padding: '0 4px' }}>ORGANIZER</Lbl>
            <div className="ap-cap" style={{ color: 'var(--tsu)', padding: '0 4px', lineHeight: '18px' }}>Runs this booking.</div>
            <div className="ap-card">
              <div className="ap-row" style={{ gap: 12, padding: 12, background: 'var(--tint)', borderBottom: '1px solid var(--b)' }}>
                <span style={{ width: 18, height: 18, borderRadius: 9, background: 'var(--fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}></span></span>
                <Av who="band" s={34} />
                <div style={{ flex: 1 }} className="ap-row"><span className="ap-bsm" style={{ fontWeight: 600 }}>The Sundowners</span><span className="ap-micro" style={{ color: 'var(--tsu)', letterSpacing: .5, marginLeft: 6 }}>· ARTIST</span></div>
              </div>
              <div className="ap-row" style={{ gap: 12, padding: 12 }}>
                <span style={{ width: 18, height: 18, borderRadius: 9, border: '2px solid var(--bm)' }}></span>
                <Av who="meridian" s={34} style={{ borderRadius: 8 }} />
                <div style={{ flex: 1, minWidth: 0 }}><div className="ap-bsm" style={{ fontWeight: 600 }}>{HIW_REP.name}</div><div className="ap-cap" style={{ color: 'var(--tmu)', marginTop: 2 }}>{HIW_REP.scope} · {HIW_REP.commission}</div></div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="ap-row" style={{ gap: 8 }}><Lbl>WHO ELSE CAN EDIT</Lbl><span style={{ padding: '2px 6px', background: 'var(--sm)', borderRadius: 999 }}><span className="ap-micro" style={{ color: 'var(--tsu)', fontWeight: 700, letterSpacing: .5 }}>OPTIONAL</span></span></div>
              <div className="ap-cap" style={{ color: 'var(--tsu)', lineHeight: '18px' }}><b style={{ color: 'var(--tb)', fontWeight: 600 }}>Production</b> = itinerary, venue, contacts.{'  '}<b style={{ color: 'var(--tb)', fontWeight: 600 }}>Crew</b> = inviting people, fees, roles.</div>
            </div>
            <P id="deleg" ping={st.ping} className="ap-card" style={{ borderRadius: 8 }}>
              <div className="ap-row" style={{ gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--b)' }}>
                <Av who="meridian" s={34} style={{ borderRadius: 8 }} />
                <span className="ap-bsm" style={{ fontWeight: 600, flex: 1, minWidth: 0 }}>{HIW_REP.name}</span>
                <div className="ap-row" style={{ gap: 6, flex: 'none' }}><Toggle on={false}>Production</Toggle><Toggle on={false}>Crew</Toggle></div>
              </div>
              <div className="ap-row" style={{ gap: 12, padding: '12px 16px' }}>
                <span style={{ width: 34, height: 34, borderRadius: 6, background: 'var(--sm)', border: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><I n="account-group-outline" s={17} c="var(--tb)" /></span>
                <span className="ap-bsm" style={{ fontWeight: 600, flex: 1, minWidth: 0 }}>Tour manager</span>
                <div className="ap-row" style={{ gap: 6, flex: 'none' }}><Toggle on={f >= 3} press={st.press === 'prod'}>Production</Toggle><Toggle on={false}>Crew</Toggle></div>
              </div>
            </P>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><Lbl style={{ padding: '0 4px' }}>STATUS</Lbl>
            <div className="ap-card"><div className="ap-row" style={{ gap: 8, padding: '14px 16px' }}>
              {[['Confirmed', 'var(--ok)'], ['Hold', 'var(--w)']].map(([l, d], i) => { const on = i === 0 && f >= 4; return <span key={l} className={'ap-pill' + (on && st.press === 'status' ? ' press' : '')} style={{ gap: 8, padding: '8px 14px', border: '1.5px solid ' + (on ? 'var(--o)' : 'var(--bm)'), background: on ? 'var(--o)' : 'transparent', color: on ? '#fff' : 'var(--tb)', fontSize: 13, lineHeight: '19px', fontWeight: on ? 600 : 500 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: on ? '#fff' : d }}></span>{l}</span>; })}
            </div></div></div>
        </div>
      </ApScroll>
    </div>
  );
}

// ── CrewFirstCard + CrewFirstDoors (components/booking/overview/CrewFirstCard.tsx) ──
export function ScrOvEmpty({ st }) {
  return (
    <div className="ap-col">
      <ApStatus /><ApTop /><ApHero />
      <div style={{ padding: '0 14px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="ap-card ap-xl" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid var(--bo)', background: 'var(--tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><I n="account-group" s={20} c="var(--fg)" /></span>
            <div><div className="ap-dis" style={{ fontSize: 17, lineHeight: '22px', letterSpacing: -0.2 }}>Start with the crew</div><div style={{ color: 'var(--tmu)', marginTop: 4 }}>Invite who’s playing and working this show — the rest of the booking is built around them.</div></div>
          </div>
          <Btn icon="account-plus-outline" press={st.press === 'invite'}>Invite crew</Btn>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="ap-micro" style={{ color: 'var(--fg)', padding: '0 2px' }}>The rest of the booking</div>
          <div className="ap-card ap-xl">
            {[['clock-outline', 'Itinerary'], ['card-account-phone', 'Contacts'], ['map-marker', 'Venue'], ['guitar-electric', 'Artist Riders'], ['calculator', 'Accounting']].map(([ic, t], i) => (
              <div key={t} className="ap-row" style={{ gap: 11, height: 46, padding: '0 14px', borderTop: i ? '1px solid var(--b)' : 0 }}><I n={ic} s={16} c="var(--tsu)" /><span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--tb)' }}>{t}</span><I n="chevron-right" s={15} c="var(--tf)" /></div>
            ))}
          </div>
        </div>
      </div>
      {st.sheet ? <><div className="ap-scrim"></div><CrewAddSheet s={st.sheet.s} h={st.h} /></> : null}
    </div>
  );
}

// ── Overview blocks (components/booking/overview/*) ──
export function OvBlock({ icon, title, summary, cta, children, flush, id, ping, pressed }) {
  return (
    <P id={id} ping={ping} className={'ap-card ap-xl' + (pressed ? ' press' : '')}>
      <div className="ap-row" style={{ gap: 11, padding: '12px 14px', alignItems: cta ? 'center' : 'flex-start', background: pressed ? 'var(--sa)' : undefined }}>
        <span style={{ height: 20, display: 'flex', alignItems: 'center' }}><I n={icon} s={17} c={cta ? 'var(--tsu)' : 'var(--fg)'} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: '20px' }}>{title}</div>
          {cta ? <div className="ap-bsm" style={{ color: 'var(--tmu)', marginTop: 1 }}>{cta[0]}</div> : summary ? <div className="ap-bsm" style={{ marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><span style={{ fontWeight: 600, color: 'var(--fg)' }}>{summary[0]}</span><span style={{ color: 'var(--tmu)' }}>{(summary[1] || []).map((q) => ' · ' + q).join('')}</span></div> : null}
        </div>
        {cta ? <span className="ap-pill" style={{ height: 30, padding: '0 11px', borderRadius: 8, border: '1px solid var(--bo)', background: 'var(--tint)', gap: 5, flex: 'none' }}><I n="plus" s={13} c="var(--fg)" /><span style={{ fontSize: 12, lineHeight: '17px', fontWeight: 600, color: 'var(--fg)', whiteSpace: 'nowrap' }}>{cta[1]}</span></span> : <span style={{ height: 20, display: 'flex', alignItems: 'center' }}><I n="chevron-right" s={16} c="var(--tsu)" /></span>}
      </div>
      {children ? <div style={flush ? null : { padding: '0 14px 14px' }}>{children}</div> : null}
    </P>
  );
}
export const CTA = { itinerary: ['No travel, load-in or soundcheck yet.', 'Add an item'], contacts: ['No promoter or production contacts.', 'Add contacts'], venue: ['Production, hospitality and parking notes.', 'Fill in'], backline: ['No riders attached to this show.', 'Add rider'], accounting: ['No fee set, nothing to settle yet.', 'Set the fee'] };

export function PlannerRow({ start, end, color, title, place, who = [], i = 0, id, ping }) {
  return (
    <div className="ap-row" style={{ gap: 10, padding: '10px 8px 10px 12px', background: i % 2 ? 'var(--bg)' : 'var(--s)', alignItems: 'center' }}>
      <div style={{ width: 44, flex: 'none' }}><P id={id} ping={ping} tag="span" style={{ display: 'inline-block', borderRadius: 4 }}><span className="ap-dis" key={start} style={{ display: 'block', fontSize: 13, lineHeight: '17px', fontVariantNumeric: 'tabular-nums' }}>{start}</span></P>{end ? <div style={{ fontSize: 10, lineHeight: '14px', color: 'var(--tsu)', fontWeight: 500 }}>{end}</div> : null}</div>
      <span style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: color, flex: 'none' }}></span>
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, lineHeight: '18px' }}>{title}</div><div style={{ fontSize: 11, lineHeight: '16px', color: 'var(--tmu)', marginTop: 1 }}>{place}</div></div>
      {who.length ? <div style={{ display: 'flex', alignItems: 'center' }}>{who.slice(0, 3).map((w, k) => <Av key={w} who={w} s={18} style={{ marginLeft: k ? -5 : 0, boxShadow: '0 0 0 1.5px ' + (i % 2 ? '#fff9f3' : '#fff') }} />)}{who.length > 3 ? <span style={{ marginLeft: -5, height: 18, minWidth: 18, padding: '0 4px', borderRadius: 999, background: 'var(--sm)', boxShadow: '0 0 0 1.5px ' + (i % 2 ? '#fff9f3' : '#fff'), fontSize: 9, fontWeight: 700, color: 'var(--tb)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>+{who.length - 3}</span> : null}</div> : null}
      <I n="chevron-right" s={14} c="var(--tf)" />
    </div>
  );
}
export function ItinBody({ loadIn = '15:00', ping, n = HIW_ITIN.length }) {
  return (
    <div>
      <div style={{ padding: '0 14px 10px' }}><Lbl>DAY OF SHOW</Lbl><div className="ap-bsm" style={{ color: 'var(--tmu)', marginTop: 2 }}>{`Sun 14 Mar · ${n} ${n === 1 ? 'item' : 'items'}`}</div></div>
      <div style={{ borderTop: '1px solid var(--b)' }}>
        {hiwItinItems(n).map((it, i) => <PlannerRow key={it.title} start={it.start === 'LOADIN' ? loadIn : it.start} end={it.end} color={it.color} title={it.title} place={it.place} who={it.who} i={i} id={it.id} ping={it.id ? ping : null} />)}
      </div>
    </div>
  );
}
export function ContactsBody({ n = 2 }) {
  const list = [HIW_VENUE.contact, HIW_VENUE.contact2].slice(0, n);
  return <div style={{ background: 'var(--sa)', border: '1px solid var(--b)', borderRadius: 8, overflow: 'hidden' }}>{list.map((c, i) => <div key={c.name} className="ap-row ap-fade" style={{ gap: 10, minHeight: 48, padding: '8px 10px', borderTop: i ? '1px solid var(--b)' : 0 }}><div style={{ flex: 1, minWidth: 0 }}><div className="ap-dis" style={{ fontSize: 12.5, lineHeight: '16px' }}>{c.name}</div><div className="ap-cap" style={{ color: 'var(--tmu)', fontWeight: 400 }}>{c.role}</div></div><span className="ap-pill" style={{ gap: 4, padding: '4px 9px', border: '1px solid var(--bo)', background: 'var(--tint)', fontSize: 11, fontWeight: 600, color: 'var(--fg)' }}><I n="phone" s={12} c="var(--fg)" />Call</span><span className="ap-pill" style={{ gap: 4, padding: '4px 9px', border: '1px solid var(--bo)', background: 'var(--tint)', fontSize: 11, fontWeight: 600, color: 'var(--fg)' }}><I n="email-outline" s={12} c="var(--fg)" />Email</span></div>)}</div>;
}
export function VenueBody({ riders }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="ap-row" style={{ gap: 10 }}><span style={{ flex: 1, fontSize: 12.5, lineHeight: '18px', fontWeight: 600, color: 'var(--fg)' }}>Köpenicker Straße 70, 10179 Berlin, Germany</span><span className="ap-pill" style={{ gap: 4, padding: '4px 9px', border: '1px solid var(--bo)', background: 'var(--tint)', fontSize: 11, fontWeight: 600, color: 'var(--fg)' }}><I n="map-outline" s={12} c="var(--fg)" />Open in Maps</span></div>
      <div style={{ borderTop: '1px solid var(--b)' }}>
        {[['LOAD-IN', HIW_VENUE.loadIn], ['PARKING', HIW_VENUE.parking]].map(([l, v]) => <div key={l} className="ap-row" style={{ gap: 12, padding: '8px 0', borderBottom: '1px solid var(--b)', alignItems: 'flex-start' }}><span className="ap-micro" style={{ lineHeight: '14px', width: 62, flex: 'none', paddingTop: 2, color: 'var(--tmu)' }}>{l}</span><span style={{ flex: 1, fontSize: 12.5, lineHeight: '18px', color: 'var(--tb)' }}>{v}</span></div>)}
      </div>
      {riders ? <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 12, lineHeight: '17px', fontWeight: 600, color: 'var(--fg)' }}>Venue Riders</span><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}><span className="ap-pill" style={{ gap: 5, height: 28, padding: '0 10px', borderRadius: 6, background: 'var(--tint)', border: '1px solid var(--bo)', fontSize: 11.5, fontWeight: 600, color: 'var(--fg)' }}><I n="paperclip" s={12} c="var(--fg)" />{HIW_VENUE.rider}</span></div></div> : null}
    </div>
  );
}
export function CrewStrip({ crew, viewer, ping }) {
  const order = ['dan', 'rui', 'nils', 'petr'];
  const conf = order.filter((k) => crew[k] === 'c');
  const ordered = [...conf.filter((k) => k === 'dan'), ...conf.filter((k) => k !== 'dan'), ...order.filter((k) => crew[k] !== 'c')].filter((k) => k !== viewer);
  const dot = (k) => <span style={{ position: 'absolute', right: -1, bottom: -1, width: 9, height: 9, borderRadius: 5, border: '1.5px solid #fff', background: crew[k] === 'c' ? 'var(--ok)' : 'var(--w)', transition: 'background .3s' }}></span>;
  return (
    <div data-a="crew-strip" className="ap-card" style={{ borderRadius: 8, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, minHeight: 48, padding: '8px 10px' }}>
      {viewer ? <span style={{ position: 'relative' }}><Av who={viewer} s={28} />{dot(viewer)}</span> : null}
      {ordered.map((k) => <P key={k} id={'crew-' + k} ping={ping} round tag="span" style={{ position: 'relative', borderRadius: 999, display: 'inline-flex' }}><Av who={k} s={28} style={{ opacity: crew[k] === 'c' ? 1 : .55, filter: crew[k] === 'c' ? 'none' : 'grayscale(.7)', transition: 'opacity .3s, filter .3s' }} />{dot(k)}</P>)}
    </div>
  );
}
export function crewSummary(crew) { const c = Object.values(crew).filter((v) => v === 'c').length; const i = Object.values(crew).filter((v) => v === 'i').length; return [c + ' confirmed', i ? [i + ' invited'] : []]; }

// Maya's Overview (components/BookingDetail.tsx · BookingOverviewTab, organizer)
export function ScrOv({ st, ping }) {
  return (
    <div className="ap-col">
      <ApStatus /><ApTop />
      <ApScroll y={st.scroll || 0}>
        <ApHero countdown={st.after ? null : 'in 159 days'} />
        <div style={{ padding: '0 14px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {st.itin ? <OvBlock id="itin" ping={ping} icon="clock-outline" title="Itinerary" summary={[(st.itinN || HIW_ITIN.length) + ((st.itinN || HIW_ITIN.length) === 1 ? ' item' : ' items') + ' across 1 day']} flush><ItinBody n={st.itinN || HIW_ITIN.length} loadIn={st.itin === 2 ? '16:00' : '15:00'} ping={ping} /></OvBlock> : <OvBlock id="itin" ping={ping} icon="clock-outline" title="Itinerary" cta={CTA.itinerary} />}
          {st.contacts ? <OvBlock id="contacts" ping={ping} icon="card-account-phone" title="Contacts"><ContactsBody n={st.contacts === 1 ? 1 : 2} /></OvBlock> : <OvBlock id="contacts" ping={ping} icon="card-account-phone" title="Contacts" cta={CTA.contacts} />}
          {st.venue ? <OvBlock id="venue" ping={ping} icon="map-marker" title="Venue"><VenueBody riders={st.riders} /></OvBlock> : <OvBlock id="venue" ping={ping} icon="map-marker" title="Venue" cta={CTA.venue} />}
          <OvBlock id="crew" ping={ping} icon="account-group" title="Crew" summary={crewSummary(st.crew)}><CrewStrip crew={st.crew} ping={ping} /></OvBlock>
          <OvBlock icon="guitar-electric" title="Artist Riders" cta={CTA.backline} />
          {(() => {
            // An accepted invite writes that person's crew fee as an expense — the figures follow the crew.
            const exp = ['dan', 'rui', 'nils', 'petr'].filter((k) => st.crew[k] === 'c').reduce((s, k) => s + HIW_PEOPLE[k].fee, 0);
            const f = (v) => '€' + v.toLocaleString('en-IE');
            return <OvBlock id="acct" icon="calculator" title="Accounting" pressed={st.press === 'acct'}><MoneyCells cells={[['FEE', '€4,000'], ['EXPENSES', '−' + f(exp)], ['NET', f(4000 - exp)]]} /></OvBlock>;
          })()}
        </div>
      </ApScroll>
    </div>
  );
}
// OverviewMoneyBody · Figures (components/booking/overview/OverviewMoneyBody.tsx)
export function MoneyCells({ cells }) {
  return <div style={{ display: 'flex', border: '1px solid var(--b)', borderRadius: 8, background: 'var(--bg)', overflow: 'hidden' }}>{cells.map(([k, v, text], i) => <div key={k} style={{ flex: 1, minWidth: 0, padding: '9px 12px 10px', borderLeft: i ? '1px solid var(--b)' : 0 }}><div className="ap-micro" style={{ lineHeight: '14px', color: 'var(--tmu)' }}>{k}</div><div style={text ? { fontSize: 13, lineHeight: '24px', fontWeight: 500, color: 'var(--tmu)', marginTop: 2 } : { fontFamily: 'Inter', fontWeight: 600, fontSize: 18, lineHeight: '24px', letterSpacing: -0.3, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{v}</div></div>)}</div>;
}

// ── Crew add sheet (components/crew/add/CrewAddSheet + CrewAddBody + CrewAddRow + crewAddReceipt.ts) ──
export function SelectCheck({ on }) { return <span style={{ width: 20, height: 20, borderRadius: 4, border: '1.5px solid ' + (on ? 'var(--o)' : 'var(--bs)'), background: on ? 'var(--o)' : 'var(--s)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{on ? <I n="check" s={13} c="#fff" /> : null}</span>; }
export function GroupLabel({ children, action, first }) { return <div className="ap-row" style={{ gap: 8, padding: (first ? 13 : 22) + 'px 16px 7px' }}><span className="ap-micro" style={{ flex: 1, color: 'var(--fg)' }}>{children}</span>{action ? <span className="ap-cap" style={{ fontWeight: 700, color: 'var(--fg)' }}>{action}</span> : null}</div>; }
export function AddRow({ who, sel, asking, role, money, isNew, open, done, pressed, roleOn, fee = '', typing }) {
  roleOn = roleOn ?? done; if (done && !fee) fee = '200';
  const p = HIW_PEOPLE[who];
  return (
    <div style={open ? { background: 'var(--sa)' } : null}>
      <div className={'ap-row' + (pressed ? ' press' : '')} style={{ gap: 4, padding: '10px 16px' }}>
        <div className="ap-row" style={{ flex: 1, gap: 11, minWidth: 0 }}>
          <SelectCheck on={sel} /><Av who={who} s={34} />
          <div style={{ flex: 1, minWidth: 0, opacity: sel ? 1 : .6 }}>
            <div className="ap-row" style={{ gap: 5, flexWrap: 'wrap' }}><span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.name}</span>{p.user && (asking || isNew || open) ? <span className="ap-cap" style={{ color: 'var(--tmu)' }}>@{p.user}</span> : null}{isNew ? <span style={{ padding: '1px 5px', borderRadius: 4, background: 'var(--ts)' }}><span className="ap-micro" style={{ fontWeight: 700, color: 'var(--fg)', letterSpacing: .4 }}>NEW</span></span> : null}</div>
            {asking ? <div className="ap-cap" style={{ fontWeight: 600, color: 'var(--w)', marginTop: 2 }}>Set a role and fee</div> : <>{role ? <div className="ap-cap" style={{ fontWeight: 600, color: 'var(--tb)', marginTop: 2 }}>{role}</div> : null}{money ? <div className="ap-cap" style={{ fontWeight: 600, color: 'var(--fg)', marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>{money}</div> : null}</>}
          </div>
        </div>
        <span style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, flex: 'none', ...(open ? { background: done ? 'var(--okb)' : 'var(--wb)', border: '1px solid ' + (done ? '#2c744955' : '#8a631255') } : null) }}><I n={open ? 'chevron-up' : sel ? 'pencil-outline' : 'plus'} s={open ? 14 : sel ? 14 : 15} c={open ? (done ? 'var(--ok)' : 'var(--w)') : 'var(--tsu)'} /></span>
      </div>
      {open ? (
        <div style={{ padding: '0 16px 12px' }}><div style={{ padding: 14, background: 'var(--s)', border: '1px solid var(--bo)', borderRadius: 8 }}>
          <div className="ap-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}><Lbl>ROLE ON THIS BOOKING</Lbl><span className="ap-cap" style={{ fontWeight: 700, color: 'var(--fg)' }}>Multiple allowed</span></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[['music', 'Musician'], ['lightbulb-on', 'Lighting Designer'], ['tune-vertical', 'Sound Engineer'], ['truck', 'Driver'], ['clipboard-text-outline', 'Tour Manager'], ['guitar-electric', 'Backline Tech']].map(([ic, l]) => { const on = roleOn && l === 'Driver'; return <span key={l} className={'ap-pill' + (on && !fee ? ' press' : '')} style={{ height: 34, padding: '0 12px', gap: 6, border: '1px solid ' + (on ? 'var(--bo)' : 'var(--b)'), background: on ? 'var(--tint)' : 'var(--s)', boxShadow: on ? '0 0 0 3px rgba(255,143,0,.08)' : '0 1px 0 rgba(99,65,30,.04)' }}><I n={on ? 'check' : ic} s={12} c={on ? 'var(--fg)' : 'var(--tmu)'} /><span className="ap-cap" style={{ fontWeight: 600, color: on ? 'var(--fg)' : 'var(--tb)' }}>{l}</span></span>; })}
          </div>
          <Lbl style={{ marginTop: 16, marginBottom: 8 }}>FEE FOR THIS BOOKING</Lbl>
          <div className="ap-row" style={{ height: 44, border: '1px solid ' + (typing ? 'var(--o)' : 'var(--bm)'), boxShadow: typing ? '0 0 0 3px rgba(255,143,0,.25)' : 'none', borderRadius: 8, background: 'var(--s)', padding: '0 12px', gap: 8 }}><span style={{ color: 'var(--tmu)', fontWeight: 600 }}>€</span><span style={{ fontSize: 15, fontWeight: 600, color: fee ? 'var(--t)' : 'var(--tf)', fontVariantNumeric: 'tabular-nums' }}>{fee || (typing ? '' : '0')}</span>{typing ? <span className="caret"></span> : null}<span style={{ flex: 1 }}></span><span className="ap-cap" style={{ color: 'var(--tsu)' }}>EUR</span></div>
        </div></div>
      ) : null}
    </div>
  );
}
export function CrewAddSheet({ s = 0, h = 844 }) {
  const P3 = ['dan', 'rui', 'nils'];
  const sel = s >= 1, typed = s === 2;
  const portRef = apUseRef(null), listRef = apUseRef(null);
  const [over, setOver] = apUseState(0);
  apUseLayout(() => {
    const m = () => { if (portRef.current && listRef.current) setOver(Math.max(0, listRef.current.offsetHeight - portRef.current.clientHeight)); };
    m(); const t = setTimeout(m, 300); return () => clearTimeout(t);
  }, [s]);
  const shift = s >= 3 && s < 5 ? over : 0;
  return (
    <div className="ap-sheet" style={{ maxHeight: Math.round(h * 0.9) }}>
      <div className="ap-grab"></div>
      <div className="ap-row" style={{ gap: 12, padding: '16px 16px 12px', borderBottom: '1px solid var(--b)' }}><div style={{ flex: 1 }}><div className="ap-dis" style={{ fontSize: 17, lineHeight: '21px' }}>Invite crew</div><div className="ap-cap" style={{ color: 'var(--tmu)' }}>to The Sundowners · 14 Mar</div></div><I n="close" s={20} c="var(--tmu)" /></div>
      <div ref={portRef} style={{ flexShrink: 1, minHeight: 0, overflow: 'hidden' }}>
        <div ref={listRef} style={{ transform: `translateY(${-shift}px)`, transition: 'transform .6s cubic-bezier(.2,.7,.3,1)' }}>
        <div style={{ padding: '16px 16px 8px' }}>
          <Lbl style={{ marginBottom: 8 }}>NAME, @USERNAME OR EMAIL</Lbl>
          <div className="ap-row" style={{ height: 44, gap: 8, padding: '0 12px', background: 'var(--s)', border: '1px solid ' + (typed ? 'var(--o)' : 'var(--bm)'), borderRadius: 8, boxShadow: typed ? '0 0 0 3px rgba(255,143,0,.25)' : 'none' }}><I n="magnify" s={16} c="var(--tsu)" />{typed ? <span style={{ fontSize: 14, color: 'var(--t)' }}>@petr<span className="caret"></span></span> : <span style={{ fontSize: 14, color: 'var(--tsu)' }}>@username or name@email.com</span>}</div>
          {typed ? null : <div className="ap-cap" style={{ color: 'var(--tsu)', marginTop: 6 }}>Anyone can be invited — by @username, or by email if they're not on Beckstage yet.</div>}
        </div>
        {typed ? <><GroupLabel first>RESULTS · 1</GroupLabel><AddRow who="petr" sel={false} /></> : null}
        {sel ? <><GroupLabel first={!typed}>{`SELECTED · ${s >= 3 ? 4 : 3}`}</GroupLabel>
          {P3.map((k) => <AddRow key={k} who={k} sel role={HIW_PEOPLE[k].role} money={'€' + HIW_PEOPLE[k].fee} />)}
          {s >= 3 ? (() => { const fee = s >= 3.4 ? '200' : s >= 3.3 ? '20' : s >= 3.2 ? '2' : ''; return <AddRow who="petr" sel open asking={s === 3} isNew={s >= 3.1} roleOn={s >= 3.1} fee={fee} typing={s >= 3.15 && s < 4} done={fee !== ''} role={s >= 3.1 ? 'Driver' : null} money={s >= 3.1 ? (fee ? '€' + fee : '€ —') : null} />; })() : null}
        </> : <><GroupLabel first action="Select all">Casa Capitão · 12 Jun</GroupLabel>{P3.map((k) => <AddRow key={k} who={k} sel={false} role={HIW_PEOPLE[k].role} money={'€' + HIW_PEOPLE[k].fee} />)}</>}
        </div>
      </div>
      <div style={{ padding: 16, borderTop: '1px solid var(--b)', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg)' }}>
        {s === 0 ? <div className="ap-bsm" style={{ fontWeight: 600, color: 'var(--tmu)' }}>Pick who to invite.</div> : s === 3 ? <div className="ap-bsm" style={{ fontWeight: 600, color: 'var(--w)' }}>Set a role for 1 person</div> : s >= 3.1 && s < 3.2 ? <div className="ap-bsm" style={{ fontWeight: 600, color: 'var(--w)' }}>Set a fee for 1 person</div> : null}
        <Btn icon="email-outline" dis={s === 0 || (s >= 3 && s < 3.2)} press={s === 5}>{s === 0 ? 'Send invite' : s === 5 ? 'Sending…' : s >= 3 ? 'Send 4 invites' : 'Send 3 invites'}</Btn>
      </div>
    </div>
  );
}



// App screens, part 2 — the invitee, Dan's production screens, Accounting and Balance. Strings from beckstage-fe (source-notes.md).
export function SecHero({ title, summary, entity }) {
  return <div style={{ padding: '12px 16px 16px' }}><div className="ap-dis" style={{ fontSize: 32, lineHeight: '39px', letterSpacing: -0.5 }}>{title}</div>{summary ? <div className="ap-bsm" style={{ color: 'var(--tmu)', marginTop: 6 }}>{summary}</div> : null}{entity ? <div className="ap-bsm" style={{ color: 'var(--tsu)', fontStyle: 'italic', marginTop: 4 }}>{entity}</div> : null}</div>;
}
export function Toast({ children, hold }) { return <div className={'ap-toast' + (hold ? ' hold' : '')}><I n="check-circle" s={18} c="#57c98c" />{children}</div>; }
export function SheetLbl({ children, tally, action }) {
  return <div className="ap-row" style={{ gap: 8, padding: '2px 2px 8px' }}><span style={{ width: 4, height: 13, borderRadius: 2, background: 'var(--bo)' }}></span><span className="ap-label" style={{ color: 'var(--tmu)' }}>{children}</span>{tally ? <span className="ap-pill" style={{ gap: 4, marginLeft: 2, padding: '2px 8px', background: 'var(--okb)' }}><I n="paperclip" s={10} c="var(--ok)" /><span className="ap-mono" style={{ fontSize: 10, fontWeight: 700, color: 'var(--ok)' }}>{tally}</span></span> : null}{action ? <><span style={{ flex: 1 }}></span><span className="ap-row" style={{ gap: 4 }}><I n={action[0]} s={11} c="var(--fg)" /><span className="ap-cap" style={{ color: 'var(--fg)', fontWeight: 700, letterSpacing: .66, textTransform: 'uppercase' }}>{action[1]}</span></span></> : null}</div>;
}
export function HiwMoney({ c, size = 13, strong, accent, out }) {
  const v = (c / 100).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return <span className="ap-row" style={{ gap: 3, alignItems: 'baseline' }}><span className="ap-mono" style={{ fontSize: size - 2, color: accent ? 'var(--fg)' : 'var(--tf)' }}>€</span><span className="ap-mono" style={{ fontSize: size, fontWeight: strong ? 700 : 500, color: accent ? 'var(--fg)' : out ? 'var(--tmu)' : 'var(--t)' }}>{v}</span></span>;
}
export function BalNote({ text, press }) {
  return <div className="ap-row" style={{ flexWrap: 'wrap', gap: 10, padding: '10px 14px', background: 'var(--s)', borderTop: '1px solid var(--b)' }}><span style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--okb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I n="check" s={12} c="var(--ok)" /></span><span style={{ flex: 1, minWidth: 150, fontWeight: 600, fontSize: 12.5, lineHeight: '18px', color: 'var(--ok)' }}>{text}</span><span className={'ap-row' + (press ? ' press' : '')} style={{ gap: 4, ...(press ? { background: 'var(--tint)', borderRadius: 6, padding: '2px 6px', margin: '-2px -6px' } : null) }}><span style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--fg)' }}>Open Balance</span><I n="arrow-right" s={13} c="var(--fg)" /></span></div>;
}
export function Sheet({ h, ratio = 0.7, title, children, footer, header }) {
  return <><div className="ap-scrim"></div><div className="ap-sheet" style={{ maxHeight: Math.round(h * ratio) }}><div className="ap-grab"></div>{header || <div className="ap-row" style={{ justifyContent: 'space-between', padding: '16px 16px 12px' }}><span className="ap-dis" style={{ fontSize: 17, lineHeight: '21px' }}>{title}</span><I n="close" s={24} c="var(--tmu)" /></div>}<div style={{ flexShrink: 1, minHeight: 0, overflow: 'hidden', padding: 16 }}>{children}</div>{footer ? <div style={{ padding: 16, background: 'var(--bg)', borderTop: '1px solid var(--b)' }}>{footer}</div> : null}</div></>;
}
export function ScrOff() { return <div className="ap-off"></div>; }

// ── app/booking-invite/[inviteId].tsx ──
export const ROLE_ICON = { Driver: 'truck-outline', 'Sound Engineer': 'speaker', 'Lighting Designer': 'lightbulb-outline', 'Tour Manager': 'shield-account-outline' };
export function ScrInvite({ st, h }) {
  const p = HIW_PEOPLE[st.who];
  const tm = st.who === 'dan';
  return (
    <div className="ap-col"><ApStatus />
      <Sheet h={h} ratio={0.66} title="Crew invite" footer={<div className="ap-row" style={{ gap: 12 }}><div style={{ flexBasis: 130 }}><Btn kind="ghost" style={{ color: 'var(--o)' }}>Decline</Btn></div><div style={{ flex: 1 }}><Btn press={st.press}>{st.press ? 'Accepting…' : 'Accept invite'}</Btn></div></div>}>
        <Lbl style={{ marginBottom: 8 }}>THE BOOKING</Lbl>
        <div className="ap-dis" style={{ fontSize: 28, lineHeight: '34px', letterSpacing: -0.42 }}>The Sundowners</div>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--b)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="ap-row" style={{ gap: 9 }}><I n="map-marker-outline" s={15} c="var(--tmu)" /><span style={{ color: 'var(--tb)' }}>Aurora Hall · Berlin</span></div>
          <div className="ap-row" style={{ gap: 9 }}><I n="calendar-blank-outline" s={15} c="var(--tmu)" /><span style={{ fontWeight: 600 }}>Sunday, Mar 14, 2027</span></div>
        </div>
        <Lbl style={{ marginTop: 22, marginBottom: 8 }}>THE OFFER</Lbl>
        <div style={{ background: 'var(--s)', borderRadius: 12, border: '1px solid var(--bm)', padding: 18, boxShadow: '0 1px 2px rgba(99,65,30,.06)' }}>
          <div className="ap-row" style={{ gap: 10 }}><I n={ROLE_ICON[p.role]} s={18} c="var(--t)" /><span className="ap-dis" style={{ fontSize: 16, lineHeight: '20px' }}>{p.role}</span></div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--b)' }}><div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 32, lineHeight: '34px', letterSpacing: -0.8, color: 'var(--fg)' }}>€{p.fee}</div><div className="ap-cap" style={{ color: 'var(--tmu)', marginTop: 4 }}>Fixed fee · this booking</div></div>
        </div>
        {tm ? <div style={{ marginTop: 18, display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 8, background: 'var(--tint)', border: '1px solid var(--bo)' }}><I n="shield-account-outline" s={16} c="var(--fg)" style={{ marginTop: 1 }} /><div><div className="ap-bsm" style={{ fontWeight: 600, color: 'var(--t)' }}>Eligible for delegation</div><div className="ap-cap" style={{ color: 'var(--tb)', marginTop: 2, lineHeight: '17px' }}>As Tour Manager, the organizer can later hand you this booking's production &amp; crew management.</div></div></div> : null}
        <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--b)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="ap-row" style={{ gap: 10 }}><Av who="band" s={28} style={{ borderRadius: 7 }} /><span className="ap-cap" style={{ color: 'var(--tmu)' }}>Contracted by <b style={{ color: 'var(--tb)', fontWeight: 600 }}>The Sundowners</b></span></div>
          <div className="ap-row" style={{ gap: 10 }}><Av who="maya" s={28} /><span className="ap-cap" style={{ color: 'var(--tmu)' }}>Invite sent by <b style={{ color: 'var(--tb)', fontWeight: 600 }}>Maya Sundowner</b></span></div>
        </div>
      </Sheet>
    </div>
  );
}

// ── Dan's booking (BookingDetail mobile, delegate with production grant) ──
export function ScrDov({ st, ping }) {
  return (
    <div className="ap-col"><ApStatus /><ApTop />
      <ApScroll y={st.scroll || 0}>
        <ApHero /><ApStrip ping={ping} />
        <div style={{ padding: '0 14px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {st.itin ? <OvBlock icon="clock-outline" title="Itinerary" summary={[HIW_ITIN.length + ' items across 1 day']} flush><ItinBody loadIn={st.itin === 2 ? '16:00' : '15:00'} /></OvBlock> : <OvBlock icon="clock-outline" title="Itinerary" cta={CTA.itinerary} />}
          {st.contacts ? <OvBlock icon="card-account-phone" title="Contacts"><ContactsBody n={st.contacts === 1 ? 1 : 2} /></OvBlock> : <OvBlock icon="card-account-phone" title="Contacts" cta={CTA.contacts} pressed={st.press === 'contacts'} />}
          {st.venue ? <OvBlock icon="map-marker" title="Venue"><VenueBody riders={st.riders} /></OvBlock> : <OvBlock icon="map-marker" title="Venue" cta={CTA.venue} />}
          <OvBlock icon="account-group" title="Crew" summary={['4 confirmed']}><CrewStrip crew={{ dan: 'c', rui: 'c', nils: 'c', petr: 'c' }} viewer="dan" /></OvBlock>
          <OvBlock icon="guitar-electric" title="Artist Riders" cta={CTA.backline} />
          <OvBlock id="acct" icon="calculator" title="Accounting" pressed={st.press === 'acct'}><MoneyCells cells={[['YOUR FEE', '€350'], ['EXPENSES', 'None submitted', true]]} /></OvBlock>
        </div>
      </ApScroll>
      {st.toast ? <Toast>Invite accepted — you're on the crew.</Toast> : null}
    </div>
  );
}

// ── Venue section (app/(tabs)/bookings/[id]/venue · components/venue/sections.ts) ──
export function VenueCard({ id, icon, label, ph, text, editing }) {
  return (
    <div data-a={id} className="ap-card" style={{ borderRadius: 12, borderColor: editing ? 'var(--bo)' : 'var(--b)', boxShadow: editing ? '0 0 0 3px rgba(255,143,0,.08)' : undefined }}>
      <div className="ap-row" style={{ gap: 8, padding: '12px 14px 0' }}><I n={icon} s={15} c="var(--fg)" /><Lbl style={{ flex: 1 }}>{label}</Lbl>{text && !editing ? <I n="pencil-outline" s={14} c="var(--tsu)" /> : null}</div>
      <div style={{ padding: '6px 14px 14px', fontSize: 13, lineHeight: '20px', color: text ? 'var(--tb)' : 'var(--tf)' }}>{editing ? <div style={{ border: '1px solid var(--o)', borderRadius: 8, padding: '9px 11px', background: 'var(--s)', color: 'var(--t)' }}>{text}<span className="caret"></span></div> : (text || ph)}</div>
    </div>
  );
}
export function VenueEditSheet({ h, label, text }) {
  return (
    <Sheet h={h} ratio={0.7} title="Edit venue" footer={<Btn icon="check">Save changes</Btn>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Lbl>{label}</Lbl>
        <div style={{ minHeight: 76, border: '1px solid var(--o)', boxShadow: '0 0 0 3px rgba(255,143,0,.25)', borderRadius: 8, padding: '10px 12px', background: 'var(--s)', fontSize: 13, lineHeight: '20px' }}>{text}<span className="caret"></span></div>
        <div style={{ background: 'var(--s)', border: '1.5px solid var(--fg)', borderRadius: 8, padding: 14 }}><div className="ap-row" style={{ gap: 8 }}><span style={{ width: 14, height: 14, borderRadius: 999, background: 'var(--fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ width: 5, height: 5, borderRadius: 3, background: '#fff' }}></span></span><span className="ap-label" style={{ color: 'var(--tmu)' }}>USE BOOKING VENUE</span></div><div className="ap-dis" style={{ fontSize: 17, marginTop: 8 }}>Aurora Hall</div><div className="ap-bsm" style={{ color: 'var(--tmu)', marginTop: 2 }}>Köpenicker Straße 70, Berlin</div></div>
        <div className="ap-row" style={{ gap: 8, background: 'var(--s)', border: '1.5px solid var(--bm)', borderRadius: 8, padding: '12px 14px' }}><span style={{ width: 14, height: 14, borderRadius: 999, border: '1.5px solid var(--bs)' }}></span><span className="ap-label" style={{ color: 'var(--tmu)' }}>DIFFERENT PLACE</span></div>
      </div>
    </Sheet>
  );
}
export function ScrVenue({ st }) {
  const f = st.f || 0;
  const n = f >= 2 && !st.editing ? 2 : f >= 2 || f >= 1 ? (f >= 2 ? 1 : 0) : 0; // the riders are files, not a filled section
  return (
    <div className="ap-col"><ApStatus /><ApTop />
      <SecHero title="Venue" summary={`${n} ${n === 1 ? 'section' : 'sections'} filled${n ? ' · ' + ['Load-in', 'Parking'].slice(0, n).join(' · ') : ''}`} entity="Aurora Hall · Köpenicker Straße 70, Berlin" />
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <VenueCard id="v-loadin" icon="truck" label="LOAD IN / LOAD OUT" ph="How to access the stage, timings, dock restrictions…" text={f >= 2 ? HIW_VENUE.loadIn : ''} />
        <VenueCard id="v-parking" icon="parking" label="PARKING" ph="Where to park, contacts, costs, alternatives…" text={f >= 2 && !st.editing ? HIW_VENUE.parking : ''} />
        <VenueCard icon="shopping-outline" label="MERCHANDISE" ph="Stand location, commission, who runs it, payouts…" />
        <VenueCard icon="notebook-outline" label="OTHER NOTES" ph="Wi-Fi, dressing rooms, catering, curfews, anything…" />
        <div data-a="v-riders" className="ap-card" style={{ borderRadius: 8, padding: '14px 16px', borderColor: f === 3 ? 'var(--bo)' : 'var(--b)' }}>
          <div className="ap-row" style={{ gap: 10 }}><span style={{ width: 30, height: 30, borderRadius: 6, background: 'var(--tint)', border: '1px solid var(--bo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I n="paperclip" s={15} c="var(--fg)" /></span><Lbl style={{ flex: 1 }}>VENUE RIDERS</Lbl>{f >= 4 ? <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tsu)' }}>1 file</span> : null}</div>
          {f >= 4 ? <div className="ap-row ap-fade" style={{ gap: 10, marginTop: 10, padding: '8px 0' }}><I n="file-pdf-box" s={20} c="var(--fg)" /><span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{HIW_VENUE.rider}</span><span className="ap-pill" style={{ padding: '3px 9px', border: '1px solid var(--bo)', background: 'var(--tint)', fontSize: 11, fontWeight: 600, color: 'var(--fg)' }}>Download</span></div>
            : <div className="ap-bsm" style={{ color: 'var(--tf)', marginTop: 10 }}>Upload technical rider, hospitality rider, stage plot…</div>}
          <div className={'ap-row' + (f === 3 ? ' press' : '')} style={{ marginTop: 10, gap: 6, justifyContent: 'center', height: 40, border: '1.5px dashed var(--bo)', borderRadius: 8, color: 'var(--fg)', fontWeight: 600, fontSize: 13 }}><I n="upload" s={15} c="var(--fg)" />Add rider</div>
        </div>
      </div>
      {f === 1 ? <VenueEditSheet h={st.h} label="LOAD IN / LOAD OUT" text={HIW_VENUE.loadIn} /> : f === 2 && st.editing ? <VenueEditSheet h={st.h} label="PARKING" text={HIW_VENUE.parking} /> : null}
    </div>
  );
}
// ── Contacts section (components/ContactsSection.tsx · forms/ContactForm.tsx · ContactFields.tsx). No contacts at this
// venue yet, so Add contact opens the form directly (no picker).
export function CField({ label, ph, value, typing, icon }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><Lbl>{label}</Lbl><div className="ap-row" style={{ gap: 8, height: 44, padding: '0 12px', background: 'var(--s)', border: '1px solid ' + (typing ? 'var(--o)' : 'var(--bm)'), boxShadow: typing ? '0 0 0 3px rgba(255,143,0,.25)' : 'none', borderRadius: 8 }}>{icon ? <I n={icon} s={15} c="var(--tsu)" /> : null}<span style={{ fontSize: 14, color: value ? 'var(--t)' : 'var(--tsu)' }}>{value || ph}</span>{typing ? <span className="caret"></span> : null}</div></div>;
}
export function ScrContacts({ st, ping }) {
  const f = st.f || 0;
  const c = HIW_VENUE.contact;
  return (
    <div className="ap-col"><ApStatus /><ApTop />
      <SecHero title="Contacts" summary={f >= 5 ? '2 contacts' : f >= 4 ? '1 contact' : 'Nothing added yet'} />
      <div style={{ padding: '0 16px' }}>
        {f >= 4 ? <ContactsBody n={f >= 5 ? 2 : 1} /> : null}
        {false ? <div className="ap-card ap-fade" style={{ borderRadius: 8, background: 'var(--sa)' }}><div className="ap-row" style={{ gap: 10, minHeight: 48, padding: '8px 10px' }}><div style={{ flex: 1 }}><div className="ap-dis" style={{ fontSize: 12.5 }}>{c.name}</div><div className="ap-cap" style={{ color: 'var(--tmu)', fontWeight: 400 }}>{c.role}</div></div><span className="ap-pill" style={{ gap: 4, padding: '4px 9px', border: '1px solid var(--bo)', background: 'var(--tint)', fontSize: 11, fontWeight: 600, color: 'var(--fg)' }}><I n="phone" s={12} c="var(--fg)" />Call</span><span className="ap-pill" style={{ gap: 4, padding: '4px 9px', border: '1px solid var(--bo)', background: 'var(--tint)', fontSize: 11, fontWeight: 600, color: 'var(--fg)' }}><I n="email-outline" s={12} c="var(--fg)" />Email</span></div></div> : null}
      </div>
      {f < 4 ? <Sheet h={st.h} ratio={0.8} title="Add contact" footer={<Btn press={f === 3} dis={f < 1}>{f === 3 ? 'Saving…' : 'Add contact'}</Btn>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <CField label="NAME" ph="Full name" value={f >= 1 ? c.name : ''} typing={f === 0} />
          <CField label="ROLE" ph="e.g. Promoter, Stage Manager, Venue FOH Engineer" value={f >= 1 ? c.role : ''} />
          <CField label="PHONE" icon="phone-outline" ph="+351 …" value={f >= 2 ? c.phone : ''} typing={f === 1} />
          <CField label="EMAIL" icon="email-outline" ph="name@example.com" value={f >= 2 ? c.email : ''} />
        </div>
      </Sheet> : null}
    </div>
  );
}

// ── Inline quick-add (components/itinerary/ItineraryQuickAddRow.tsx): type, title, start time, place; Save.
export function QuickAdd({ qa = 0 }) {
  const typed = qa >= 1, f = qa >= 2 ? 1.7 : typed ? 1.6 : 1.5;
  return (
    <div data-a="quickadd" className="ap-fade" style={{ borderTop: '1px solid var(--b)', background: 'var(--s)', padding: '12px 14px', boxShadow: 'inset 3px 0 0 var(--o)' }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{[['truck', 'Travel', '#2563a8', '#e3eef9'], ['silverware-fork-knife', 'Meal', '#7d4ea3', '#f1e8f7'], ['bed', 'Housing', '#1f7a6f', '#e1f1ee'], ['bullhorn', 'Event', '#9c4a17', '#fceadb']].map(([ic, l, c, bg]) => { const on = l === 'Event'; return <span key={l} className="ap-pill" style={{ height: 28, padding: '0 10px', gap: 5, border: '1px solid ' + (on ? c : 'var(--b)'), background: on ? bg : 'var(--s)', fontSize: 11, fontWeight: 600, color: on ? c : 'var(--tb)' }}><I n={ic} s={12} c={on ? c : 'var(--tmu)'} />{l}</span>; })}</div>
      <div className="ap-row" style={{ gap: 12, marginTop: 10 }}>
        <div style={{ flex: 1, height: 40, border: '1px solid ' + (f < 1.7 ? 'var(--o)' : 'var(--bm)'), boxShadow: f < 1.7 ? '0 0 0 3px rgba(255,143,0,.25)' : 'none', borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 14, color: typed ? 'var(--t)' : 'var(--tsu)' }}>{typed ? 'Soundcheck' : 'Soundcheck, Show, Press…'}{f < 1.7 ? <span className="caret"></span> : null}</div>
        <div style={{ textAlign: 'right' }}><div className="ap-micro" style={{ color: 'var(--tmu)' }}>START</div><div className="ap-mono" style={{ fontSize: 18, fontWeight: 600, color: typed ? 'var(--t)' : 'var(--tf)' }}>{typed ? '17:00' : '16:00'}</div></div>
      </div>
      <div className="ap-row" style={{ gap: 6, marginTop: 8 }}><I n="map-marker" s={13} c="var(--fg)" /><span className="ap-bsm" style={{ color: 'var(--tb)' }}>Aurora Hall</span></div>
      <div className="ap-row" style={{ gap: 12, marginTop: 12, justifyContent: 'flex-end' }}><span className="ap-cap" style={{ color: 'var(--tmu)', textDecoration: 'underline' }}>Open full editor</span><span className="ap-cap" style={{ color: 'var(--fg)', fontWeight: 600 }}>Save &amp; add another</span><span className={'ap-pill' + (f >= 1.7 ? ' press' : '')} style={{ height: 32, padding: '0 16px', background: typed ? 'var(--o)' : '#f3ddbe', color: typed ? '#fff' : '#c2b2a2', fontFamily: 'Inter', fontWeight: 600, fontSize: 13 }}>Save</span></div>
    </div>
  );
}

// ── Itinerary section (app/(tabs)/bookings/[id]/itinerary · ItineraryPlannerRow · constants/itineraryTypes.ts) ──
// ItineraryEmptyHero (components/itinerary/ItineraryEmptyHero.tsx) — the day before anything is on it.
export function ItinEmpty({ press }) {
  return (
    <div className="ap-col"><ApStatus /><ApTop />
      <SecHero title="Itinerary" summary="Nothing added yet" />
      <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
        <span title="BeckstageMark" style={{ width: 68, height: 68, background: 'var(--o)', WebkitMask: 'url(/avatars/logo-mark.png) center / contain no-repeat', mask: 'url(/avatars/logo-mark.png) center / contain no-repeat' }}></span>
        <div className="ap-dis" style={{ fontSize: 20, lineHeight: '25px', marginTop: 4 }}>Build the day, hour by hour.</div>
        <div style={{ color: 'var(--tmu)', maxWidth: 300 }}>Add travel, hotels, meals and stage events — pin times, locations and the people involved.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 6 }}>{[['truck', 'Travel', '#2563a8'], ['silverware-fork-knife', 'Meal', '#7d4ea3'], ['bed', 'Housing', '#1f7a6f'], ['bullhorn', 'Event', '#9c4a17']].map(([ic, l, c]) => <span key={l} className="ap-pill" style={{ gap: 5, height: 30, padding: '0 11px', border: '1px solid var(--b)', background: 'var(--s)', fontSize: 12, fontWeight: 600, color: 'var(--tb)' }}><I n={ic} s={13} c={c} />+ {l}</span>)}</div>
        <div className={'ap-btn pri' + (press ? ' press' : '')} style={{ marginTop: 8, padding: '0 22px' }}><I n="plus" s={16} c="#fff" /><span>Add first item</span></div>
      </div>
    </div>
  );
}
export function ScrItin({ st }) {
  if (st.n === 0) return <ItinEmpty press={st.press} />;
  const n = st.n || HIW_ITIN.length;
  return (
    <div className="ap-col"><ApStatus /><ApTop />
      <SecHero title="Itinerary" summary={`${n} ${n === 1 ? 'item' : 'items'} across 1 day`} />
      <div style={{ padding: '0 16px' }}>
        <div data-a="itin-day" className="ap-card ap-xl">
          <div className="ap-row" style={{ gap: 10, padding: '10px 14px', background: 'var(--sa)', borderBottom: '1px solid var(--b)' }}><span className="ap-dis" style={{ fontSize: 15, flex: 1 }}>Sun 14 Mar</span><Lbl>DAY OF SHOW</Lbl></div>
          {hiwItinItems(n).map((it, i) => <div key={it.title} className="ap-fade"><PlannerRow start={it.start === 'LOADIN' ? '15:00' : it.start} end={it.end} color={it.color} title={it.title} place={it.place} who={it.who} i={i} /></div>)}
          {st.qa != null ? <QuickAdd qa={st.qa} /> : <div className="ap-row" style={{ gap: 8, padding: '11px 14px', borderTop: '1px solid var(--b)' }}><I n="plus" s={14} c="var(--fg)" /><span className="ap-bsm" style={{ fontWeight: 600, color: 'var(--fg)' }}>Add an item</span></div>}
        </div>
      </div>
    </div>
  );
}
// ── Itinerary item edit (components/ItineraryItemFormSection.tsx, mobile, event) ──
export function ItemSec({ children, first }) { return <div className="ap-label" style={{ color: 'var(--fg)', marginTop: first ? 0 : 18, marginBottom: 8 }}>{children}</div>; }
export function WhenRow({ label, value, sub, focus, k }) {
  return <><div style={{ height: 1, background: 'var(--b)' }}></div><div className="ap-row" style={{ justifyContent: 'space-between', padding: '14px 0', minHeight: 48, gap: 12 }}><span style={{ color: 'var(--tb)' }}>{label}</span><div style={{ textAlign: 'right' }}><span className="ap-row" style={{ gap: 6, justifyContent: 'flex-end', ...(focus ? { background: 'var(--tint)', borderRadius: 6, padding: '2px 8px', margin: '-2px -8px', boxShadow: '0 0 0 1.5px var(--o)' } : null) }}><span key={k || value} className="ap-typed" style={{ fontWeight: 600, fontSize: 15, lineHeight: '21px', fontVariantNumeric: 'tabular-nums' }}>{value}</span><I n="chevron-down" s={14} c="var(--tsu)" /></span>{sub ? <div style={{ fontSize: 12, color: 'var(--tmu)', marginTop: 2 }}>{sub}</div> : null}</div></div></>;
}
export function ScrItem({ st }) {
  const isNew = st.mode === 'new';
  const f = st.f || 0;
  const t = isNew ? (f >= 2 ? '15:00' : '12:00') : st.time || '15:00';
  const desc = isNew ? (f >= 1 ? 'Load-in' : '') : 'Load-in';
  return (
    <div className="ap-col"><ApStatus />
      <div className="ap-row" style={{ justifyContent: 'space-between', padding: '14px 20px 10px', borderBottom: '1px solid var(--b)' }}><span style={{ color: 'var(--tmu)', fontWeight: 600 }}>Cancel</span><span className="ap-dis" style={{ fontSize: 17, lineHeight: '21px' }}>{isNew ? 'New item' : 'Edit item'}</span><span className={st.press ? 'press' : ''} style={{ display: 'inline-block', color: 'var(--fg)', fontWeight: 700 }}>Save</span></div>
      <ApScroll y={st.scroll || 0} pad="16px 20px 24px">
        <ItemSec first>TYPE</ItemSec>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{[['truck', 'Travel', '#2563a8', '#e3eef9'], ['silverware-fork-knife', 'Meal', '#7d4ea3', '#f1e8f7'], ['bed', 'Housing', '#1f7a6f', '#e1f1ee'], ['bullhorn', 'Event', '#9c4a17', '#fceadb']].map(([ic, l, c, bg]) => { const on = l === 'Event'; return <div key={l} style={{ flex: '1 1 48%', padding: '12px 6px', borderRadius: 8, border: '1.5px solid ' + (on ? c : 'var(--b)'), background: on ? bg : 'var(--s)', boxShadow: on ? '0 0 0 3px ' + c + '20' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}><I n={ic} s={20} c={on ? c : 'var(--tmu)'} /><span className="ap-label" style={{ color: on ? c : 'var(--tb)' }}>{l}</span></div>; })}</div>
        <ItemSec>DESCRIPTION</ItemSec>
        <div className="ap-row" style={{ gap: 8, padding: '12px', background: 'var(--s)', border: '1px solid ' + (isNew && f === 0 ? 'var(--o)' : 'var(--b)'), boxShadow: isNew && f === 0 ? '0 0 0 3px rgba(255,143,0,.25)' : 'none', borderRadius: 8 }}><I n="format-text" s={16} c="var(--tmu)" /><span key={desc} className="ap-typed" style={{ fontSize: 13, color: desc ? 'var(--t)' : 'var(--tf)' }}>{desc || 'Soundcheck, Show, Press…'}</span>{isNew && f === 0 ? <span className="caret"></span> : null}</div>
        <ItemSec>WHEN</ItemSec>
        <div>
          <WhenRow label="Starts on" value="Sun, Mar 14" sub="day of show" />
          <div data-a="startsat"><WhenRow label="Starts at" value={t} focus={st.editing} /></div>
          <div style={{ height: 1, background: 'var(--b)' }}></div>
          <div className="ap-row" style={{ gap: 6, padding: '14px 0' }}><I n="plus" s={14} c="var(--fg)" /><span style={{ fontWeight: 600, color: 'var(--fg)' }}>Add end time</span></div>
        </div>
        <ItemSec>LOCATION</ItemSec>
        <div style={{ background: 'var(--s)', border: '1.5px solid var(--fg)', borderRadius: 8, padding: 14, marginBottom: 8 }}>
          <div className="ap-row" style={{ gap: 8 }}><span style={{ width: 14, height: 14, borderRadius: 999, background: 'var(--fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ width: 5, height: 5, borderRadius: 3, background: '#fff' }}></span></span><span className="ap-label" style={{ color: 'var(--tmu)' }}>USE BOOKING VENUE</span></div>
          <div className="ap-dis" style={{ fontSize: 17, lineHeight: '21px', marginTop: 8 }}>Aurora Hall</div>
          <div className="ap-bsm" style={{ color: 'var(--tmu)', marginTop: 2 }}>Köpenicker Straße 70, Berlin</div>
          <div className="ap-cap" style={{ color: 'var(--tmu)', marginTop: 12, marginBottom: 6 }}>Specific spot at the venue (optional)</div>
          <div className="ap-row" style={{ gap: 8, padding: '9px 10px', border: '1px solid var(--b)', borderRadius: 6, background: 'var(--bg)' }}><I n="map-marker-outline" s={13} c="var(--tsu)" /><span className="ap-bsm" style={{ color: 'var(--tsu)' }}>e.g. Stage, Backstage, Dressing room…</span></div>
        </div>
        <div className="ap-row" style={{ gap: 8, background: 'var(--s)', border: '1.5px solid var(--bm)', borderRadius: 8, padding: '12px 14px' }}><span style={{ width: 14, height: 14, borderRadius: 999, border: '1.5px solid var(--bs)' }}></span><I n="magnify" s={14} c="var(--tmu)" /><span style={{ color: 'var(--tmu)' }}>Different place</span></div>
        <ItemSec>PAID BY</ItemSec>
        <div className="ap-row" style={{ gap: 6 }}>{['Promoter', 'Artist', 'N/A'].map((l) => { const on = l === 'N/A'; return <span key={l} style={{ flex: 1, height: 38, borderRadius: 6, border: '1px solid ' + (on ? 'var(--t)' : 'var(--b)'), background: on ? 'var(--t)' : 'var(--s)', color: on ? '#fff' : 'var(--tb)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{l}</span>; })}</div>
        <ItemSec>NOTES (OPTIONAL)</ItemSec>
        <div className="ap-row" style={{ gap: 8, alignItems: 'flex-start', padding: 12, minHeight: 76, background: 'var(--s)', border: '1px solid var(--b)', borderRadius: 8 }}><I n="text-box-outline" s={16} c="var(--tmu)" /><span style={{ color: 'var(--tf)' }}>Linecheck 30 min, then Set A rehearsal…</span></div>
        <ItemSec>ATTACHMENTS (OPTIONAL)</ItemSec>
        <div style={{ padding: 16, border: '1.5px dashed var(--bm)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><I n="plus" s={18} c="var(--tmu)" /><span style={{ color: 'var(--tmu)' }}>Add files</span><span className="ap-cap" style={{ color: 'var(--tsu)', textAlign: 'center' }}>Interview questions, run-of-show · PDF, images — max 10 MB each</span></div>
      </ApScroll>
      {st.editing ? <><div className="ap-scrim" style={{ background: 'rgba(33,26,21,.25)' }}></div><div className="ap-sheet" style={{ boxShadow: '0 -8px 24px rgba(99,65,30,.12)' }}><div className="ap-grab"></div><div className="ap-row" style={{ justifyContent: 'space-between', padding: '10px 20px 4px' }}><span style={{ color: 'var(--tmu)', fontWeight: 600 }}>Starts at</span><span style={{ color: 'var(--fg)', fontWeight: 700 }}>Done</span></div><div style={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: 48, padding: '14px 0 34px', fontFamily: 'Inter', fontSize: 22 }}><div style={{ position: 'absolute', left: 40, right: 40, top: '50%', height: 38, marginTop: -29, borderRadius: 9, background: 'var(--sm)' }}></div>{[['11', '12', '13', '14', '15', '16', '17', '18', '19'], ['50', '55', '00', '05', '10']].map((col, ci) => { const sel = ci === 0 ? t.slice(0, 2) : '00'; const i = col.indexOf(sel); return <div key={ci} style={{ position: 'relative', height: 190, overflow: 'hidden', width: 44 }}><div style={{ position: 'absolute', left: 0, right: 0, top: 95 - 19 - i * 38, transition: 'top .6s cubic-bezier(.2,.7,.3,1)' }}>{col.map((v) => <div key={v} style={{ height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', color: v === sel ? 'var(--t)' : 'var(--tf)', fontWeight: v === sel ? 600 : 400, fontVariantNumeric: 'tabular-nums' }}>{v}</div>)}</div></div>; })}</div></div></> : null}
    </div>
  );
}

// ── Accounting (app/(tabs)/bookings/[id]/accounting/index.tsx · AccountingWorksheet · WaterfallSummary · ExpenseLedger) ──
export function WRow({ op, label, sub, c, kind }) {
  const sub2 = kind === 'subtotal' || kind === 'accent', acc = kind === 'accent';
  return <div className="ap-row" style={{ gap: 12, padding: '10px 14px', borderTop: (sub2 ? '1.5px solid ' + (acc ? 'var(--bo)' : 'var(--bs)') : '1px solid var(--b)'), background: acc ? 'var(--tint)' : sub2 ? 'var(--sm)' : 'var(--s)' }}><span className="ap-mono" style={{ width: 16, textAlign: 'center', fontSize: 15, fontWeight: 600, color: op === '−' ? 'var(--tmu)' : 'var(--tf)' }}>{op}</span><div style={{ flex: 1 }}><div className="ap-dis" style={{ fontSize: 13, fontWeight: sub2 ? 700 : 600, letterSpacing: sub2 && !acc ? .28 : -.07, textTransform: sub2 && !acc ? 'uppercase' : 'none', color: acc ? 'var(--fg)' : 'var(--t)' }}>{label}</div>{sub ? <div className="ap-cap" style={{ color: 'var(--tmu)', marginTop: 1 }}>{sub}</div> : null}</div><HiwMoney c={c} size={acc ? 19 : 15} strong={sub2} accent={acc} out={op === '−'} /></div>;
}
export function LedgerRow({ item, cat, stripe, meta, payer, c, id, ping, clip }) {
  return <P id={id} ping={ping}><div className="ap-row" style={{ gap: 10, padding: '10px 14px', borderTop: '1px solid var(--b)', alignItems: 'flex-start' }}><div style={{ flex: 1.7, minWidth: 0 }}><div className="ap-bsm" style={{ fontWeight: 600 }}>{item}</div><div className="ap-row" style={{ gap: 7, marginTop: 3 }}><span className="ap-row" style={{ gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: stripe }}></span><span className="ap-bsm" style={{ color: 'var(--tb)' }}>{cat}</span></span><span style={{ color: 'var(--tf)' }}>·</span>{clip ? <I n="paperclip" s={12} c="var(--fg)" /> : <span className="ap-pill" style={{ gap: 3, padding: '1px 6px', background: 'var(--sm)' }}><I n="bank-transfer" s={12} c="var(--tmu)" /><span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tmu)' }}>{meta}</span></span>}</div>{payer ? <div className="ap-cap" style={{ color: 'var(--tmu)', marginTop: 2 }}>Paid by {payer}</div> : null}</div><div style={{ flex: .9, display: 'flex', justifyContent: 'flex-end' }}><HiwMoney c={c} size={12} /></div></div></P>;
}
export function LedgerHead() { return <div className="ap-row" style={{ padding: '8px 14px', background: 'var(--sa)' }}><span className="ap-micro" style={{ flex: 1.7, color: 'var(--tmu)' }}>ITEM</span><span className="ap-micro" style={{ flex: .9, textAlign: 'right', color: 'var(--tmu)' }}>AMOUNT</span></div>; }
export function LedgerFoot({ label, c }) { return <div className="ap-row" style={{ padding: '10px 14px', borderTop: '1.5px solid var(--bs)', background: 'var(--sm)' }}><span className="ap-cap" style={{ flex: 1, fontWeight: 700, color: 'var(--tb)' }}>{label}</span><HiwMoney c={c} size={13} strong /></div>; }
export function ScrAcct({ st, ping }) {
  const exp = st.exp;
  const total = exp ? 116000 : 110000;
  const n = exp ? 5 : 4;
  return (
    <div className="ap-col"><ApStatus /><ApTop />
      {st.closed ? <div style={{ padding: '12px 16px 16px' }}><div className="ap-row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}><span className="ap-dis" style={{ fontSize: 32, lineHeight: '39px', letterSpacing: -0.5 }}>Accounting</span><span className="ap-pill ap-fade" style={{ gap: 4, padding: '3px 8px', background: 'var(--sm)' }}><I n="lock-outline" s={11} c="var(--tmu)" /><span className="ap-mono" style={{ fontSize: 10, color: 'var(--tmu)', letterSpacing: .8 }}>LOCKED · 15 MAR</span></span></div><div className="ap-bsm" style={{ color: 'var(--tmu)', marginTop: 6 }}>€2,840 net</div></div>
        : <SecHero title="Accounting" summary={`€4,000 fee · ${n} expenses · €${exp ? '2,840' : '2,900'} net`} />}
      <ApScroll y={st.scroll || 0} pad="0 16px 24px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div><SheetLbl action={st.closed ? null : ['pencil', 'Edit']}>SUMMARY</SheetLbl>
            <P id="chain" ping={ping} className="ap-card" style={{ borderRadius: 6 }}>
              <div style={{ marginTop: -1 }}><WRow op="" label="Total fee" sub="Flat Fee" c={400000} /></div>
              <WRow op="−" label="Expenses" sub={`${n} items`} c={total} />
              <WRow op="=" label="After expenses" kind="subtotal" c={400000 - total} />
              <WRow op="−" label={HIW_REP.name} sub={'Commission · ' + HIW_REP.commission} c={400000 * HIW_REP.pct / 100} />
              <WRow op="=" label="Artist earnings" sub="The Sundowners" kind="accent" c={400000 - total - 400000 * HIW_REP.pct / 100} />
              {st.closed ? <div className="ap-row ap-fade" style={{ gap: 9, padding: '11px 14px', background: 'var(--sm)', borderTop: '1px solid var(--bm)' }}><I n="account-multiple-outline" s={14} c="var(--tmu)" /><span className="ap-cap" style={{ color: 'var(--tb)', flex: 1 }}>Paid as one — what this booking earns isn't divided between members.</span></div> : null}
              {st.closed ? <div className="ap-fade"><BalNote text="The €2,840 is in The Sundowners’s Balance" /></div> : null}
            </P></div>
          <div><SheetLbl tally={exp ? '1/1' : null} action={st.closed ? null : ['plus', 'Add expense']}>EXPENSES</SheetLbl>
            <div className="ap-card" style={{ borderRadius: 6 }}><LedgerHead />
              {exp ? <LedgerRow id="exp-new" ping={ping} item="Fuel" cat="Travel" stripe="#5b8cc4" clip payer="Dan Whitaker" c={6000} /> : null}
              {['dan', 'rui', 'nils', 'petr'].map((k) => <LedgerRow key={k} item={HIW_PEOPLE[k].name} cat="Crew fee" stripe="#f47340" meta="Via balance" payer="The Sundowners" c={HIW_PEOPLE[k].fee * 100} />)}
              <LedgerFoot label={`Total · ${n} items`} c={total} />
            </div></div>
          {st.band ? <div className="ap-row" style={{ justifyContent: 'space-between', gap: 10, padding: '12px 16px', margin: '0 -16px', background: 'var(--sa)', borderTop: '1px solid var(--b)' }}><span className="ap-bsm" style={{ color: 'var(--tmu)', flexShrink: 1 }}>Books still open — close to lock.</span><Btn kind="wf" icon="shield-check" full={false} press={st.closeSheet == null && st.band}>Close &amp; lock</Btn></div> : null}
        </div>
      </ApScroll>
      {st.closeSheet != null ? <Sheet h={st.h} ratio={0.9}
        header={<div className="ap-row" style={{ justifyContent: 'space-between', padding: '14px 16px 12px', borderBottom: '1px solid var(--b)' }}><span className="ap-bsm" style={{ color: 'var(--tmu)', width: 50 }}>Cancel</span><span className="ap-dis" style={{ fontSize: 17 }}>Close &amp; lock</span><span style={{ width: 50 }}></span></div>}
        footer={<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><Btn kind="wf" icon="shield-lock-outline" press={st.closeSheet === 1}>{st.closeSheet === 1 ? 'Closing…' : 'Close & lock the books'}</Btn><span className="ap-cap" style={{ color: 'var(--tsu)', textAlign: 'center' }}>You won't be able to change the fee or the expenses after this.</span></div>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><div className="ap-label" style={{ color: 'var(--tmu)', marginBottom: 8 }}>THE NUMBERS</div>
            <div className="ap-card" style={{ borderRadius: 6 }}><WRow op="" label="Total fee" sub="Flat Fee" c={400000} /><WRow op="−" label="Expenses" sub="5 items" c={116000} /><WRow op="=" label="After expenses" kind="subtotal" c={284000} /><WRow op="−" label={HIW_REP.name} sub={'Commission · ' + HIW_REP.commission} c={60000} /><WRow op="=" label="Artist earnings" sub="The Sundowners" kind="accent" c={224000} /></div></div>
          <div style={{ height: 1, background: 'var(--b)' }}></div>
          <div className="ap-dis" style={{ fontSize: 15, lineHeight: '20px' }}>How are this booking's artist earnings divided?</div>
          {[['Collective — the artist is paid as one', true], ['Individual — each member gets their share', false]].map(([t, on]) => <div key={t} style={{ padding: 12, borderRadius: 8, border: '1.5px solid ' + (on ? 'var(--fg)' : 'var(--bm)'), background: 'var(--s)', display: 'flex', gap: 10 }}><span style={{ width: 16, height: 16, marginTop: 2, borderRadius: 999, border: '1.5px solid ' + (on ? 'var(--fg)' : 'var(--bs)'), background: on ? 'var(--fg)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{on ? <span style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}></span> : null}</span><div><div style={{ fontWeight: 600, fontSize: 13 }}>{t}</div>{on ? <div className="ap-bsm" style={{ color: 'var(--tmu)', marginTop: 4 }}>The whole €2,840 goes to the artist balance. No member is owed anything personally.</div> : null}</div></div>)}
        </div>
      </Sheet> : null}
    </div>
  );
}
export function ScrDacct({ st, ping }) {
  return (
    <div className="ap-col"><ApStatus /><ApTop />
      {st.closed ? <div style={{ padding: '12px 16px 16px' }}><div className="ap-row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}><span className="ap-dis" style={{ fontSize: 32, lineHeight: '39px', letterSpacing: -0.5 }}>Accounting</span><span className="ap-pill ap-fade" style={{ gap: 4, padding: '3px 8px', background: 'var(--sm)' }}><I n="lock-outline" s={11} c="var(--tmu)" /><span className="ap-mono" style={{ fontSize: 10, color: 'var(--tmu)', letterSpacing: .8 }}>LOCKED · 15 MAR</span></span></div><div className="ap-bsm" style={{ color: 'var(--tmu)', marginTop: 6 }}>€350 fee · 1 expense submitted</div></div>
        : <SecHero title="Accounting" summary={`€350 fee · ${st.exp ? '1 expense submitted' : 'No expenses submitted'}`} />}
      <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div><SheetLbl>YOUR FEE</SheetLbl>
          <P id="fee" ping={ping} className="ap-card" style={{ borderRadius: 6 }}>
            <div className="ap-row" style={{ gap: 12, padding: '13px 14px' }}><I n="receipt-text-outline" s={18} c="var(--fg)" /><div><div className="ap-dis" style={{ fontSize: 22, lineHeight: '27px', letterSpacing: -0.2 }}>€350</div><div className="ap-bsm" style={{ color: 'var(--tmu)', marginTop: 2 }}>{st.closed ? 'Fixed fee · final' : 'Fixed fee for this booking'}</div></div></div>
            {st.credited ? <div className="ap-fade"><BalNote text="This fee is in your Balance" press={st.pressOpen} /></div> : null}
          </P></div>
        <div><SheetLbl tally={st.exp ? '1/1' : null} action={st.exp && !st.closed ? ['plus', 'Add expense'] : null}>YOUR EXPENSES</SheetLbl>
          {st.exp ? <div className="ap-card" style={{ borderRadius: 6 }}><LedgerHead /><LedgerRow item="Fuel" cat="Travel" stripe="#5b8cc4" clip c={6000} /><LedgerFoot label="You submitted · 1 item" c={6000} />{st.credited ? <P id="exp-bal" ping={ping}><div className="ap-fade"><BalNote text="This expense is in your Balance" /></div></P> : null}</div>
            : <div className="ap-card" style={{ borderRadius: 6, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}><I n="receipt-text-outline" s={24} c="var(--tsu)" /><span className="ap-dis" style={{ fontSize: 14 }}>No expenses logged</span><span className="ap-cap" style={{ color: 'var(--tmu)', textAlign: 'center', maxWidth: 300 }}>Add van rentals, hotels, crew fees and more as they happen — each row can carry a receipt.</span><Btn kind="ghost" size="md" icon="plus" full={false}>Add expense</Btn></div>}
        </div>
      </div>
      {st.add != null ? <AddExpense f={st.add} h={st.h} /> : null}
    </div>
  );
}
// ── app/(tabs)/bookings/[id]/accounting/add-expense.tsx (AddAccountingExpenseSection) ──
export function AddExpense({ f, h }) {
  const Field = ({ label, hint, children }) => <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><Lbl>{label}</Lbl>{children}{hint ? <span className="ap-cap" style={{ color: 'var(--tsu)' }}>{hint}</span> : null}</div>;
  return (
    <Sheet h={h} ratio={0.9} header={<div className="ap-row" style={{ justifyContent: 'space-between', padding: '14px 16px 12px', borderBottom: '1px solid var(--b)' }}><span className="ap-bsm" style={{ color: 'var(--tmu)' }}>Cancel</span><span className="ap-dis" style={{ fontSize: 17 }}>Add expense</span><span className="ap-bsm" style={{ fontWeight: 700, color: f >= 1 ? 'var(--o)' : 'var(--tf)' }}>Save</span></div>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="DESCRIPTION"><div className="ap-card" style={{ padding: '11px 12px', fontSize: 13, color: f >= 1 ? 'var(--t)' : 'var(--tsu)' }}>{f >= 1 ? 'Fuel' : 'What was spent?'}</div></Field>
        <Field label="AMOUNT" hint="Only EUR is supported at the moment."><div className="ap-card ap-row" style={{ padding: '8px 12px', gap: 8 }}><span className="ap-dis" style={{ fontSize: 17, color: 'var(--tmu)' }}>€</span><span className="ap-dis" style={{ fontSize: 22, lineHeight: '27px', color: f >= 1 ? 'var(--t)' : 'var(--tf)' }}>{f >= 1 ? '60' : '0'}</span></div></Field>
        <Field label="TYPE"><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{[['truck', 'Travel', '#2563a8', '#e3eef9'], ['bed', 'Housing', '#6b4a8a', '#efe7f8'], ['food-fork-drink', 'Food & drink', '#2c7449', '#e6f3ec'], ['speaker', 'Equipment', '#3a312b', '#f6ece1']].map(([ic, l, fg, bg]) => { const on = f >= 2 && l === 'Travel'; return <span key={l} className={'ap-pill' + (on && f === 2 ? ' press' : '')} style={{ gap: 8, padding: '5px 12px 5px 5px', border: '1px solid ' + (on ? 'var(--o)' : 'var(--b)'), background: on ? 'var(--o)' : 'var(--s)' }}><span style={{ width: 24, height: 24, borderRadius: 999, background: on ? 'rgba(255,255,255,.22)' : bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I n={ic} s={14} c={on ? '#fff' : fg} /></span><span className="ap-bsm" style={{ fontWeight: 600, color: on ? '#fff' : 'var(--tb)' }}>{l}</span></span>; })}</div></Field>
        <Field label="RECEIPT · OPTIONAL">{f >= 3 ? <div className="ap-card ap-row ap-fade" style={{ padding: '11px 12px', gap: 10 }}><I n="file-document-outline" s={18} c="var(--tmu)" /><span style={{ flex: 1, fontSize: 13 }}>IMG_2041.jpg</span><Lbl>Remove</Lbl></div> : <div className="ap-row" style={{ gap: 12, padding: '12px', border: '1px dashed var(--bs)', borderRadius: 8 }}><span style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I n="upload" s={14} c="var(--fg)" /></span><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>Upload receipt</div><div className="ap-cap" style={{ color: 'var(--tmu)' }}>PDF, JPG or PNG · up to 10 MB</div></div><Lbl>Choose</Lbl></div>}</Field>
        <Btn dis={f < 1} press={f === 4}>Add expense</Btn>
      </div>
    </Sheet>
  );
}

// ── Balance (app/(tabs)/balance.tsx · components/balance/counterparty/*) ──
export function HiwCpRow({ who, name, dir, amt, asked, last, id, ping, square }) {
  return <P id={id} ping={ping}><div className="ap-row" style={{ gap: 12, padding: '12px 14px', borderBottom: last ? 0 : '1px solid var(--b)' }}><Av who={who} s={38} style={square ? { borderRadius: 10 } : null} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{name}</div>{asked ? <span className="ap-pill ap-fade" style={{ gap: 5, marginTop: 4, padding: '2px 8px', background: 'var(--wb)' }}><span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--w)' }}></span><span className="ap-cap" style={{ fontWeight: 600, color: 'var(--w)' }}>{asked} requested</span></span> : null}</div><div style={{ textAlign: 'right' }}>{dir === 'square' ? <span className="ap-bsm" style={{ color: 'var(--tmu)' }}>settled</span> : <><div className="ap-micro" style={{ color: dir === 'collect' ? 'var(--fg)' : 'var(--w)' }}>{dir === 'collect' ? 'OWED TO YOU' : 'YOU OWE'}</div><div className="ap-dis" style={{ fontSize: 16, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{amt}</div></>}</div><I n="chevron-right" s={16} c="var(--tf)" /></div></P>;
}
export function CpGroup({ dir, count, total, children }) {
  const g = { pay: ['YOU OWE', 'var(--w)', 'var(--w)'], collect: ['OWED TO YOU', 'var(--fg)', 'var(--o)'], square: ['SETTLED', 'var(--tmu)', 'var(--bm)'] }[dir];
  return <div style={{ marginBottom: 14 }}><div className="ap-row" style={{ justifyContent: 'space-between', padding: '4px 2px 8px' }}><span className="ap-row" style={{ gap: 7 }}><I n="chevron-down" s={14} c={g[1]} /><span className="ap-micro" style={{ color: g[1] }}>{g[0]}</span><span className="ap-cap" style={{ color: 'var(--tsu)' }}>{count}</span></span>{total ? <span className="ap-dis" style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{total}</span> : null}</div><div className="ap-card ap-xl" style={{ borderLeft: '3px solid ' + g[2] }}>{children}</div></div>;
}
export function CpDetail({ h, wallet, who, name, dir, amt, req, square, footer, form, doc, docPress }) {
  return (
    <Sheet h={h} ratio={0.82} header={<div className="ap-row" style={{ gap: 9, padding: '14px 16px 12px', borderBottom: '1px solid var(--b)' }}>{form ? <I n="chevron-left" s={20} c="var(--tmu)" /> : null}<span className="ap-micro" style={{ flex: 1, color: 'var(--tmu)' }}>{form || wallet}</span><I n="close" s={20} c="var(--tmu)" /></div>} footer={footer}>
      {form ? <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="ap-row" style={{ gap: 12 }}><Av who={who} s={38} style={square ? { borderRadius: 10 } : null} /><span style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>{name}</span><span className="ap-dis" style={{ fontSize: 16 }}>€410</span></div>
        <div><Lbl style={{ marginBottom: 8 }}>AMOUNT</Lbl><div className="ap-card ap-row" style={{ padding: '10px 12px', gap: 8 }}><span className="ap-dis" style={{ fontSize: 17, color: 'var(--tmu)' }}>€</span><span className="ap-dis" style={{ fontSize: 22 }}>410</span></div>{form === 'REQUEST PAYMENT' ? <div className="ap-cap" style={{ color: 'var(--tsu)', marginTop: 6 }}>Up to €410.</div> : null}</div>
        {form === 'REQUEST PAYMENT' ? <div><Lbl style={{ marginBottom: 8 }}>DOCUMENT</Lbl>{doc ? <div data-a="doc" className="ap-row ap-fade" style={{ gap: 10, padding: '10px 12px', background: 'var(--s)', border: '1px solid var(--b)', borderRadius: 8 }}><span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--tint)', border: '1px solid var(--bo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I n="receipt-text-outline" s={14} c="var(--fg)" /></span><span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>Invoice-0314-Whitaker.pdf</span><I n="close" s={15} c="var(--tmu)" /></div> : <div data-a="doc" className={'ap-row' + (docPress ? ' press' : '')} style={{ gap: 6, justifyContent: 'center', height: 44, border: '1.5px dashed var(--bo)', borderRadius: 8, color: 'var(--fg)', fontWeight: 600, fontSize: 13 }}><I n="plus" s={14} c="var(--fg)" />Attach</div>}</div> : null}
      </div> : <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="ap-row" style={{ justifyContent: 'space-between' }}><div className="ap-row" style={{ gap: 12 }}><Av who={who} s={44} style={square ? { borderRadius: 11 } : null} /><span className="ap-dis" style={{ fontSize: 17 }}>{name}</span></div><div style={{ textAlign: 'right' }}><div className="ap-micro" style={{ color: dir === 'collect' ? 'var(--fg)' : dir === 'pay' ? 'var(--w)' : 'var(--tmu)' }}>{dir === 'collect' ? 'THEY OWE YOU' : dir === 'pay' ? 'YOU OWE THEM' : 'SETTLED'}</div><div className="ap-dis" style={{ fontSize: 26, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{amt}</div></div></div>
        {req ? <div className="ap-fade"><div className="ap-micro" style={{ color: 'var(--tmu)', marginBottom: 8 }}>OPEN REQUESTS · 1</div><div className="ap-card ap-xl ap-row" style={{ padding: '12px 14px', gap: 10 }}><I n="clock-outline" s={16} c="var(--w)" /><div style={{ flex: 1 }}><div className="ap-bsm" style={{ fontWeight: 600 }}>{req}</div><div className="ap-cap" style={{ color: 'var(--tmu)' }}>15 Mar 2027</div></div><span className="ap-dis" style={{ fontSize: 14 }}>€410</span></div></div> : null}
        <div><div className="ap-micro" style={{ color: 'var(--tmu)', marginBottom: 8 }}>STATEMENT</div><div className="ap-card ap-xl">{[['Crew fee', '€350'], ['Fuel', '€60']].map(([l, v], i) => <div key={l} className="ap-row" style={{ gap: 10, padding: '11px 14px', borderTop: i ? '1px solid var(--b)' : 0 }}><div style={{ flex: 1 }}><div className="ap-bsm" style={{ fontWeight: 600 }}>{l}</div><div className="ap-cap" style={{ color: 'var(--tmu)' }}>The Sundowners · Aurora Hall · 14 Mar</div></div><span className="ap-dis" style={{ fontSize: 14 }}>{v}</span></div>)}</div></div>
      </div>}
    </Sheet>
  );
}
export function BalHead({ wallets }) {
  return (
    <div style={{ padding: '10px 16px 14px' }}>
      <div className="ap-row" style={{ justifyContent: 'space-between' }}><span className="ap-dis" style={{ fontSize: 32, lineHeight: '39px', letterSpacing: -0.5 }}>Balance</span><span className="ap-circle"><I n="bell-outline" s={17} /></span></div>
      {wallets ? <div className="ap-card ap-xl" style={{ marginTop: 14 }}>
        <div className="ap-row" style={{ padding: '8px 12px 6px', gap: 0 }}><span style={{ flex: 1 }}></span><span className="ap-micro" style={{ width: 78, textAlign: 'right', color: 'var(--w)' }}>TO PAY</span><span className="ap-micro" style={{ width: 92, textAlign: 'right', color: 'var(--fg)' }}>TO COLLECT</span></div>
        {wallets.map(([who, name, pay, coll, active, square], i) => <div key={name} className="ap-row" style={{ gap: 10, padding: '9px 12px', background: active ? 'var(--tint)' : 'var(--s)', borderLeft: '3px solid ' + (active ? 'var(--o)' : 'transparent'), borderTop: '1px solid var(--b)' }}><Av who={who} s={26} style={square ? { borderRadius: 7 } : null} /><span style={{ flex: 1, fontSize: 13, fontWeight: active ? 700 : 600 }}>{name}</span><span className="ap-dis" style={{ width: 70, textAlign: 'right', fontSize: 14, color: pay === '€0' ? 'var(--tf)' : 'var(--t)' }}>{pay}</span><span className="ap-dis" style={{ width: 92, textAlign: 'right', fontSize: 14, color: coll === '€0' ? 'var(--tf)' : 'var(--t)' }}>{coll}</span></div>)}
      </div> : null}
    </div>
  );
}
export function ScrBal({ st, ping }) {
  const s = st.s || 'list';
  const settled = s === 'done';
  return (
    <div className="ap-col"><ApStatus /><BalHead wallets={[['maya', 'Maya Sundowner', '€0', '€0', false], ['band', 'The Sundowners', settled ? '€750' : '€1,160', '€0', true, true]]} />
      <div style={{ padding: '0 16px' }}>
        <CpGroup dir="pay" count={settled ? 3 : 4} total={settled ? '€750' : '€1,160'}>
          {settled ? null : <HiwCpRow id="req" ping={ping} who="dan" name="Dan Whitaker" dir="pay" amt="€410" asked={st.req ? '€410' : null} />}
          {['rui', 'nils', 'petr'].map((k, i) => <HiwCpRow key={k} who={k} name={HIW_PEOPLE[k].name} dir="pay" amt={'€' + HIW_PEOPLE[k].fee} last={i === 2} />)}
        </CpGroup>
        {settled ? <CpGroup dir="square" count={1}><HiwCpRow who="dan" name="Dan Whitaker" dir="square" last /></CpGroup> : null}
      </div>
      {s === 'detail' || s === 'form' ? <CpDetail h={st.h} wallet="THE SUNDOWNERS" who="dan" name="Dan Whitaker" dir="pay" amt="€410" req="They requested" form={s === 'form' ? 'RECORD PAYMENT' : null} footer={<Btn size="md" press={st.press}>Record payment</Btn>} /> : null}
      {settled ? <Toast>Payment recorded</Toast> : null}
    </div>
  );
}
export function ScrDbal({ st, ping }) {
  const s = st.s || 'list';
  const settled = s === 'settled';
  // Dan works for more than one artist: his Balance holds what each of them owes him.
  const others = [['harbour', 'Harbour Lights', '€280'], ['lumen', 'Lumen Artists', '€1,200']];
  return (
    <div className="ap-col"><ApStatus /><BalHead wallets={[['dan', 'Dan Whitaker', '€0', settled ? '€1,480' : '€1,890', true]]} />
      <div style={{ padding: '0 16px' }}>
        <CpGroup dir="collect" count={settled ? 2 : 3} total={settled ? '€1,480' : '€1,890'}>
          {settled ? null : <HiwCpRow who="band" square name="The Sundowners" dir="collect" amt="€410" asked={s === 'sent' ? '€410' : null} />}
          {others.map(([w, n, v], i) => <HiwCpRow key={w} who={w} square name={n} dir="collect" amt={v} asked={w === 'lumen' ? '€1,200' : null} last={i === others.length - 1} />)}
        </CpGroup>
        {settled ? <CpGroup dir="square" count={1}><HiwCpRow id="settled" ping={ping} who="band" square name="The Sundowners" dir="square" last /></CpGroup> : null}
      </div>
      {s === 'detail' || s === 'form' || s === 'sent' ? <CpDetail h={st.h} wallet="DAN WHITAKER" who="band" square name="The Sundowners" dir="collect" amt="€410" req={s === 'sent' ? 'You requested' : null} form={s === 'form' ? 'REQUEST PAYMENT' : null} doc={st.doc === 1} docPress={st.doc === 0} footer={s === 'sent' ? <div className="ap-row" style={{ gap: 8, justifyContent: 'center' }}><I n="check" s={14} c="var(--tmu)" /><span className="ap-bsm" style={{ color: 'var(--tmu)' }}>Everything they owe is already requested · €410</span></div> : s === 'form' ? <div className="ap-row" style={{ gap: 9 }}><div style={{ flex: 1 }}><Btn kind="sec" size="md">Cancel</Btn></div><div style={{ flex: 1 }}><Btn size="md" press={st.press}>Request €410</Btn></div></div> : <Btn size="md">Request payment</Btn>} /> : null}
      {s === 'sent' ? <Toast>Payment request sent</Toast> : null}
    </div>
  );
}

export const SCREENS = { contacts: ScrContacts, off: ScrOff, create: ScrCreate, ovEmpty: ScrOvEmpty, ov: ScrOv, invite: ScrInvite, dov: ScrDov, venue: ScrVenue, itin: ScrItin, item: ScrItem, acct: ScrAcct, dacct: ScrDacct, bal: ScrBal, dbal: ScrDbal };
export function AppScreen({ st, h = 844, ping, crop }) {
  const C = SCREENS[st.scr];
  return (
    <div className="ap ap-scale" style={{ height: h }}>
      <div key={st.scr} className="ap-fade" style={{ position: 'absolute', inset: 0 }}><C st={{ ...st, h }} h={h} ping={ping} /></div>
      {crop ? <div style={{ position: 'absolute', left: 0, right: 0, top: crop, bottom: 0, background: 'linear-gradient(rgba(255,249,243,0), #fff9f3 46px)', zIndex: 25 }}></div> : null}
    </div>
  );
}


/* FAQ accordion: the first item is open by default, one open at a time. */
import { useState } from 'react';
import { Icon } from './icons';
import { FAQ, LINKS } from '../data/site';

// The last answer names the address; make it a link without changing the copy.
function answer(a: string) {
  const k = a.indexOf(LINKS.email);
  if (k < 0) return a;
  return <>{a.slice(0, k)}<a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>{a.slice(k + LINKS.email.length)}</>;
}

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list">
      {FAQ.map((it, i) => (
        <div className={'faq-item' + (open === i ? ' open' : '')} key={it.q}>
          <button type="button" className="faq-q" id={`faq-q-${i}`} aria-controls={`faq-a-${i}`}
            onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span>{it.q}</span>
            <span className="faq-ic"><Icon name="plus" size={16} /></span>
          </button>
          <div className="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
            <p>{answer(it.a)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

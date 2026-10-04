import type { Line } from '../data/site';

/** Text between *…* renders as a keyword. */
export function kw(s: string, className: string) {
  return s.split(/\*(.+?)\*/).map((p, i) => (i % 2 ? <strong className={className} key={i}>{p}</strong> : p));
}

export function LineText({ l, kwClass, preClass }: { l: Line; kwClass: string; preClass: string }) {
  if (typeof l === 'string') return <>{kw(l, kwClass)}</>;
  return <><span className={preClass}>{l.pre}</span>{kw(l.s, kwClass)}</>;
}

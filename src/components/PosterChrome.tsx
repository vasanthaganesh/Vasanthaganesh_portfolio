/**
 * Bottom-corner poster metadata, mirroring the reference posters:
 * red kicker + bone line bottom-left, section number bottom-right.
 * (Top corners are handled by the fixed <Nav/>.)
 */
export default function PosterChrome({
  kicker,
  line,
  n,
  className = "",
}: {
  kicker: string;
  line: string;
  n?: string;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-6 pb-6 md:px-12 md:pb-10 ${className}`}
    >
      <div className="chrome leading-tight">
        <p className="text-signal">{kicker}</p>
        <p>{line}</p>
      </div>
      {n ? <p className="chrome tabular-nums">{n}</p> : null}
    </div>
  );
}

export function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <p className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
      <span className="text-signal">{n}</span>
      <span className="h-px w-10 bg-line" />
      {label}
    </p>
  );
}

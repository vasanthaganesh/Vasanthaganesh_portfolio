"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/** Typewriter manifesto. Types each line once when scrolled into view. */
export default function Terminal({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [typed, setTyped] = useState<string[]>([]);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(lines);
      return;
    }
    let li = 0;
    let ci = 0;
    const out: string[] = [];
    const id = window.setInterval(() => {
      if (li >= lines.length) return window.clearInterval(id);
      ci++;
      out[li] = lines[li].slice(0, ci);
      setTyped([...out]);
      if (ci >= lines[li].length) {
        li++;
        ci = 0;
      }
    }, 34);
    return () => window.clearInterval(id);
  }, [inView, lines]);

  const done = typed.length === lines.length && typed[lines.length - 1] === lines[lines.length - 1];

  return (
    <div ref={ref} className="border border-line bg-deep/60 font-mono text-[13px] leading-7 md:text-sm">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-mist">
        <span>manifesto.sh</span>
        <span className="flex gap-1.5">
          <i className="h-1.5 w-1.5 rounded-full bg-line" />
          <i className="h-1.5 w-1.5 rounded-full bg-line" />
          <i className="h-1.5 w-1.5 rounded-full bg-signal" />
        </span>
      </div>
      <div className="min-h-[11.5rem] px-5 py-4" aria-label={lines.join(". ")}>
        {lines.map((_, i) => (
          <p key={i} aria-hidden className={typed[i] === undefined ? "invisible" : ""}>
            <span className="text-signal">&gt; </span>
            <span className="text-bone">{typed[i] ?? lines[i]}</span>
            {(i === typed.length - 1 || (done && i === lines.length - 1)) && (
              <span className="caret ml-0.5 text-bone">_</span>
            )}
          </p>
        ))}
      </div>
    </div>
  );
}

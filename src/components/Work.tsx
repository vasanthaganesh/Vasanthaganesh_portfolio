"use client";

import { useRef } from "react";
import { projects, archive } from "@/content/portfolio";
import PosterChrome, { SectionLabel } from "./PosterChrome";
import { MaskLines, Reveal } from "./Reveal";

export default function Work() {
  const glow = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = glow.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px) translate(-50%, -50%)`;
  };

  return (
    <section id="projects" className="relative min-h-svh overflow-hidden px-6 pb-40 pt-36 md:px-12 md:pt-44" onPointerMove={onMove}>
      <div
        ref={glow}
        className="pointer-events-none absolute left-0 top-0 hidden h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgb(127_182_255/0.09),transparent_60%)] md:block"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1440px]">
        <SectionLabel n="03" label="Selected Work" />
        <MaskLines lines={["Systems &", "Products Shipped."]} className="wordmark text-[clamp(2.6rem,8vw,8.5rem)]" />

        <ul className="mt-24 border-t border-line">
          {projects.map((p) => (
            <li key={p.n} className="group border-b border-line">
              <Reveal>
                <article className="grid gap-6 py-10 md:grid-cols-12 md:gap-8 md:py-14">
                  <p className="font-mono text-xs text-signal md:col-span-1 md:pt-3">{p.n}</p>
                  <div className="md:col-span-6">
                    <h3 className="wordmark text-[clamp(1.6rem,3.4vw,3.4rem)] transition-transform duration-700 ease-[var(--ease-cine)] group-hover:translate-x-3">
                      {p.title}
                    </h3>
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-mist">{p.category}</p>

                    {/* Target Users and Life Impact callouts */}
                    <div className="mt-6 space-y-4 border-l border-line pl-4">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal block">
                          Target Users
                        </span>
                        <p className="mt-1 text-sm leading-relaxed text-mist">{p.targetUsers}</p>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal block">
                          Life Impact
                        </span>
                        <p className="mt-1 text-sm leading-relaxed text-bone/90">{p.lifeImpact}</p>
                      </div>
                    </div>

                    {/* Clickable GitHub repo link for AI projects */}
                    {p.repo && (
                      <div className="mt-6">
                        <a
                          href={p.repo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-bone/30 bg-void/50 px-4 py-2 font-mono text-xs text-bone transition-all duration-300 hover:border-bone hover:bg-bone/10"
                          aria-label={`View ${p.title} repository on GitHub`}
                        >
                          <span>GitHub Repository</span>
                          <span className="font-sans text-signal">↗</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-5">
                    <p className="text-[15px] leading-relaxed text-mist transition-colors duration-500 group-hover:text-bone/90">
                      {p.body}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-bone/80">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
            Enterprise BFSI microservices & high-impact client systems.
          </p>
        </Reveal>

        {/* Archive (from resume) */}
        <div className="mt-28">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist">Archive</p>
          </Reveal>
          <div className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {archive.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.08} className="bg-void p-6 md:p-8">
                <h4 className="text-lg font-medium tracking-tight">{a.title}</h4>
                <p className="mt-1 font-mono text-[11px] text-signal">{a.stack}</p>
                <p className="mt-4 text-sm leading-relaxed text-mist">{a.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <PosterChrome kicker="Work" line="Enterprise platforms and mission-critical systems." n="03" />
    </section>
  );
}

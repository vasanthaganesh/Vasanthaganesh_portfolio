import { about } from "@/content/portfolio";
import PosterChrome, { SectionLabel } from "./PosterChrome";
import { MaskLines, Reveal } from "./Reveal";
import Terminal from "./Terminal";

export default function About() {
  return (
    <section id="about" className="relative min-h-svh px-6 pb-40 pt-36 md:px-12 md:pt-44">
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel n="01" label="About & Philosophy" />
        <MaskLines
          lines={about.headlineLines ?? [about.headline]}
          className="wordmark max-w-5xl text-[clamp(2.4rem,7vw,7.5rem)]"
        />

        {/* Essays */}
        <div className="mt-24 grid gap-px bg-line md:grid-cols-3">
          {about.essays.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.1} className="bg-void p-0 py-8 md:px-8 md:first:pl-0">
              <p className="font-mono text-[11px] text-signal">0{i + 1}</p>
              <h3 className="mt-4 text-xl font-medium tracking-tight">{e.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-mist">{e.body}</p>
            </Reveal>
          ))}
        </div>

        {/* Manifesto + stats */}
        <div className="mt-28 grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Terminal lines={about.manifesto} />
          </Reveal>

          <div className="lg:col-span-7">
            <dl className="border-t border-line">
              {about.stats.map((s, i) => (
                <Reveal key={s.k} delay={i * 0.06}>
                  <div
                    className={`grid grid-cols-12 items-baseline gap-4 border-b border-line py-5 transition-colors ${
                      s.highlight ? "rounded-sm border-signal/40 bg-signal/[0.04] px-3 -mx-3" : ""
                    }`}
                  >
                    <dt className="col-span-12 font-mono text-[10px] uppercase tracking-[0.2em] text-mist sm:col-span-4">
                      <span className="block">{s.k}</span>
                      {s.highlight && (
                        <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-signal/60 bg-signal/15 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-signal">
                          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
                          Flagship Backend Credential
                        </span>
                      )}
                    </dt>
                    <dd className="col-span-12 sm:col-span-8">
                      <span className={`wordmark block text-2xl md:text-3xl ${s.highlight ? "text-bone" : ""}`}>
                        {s.v}
                      </span>
                      <span className={`mt-2 block text-sm ${s.highlight ? "text-bone/90" : "text-mist"}`}>
                        {s.c}
                      </span>
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>

        {/* Personal Inspirations (Distinct from Technical Credentials) */}
        <div className="mt-28">
          <Reveal>
            <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
                Personal Inspirations & Mindset
              </p>
              <span className="font-mono text-[10px] uppercase tracking-wider text-signal">
                Mindset · Conviction · Living Systems
              </span>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
            {about.inspirations.map((item, i) => (
              <Reveal key={item.figure} delay={i * 0.08} className="group bg-void p-6 transition-colors hover:bg-deep">
                <span className="font-mono text-[10px] uppercase tracking-wider text-signal">
                  0{i + 1}
                </span>
                <h4 className="mt-3 text-lg font-medium tracking-tight text-bone">
                  {item.figure}
                </h4>
                <p className="mt-1 font-mono text-[11px] text-mist">{item.source}</p>
                <p className="mt-4 text-sm leading-relaxed text-bone/80 transition-colors group-hover:text-bone">
                  “{item.quote}”
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Timeline (from resume) */}
        <div className="mt-28">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist">Trajectory</p>
          </Reveal>
          <ol className="mt-8 border-t border-line">
            {about.timeline.map((t, i) => (
              <Reveal key={t.role} delay={i * 0.08}>
                <li className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-8">
                  <p className="font-mono text-xs text-signal md:col-span-3">{t.when}</p>
                  <div className="md:col-span-4">
                    <h3 className="text-lg font-medium tracking-tight">{t.role}</h3>
                    <p className="mt-1 text-sm text-mist">{t.org}</p>
                  </div>
                  <p className="text-[15px] leading-relaxed text-mist md:col-span-5">{t.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      <PosterChrome kicker="About" line="Systems × Resilience × Craft" n="01" />
    </section>
  );
}

import { skills } from "@/content/portfolio";
import PosterChrome, { SectionLabel } from "./PosterChrome";
import { MaskLines, Reveal } from "./Reveal";

export default function Stack() {
  const row = [...skills.tags, ...skills.tags];
  return (
    <section id="skills" className="relative min-h-svh overflow-hidden pb-40 pt-36 md:pt-44">
      {/* faint horizon glow echoing the posters */}
      <div className="pointer-events-none absolute left-1/2 top-[38%] h-[50vh] w-[120vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgb(127_182_255/0.10),transparent_60%)]" />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-12">
        <SectionLabel n="02" label="Skills & Stack" />
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <MaskLines
            lines={skills.headlineLines ?? [skills.headline]}
            className="wordmark text-[clamp(2.6rem,8vw,8.5rem)] lg:col-span-8"
          />
          <Reveal className="lg:col-span-4" delay={0.2}>
            <p className="text-[15px] leading-relaxed text-mist">{skills.body}</p>
          </Reveal>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative mt-24 border-y border-line py-6" aria-label={skills.tags.join(", ")}>
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap" aria-hidden>
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-10 text-[clamp(1.4rem,3vw,2.6rem)] font-light tracking-tight">
              {t}
              <span className="text-signal">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Disciplines */}
      <div className="relative mx-auto mt-24 max-w-[1440px] px-6 md:px-12">
        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {skills.disciplines.map((d, i) => (
            <Reveal key={d.t} delay={(i % 3) * 0.08} className="group bg-void p-8 transition-colors hover:bg-deep md:p-10">
              <div className="flex items-start justify-between">
                <span className="text-3xl text-bone/80 transition-colors group-hover:text-signal">{d.g}</span>
                <span className="font-mono text-[11px] text-mist">0{i + 1}</span>
              </div>
              <h3 className="wordmark mt-10 text-lg md:text-xl">{d.t}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-mist">{d.d}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <PosterChrome kicker="Stack" line="Enterprise Java, microservices, and relational databases. Zero bloat." n="02" />
    </section>
  );
}

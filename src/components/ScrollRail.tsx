"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/portfolio";

interface Waypoint {
  id: string;
  n: string;
  label: string;
  pct: number;
}

const SECTION_LABELS: Record<string, string> = {
  top: "HERO",
  about: "ABOUT",
  skills: "STACK",
  projects: "WORK",
  diary: "JOURNAL",
  contact: "CONTACT",
};

const WAYPOINTS = [
  { id: "top", n: "00", label: "Hero" },
  ...nav.map((item) => ({ id: item.id, n: item.n, label: item.label })),
];

// Major ticks every 10%, minor ticks every 2.5%
const TICKS = Array.from({ length: 41 }, (_, i) => {
  const pct = i * 2.5;
  const isMajor = pct % 10 === 0;
  const isMid = pct % 5 === 0 && !isMajor;
  return { pct, isMajor, isMid };
});

export default function ScrollRail() {
  const [activeSection, setActiveSection] = useState<string>("top");
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [ghostPct, setGhostPct] = useState<number | null>(null);
  const [ghostSection, setGhostSection] = useState<string>("HERO");

  const trackRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const sectionNameRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);

  // Measure dynamic document positions of section anchors
  useEffect(() => {
    const measure = () => {
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const maxScroll = Math.max(1, docH - winH);

      const measured = WAYPOINTS.map((w) => {
        if (w.id === "top") return { ...w, pct: 0 };
        const el = document.getElementById(w.id);
        if (!el) return { ...w, pct: 0 };
        const top = el.getBoundingClientRect().top + window.scrollY;
        const pct = Math.min(100, Math.max(0, (top / maxScroll) * 100));
        return { ...w, pct };
      });

      setWaypoints(measured);
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });
    const t = setTimeout(measure, 1000);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  // 60fps direct DOM animation loop for scrolling telemetry (0 React re-renders on scroll)
  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    let vel = 0;

    const update = () => {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const maxScroll = Math.max(1, docH - winH);
      const ratio = Math.min(1, Math.max(0, scrollY / maxScroll));
      const pct = ratio * 100;

      // Velocity calculation
      const delta = Math.abs(scrollY - lastY);
      lastY = scrollY;
      vel += (delta - vel) * 0.15;

      const track = trackRef.current;
      const needle = needleRef.current;
      const badge = badgeRef.current;
      const sectionName = sectionNameRef.current;

      // Find current active section
      let currentId = "top";
      const sections = WAYPOINTS.map((w) => document.getElementById(w.id)).filter(Boolean) as HTMLElement[];
      for (let i = sections.length - 1; i >= 0; i--) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= winH * 0.45) {
          currentId = sections[i].id;
          break;
        }
      }

      if (track && needle && badge && sectionName) {
        const trackHeight = track.clientHeight;
        const needleY = ratio * trackHeight;

        // Mathematical vertical centering: translate3d with translateY(-50%) aligns needle center with tick marks
        needle.style.transform = `translate3d(0, ${needleY}px, 0) translateY(-50%)`;
        badge.textContent = `${Math.round(pct)}%`;
        sectionName.textContent = SECTION_LABELS[currentId] || currentId.toUpperCase();

        // Subtle velocity flare
        if (vel > 18) {
          needle.style.filter = "drop-shadow(0 0 10px #ff3b30) brightness(1.3)";
        } else {
          needle.style.filter = "none";
        }
      }

      setActiveSection(currentId);
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Jump to specific scroll percentage on track click
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const ratio = Math.min(1, Math.max(0, clickY / rect.height));

    const docH = document.documentElement.scrollHeight;
    const winH = window.innerHeight;
    const maxScroll = Math.max(1, docH - winH);
    const targetY = ratio * maxScroll;

    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  // Hover ghost indicator preview
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const ghost = ghostRef.current;
    if (!track || !ghost) return;
    const rect = track.getBoundingClientRect();
    const hoverY = e.clientY - rect.top;
    const ratio = Math.min(1, Math.max(0, hoverY / rect.height));
    const currentPct = Math.round(ratio * 100);
    setGhostPct(currentPct);

    // Find section corresponding to hover percentage
    let hoverSection = "HERO";
    const sorted = [...waypoints].sort((a, b) => a.pct - b.pct);
    for (const w of sorted) {
      if (currentPct >= w.pct - 3) {
        hoverSection = SECTION_LABELS[w.id] || w.label.toUpperCase();
      }
    }
    setGhostSection(hoverSection);

    // Ghost needle also mathematically centered with translateY(-50%)
    ghost.style.transform = `translate3d(0, ${hoverY}px, 0) translateY(-50%)`;
  };

  const jumpToSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <aside
      className="fixed right-3 top-28 bottom-28 z-40 hidden w-28 select-none lg:flex flex-col items-end pointer-events-none"
      aria-label="Scroll Telemetry Ruler"
    >
      {/* Outer telemetry track container */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setGhostPct(null);
        }}
        className="group relative h-full w-full pointer-events-auto cursor-pointer"
      >
        {/* Subtle background rail line */}
        <div className="absolute right-[22px] top-0 bottom-0 w-px bg-line/40 transition-colors group-hover:bg-line" />

        {/* Major & Minor Ticks */}
        <div className="absolute inset-0 pointer-events-none">
          {TICKS.map((t) => (
            <div
              key={t.pct}
              className="absolute right-0 flex items-center justify-end"
              style={{ top: `${t.pct}%`, transform: "translateY(-50%)" }}
            >
              {/* Monospace percentage numbers on major ticks (00, 10, 20... 100) */}
              {t.isMajor && (
                <span className="mr-2 font-mono text-[8.5px] tabular-nums tracking-tighter text-mist/40 transition-colors group-hover:text-mist/80">
                  {String(t.pct).padStart(2, "0")}
                </span>
              )}

              {/* Tick line */}
              <span
                className={`block transition-all ${
                  t.isMajor
                    ? "h-px w-3 bg-mist/50 group-hover:w-3.5 group-hover:bg-bone"
                    : t.isMid
                    ? "h-px w-2 bg-mist/25 group-hover:bg-mist/50"
                    : "h-px w-1 bg-mist/15 group-hover:bg-mist/30"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Section Waypoint Markers pegged to document section offsets */}
        <div className="absolute inset-0 pointer-events-none">
          {waypoints.map((w) => {
            const isActive = activeSection === w.id;
            return (
              <div
                key={w.id}
                className="absolute right-7 pointer-events-auto flex items-center gap-1.5 transition-transform"
                style={{ top: `${w.pct}%`, transform: "translateY(-50%)" }}
              >
                <button
                  type="button"
                  onClick={(e) => jumpToSection(w.id, e)}
                  aria-label={`Jump to ${w.label}`}
                  className="group/wp flex items-center gap-1.5 py-1 px-1 focus:outline-none"
                >
                  {/* Expanded badge on hover */}
                  <span
                    className={`hidden rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest transition-all group-hover/wp:inline-block ${
                      isActive
                        ? "border-signal/50 bg-signal/10 text-signal"
                        : "border-line bg-void/90 text-bone backdrop-blur-sm"
                    }`}
                  >
                    {w.n}. {w.label}
                  </span>

                  {/* Compact index number (always visible) */}
                  <span
                    className={`font-mono text-[9.5px] tabular-nums tracking-wider transition-colors ${
                      isActive
                        ? "font-bold text-signal drop-shadow-[0_0_6px_rgba(255,59,48,0.7)]"
                        : "text-mist/50 hover:text-bone"
                    }`}
                  >
                    {w.n}
                  </span>

                  {/* Waypoint diamond indicator */}
                  <span
                    className={`h-1.5 w-1.5 rotate-45 border transition-all ${
                      isActive
                        ? "border-signal bg-signal shadow-[0_0_8px_#ff3b30]"
                        : "border-line bg-void group-hover/wp:border-bone"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Hover Ghost Needle previewing jump position */}
        <div
          ref={ghostRef}
          className={`pointer-events-none absolute right-0 top-0 flex items-center justify-end transition-opacity duration-150 ${
            isHovered && ghostPct !== null ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: "translate3d(0, 0, 0) translateY(-50%)" }}
        >
          <div className="mr-2 flex items-center gap-1.5 rounded-[3px] border border-line bg-void/90 px-1.5 py-0.5 shadow-md backdrop-blur-md">
            <span className="font-mono text-[8.5px] tabular-nums text-mist">
              {ghostPct}%
            </span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-mist/60 border-l border-line pl-1">
              {ghostSection}
            </span>
          </div>
          <span className="h-px w-5 border-t border-dashed border-mist/60" />
        </div>

        {/* Active Laser Pointer & Readout Badge — VISIBLE ONLY ON HOVER */}
        <div
          ref={needleRef}
          className={`pointer-events-none absolute right-0 top-0 flex items-center justify-end transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: "translate3d(0, 0, 0) translateY(-50%)" }}
        >
          {/* Digital Telemetry Badge with Real-Time Percentage & Page Name */}
          <div className="mr-2 flex items-center gap-1.5 rounded-[3px] border border-signal/60 bg-void/95 px-2 py-0.5 shadow-[0_0_14px_rgba(3,4,7,0.95)] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
            <span
              ref={badgeRef}
              className="font-mono text-[9.5px] font-bold tabular-nums tracking-wider text-signal"
            >
              0%
            </span>
            <span
              ref={sectionNameRef}
              className="font-mono text-[9px] uppercase tracking-wider text-bone/90 border-l border-line/80 pl-1.5 font-medium"
            >
              HERO
            </span>
          </div>

          {/* Precision Laser Pointer Needle (Mathematically centered on tick line) */}
          <div className="relative flex items-center">
            <span className="h-[2px] w-6 bg-gradient-to-l from-signal to-signal/40 shadow-[0_0_8px_#ff3b30]" />
            <span className="h-2 w-1 rounded-sm bg-signal shadow-[0_0_10px_#ff3b30]" />
          </div>
        </div>
      </div>
    </aside>
  );
}

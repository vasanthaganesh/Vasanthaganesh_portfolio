"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { hero } from "@/content/portfolio";
import PosterChrome from "./PosterChrome";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="sky-fallback absolute inset-0" />,
});

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const word = hero.lines.join("");
  let idx = 0;

  // Scroll morph: wordmark glides up and left toward navbar slot while scaling down
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const y = window.scrollY;
      const threshold = 340;
      const p = Math.min(1, Math.max(0, y / threshold));
      const el = wordmarkRef.current;
      if (!el) return;

      const easeP = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const tx = -easeP * 24;
      const ty = -easeP * 14;
      const scale = 1 - easeP * 0.45;
      const op = Math.max(0, 1 - easeP * 1.6);

      el.style.transform = `translate3d(${tx}vw, ${ty}vh, 0) scale(${scale})`;
      el.style.opacity = String(op);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="top"
      className="relative h-svh min-h-[640px] w-full overflow-hidden bg-void"
    >
      <HeroScene />

      {/* vignette for legibility */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_35%,transparent_30%,rgb(3_4_7/0.55)_100%)]" />

      <div className="relative z-[3] flex h-full flex-col items-center px-4 pt-[15vh] text-center md:pt-[24vh]">
        <motion.p
          className="mb-6 font-mono text-[9px] uppercase tracking-[0.18em] text-mist sm:text-[10px] md:text-[11px] md:tracking-[0.3em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          {hero.eyebrow}
        </motion.p>

        <h1
          ref={wordmarkRef}
          className="wordmark text-bone will-change-transform origin-center"
          aria-label={word}
        >
          {/* unified wordmark scaling smoothly across all viewports without awkward breaks */}
          <span
            className="flex items-center justify-center text-[clamp(1.85rem,7.8vw,4.5rem)] sm:text-[clamp(2.5rem,8.5vw,6rem)] md:text-[clamp(3rem,7vw,8.5rem)] lg:text-[clamp(3.5rem,7.5vw,9.5rem)] tracking-tight leading-none"
            aria-hidden
          >
            {hero.lines.map((part, li) => (
              <span key={li} className="flex overflow-hidden pb-[0.04em]">
                {part.split("").map((ch) => {
                  const i = idx++;
                  return (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 1, delay: 0.35 + i * 0.04 + li * 0.12, ease }}
                    >
                      {ch}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          className="mt-4 text-[clamp(1.05rem,1.8vw,1.6rem)] tracking-[-0.02em] text-bone md:mt-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1, ease }}
        >
          {hero.cadence}
        </motion.p>

        <motion.div
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 1, ease }}
        >
          <a
            href={hero.ctaPrimary.href || "#projects"}
            className="rounded-full bg-bone px-6 py-3 text-sm font-medium text-void transition-colors hover:bg-white"
          >
            {hero.ctaPrimary.label}
          </a>
          <a
            href={hero.ctaGhost.href || "#contact"}
            className="rounded-full border border-bone/30 px-6 py-3 text-sm text-bone backdrop-blur-sm transition-colors hover:border-bone"
          >
            {hero.ctaGhost.label}
          </a>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 z-[3] hidden -translate-x-1/2 flex-col items-center gap-3 md:bottom-10 md:flex"
        aria-label="Scroll to about"
      >
        <span className="font-mono text-[10px] tracking-[0.35em] text-mist">SCROLL</span>
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span className="scroll-line absolute inset-0 bg-bone" />
        </span>
      </a>

      {/* corner positioning statement (aligned in bottom-right corner) */}
      <motion.div
        className="pointer-events-none absolute bottom-6 right-6 z-[3] hidden max-w-[280px] text-right sm:block md:bottom-10 md:right-12 md:max-w-xs lg:max-w-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.45, duration: 1, ease }}
      >
        <p className="text-xs leading-relaxed text-mist md:text-[13px] lg:text-[13.5px]">
          {hero.body}
        </p>
      </motion.div>

      <PosterChrome kicker={hero.tagline} line="Puducherry, India — available globally" className="z-[3]" />
    </section>
  );
}

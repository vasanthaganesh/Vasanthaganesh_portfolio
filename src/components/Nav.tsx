"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, site, contact } from "@/content/portfolio";
import { TextRoll } from "@/components/ui/text-roll";

function HandleIcon() {
  return (
    <span className="grid h-[18px] w-[22px] place-items-center rounded-[4px] bg-signal" aria-hidden>
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
        <path d="M1 5h7M5.5 2 8.5 5l-3 3" stroke="#f3f2ea" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const logoRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const telegram = contact.channels.find((c) => c.k === "Telegram") ?? contact.channels[0];

  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Scroll morph: VG logo rolls away to the left while name glides into the top-left slot
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const y = window.scrollY;
      const threshold = 320;
      const p = Math.min(1, Math.max(0, y / threshold));

      const logo = logoRef.current;
      const name = nameRef.current;

      if (logo) {
        // Smooth rolling to left of screen: translates left, rotates, dissolves
        const tx = -p * 150;
        const rot = -p * 120;
        const op = Math.max(0, 1 - p * 2.2);
        logo.style.transform = `translate3d(${tx}%, 0, 0) rotate(${rot}deg)`;
        logo.style.opacity = String(op);
        logo.style.pointerEvents = p >= 0.5 ? "none" : "auto";
      }

      if (name) {
        // Name glides in smoothly from the hero center direction and locks into the top-left
        const easeP = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const tx = (1 - easeP) * 140;
        const ty = (1 - easeP) * 50;
        const scale = 1 + (1 - easeP) * 0.35;
        const op = Math.min(1, Math.max(0, (p - 0.12) / 0.55));

        name.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
        name.style.opacity = String(op);
        name.style.pointerEvents = p <= 0.3 ? "none" : "auto";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 [text-shadow:0_1px_12px_rgb(3_4_7/0.6)] md:px-12 md:py-8">
        <motion.a
          href="#top"
          initial="initial"
          whileHover="hovered"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group relative z-10 flex items-center h-9 focus:outline-none cursor-pointer"
          aria-label="Back to top"
        >
          {/* VG Logo Badge — visible at scroll = 0, rolls smoothly to the left on scroll */}
          <div
            ref={logoRef}
            className="flex items-center gap-2 will-change-transform"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-void/90 shadow-[0_2px_12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors group-hover:border-bone/70">
              <span className="font-mono text-[12px] font-black tracking-tighter text-bone">VG</span>
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_6px_#ff3b30]" />
            </div>
          </div>

          {/* Docked Name — flies in from hero center and lands in top-left as logo rolls away */}
          <div
            ref={nameRef}
            className="absolute left-0 flex items-center whitespace-nowrap will-change-transform"
            style={{ opacity: 0 }}
          >
            <TextRoll
              className="wordmark text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-tight !leading-[1.1] text-bone group-hover:text-white transition-colors uppercase"
            >
              VASANTHAGANESH
            </TextRoll>
          </div>
        </motion.a>

        {/* Mathematically centered primary navigation */}
        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex pointer-events-auto z-10"
          aria-label="Primary"
        >
          {nav.map((n) => (
            <motion.a
              key={n.id}
              href={`#${n.id}`}
              initial="initial"
              whileHover="hovered"
              className={`chrome group flex items-center gap-1.5 transition-opacity ${
                active && active !== n.id ? "opacity-50 hover:opacity-100" : ""
              }`}
            >
              <span className="font-mono text-[10px] text-mist">{n.n}.</span>
              <TextRoll className="uppercase tracking-wide text-xs !leading-[1.1] text-bone group-hover:text-white">
                {n.label}
              </TextRoll>
            </motion.a>
          ))}
        </nav>

        <div className="z-10 flex items-center gap-4 sm:gap-6">
          <a
            href={site.resume}
            download
            className="chrome hidden items-center gap-1.5 rounded-full border border-line px-3.5 py-1 text-xs text-bone transition-colors hover:border-bone sm:flex"
            aria-label="Download CV"
          >
            <span>CV</span>
            <span className="text-signal">↓</span>
          </a>

          <a href={telegram.href} target="_blank" rel="noreferrer" className="chrome hidden items-center gap-2 xl:flex">
            <HandleIcon />
            {site.handle}
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="chrome uppercase tracking-wide lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-void px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ul className="space-y-3">
              {nav.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, ease: [0.16, 1, 0.3, 1], duration: 0.7 }}
                >
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-signal">{n.n}</span>
                    <span className="wordmark text-5xl">{n.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-12 flex flex-col gap-4">
              <a
                href={site.resume}
                download
                className="chrome inline-flex w-fit items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-bone hover:border-bone"
              >
                <span>Download CV</span>
                <span className="text-signal">↓</span>
              </a>
              <a href={telegram.href} target="_blank" rel="noreferrer" className="chrome flex items-center gap-2">
                <HandleIcon /> {site.handle}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

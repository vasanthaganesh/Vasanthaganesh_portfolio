"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { journal } from "@/content/portfolio";
import PosterChrome, { SectionLabel } from "./PosterChrome";
import { MaskLines, Reveal } from "./Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Journal() {
  const [tab, setTab] = useState(journal[0]?.id ?? "systems");
  const [open, setOpen] = useState<number | null>(0);
  const current = journal.find((j) => j.id === tab) ?? journal[0];

  return (
    <section id="diary" className="relative min-h-svh px-6 pb-40 pt-36 md:px-12 md:pt-44">
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel n="04" label="Developer Journal" />
        <MaskLines lines={["Notes from", "the workbench."]} className="wordmark text-[clamp(2.6rem,8vw,8.5rem)]" />

        <div className="mt-20 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal delay={0.15}>
              <div role="tablist" aria-label="Journal topics" className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
                {journal.map((j) => {
                  const active = j.id === tab;
                  return (
                    <button
                      key={j.id}
                      role="tab"
                      id={`tab-${j.id}`}
                      aria-selected={active}
                      aria-controls={`panel-${j.id}`}
                      onClick={() => {
                        setTab(j.id);
                        setOpen(0);
                      }}
                      className={`flex items-center gap-3 rounded-full border px-4 py-2 text-sm transition-colors lg:rounded-none lg:border-0 lg:px-0 ${
                        active ? "border-bone text-bone" : "border-line text-mist hover:text-bone"
                      }`}
                    >
                      <span className={`hidden h-px transition-all duration-500 lg:block ${active ? "w-10 bg-signal" : "w-4 bg-line"}`} />
                      {j.label}
                      <span className="font-mono text-[10px] text-mist">0{j.entries.length}</span>
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            <AnimatePresence mode="wait">
              <motion.ul
                key={tab}
                className="border-t border-line"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease }}
              >
                {current?.entries.map((e, i) => {
                  const isOpen = open === i;
                  return (
                    <li key={e.title} className="border-b border-line">
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="group grid w-full grid-cols-12 items-baseline gap-4 py-7 text-left"
                      >
                        <span className="col-span-12 font-mono text-[11px] uppercase tracking-[0.15em] text-signal sm:col-span-3">
                          {e.date}
                        </span>
                        <span className="col-span-11 text-lg tracking-tight transition-colors group-hover:text-white sm:col-span-8 md:text-xl">
                          {e.title}
                        </span>
                        <span
                          className={`col-span-1 justify-self-end text-xl text-mist transition-transform duration-500 ${isOpen ? "rotate-45 text-bone" : ""}`}
                          aria-hidden
                        >
                          +
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.6, ease }}
                            className="overflow-hidden"
                          >
                            <blockquote className="grid grid-cols-12 gap-4 pb-10">
                              <p className="col-span-12 text-[17px] font-light leading-[1.75] text-bone/85 sm:col-span-9 sm:col-start-4">
                                “{e.body}”
                              </p>
                            </blockquote>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <PosterChrome kicker="Journal" line="Engineering depth, interactive systems, and quiet impact." n="04" />
    </section>
  );
}

"use client";

import { useState } from "react";
import { contact, footer, site } from "@/content/portfolio";
import PosterChrome, { SectionLabel } from "./PosterChrome";
import { MaskLines, Reveal } from "./Reveal";

export default function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1800);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(contact.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 1800);
    } catch {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  return (
    <section id="contact" className="relative flex min-h-svh flex-col overflow-hidden px-6 pt-36 md:px-12 md:pt-44">
      {/* rising horizon glow */}
      <div className="pointer-events-none absolute bottom-[-30vh] left-1/2 h-[70vh] w-[140vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(127_182_255/0.22),transparent_62%)]" />
      <div className="pointer-events-none absolute bottom-[8vh] left-0 right-0 h-px bg-gradient-to-r from-transparent via-glow/40 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1440px] flex-1">
        <SectionLabel n="05" label="Contact" />
        <MaskLines lines={contact.headline} className="wordmark text-[clamp(2.6rem,9.5vw,10rem)]" />

        <div className="mt-16 grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="text-[17px] leading-relaxed text-mist">{contact.body}</p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-signal">{contact.availability}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={`mailto:${contact.email}`} className="rounded-full bg-bone px-6 py-3 text-sm font-medium text-void transition-colors hover:bg-white">
                Start a project
              </a>
              <a
                href={site.resume}
                download
                className="rounded-full border border-bone/30 px-6 py-3 text-sm text-bone transition-colors hover:border-bone"
              >
                Download CV ↓
              </a>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.15}>
            <div className="space-y-8">
              <button onClick={copyEmail} className="group block w-full text-left" aria-label={`Copy email ${contact.email}`}>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist">
                  Email — {copiedEmail ? <span className="text-signal">copied ✓</span> : "click to copy"}
                </span>
                <span className="link-wipe mt-3 block break-all text-[clamp(1.25rem,2.6vw,2.4rem)] tracking-tight">
                  {contact.email}
                </span>
              </button>

              <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist block">
                    Direct Phone / WhatsApp
                  </span>
                  <a
                    href={`tel:${contact.phone}`}
                    className="link-wipe mt-2 block font-mono text-lg text-bone hover:text-white"
                  >
                    {contact.phone}
                  </a>
                </div>
                <button
                  onClick={copyPhone}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-mist transition-colors hover:border-bone hover:text-bone"
                  aria-label="Copy phone number"
                >
                  {copiedPhone ? <span className="text-signal">copied ✓</span> : "copy number"}
                </button>
              </div>
            </div>

            <ul className="mt-12 border-t border-line">
              {contact.channels.map((c) => (
                <li key={c.k} className="border-b border-line">
                  <a href={c.href} target="_blank" rel="noreferrer" className="group flex items-baseline justify-between py-5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">{c.k}</span>
                    <span className="flex items-center gap-3 text-lg tracking-tight">
                      <span className="link-wipe">{c.v}</span>
                      <span className="text-signal transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-1">↗</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <footer className="relative mx-auto mt-32 flex w-full max-w-[1440px] flex-col gap-2 pb-24 font-mono text-[11px] uppercase tracking-[0.2em] text-mist sm:flex-row sm:justify-between md:pb-28">
        <span className="text-bone">{footer.mark}</span>
        <span>{footer.colophon}</span>
      </footer>

      <PosterChrome kicker="Target Role" line={site.role} n="05" />
    </section>
  );
}

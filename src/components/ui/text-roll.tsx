"use client";

import React from "react";
import { motion } from "framer-motion";

interface TextRollProps {
  children: string;
  className?: string;
  center?: boolean;
  stagger?: number;
  duration?: number;
}

export function TextRoll({
  children,
  className = "",
  center = false,
  stagger = 0.025,
  duration = 0.35,
}: TextRollProps) {
  const chars = children.split("");
  const mid = (chars.length - 1) / 2;

  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={`relative inline-block overflow-hidden whitespace-nowrap select-none ${className}`}
    >
      <span className="inline-flex pointer-events-none">
        {chars.map((char, i) => {
          const delay = center ? stagger * Math.abs(i - mid) : stagger * i;
          return (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                initial: { y: "0%" },
                hovered: { y: "-120%" },
              }}
              transition={{
                ease: [0.25, 1, 0.5, 1],
                duration,
                delay,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </span>
      <span className="absolute inset-0 inline-flex pointer-events-none" aria-hidden="true">
        {chars.map((char, i) => {
          const delay = center ? stagger * Math.abs(i - mid) : stagger * i;
          return (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                initial: { y: "120%" },
                hovered: { y: "0%" },
              }}
              transition={{
                ease: [0.25, 1, 0.5, 1],
                duration,
                delay,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </span>
    </motion.span>
  );
}

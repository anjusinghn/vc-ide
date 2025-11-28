"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why Rixie", href: "#differentiators" },
  { label: "Contact", href: "#cta" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="flex items-center justify-between px-8 md:px-28 py-4 transition-[background,border-color,backdrop-filter] duration-500"
      style={{
        background: scrolled ? "var(--background)" : "transparent",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        opacity: scrolled ? 0.95 : 1,
        backdropFilter: scrolled ? "blur(8px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <div className="flex items-center gap-12 md:gap-20">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Rixie</span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="bg-foreground text-background rounded-full text-xs font-semibold px-4 py-2 hover:opacity-80 transition cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Request Access
      </button>
    </motion.nav>
  );
}

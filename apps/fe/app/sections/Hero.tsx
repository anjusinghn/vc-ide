"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/app/components/Navbar";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroTextY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        muted
        loop
        playsInline
        autoPlay
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
      />

      <div className="absolute inset-0 bg-black/40 z-[1]" />

      <div className="relative z-[3]">
        <Navbar />

        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className="flex flex-col items-center text-center mt-16 md:mt-24 px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-6 flex items-center gap-2"
          >
            <span className="text-sm font-medium text-foreground">
              Investor IDE
            </span>
            <span className="text-sm text-muted-foreground">
              — Cursor for investors
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl tracking-[-2px] font-medium leading-tight md:leading-[1.15] mb-3"
          >
            Cursor for{" "}
            <span className="font-serif italic font-normal">Investors</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg font-normal leading-6 opacity-85 mb-8 text-foreground"
          >
            The operating system for private-market decision work.
            <br />
            Source, evaluate, decide, and report — one workspace.
          </motion.p>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white text-black rounded-full px-8 py-3.5 text-base font-medium cursor-pointer hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Request Early Access
          </motion.button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent z-[4] pointer-events-none" />
    </section>
  );
}

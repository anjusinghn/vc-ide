"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const layers = [
  {
    number: 1,
    title: "Connectors",
    tag: "INPUT",
    description:
      "Gmail, Calendar, Affinity, Harmonic, PitchBook, Drive, Notion, Slack, Zoom transcripts. Each tool is a connector, not a destination.",
  },
  {
    number: 2,
    title: "Canonical Data Model",
    tag: "STRUCTURE",
    description:
      "Structured objects: Person, Company, Deal, Meeting, Memo, Thesis, Fund, LP, Portfolio Company, KPI. Every agent reads and writes to these—not chat history.",
  },
  {
    number: 3,
    title: "Agent Runtime",
    tag: "COMPUTE",
    description:
      "Specialized agents for specialized jobs: Scout for sourcing, Mapper for relationships, Analyst for research, Memo for writing, Operator for CRM and outreach.",
  },
  {
    number: 4,
    title: "Approval Layer",
    tag: "CONTROL",
    description:
      "Four modes: Observe (summarize only), Suggest (draft but don't apply), Approve (review before write), Auto-run (safe internal tasks only).",
  },
  {
    number: 5,
    title: "Firm Memory",
    tag: "LEARN",
    description:
      "The system learns which deals each partner likes, which memos got traction, which signals correlated with outcomes. A private behavioral dataset no generic model has.",
  },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function FlowConnector({
  active,
  index,
  inView,
}: {
  active: boolean;
  index: number;
  inView: boolean;
}) {
  return (
    <div className="flex justify-center py-1.5">
      <div className="flex flex-col items-center gap-1">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="w-[3px] h-[3px] rounded-full"
            style={{
              backgroundColor: active
                ? "rgba(255, 255, 255, 0.35)"
                : "rgba(255, 255, 255, 0.06)",
            }}
            animate={
              inView
                ? {
                    opacity: [0.3, 1, 0.3],
                  }
                : {}
            }
            transition={{
              duration: 1.8,
              delay: dot * 0.25 + index * 0.1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="px-8 md:px-28 py-24 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        className="mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-medium tracking-[-1.5px] mb-4">
          Five layers,{" "}
          <span className="font-serif italic font-normal">one</span> system
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl">
          Not a chatbot. A workspace, command layer, memory, and action engine.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left: Layer descriptions */}
        <div className="relative flex flex-col">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.number}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease,
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="relative flex gap-6 cursor-default"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                    active === i
                      ? "bg-white/10 border border-white/20"

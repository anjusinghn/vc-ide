"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "Command Bar",
    description:
      "Describe the outcome, not the workflow. 'Find seed-stage AI security startups with repeat founders and a warm path.'",
  },
  {
    title: "Thesis-as-Code",
    description:
      "Encode sectors, stages, ownership targets, and anti-thesis patterns. The system runs your thesis continuously.",
  },
  {
    title: "Deal Workspace",
    description:
      "Notes, emails, transcripts, comps, and memos in one place. Auto-generated briefs, competitor maps, and relationship graphs.",
  },
  {
    title: "Meeting to Memo",
    description:
      "Transcribe founder calls. Extract metrics, risks, and asks. Draft follow-ups, update CRM, generate partner-ready memos.",
  },
  {
    title: "Relationship Intelligence",
    description:
      "Warm intro paths, network overlap, relationship freshness scores. Your firm's network becomes a searchable asset.",
  },
  {
    title: "Diligence Copilot",
    description:
      "Summarize data rooms, flag inconsistencies, build competitor grids. Every claim links back to a source.",
  },
];

const rowVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="px-8 md:px-28 py-24 md:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-medium tracking-[-1.5px] mb-4">
          Everything an investor{" "}
          <span className="font-serif italic font-normal">needs</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl">
          From sourcing to IC memo, one workspace replaces the
          spreadsheet-and-email chaos.
        </p>
      </motion.div>

      <div className="max-w-2xl">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            custom={i}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={rowVariants}
            className="grid grid-cols-2 gap-8 py-6 border-b border-border first:pt-0 last:pb-0 last:border-b-0"
          >
            <h3 className="text-base font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

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

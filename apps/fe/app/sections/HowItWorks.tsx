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

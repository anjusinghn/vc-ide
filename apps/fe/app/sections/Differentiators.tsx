"use client";

import { motion } from "framer-motion";
import {
  Brain,
  UserCheck,
  GitBranch,
  History,
  Shield,
  TrendingUp,
} from "lucide-react";

const differentiators = [
  {
    icon: Brain,
    title: "Firm-Specific Workflow Memory",
    description:
      "The system learns how your firm works — your processes, your templates, your decision patterns.",
  },
  {
    icon: UserCheck,
    title: "Partner Preference Modeling",
    description:
      "Which deals each partner likes, which memos got traction, which sourced companies became meetings.",
  },
  {
    icon: GitBranch,
    title: "Proprietary Relationship Graph",
    description:
      "Your firm's network as a searchable, scored, living map. Not a generic LinkedIn scrape.",
  },
  {
    icon: History,
    title: "Decision History",
    description:
      "Full audit trail: who changed the memo, who approved the action, what changed since last week.",
  },
  {
    icon: Shield,
    title: "Action Approvals & Audit Logs",
    description:
      "Observe, suggest, approve, auto-run. Never send an email or edit a CRM record without a clear review step.",
  },
  {
    icon: TrendingUp,
    title: "Outcome Feedback Loop",
    description:
      "Which signals correlated with real outcomes? The system gets sharper with every decision your firm makes.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },

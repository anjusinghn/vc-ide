import { db } from "./index.js";
import { createId, daysAgo } from "../lib/utils.js";

type SeedCompany = {
  id: string;
  name: string;
  sector: string;
  stage: string;
  geography: string;
  website: string;
  description: string;
  foundedDate: string;
  employeeCount: number;
  fundingTotal: number;
};

export function seedIfEmpty() {
  const existing = db.prepare("SELECT COUNT(*) as count FROM companies").get() as { count: number };
  if (existing.count > 0) {
    return;
  }

  const fundId = createId();
  const thesisId = createId();

  const companies: SeedCompany[] = [
    {
      id: createId(),
      name: "Acme Corp",
      sector: "AI Infrastructure",
      stage: "Seed",
      geography: "San Francisco, CA",
      website: "https://acme.example",
      description: "Inference orchestration tooling for multimodal agent teams.",
      foundedDate: "2022-04-15",
      employeeCount: 28,
      fundingTotal: 8_500_000,
    },
    {
      id: createId(),
      name: "Bolt AI",
      sector: "Developer Tools",
      stage: "Pre-Seed",
      geography: "New York, NY",
      website: "https://bolt.example",
      description: "Copilot analytics platform for engineering organizations.",
      foundedDate: "2023-01-09",
      employeeCount: 14,
      fundingTotal: 2_750_000,
    },
    {
      id: createId(),
      name: "Crux Labs",
      sector: "Climate Software",
      stage: "Seed",
      geography: "Austin, TX",
      website: "https://crux.example",
      description: "Industrial emissions workflow automation for mid-market plants.",
      foundedDate: "2021-09-02",
      employeeCount: 19,
      fundingTotal: 5_200_000,
    },
    {
      id: createId(),
      name: "Delta Security",
      sector: "Cybersecurity",
      stage: "Series A",
      geography: "Boston, MA",
      website: "https://delta.example",
      description: "Runtime identity graph for cloud-native security teams.",
      foundedDate: "2020-06-28",
      employeeCount: 41,
      fundingTotal: 16_800_000,
    },
    {
      id: createId(),
      name: "Echo Analytics",
      sector: "Vertical SaaS",
      stage: "Seed",
      geography: "Seattle, WA",
      website: "https://echo.example",
      description: "Revenue intelligence platform for specialty healthcare clinics.",
      foundedDate: "2022-11-18",
      employeeCount: 23,
      fundingTotal: 6_100_000,
    },
  ];

  const thesis = {
    id: thesisId,
    name: "AI Infrastructure - Seed",
    fundId,
    sectors: JSON.stringify(["AI", "Infrastructure"]),
    stages: JSON.stringify(["pre_seed", "seed"]),
    geographies: JSON.stringify(["US", "Europe"]),
    ownershipTargetMin: 0.08,
    ownershipTargetMax: 0.15,
    preferredFounderPatterns: JSON.stringify([
      "technical founders with infra depth",
      "repeat builders from data tooling teams",
    ]),
    antiPatterns: JSON.stringify([
      "services-heavy gross margin profile",
      "single-customer concentration risk",
    ]),
    diligenceQuestions: JSON.stringify([
      "What is the deployment footprint at $1M ARR?",
      "How sticky is the workflow after initial integration?",
      "What moat compounds with usage density?",
    ]),
    active: 1,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(2),
  };

  const deals = [
    {
      id: createId(),
      companyId: companies[0].id,
      fundId,
      stage: "diligence",
      confidence: 83,
      leadPartner: "Nadia Park",
      source: "Warm intro from angel syndicate",
      thesisId,
      createdAt: daysAgo(12),
      updatedAt: daysAgo(1),
      lastActivityAt: daysAgo(1),
    },
    {
      id: createId(),

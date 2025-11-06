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

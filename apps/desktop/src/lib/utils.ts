import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DealStage, DealWithCompany } from "@vc-ide/shared";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stageOrder: DealStage[] = [
  "sourced",
  "first_call",
  "diligence",
  "ic",
  "term_sheet",
  "closed",
  "passed",
];

export function formatRelativeDate(dateString?: string | null) {
  if (!dateString) {
    return "No activity";
  }

  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "1 day ago";
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) {
    return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString();
}

export function formatCurrency(value?: number | null) {
  if (value == null) {
    return "—";

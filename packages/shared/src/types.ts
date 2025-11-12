export type DealStage =
  | "sourced"
  | "first_call"
  | "diligence"
  | "ic"
  | "term_sheet"
  | "closed"
  | "passed";

export type MeetingType =
  | "founder_call"
  | "partner_meeting"
  | "reference"
  | "other";

export type MemoType = "ic_memo" | "company_brief" | "meeting_summary" | "scratch";
export type MemoStatus = "draft" | "review" | "final";
export type TaskStatus = "open" | "done" | "cancelled";
export type PersonTag = "founder" | "angel" | "operator" | "lp" | "partner";

export interface Company {
  id: string;
  name: string;
  sector?: string | null;
  stage?: string | null;
  geography?: string | null;
  website?: string | null;
  description?: string | null;
  foundedDate?: string | null;
  employeeCount?: number | null;
  fundingTotal?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Fund {
  id: string;
  name: string;
  vintageYear?: number | null;
  targetSize?: number | null;
  strategy?: string | null;
  createdAt: string;
}

export interface Thesis {
  id: string;
  name: string;
  fundId?: string | null;
  sectors: string[];
  stages: string[];
  geographies: string[];
  ownershipTargetMin?: number | null;
  ownershipTargetMax?: number | null;
  preferredFounderPatterns: string[];
  antiPatterns: string[];
  diligenceQuestions: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  companyId: string;
  fundId?: string | null;

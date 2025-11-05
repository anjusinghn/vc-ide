import type {
  ActivityEntry,
  Company,
  CreateCompanyInput,
  CreateDealInput,
  CreateFundInput,
  CreateMeetingInput,
  CreateMemoInput,
  CreatePersonInput,
  CreateTaskInput,
  CreateThesisInput,
  Deal,
  DealFull,
  DealWithCompany,
  Fund,
  Meeting,
  Memo,
  Person,
  PipelineSummary,
  SearchResults,
  Task,
  Thesis,
  UpdateCompanyInput,
  UpdateDealInput,
  UpdateFundInput,
  UpdateMeetingInput,
  UpdateMemoInput,
  UpdatePersonInput,
  UpdateTaskInput,
  UpdateThesisInput,
} from "@vc-ide/shared";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3001/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const queryKeys = {
  companies: ["companies"] as const,
  company: (id: string) => ["companies", id] as const,

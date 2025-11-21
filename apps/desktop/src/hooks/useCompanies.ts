import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateCompanyInput, UpdateCompanyInput } from "@vc-ide/shared";

import { api, queryKeys } from "../lib/api";

export function useCompanies() {
  return useQuery({
    queryKey: queryKeys.companies,
    queryFn: api.companies.list,
  });
}

export function useCompany(id?: string) {
  return useQuery({
    queryKey: queryKeys.company(id ?? "unknown"),
    queryFn: () => api.companies.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

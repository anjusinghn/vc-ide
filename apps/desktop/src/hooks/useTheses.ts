import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateThesisInput, UpdateThesisInput } from "@vc-ide/shared";

import { api, queryKeys } from "../lib/api";

export function useTheses() {
  return useQuery({
    queryKey: queryKeys.theses,
    queryFn: api.theses.list,
  });
}

export function useThesis(id?: string) {
  return useQuery({
    queryKey: queryKeys.thesis(id ?? "unknown"),
    queryFn: () => api.theses.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreateThesis() {
  const queryClient = useQueryClient();

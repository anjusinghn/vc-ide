import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateDealInput, UpdateDealInput } from "@vc-ide/shared";

import { api, queryKeys } from "../lib/api";

export function useDeals() {
  return useQuery({
    queryKey: queryKeys.deals,
    queryFn: api.deals.list,
  });
}

export function useDeal(id?: string) {
  return useQuery({
    queryKey: queryKeys.deal(id ?? "unknown"),
    queryFn: () => api.deals.get(id!),
    enabled: Boolean(id),
  });
}

export function useDealFull(id?: string) {
  return useQuery({
    queryKey: queryKeys.dealFull(id ?? "unknown"),
    queryFn: () => api.deals.full(id!),
    enabled: Boolean(id),
  });
}


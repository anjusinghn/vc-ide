import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskInput, UpdateTaskInput } from "@vc-ide/shared";

import { api, queryKeys } from "../lib/api";

export function useTasks() {
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: api.tasks.list,
  });
}

export function useTask(id?: string) {
  return useQuery({
    queryKey: queryKeys.task(id ?? "unknown"),
    queryFn: () => api.tasks.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateMeetingInput, UpdateMeetingInput } from "@vc-ide/shared";

import { api, queryKeys } from "../lib/api";

export function useMeetings() {
  return useQuery({
    queryKey: queryKeys.meetings,
    queryFn: api.meetings.list,
  });
}

export function useMeeting(id?: string) {
  return useQuery({
    queryKey: queryKeys.meeting(id ?? "unknown"),
    queryFn: () => api.meetings.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();

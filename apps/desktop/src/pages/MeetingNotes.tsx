import { MeetingForm } from "../components/workspace/MeetingForm";
import { useCreateMeeting, useMeeting, useUpdateMeeting } from "../hooks/useMeetings";
import { usePeople } from "../hooks/usePeople";

export function MeetingNotes({
  dealId,
  meetingId,
}: {
  dealId?: string;
  meetingId?: string;
}) {
  const meetingQuery = useMeeting(meetingId);
  const peopleQuery = usePeople();
  const createMeeting = useCreateMeeting();
  const updateMeeting = useUpdateMeeting(meetingId ?? "");

  if (meetingId && meetingQuery.isLoading) {
    return (
      <div className="flex flex-col gap-3 p-5">
        <div className="skeleton h-4 rounded w-2/5" />
        <div className="skeleton h-4 rounded w-full" />
        <div className="skeleton h-4 rounded w-4/5" />
        <div className="skeleton h-4 rounded w-3/5" />
      </div>
    );
  }

  return (
    <div className="list-stack">

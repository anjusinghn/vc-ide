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
      <section className="data-card">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Meeting Notes
          </p>
          <p className="text-sm font-medium mt-0.5">
            {meetingQuery.data ? "Edit note" : "New structured note"}
          </p>
        </div>
      </section>
      <section className="data-card">
        <MeetingForm
          defaultDealId={dealId}
          meeting={meetingQuery.data}
          onSave={async (payload) => {
            if (meetingId) {
              await updateMeeting.mutateAsync(payload);
              return;
            }

            await createMeeting.mutateAsync(payload);
          }}
          people={peopleQuery.data ?? []}
        />
      </section>
    </div>
  );
}

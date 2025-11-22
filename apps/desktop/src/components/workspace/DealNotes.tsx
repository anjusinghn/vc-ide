import type { Meeting } from "@vc-ide/shared";
import { NotebookText } from "lucide-react";

import { formatRelativeDate } from "../../lib/utils";
import { EmptyState } from "../layout/EmptyState";

export function DealNotes({ meetings }: { meetings: Meeting[] }) {
  if (meetings.length === 0) {
    return (
      <div className="min-h-56">
        <EmptyState
          description="Meeting notes become the narrative backbone of a deal. Add the first founder call or partner sync to start the trail."
          icon={NotebookText}
          title="No meeting notes yet"
        />
      </div>
    );
  }

  return (
    <div className="list-stack">
      {meetings.map((meeting) => (
        <article className="list-item" key={meeting.id}>
          <div className="split-inline">
            <span className="font-medium text-foreground text-xs">{meeting.meetingType}</span>
            <span className="muted">{formatRelativeDate(meeting.date)}</span>
          </div>
          <p>{meeting.rawNotes ?? "No raw notes captured."}</p>
          <div className="action-row">
            {meeting.structuredNotes.risks.map((risk) => (
              <span className="badge" key={risk}>
                Risk: {risk}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

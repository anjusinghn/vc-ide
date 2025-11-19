import type { ActivityEntry } from "@vc-ide/shared";

import { formatRelativeDate } from "../../lib/utils";

export function DealTimeline({ activity }: { activity: ActivityEntry[] }) {
  if (activity.length === 0) {
    return (
      <p className="text-xs text-muted-foreground px-3 py-8 text-center">
        No timeline events yet.
      </p>
    );
  }

  return (
    <div className="list-stack">
      {activity.map((entry) => (
        <div
          className="list-item text-xs"
          key={`${entry.entityType}:${entry.entityId}:${entry.timestamp}`}
        >
          <div className="split-inline">
            <span className="font-medium">{entry.entityName}</span>
            <span className="text-muted-foreground">{formatRelativeDate(entry.timestamp)}</span>
          </div>
          <span className="text-muted-foreground capitalize">
            {entry.entityType} {entry.action}
          </span>
        </div>
      ))}
    </div>
  );
}

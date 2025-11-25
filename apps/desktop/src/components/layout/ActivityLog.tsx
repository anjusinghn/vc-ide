import { Activity, Briefcase, FileText, Users } from "lucide-react";

import { useActivity } from "../../hooks/useActivity";
import { useLayout } from "../../contexts/LayoutContext";
import { formatRelativeDate } from "../../lib/utils";
import { EmptyState } from "./EmptyState";

function iconForEntity(entityType: string) {
  if (entityType === "deal") {
    return <Briefcase size={14} />;
  }

  if (entityType === "memo" || entityType === "meeting") {
    return <FileText size={14} />;
  }

  if (entityType === "person" || entityType === "company") {
    return <Users size={14} />;
  }

  return <Activity size={14} />;
}

export function ActivityLog() {
  const activity = useActivity(50);
  const { openTab } = useLayout();

  if (activity.isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <div className="skeleton h-5 rounded" />
        <div className="skeleton h-5 rounded w-4/5" />
        <div className="skeleton h-5 rounded w-3/5" />
        <div className="skeleton h-5 rounded w-4/5" />
      </div>
    );
  }

  if ((activity.data?.length ?? 0) === 0) {
    return (
      <EmptyState
        description="Changes from deals, notes, meetings, and tasks will stream here as the workspace evolves."
        icon={Activity}
        title="No activity yet"
      />
    );
  }

  return (
    <div className="list-stack" style={{ overflowY: "auto" }}>
      {(activity.data ?? []).map((item) => (
        <button
          className="list-item"
          key={`${item.entityType}:${item.entityId}:${item.timestamp}`}
          onClick={() => {
            if (item.entityType === "deal") {
              openTab({
                id: `deal:${item.entityId}`,
                title: item.entityName,
                kind: "deal",
                section: "deals",
                payload: { dealId: item.entityId },
              });
            }
          }}
          style={{
            alignItems: "center",
            background: "transparent",
            border: "none",
            color: "inherit",
            cursor: item.entityType === "deal" ? "pointer" : "default",
            display: "grid",
            gap: 4,
            textAlign: "left",
            width: "100%",
          }}
          type="button"
        >
          <div className="split-inline">
            <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
              <span className="muted" style={{ display: "inline-flex" }}>
                {iconForEntity(item.entityType)}
              </span>
              <strong>{item.entityName}</strong>
            </div>
            <span className="muted" style={{ fontSize: 11 }}>
              {formatRelativeDate(item.timestamp)}
            </span>
          </div>
          <span className="muted" style={{ fontSize: 11 }}>
            {item.entityType} {item.action}
          </span>
        </button>
      ))}
    </div>
  );
}

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

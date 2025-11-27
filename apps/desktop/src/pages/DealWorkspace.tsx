import { useEffect, useMemo, useState } from "react";

import { DealNotes } from "../components/workspace/DealNotes";
import { DealOverview } from "../components/workspace/DealOverview";
import { DealTimeline } from "../components/workspace/DealTimeline";
import { ConfidenceBadge } from "../components/workspace/ConfidenceBadge";
import { StageBadge } from "../components/workspace/StageBadge";
import { useDealFull } from "../hooks/useDeals";
import { useWorkspace } from "../contexts/WorkspaceContext";

const tabs = ["overview", "notes", "memos", "timeline"] as const;

export function DealWorkspace({
  dealId,
  initialSection = "overview",
}: {
  dealId?: string;
  initialSection?: (typeof tabs)[number];
}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(initialSection);
  const dealQuery = useDealFull(dealId);
  const { addRecentItem } = useWorkspace();

  useEffect(() => {
    if (!dealQuery.data) {
      return;
    }

    addRecentItem({
      id: `deal:${dealQuery.data.id}`,
      title: dealQuery.data.company.name,
      kind: "deal",
    });
  }, [addRecentItem, dealQuery.data]);

  const memoContent = useMemo(() => dealQuery.data?.memos ?? [], [dealQuery.data]);

  if (!dealId) {
    return (
      <p className="flex items-center justify-center h-full text-xs text-muted-foreground">
        Select a deal to open its workspace.
      </p>
    );
  }

  if (dealQuery.isLoading) {
    return (
      <div className="flex flex-col gap-3 p-5">
        <div className="skeleton h-4 rounded w-2/5" />
        <div className="skeleton h-4 rounded w-full" />
        <div className="skeleton h-4 rounded w-4/5" />
        <div className="skeleton h-4 rounded w-3/5" />
        <div className="skeleton h-4 rounded w-full" />
      </div>
    );
  }

  if (!dealQuery.data) {
    return (
      <p className="flex items-center justify-center h-full text-xs text-muted-foreground">
        Deal not found.
      </p>
    );
  }

  const deal = dealQuery.data;

  return (
    <div className="list-stack">
      <section className="data-card">
        <div className="split-inline">
          <div>
            <strong className="text-lg font-semibold">{deal.company.name}</strong>
          </div>
          <div className="action-row">
            <StageBadge stage={deal.stage} />
            <ConfidenceBadge value={deal.confidence} />
          </div>
        </div>
        <div className="flex items-center gap-0 border-b border-border mt-3 -mb-[14px] -mx-[14px] px-[14px]">

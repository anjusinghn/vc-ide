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

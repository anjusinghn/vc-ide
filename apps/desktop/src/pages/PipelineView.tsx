import { useMemo, useState } from "react";
import type { DealStage, DealWithCompany } from "@vc-ide/shared";

import { usePipeline } from "../hooks/usePipeline";
import { useLayout } from "../contexts/LayoutContext";
import { useWorkspace } from "../contexts/WorkspaceContext";
import { formatRelativeDate, groupDealsByStage, stageLabel, stageOrder } from "../lib/utils";
import { useShortcutActions } from "../hooks/useKeyboardShortcuts";
import { ConfidenceBadge } from "../components/workspace/ConfidenceBadge";
import { StageBadge } from "../components/workspace/StageBadge";
import { StageColumn } from "../components/workspace/StageColumn";
import { EmptyState } from "../components/layout/EmptyState";
import { Briefcase } from "lucide-react";

type SortMode = "activity" | "confidence" | "name";

export function PipelineView() {
  const [stageFilter, setStageFilter] = useState<DealStage | "all">("all");
  const [sortBy, setSortBy] = useState<SortMode>("activity");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const { deals, summary } = usePipeline();
  const { openTab } = useLayout();
  const { addRecentItem } = useWorkspace();
  const shortcutActions = useShortcutActions();

  const filteredDeals = useMemo(() => {
    const source = deals.data ?? [];
    const next = source.filter((deal) => (stageFilter === "all" ? true : deal.stage === stageFilter));

    return next.sort((left, right) => {
      if (sortBy === "confidence") {
        return (right.confidence ?? 0) - (left.confidence ?? 0);
      }

      if (sortBy === "name") {
        return left.company.name.localeCompare(right.company.name);
      }

      return right.lastActivityAt.localeCompare(left.lastActivityAt);
    });
  }, [deals.data, sortBy, stageFilter]);

  const openDeal = (deal: DealWithCompany) => {
    openTab({
      id: `deal:${deal.id}`,
      title: deal.company.name,
      kind: "deal",
      section: "deals",
      payload: { dealId: deal.id },
    });
    addRecentItem({
      id: `deal:${deal.id}`,
      title: deal.company.name,
      kind: "deal",
    });
  };

  const grouped = groupDealsByStage(filteredDeals);

  return (
    <div className="list-stack">
      <section className="data-card">
        <p className="text-xs font-mono text-muted-foreground mb-3">
          {stageOrder.slice(0, 5).map((stage, i) => (
            <span key={stage}>
              {i > 0 && <span className="mx-2 opacity-30">·</span>}
              <span className="text-foreground">{stageLabel(stage)}</span>
              {" "}<span className="tabular-nums">{summary.data?.[stage] ?? 0}</span>
            </span>
          ))}
        </p>

        <div className="toolbar">
          <div className="toolbar-field">
            <div className="flex rounded border border-border overflow-hidden">
              <button
                className={`px-2.5 py-0.5 text-[11px] transition-colors ${viewMode === "table" ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setViewMode("table")}
                type="button"
              >
                Table
              </button>
              <button
                className={`px-2.5 py-0.5 text-[11px] border-l border-border transition-colors ${viewMode === "kanban" ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setViewMode("kanban")}
                type="button"
              >
                Kanban
              </button>
            </div>
          </div>
          <div className="toolbar-field">
            <label htmlFor="stage-filter">Stage</label>
            <select
              className="select"
              id="stage-filter"
              onChange={(event) => setStageFilter(event.target.value as DealStage | "all")}
              value={stageFilter}
            >
              <option value="all">All stages</option>
              {stageOrder.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
          <div className="toolbar-field">
            <label htmlFor="sort-by">Sort</label>
            <select
              className="select"
              id="sort-by"
              onChange={(event) => setSortBy(event.target.value as SortMode)}
              value={sortBy}
            >
              <option value="activity">Last activity</option>
              <option value="confidence">Confidence</option>
              <option value="name">Company name</option>
            </select>
          </div>

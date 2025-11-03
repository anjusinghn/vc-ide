import { Settings } from "lucide-react";

import { useFunds } from "../../hooks/useFunds";
import { usePipeline } from "../../hooks/usePipeline";
import { useTasks } from "../../hooks/useTasks";
import { useLayout } from "../../contexts/LayoutContext";
import { useWorkspace } from "../../contexts/WorkspaceContext";

export function StatusBar() {
  const { activeFund } = useWorkspace();
  const funds = useFunds();
  const pipeline = usePipeline();
  const tasks = useTasks();
  const { openTab } = useLayout();

  const workspaceLabel = funds.data?.find((fund) => fund.name === activeFund)?.name ?? funds.data?.[0]?.name ?? activeFund;
  const dueTasks = (tasks.data ?? []).filter((task) => task.status === "open" && Boolean(task.dueDate));

  return (
    <footer className="status-bar">
      <div className="status-cluster">
        <span className="muted">ws:</span>
        <span>{workspaceLabel}</span>
      </div>
      <div className="status-cluster">
        <span>{pipeline.deals.data?.length ?? 0} deals</span>

import type { DealWithCompany, Task } from "@vc-ide/shared";
import { CalendarClock, CircleSlash2, ExternalLink } from "lucide-react";

import { cn } from "../../lib/utils";
import { formatDueDate, isPastDue } from "../../lib/dates";

export function TaskItem({
  deal,
  isUpdating,
  onCancel,
  onComplete,
  onOpenDeal,
  task,
}: {
  deal?: DealWithCompany;
  isUpdating?: boolean;
  onCancel: (task: Task) => void;
  onComplete: (task: Task) => void;
  onOpenDeal: (dealId: string) => void;
  task: Task;
}) {
  const pastDue = isPastDue(task.dueDate);

  return (
    <div className="list-item grid gap-2">
      <div className="split-inline gap-3">
        <label className={cn("flex items-start gap-2.5 flex-1", isUpdating ? "cursor-wait" : "cursor-pointer")}>
          <input
            checked={false}
            className="mt-0.5 accent-accent"
            disabled={isUpdating}
            onChange={() => onComplete(task)}
            type="checkbox"
          />
          <div className="grid gap-1">
            <span className="font-medium text-xs">{task.title}</span>
            {task.description ? (
              <span className="text-[11px] text-muted-foreground leading-relaxed block mt-0.5">
                {task.description}
              </span>
            ) : null}
          </div>
        </label>

        <div className="action-row self-start">
          <button
            className="small-action"
            disabled={isUpdating}
            onClick={() => onCancel(task)}
            type="button"
          >
            <CircleSlash2 size={12} />
            Cancel
          </button>
        </div>
      </div>

      <div className="split-inline gap-3">
        <div className="action-row muted flex-wrap text-[11px]">
          <span className="inline-flex items-center gap-1">
            <CalendarClock size={12} />
            <span className={cn("text-[11px]", pastDue && "text-[oklch(0.82_0.12_27)]")}>
              {formatDueDate(task.dueDate)}
            </span>
          </span>
          {task.assignee ? <span>Owner: {task.assignee}</span> : null}
        </div>

        {deal ? (
          <button className="small-action" onClick={() => onOpenDeal(deal.id)} type="button">
            <ExternalLink size={12} />
            {deal.company.name}
          </button>
        ) : null}
      </div>
    </div>
  );
}

import type { DealFull } from "@vc-ide/shared";

import { ConfidenceBadge } from "./ConfidenceBadge";
import { CompanyCard } from "./CompanyCard";
import { StageBadge } from "./StageBadge";

export function DealOverview({ deal }: { deal: DealFull }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <CompanyCard company={deal.company} thesis={deal.thesis} />
      <section className="data-card">
        <div className="split-inline">
          <div>
            <div className="muted">Deal</div>
            <span className="font-medium text-foreground text-xs">{deal.company.name}</span>
          </div>
          <StageBadge stage={deal.stage} />
        </div>
        <div className="action-row mt-3">
          <ConfidenceBadge value={deal.confidence} />
          <span className="badge">Lead {deal.leadPartner ?? "Unassigned"}</span>
          <span className="badge">{deal.source ?? "Unknown source"}</span>
        </div>
        <div className="list-stack mt-3">
          {deal.tasks.map((task) => (
            <div className="list-item" key={task.id}>
              <div className="split-inline">
                <span className="font-medium text-foreground text-xs">{task.title}</span>
                <span className="badge">{task.status}</span>
              </div>
              <div className="muted">{task.assignee ?? "Unassigned"}</div>
            </div>
          ))}
          {deal.tasks.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No open tasks.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

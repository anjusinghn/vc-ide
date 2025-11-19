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

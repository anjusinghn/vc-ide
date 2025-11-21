import type { DealStage, DealWithCompany } from "@vc-ide/shared";

import { stageLabel } from "../../lib/utils";
import { DealCard } from "./DealCard";

export function StageColumn({
  deals,
  onOpen,
  stage,
}: {
  deals: DealWithCompany[];
  onOpen: (deal: DealWithCompany) => void;
  stage: DealStage;
}) {
  return (
    <section className="flex flex-col gap-1.5 bg-card border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium">{stageLabel(stage)}</span>
        <span className="text-[10px] font-mono text-muted-foreground">{deals.length}</span>
      </div>
      {deals.map((deal) => (
        <DealCard deal={deal} key={deal.id} onOpen={onOpen} />
      ))}
    </section>
  );
}

import type { DealStage } from "@vc-ide/shared";

import { cn, stageLabel } from "../../lib/utils";

const stageDotColor: Record<DealStage, string> = {
  sourced: "text-muted-foreground",
  first_call: "text-muted-foreground",
  diligence: "text-muted-foreground",
  ic: "text-accent",
  term_sheet: "text-accent",
  closed: "text-accent",
  passed: "text-muted-foreground",
};

export function StageBadge({ stage }: { stage: DealStage }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium">
      <span className={cn("text-[8px]", stageDotColor[stage])}>●</span>
      {stageLabel(stage)}
    </span>
  );
}

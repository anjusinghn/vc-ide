import { cn, confidenceLabel } from "../../lib/utils";

const colorMap: Record<string, string> = {
  High: "text-emerald-400",
  Medium: "text-amber-400",
  Low: "text-muted-foreground",
  Unscored: "text-muted-foreground",
};

export function ConfidenceBadge({ value }: { value?: number | null }) {
  const label = confidenceLabel(value);
  return (
    <span className={cn("text-[11px] font-medium tabular-nums", colorMap[label])}>
      {value ?? "—"}{" "}
      <span className="text-muted-foreground font-normal">· {label}</span>
    </span>
  );
}

import type { LucideIcon } from "lucide-react";

import { Button } from "../ui/button";

type EmptyStateProps = {
  actionLabel?: string;
  description: string;
  icon: LucideIcon;
  onAction?: () => void;
  title: string;
};

export function EmptyState({
  actionLabel,
  description,
  icon: Icon,
  onAction,
  title,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full py-10 px-6 text-center animate-in fade-in duration-150">
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        <Icon size={18} />
      </div>
      <div className="grid gap-1 max-w-xs">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction ? (
        <Button onClick={onAction} size="sm" variant="outline">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

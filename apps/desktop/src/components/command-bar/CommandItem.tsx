import type { LucideIcon } from "lucide-react";

type CommandItemProps = {
  icon?: LucideIcon;
  label: string;
  shortcut?: string;
  onSelect: () => void;
};

export function CommandItem({
  icon: Icon,
  label,
  shortcut,
  onSelect,
}: CommandItemProps) {
  return (
    <button className="command-item" onClick={onSelect} type="button">
      {Icon ? (
        <Icon size={14} className="shrink-0 opacity-[0.65]" />
      ) : null}
      <span className="flex-1">{label}</span>
      {shortcut ? (
        <span className="text-[10px] bg-white/[0.08] px-[5px] py-px rounded-[3px] border border-border text-muted-foreground shrink-0 font-[inherit]">
          {shortcut}
        </span>
      ) : null}
    </button>
  );
}

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function SidebarSection({
  badge,
  defaultOpen = true,
  title,
  children,
}: {
  badge?: number;
  defaultOpen?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="sidebar-section">
      <button
        className="sidebar-section-header"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="flex items-center gap-1.5">
          {title}
          {badge !== undefined && badge > 0 ? (
            <span className="text-[10px] font-mono tabular-nums text-muted-foreground">
              {badge}
            </span>
          ) : null}
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-150 shrink-0 ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>
      {open ? <div className="sidebar-list">{children}</div> : null}
    </section>
  );
}

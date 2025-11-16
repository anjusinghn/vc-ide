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

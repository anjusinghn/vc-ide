import {
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  ChevronsLeft,
  Lightbulb,
  Users,
} from "lucide-react";

import { useMeetings } from "../../hooks/useMeetings";
import { usePeople } from "../../hooks/usePeople";
import { usePipeline } from "../../hooks/usePipeline";
import { useTheses } from "../../hooks/useTheses";
import { useLayout, type NavSection } from "../../contexts/LayoutContext";
import { useWorkspace } from "../../contexts/WorkspaceContext";
import { SidebarSection } from "./SidebarSection";

type NavItem = {
  key: NavSection;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
};

const NAV_ITEMS: NavItem[] = [
  { key: "pipeline", label: "Pipeline", icon: BarChart3 },
  { key: "deals", label: "Deals", icon: Briefcase },
  { key: "theses", label: "Thesis", icon: Lightbulb },
  { key: "people", label: "People", icon: Users },
  { key: "meetings", label: "Meetings", icon: Calendar },
];

function iconForRecentKind(kind: "deal" | "company" | "person" | "meeting" | "thesis") {
  switch (kind) {
    case "deal":    return <Briefcase size={12} />;
    case "company": return <Building2 size={12} />;
    case "thesis":  return <Lightbulb size={12} />;
    case "person":  return <Users size={12} />;
    case "meeting": return <Calendar size={12} />;
  }
}

function openRecentTab(
  item: { id: string; title: string; kind: "deal" | "company" | "person" | "meeting" | "thesis" },
  openTab: ReturnType<typeof useLayout>["openTab"],
) {
  const entityId = item.id.split(":")[1];

  if (item.kind === "thesis") {
    openTab({
      id: item.id,
      title: item.title,
      kind: "thesis",
      section: "theses",
      payload: { thesisId: entityId },
    });

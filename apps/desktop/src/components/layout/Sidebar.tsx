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
    return;
  }

  if (item.kind === "person") {
    openTab({
      id: item.id,
      title: item.title,
      kind: "person",
      section: "people",
      payload: { personId: entityId },
    });
    return;
  }

  if (item.kind === "meeting") {
    openTab({
      id: item.id,
      title: item.title,
      kind: "meeting",
      section: "meetings",
      payload: { meetingId: entityId },
    });
    return;
  }

  openTab({
    id: item.id,
    title: item.title,
    kind: item.kind,
    section: "deals",
    payload: { dealId: entityId },
  });
}

export function Sidebar() {
  const { activeSection, openTab, toggleSidebar } = useLayout();
  const { addRecentItem, recentItems } = useWorkspace();
  const pipeline = usePipeline();
  const thesesQuery = useTheses();
  const peopleQuery = usePeople();
  const meetingsQuery = useMeetings();

  const featuredDeal = pipeline.deals.data?.[0];
  const featuredThesis = thesesQuery.data?.find((thesis) => thesis.active) ?? thesesQuery.data?.[0];
  const featuredPerson = peopleQuery.data?.[0];
  const featuredMeeting = meetingsQuery.data?.[0];

  const liveDeals = (pipeline.deals.data ?? []).slice(0, 4);
  const activeTheses = (thesesQuery.data ?? []).filter((thesis) => thesis.active).slice(0, 3);

  return (
    <aside className="sidebar-card">
      <div className="sidebar-header">
        <div>
          <div className="text-[10px] tracking-[0.06em] uppercase text-muted-foreground">
            Investor IDE

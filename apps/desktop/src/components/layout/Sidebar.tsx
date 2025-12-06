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
          </div>
          <span className="text-[13px] font-semibold">Neuralyn</span>
        </div>
        <button className="small-action" onClick={toggleSidebar} type="button" aria-label="Collapse sidebar">
          <ChevronsLeft size={14} />
        </button>
      </div>

      <div className="sidebar-content">
        <SidebarSection title="Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={`sidebar-item${activeSection === item.key ? " active" : ""}`}
                key={item.key}
                onClick={() => {
                  if (item.key === "pipeline") {
                    openTab({
                      id: "pipeline",
                      title: "Pipeline",
                      kind: "pipeline",
                      section: "pipeline",
                    });
                    return;
                  }

                  if (item.key === "deals" && featuredDeal) {
                    openTab({
                      id: `deal:${featuredDeal.id}`,
                      title: featuredDeal.company.name,
                      kind: "deal",
                      section: "deals",
                      payload: { dealId: featuredDeal.id },
                    });
                    addRecentItem({
                      id: `deal:${featuredDeal.id}`,
                      title: featuredDeal.company.name,
                      kind: "deal",
                    });
                    return;
                  }

                  if (item.key === "theses" && featuredThesis) {
                    openTab({
                      id: `thesis:${featuredThesis.id}`,
                      title: featuredThesis.name,
                      kind: "thesis",
                      section: "theses",
                      payload: { thesisId: featuredThesis.id },
                    });
                    addRecentItem({
                      id: `thesis:${featuredThesis.id}`,
                      title: featuredThesis.name,
                      kind: "thesis",
                    });
                    return;
                  }

                  if (item.key === "people" && featuredPerson) {
                    openTab({
                      id: `person:${featuredPerson.id}`,
                      title: featuredPerson.name,
                      kind: "person",
                      section: "people",
                      payload: { personId: featuredPerson.id },
                    });
                    addRecentItem({
                      id: `person:${featuredPerson.id}`,
                      title: featuredPerson.name,
                      kind: "person",
                    });
                    return;
                  }

                  if (item.key === "meetings") {
                    openTab({
                      id: featuredMeeting ? `meeting:${featuredMeeting.id}` : "meeting:new",
                      title: featuredMeeting ? "Meeting Notes" : "New Meeting Note",
                      kind: "meeting",
                      section: "meetings",
                      payload: {
                        dealId: featuredMeeting?.dealId ?? undefined,
                        meetingId: featuredMeeting?.id,
                      },
                    });
                    return;
                  }

                  openTab({
                    id: "pipeline",
                    title: "Pipeline",
                    kind: "pipeline",
                    section: "pipeline",
                  });
                }}
                type="button"
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </SidebarSection>

        <SidebarSection title="Recent" defaultOpen>
          {recentItems.length === 0 ? (
            <div className="sidebar-item cursor-default pointer-events-none">
              <span className="truncate text-[11px]">No recent items</span>
            </div>
          ) : null}
          {recentItems.slice(0, 5).map((item) => (

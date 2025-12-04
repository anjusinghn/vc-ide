import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Briefcase,
  Calendar,
  Clock,
  Lightbulb,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem as CmdkItem,
  CommandList,
} from "cmdk";

import { usePipeline } from "../../hooks/usePipeline";
import { useSearch } from "../../hooks/useSearch";
import {
  useLayout,
  type NavSection,
  type TabKind,
} from "../../contexts/LayoutContext";
import { useMeetings } from "../../hooks/useMeetings";
import { usePeople } from "../../hooks/usePeople";
import { useWorkspace } from "../../contexts/WorkspaceContext";
import { useTheses } from "../../hooks/useTheses";
import { useShortcutActions } from "../../hooks/useKeyboardShortcuts";

type NavEntry = {
  label: string;
  section: NavSection;
  kind: TabKind;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  shortcut?: string;
};

const NAV_ENTRIES: NavEntry[] = [
  {
    label: "Go to Pipeline",
    section: "pipeline",
    kind: "pipeline",
    icon: BarChart3,
    shortcut: "P",
  },
  {
    label: "Go to Deals",
    section: "deals",
    kind: "deal",
    icon: Briefcase,
    shortcut: "D",
  },
  {
    label: "Go to Thesis",
    section: "theses",
    kind: "thesis",
    icon: Lightbulb,
    shortcut: "T",
  },
  { label: "Go to People", section: "people", kind: "person", icon: Users },
  {
    label: "Go to Meetings",
    section: "meetings",
    kind: "meeting",
    icon: Calendar,
  },
];

const ACTION_ENTRIES = [
  { label: "New Deal", value: "new-deal" },
  { label: "New Meeting Note", value: "new-meeting-note" },
  { label: "New Note", value: "new-note" },
  { label: "Open Settings", value: "settings" },
];

export function CommandPalette() {
  const { commandOpen, openTab, setCommandOpen } = useLayout();
  const { recentItems } = useWorkspace();
  const [query, setQuery] = useState("");
  const searchQuery = useSearch(query);
  const pipeline = usePipeline();
  const thesesQuery = useTheses();
  const peopleQuery = usePeople();
  const meetingsQuery = useMeetings();
  const shortcutActions = useShortcutActions();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setCommandOpen]);

  const navigate = (section: NavSection, kind: TabKind, label: string) => {
    if (section === "deals") {
      const deal = pipeline.deals.data?.[0];
      if (deal) {
        openTab({
          id: `deal:${deal.id}`,
          title: deal.company.name,
          kind: "deal",
          section: "deals",
          payload: { dealId: deal.id },
        });
      } else {
        openTab({ id: "pipeline", title: "Pipeline", kind: "pipeline", section: "pipeline" });
      }
      setCommandOpen(false);
      return;
    }

    if (section === "theses") {
      const thesis = thesesQuery.data?.find((entry) => entry.active) ?? thesesQuery.data?.[0];
      openTab({
        id: thesis ? `thesis:${thesis.id}` : section,
        title: thesis?.name ?? label,
        kind,
        section,
        payload: thesis ? { thesisId: thesis.id } : undefined,
      });
      setCommandOpen(false);
      return;
    }

    if (section === "people") {
      const person = peopleQuery.data?.[0];
      openTab({
        id: person ? `person:${person.id}` : section,
        title: person?.name ?? label,
        kind,
        section,
        payload: person ? { personId: person.id } : undefined,
      });
      setCommandOpen(false);
      return;
    }

    if (section === "meetings") {
      const meeting = meetingsQuery.data?.[0];
      openTab({
        id: meeting ? `meeting:${meeting.id}` : "meeting:new",
        title: meeting ? "Meeting Notes" : label,
        kind,
        section,
        payload: meeting
          ? { dealId: meeting.dealId ?? undefined, meetingId: meeting.id }
          : {},
      });
      setCommandOpen(false);
      return;
    }

    openTab({ id: section, title: label, kind, section });
    setCommandOpen(false);
  };

  const pipelineDealsByCompanyId = useMemo(
    () => new Map((pipeline.deals.data ?? []).map((deal) => [deal.company.id, deal])),
    [pipeline.deals.data],
  );

  const openRecentItem = (item: (typeof recentItems)[number]) => {
    const entityId = item.id.split(":")[1];

    if (item.kind === "thesis") {
      openTab({
        id: item.id,
        title: item.title,
        kind: "thesis",
        section: "theses",
        payload: { thesisId: entityId },
      });
    } else if (item.kind === "person") {
      openTab({
        id: item.id,
        title: item.title,
        kind: "person",
        section: "people",
        payload: { personId: entityId },
      });
    } else if (item.kind === "meeting") {
      openTab({

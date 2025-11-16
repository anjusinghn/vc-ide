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

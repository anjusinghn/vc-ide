import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type NavSection = "pipeline" | "deals" | "theses" | "people" | "meetings";
export type TabKind = "pipeline" | "deal" | "thesis" | "meeting" | "company" | "person" | "settings";

export interface WorkspaceTab {
  id: string;
  title: string;
  kind: TabKind;
  section: NavSection;
  payload?: Record<string, string | undefined>;
}

type LayoutContextValue = {
  activeSection: NavSection;
  tabs: WorkspaceTab[];
  activeTabId: string;
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  setActiveSection: (section: NavSection) => void;
  openTab: (tab: WorkspaceTab) => void;
  closeTab: (tabId: string) => void;
  selectTab: (tabId: string) => void;
  toggleSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
};

const STORAGE_KEY = "neuralyn.layout.v1";
const defaultPipelineTab: WorkspaceTab = {
  id: "pipeline",
  title: "Pipeline",
  kind: "pipeline",
  section: "pipeline",
};

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<WorkspaceTab[]>(() => {
    if (typeof window === "undefined") {
      return [defaultPipelineTab];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [defaultPipelineTab];
    }

    try {
      const parsed = JSON.parse(raw) as { tabs?: WorkspaceTab[] };

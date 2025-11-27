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
      return parsed.tabs && parsed.tabs.length > 0 ? parsed.tabs : [defaultPipelineTab];
    } catch {
      return [defaultPipelineTab];
    }
  });
  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[0]?.id ?? defaultPipelineTab.id);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return false;
    }

    try {
      return Boolean((JSON.parse(raw) as { sidebarCollapsed?: boolean }).sidebarCollapsed);
    } catch {
      return false;
    }
  });
  const [commandOpen, setCommandOpen] = useState(false);

  const activeSection = useMemo(() => {
    return tabs.find((tab) => tab.id === activeTabId)?.section ?? "pipeline";
  }, [activeTabId, tabs]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tabs,
        sidebarCollapsed,
      }),
    );
  }, [sidebarCollapsed, tabs]);

  const value = useMemo<LayoutContextValue>(
    () => ({
      activeSection,
      tabs,
      activeTabId,
      sidebarCollapsed,
      commandOpen,
      setActiveSection: (section) => {
        setActiveTabId((current) => tabs.find((tab) => tab.id === current)?.id ?? defaultPipelineTab.id);
        if (section === "pipeline") {
          setTabs((current) => {
            const existing = current.find((tab) => tab.id === "pipeline");

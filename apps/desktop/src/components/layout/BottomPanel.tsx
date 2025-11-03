import { useEffect, useState } from "react";

import { ActivityLog } from "./ActivityLog";
import { QuickNotes } from "./QuickNotes";
import { TaskList } from "./TaskList";
import {
  BOTTOM_PANEL_STORAGE_KEY,
  bottomPanelTabEvent,
  type BottomPanelTab,
} from "../../lib/shortcuts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function BottomPanel() {
  const [activeTab, setActiveTab] = useState<BottomPanelTab>(() => {
    if (typeof window === "undefined") {
      return "activity";
    }

    const stored = window.localStorage.getItem(BOTTOM_PANEL_STORAGE_KEY);
    return stored === "tasks" || stored === "notes" ? stored : "activity";
  });

  useEffect(() => {
    window.localStorage.setItem(BOTTOM_PANEL_STORAGE_KEY, activeTab);
  }, [activeTab]);

  useEffect(() => {
    const onTabEvent = (event: Event) => {
      const nextTab = (event as CustomEvent<BottomPanelTab>).detail;
      if (nextTab === "activity" || nextTab === "tasks" || nextTab === "notes") {
        setActiveTab(nextTab);
      }
    };

    window.addEventListener(bottomPanelTabEvent, onTabEvent);
    return () => window.removeEventListener(bottomPanelTabEvent, onTabEvent);
  }, []);

  return (
    <section className="bottom-card">

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
      <Tabs className="flex flex-col h-full gap-0" onValueChange={(value) => setActiveTab(value as BottomPanelTab)} value={activeTab}>
        <div className="panel-header">
          <TabsList variant="line" className="h-auto gap-0 bg-transparent p-0">
            <TabsTrigger
              value="activity"
              className="h-7 text-[11px] px-3 rounded-none"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="h-7 text-[11px] px-3 rounded-none"
            >
              Tasks
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="h-7 text-[11px] px-3 rounded-none"
            >
              Notes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="activity" className="tab-body m-0 p-0">
          <ActivityLog />
        </TabsContent>

        <TabsContent value="tasks" className="tab-body m-0 p-0">
          <TaskList />
        </TabsContent>

        <TabsContent value="notes" className="tab-body m-0 p-0">
          <QuickNotes />
        </TabsContent>
      </Tabs>
    </section>
  );
}

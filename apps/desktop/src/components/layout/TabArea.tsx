import { X } from "lucide-react";

import { CompanyBrief } from "../../pages/CompanyBrief";
import { DealWorkspace } from "../../pages/DealWorkspace";
import { MeetingNotes } from "../../pages/MeetingNotes";
import { PersonView } from "../../pages/PersonView";
import { PipelineView } from "../../pages/PipelineView";
import { SettingsView } from "../../pages/SettingsView";
import { ThesisEditor } from "../../pages/ThesisEditor";
import { useLayout } from "../../contexts/LayoutContext";

function renderTabContent(tab: ReturnType<typeof useLayout>["tabs"][number] | undefined) {
  if (!tab) {
    return null;
  }

  if (tab.kind === "pipeline") {
    return <PipelineView />;
  }

  if (tab.kind === "deal") {
    return (
      <DealWorkspace
        dealId={tab.payload?.dealId}
        initialSection={(tab.payload?.view as "overview" | "notes" | "memos" | "timeline" | undefined) ?? "overview"}
      />
    );
  }

  if (tab.kind === "company") {
    return <CompanyBrief dealId={tab.payload?.dealId} />;
  }

  if (tab.kind === "thesis") {
    return <ThesisEditor thesisId={tab.payload?.thesisId} />;
  }

  if (tab.kind === "meeting") {
    return <MeetingNotes dealId={tab.payload?.dealId} meetingId={tab.payload?.meetingId} />;
  }

  if (tab.kind === "person") {
    return <PersonView personId={tab.payload?.personId} />;
  }

  if (tab.kind === "settings") {
    return <SettingsView />;
  }

  return null;
}

export function TabArea() {
  const { activeTabId, closeTab, selectTab, tabs } = useLayout();
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  if (tabs.length === 0) {
    return (
      <section className="content-card">
        <div className="empty-state flex-col gap-2">
          <div className="text-[15px] font-semibold text-foreground">
            Neuralyn — Investor IDE
          </div>
          <div className="text-xs max-w-[320px] text-center">
            Select a section from the sidebar or press{" "}
            <kbd className="text-[10px] bg-white/[0.08] px-[5px] py-px rounded-[3px] border border-border font-[inherit]">
              ⌘K
            </kbd>{" "}
            to search
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="content-card">
      <div className="tab-strip">
        {tabs.map((tab) => (
          <button
            className={`tab-button${tab.id === activeTabId ? " active" : ""}`}
            key={tab.id}
            onClick={() => selectTab(tab.id)}
            type="button"
          >
            <span>{tab.title}</span>
            {tab.id !== "pipeline" ? (
              <button
                aria-label={`Close ${tab.title}`}
                className="tab-close"
                onClick={(event) => {
                  event.stopPropagation();
                  closeTab(tab.id);
                }}
                type="button"
              >
                <X size={11} />
              </button>
            ) : null}
          </button>
        ))}
      </div>
      <div className="tab-body">{renderTabContent(activeTab)}</div>
    </section>
  );
}

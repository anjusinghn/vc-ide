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

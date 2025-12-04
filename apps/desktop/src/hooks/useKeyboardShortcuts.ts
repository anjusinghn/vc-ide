import { useEffect } from "react";

import { useCreateCompany } from "./useCompanies";
import { useCreateDeal } from "./useDeals";
import { useFunds } from "./useFunds";
import { useMeetings } from "./useMeetings";
import { usePeople } from "./usePeople";
import { usePipeline } from "./usePipeline";
import { useTheses } from "./useTheses";
import { useLayout } from "../contexts/LayoutContext";
import { useWorkspace } from "../contexts/WorkspaceContext";
import { focusQuickNotes, isEditableTarget } from "../lib/shortcuts";
import type { DealStage } from "@vc-ide/shared";

const DEAL_STAGES: DealStage[] = [
  "sourced",
  "first_call",
  "diligence",
  "ic",
  "term_sheet",
  "closed",
  "passed",
];

export function useShortcutActions() {
  const createCompany = useCreateCompany();
  const createDeal = useCreateDeal();
  const funds = useFunds();
  const meetings = useMeetings();
  const people = usePeople();
  const pipeline = usePipeline();
  const theses = useTheses();
  const { activeFund, addRecentItem } = useWorkspace();
  const { activeTabId, closeTab, openTab, selectTab, setCommandOpen, tabs } = useLayout();

  const openSection = (index: number) => {
    if (index === 1) {
      openTab({ id: "pipeline", title: "Pipeline", kind: "pipeline", section: "pipeline" });
      return;
    }

    if (index === 2) {
      const deal = pipeline.deals.data?.[0];
      if (!deal) {
        openTab({ id: "pipeline", title: "Pipeline", kind: "pipeline", section: "pipeline" });
        return;
      }

      openTab({
        id: `deal:${deal.id}`,
        title: deal.company.name,
        kind: "deal",
        section: "deals",
        payload: { dealId: deal.id },
      });
      return;
    }

    if (index === 3) {
      const thesis = theses.data?.find((entry) => entry.active) ?? theses.data?.[0];
      openTab({
        id: thesis ? `thesis:${thesis.id}` : "pipeline",
        title: thesis?.name ?? "Thesis",
        kind: thesis ? "thesis" : "pipeline",
        section: thesis ? "theses" : "pipeline",
        payload: thesis ? { thesisId: thesis.id } : undefined,
      });
      return;
    }

    if (index === 4) {
      const person = people.data?.[0];
      openTab({
        id: person ? `person:${person.id}` : "pipeline",
        title: person?.name ?? "People",
        kind: person ? "person" : "pipeline",
        section: person ? "people" : "pipeline",
        payload: person ? { personId: person.id } : undefined,
      });
      return;
    }

    if (index === 5) {
      const meeting = meetings.data?.[0];
      openTab({
        id: meeting ? `meeting:${meeting.id}` : "meeting:new",
        title: meeting ? "Meeting Notes" : "New Meeting Note",
        kind: "meeting",
        section: "meetings",
        payload: meeting ? { meetingId: meeting.id, dealId: meeting.dealId ?? undefined } : {},
      });
    }
  };

  const openSettings = () => {
    openTab({
      id: "settings",
      title: "Settings",
      kind: "settings",
      section: "pipeline",
    });
  };

  const createNewDeal = async () => {
    const companyName = window.prompt("New deal: company name");
    if (!companyName?.trim()) {
      return;
    }

    const stageInput = window.prompt(
      `Stage (${DEAL_STAGES.join(", ")})`,
      "sourced",
    );
    const stage = DEAL_STAGES.includes((stageInput ?? "sourced").trim() as DealStage)
      ? ((stageInput ?? "sourced").trim() as DealStage)
      : "sourced";
    const sector = window.prompt("Sector (optional)")?.trim() || undefined;
    const geography = window.prompt("Geography (optional)")?.trim() || undefined;

    try {
      const company = await createCompany.mutateAsync({
        geography,
        name: companyName.trim(),
        sector,
        stage,
      });
      const fundId =
        funds.data?.find((fund) => fund.name === activeFund)?.id ?? funds.data?.[0]?.id;
      const thesisId = theses.data?.find((thesis) => thesis.active)?.id ?? theses.data?.[0]?.id;

      const deal = await createDeal.mutateAsync({
        companyId: company.id,
        fundId,
        source: "Manual shortcut entry",
        stage,
        thesisId,
      });

      openTab({
        id: `deal:${deal.id}`,
        title: company.name,
        kind: "deal",
        section: "deals",
        payload: { dealId: deal.id },
      });
      addRecentItem({
        id: `deal:${deal.id}`,
        title: company.name,
        kind: "deal",
      });
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to create deal");
    }
  };

  const nextTab = () => {
    if (tabs.length <= 1) {
      return;
    }

    const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % tabs.length;
    selectTab(tabs[nextIndex].id);
  };

  const closeCurrentTab = () => {
    if (activeTabId === "pipeline") {
      return;
    }

    closeTab(activeTabId);
  };

  return {
    closeCurrentTab,
    createNewDeal,
    createQuickNote: focusQuickNotes,
    nextTab,
    openSection,

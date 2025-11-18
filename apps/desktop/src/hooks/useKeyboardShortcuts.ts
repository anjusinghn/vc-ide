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

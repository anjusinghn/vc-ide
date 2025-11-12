import { useEffect, useState } from "react";
import type { Thesis, UpdateThesisInput } from "@vc-ide/shared";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

const THESIS_STAGE_OPTIONS = ["pre_seed", "seed", "series_a", "series_b", "growth"];

const textareaClass =
  "w-full min-h-[72px] resize-none rounded-md border border-input bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50 dark:bg-input/30";

function splitValues(value: string) {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function ThesisForm({
  onSave,
  thesis,
}: {
  onSave: (payload: UpdateThesisInput) => Promise<void> | void;
  thesis?: Thesis;
}) {
  const [form, setForm] = useState<UpdateThesisInput>({
    name: "",
    sectors: [],
    stages: [],
    geographies: [],
    ownershipTargetMin: 0.05,
    ownershipTargetMax: 0.15,
    preferredFounderPatterns: [],
    antiPatterns: [],
    diligenceQuestions: [],
    active: true,
  });

  useEffect(() => {
    if (!thesis) {
      return;
    }

    setForm({
      name: thesis.name,
      sectors: thesis.sectors,
      stages: thesis.stages,
      geographies: thesis.geographies,
      ownershipTargetMin: thesis.ownershipTargetMin ?? undefined,
      ownershipTargetMax: thesis.ownershipTargetMax ?? undefined,
      preferredFounderPatterns: thesis.preferredFounderPatterns,
      antiPatterns: thesis.antiPatterns,
      diligenceQuestions: thesis.diligenceQuestions,

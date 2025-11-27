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
      active: thesis.active,
    });
  }, [thesis]);

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSave(form);
      }}
    >
      <div className="grid gap-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="thesis-name">
          Name
        </label>
        <Input
          id="thesis-name"
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          value={form.name ?? ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="thesis-sectors">
            Sectors
          </label>
          <Input
            id="thesis-sectors"
            onChange={(event) => setForm((current) => ({ ...current, sectors: splitValues(event.target.value) }))}
            value={(form.sectors ?? []).join(", ")}
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="thesis-geographies">
            Geographies
          </label>
          <Input
            id="thesis-geographies"
            onChange={(event) => setForm((current) => ({ ...current, geographies: splitValues(event.target.value) }))}
            value={(form.geographies ?? []).join(", ")}
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <p className="text-xs font-medium text-muted-foreground">Stages</p>
        <div className="action-row flex-wrap">
          {THESIS_STAGE_OPTIONS.map((stage) => {
            const selected = form.stages?.includes(stage) ?? false;
            return (
              <button
                className={`small-action ${selected ? "active" : ""}`}

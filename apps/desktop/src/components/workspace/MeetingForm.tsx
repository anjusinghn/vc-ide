import { useEffect, useState } from "react";
import type { Meeting, MeetingType, Person, StructuredMeetingNotes } from "@vc-ide/shared";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

type MeetingPayload = {
  attendees: string[];
  date: string;
  dealId?: string | null;
  meetingType: MeetingType;
  rawNotes: string;
  structuredNotes: StructuredMeetingNotes;
};

const textareaClass =
  "w-full min-h-[72px] resize-none rounded-md border border-input bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50 dark:bg-input/30";

function splitList(value: string) {
  return value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function MeetingForm({
  defaultDealId,
  meeting,
  people,
  onSave,
}: {
  defaultDealId?: string;
  meeting?: Meeting;
  people: Person[];
  onSave: (payload: MeetingPayload) => Promise<void> | void;
}) {
  const [form, setForm] = useState<MeetingPayload>({
    attendees: [],
    date: new Date().toISOString().slice(0, 10),
    dealId: defaultDealId,
    meetingType: "founder_call",
    rawNotes: "",
    structuredNotes: {
      metrics: {},
      risks: [],
      asks: [],
      nextSteps: [],
    },
  });

  useEffect(() => {
    if (!meeting) {
      return;
    }

    setForm({
      attendees: meeting.attendees,
      date: meeting.date.slice(0, 10),
      dealId: meeting.dealId,
      meetingType: meeting.meetingType,
      rawNotes: meeting.rawNotes ?? "",
      structuredNotes: meeting.structuredNotes,
    });
  }, [meeting]);

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSave(form);
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="meeting-date">
            Date
          </label>
          <Input
            id="meeting-date"
            onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
            type="date"
            value={form.date}
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="meeting-type">
            Meeting Type
          </label>
          <select
            className="select"
            id="meeting-type"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                meetingType: event.target.value as MeetingType,
              }))
            }
            value={form.meetingType}
          >
            <option value="founder_call">Founder Call</option>
            <option value="partner_meeting">Partner Meeting</option>
            <option value="reference">Reference</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="grid gap-1.5">
        <p className="text-xs font-medium text-muted-foreground">Attendees</p>
        <div className="action-row flex-wrap">
          {people.map((person) => {
            const selected = form.attendees.includes(person.id);
            return (
              <button
                className={`small-action ${selected ? "active" : ""}`}
                key={person.id}
                onClick={(event) => {
                  event.preventDefault();
                  setForm((current) => ({
                    ...current,

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

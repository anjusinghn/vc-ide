import { useEffect, useMemo, useRef, useState } from "react";
import type { CreateMemoInput } from "@vc-ide/shared";
import { NotebookPen } from "lucide-react";

import { useCreateMemo, useMemos, useUpdateMemo } from "../../hooks/useMemos";
import { formatRelativeDate } from "../../lib/utils";
import { quickNotesFocusEvent } from "../../lib/shortcuts";
import { EmptyState } from "./EmptyState";

export function QuickNotes() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const memos = useMemos();
  const createMemo = useCreateMemo();

  const scratchMemo = useMemo(
    () => (memos.data ?? []).find((memo) => memo.memoType === "scratch"),
    [memos.data],
  );
  const updateMemo = useUpdateMemo(scratchMemo?.id ?? "");

  const [draft, setDraft] = useState("");
  const [lastSavedValue, setLastSavedValue] = useState("");
  const [status, setStatus] = useState("Ready");

  useEffect(() => {
    const nextValue = scratchMemo?.content ?? "";
    setDraft(nextValue);
    setLastSavedValue(nextValue);
    setStatus(scratchMemo ? `Saved ${formatRelativeDate(scratchMemo.updatedAt)}` : "Ready");
  }, [scratchMemo?.content, scratchMemo?.id, scratchMemo?.updatedAt]);

  useEffect(() => {
    const focusTextarea = () => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(draft.length, draft.length);
    };

    window.addEventListener(quickNotesFocusEvent, focusTextarea);
    return () => window.removeEventListener(quickNotesFocusEvent, focusTextarea);
  }, [draft.length]);

  useEffect(() => {
    if (draft === lastSavedValue) {
      return;
    }

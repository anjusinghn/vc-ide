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

    setStatus("Saving…");
    const timeout = window.setTimeout(async () => {
      const payload: CreateMemoInput = {
        author: "Neuralyn",
        content: draft,
        memoType: "scratch",
        status: "draft",
        title: "Quick Notes",
      };

      try {
        if (scratchMemo) {
          await updateMemo.mutateAsync(payload);
        } else {
          await createMemo.mutateAsync(payload);
        }
        setLastSavedValue(draft);
        setStatus("Saved just now");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Save failed");
      }
    }, 1_000);

    return () => window.clearTimeout(timeout);
  }, [createMemo, draft, lastSavedValue, scratchMemo, updateMemo]);

  if (memos.isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <div className="skeleton h-5 rounded" />
        <div className="skeleton h-5 rounded w-4/5" />
        <div className="skeleton h-5 rounded w-3/5" />
      </div>
    );
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        className="split-inline"
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "10px 12px",
        }}

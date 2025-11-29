import { useEffect, useState } from "react";
import type { CreateTaskInput, DealWithCompany, Task, UpdateTaskInput } from "@vc-ide/shared";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

const textareaClass =
  "w-full min-h-[72px] resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50 dark:bg-input/30";

type TaskFormValues = {
  assignee: string;
  dealId: string;
  description: string;
  dueDate: string;
  title: string;
};

function toFormValues(task?: Task, defaultDealId?: string): TaskFormValues {
  return {
    assignee: task?.assignee ?? "",
    dealId: task?.dealId ?? defaultDealId ?? "",
    description: task?.description ?? "",
    dueDate: task?.dueDate?.slice(0, 10) ?? "",
    title: task?.title ?? "",
  };
}

function toPayload(values: TaskFormValues): CreateTaskInput | UpdateTaskInput {
  return {
    assignee: values.assignee.trim() || undefined,
    dealId: values.dealId || undefined,
    description: values.description.trim() || undefined,
    dueDate: values.dueDate || undefined,
    status: "open",
    title: values.title.trim(),
  };
}

export function TaskForm({
  deals,
  defaultDealId,
  onOpenChange,
  onSave,
  open,
  task,
}: {
  deals: DealWithCompany[];
  defaultDealId?: string;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  open: boolean;
  task?: Task;
}) {
  const [values, setValues] = useState<TaskFormValues>(() => toFormValues(task, defaultDealId));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(toFormValues(task, defaultDealId));
  }, [defaultDealId, open, task]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="border-border bg-card text-card-foreground sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            Capture follow-ups, diligence work, and partner actions without leaving the workspace.
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            setIsSaving(true);

            try {
              await onSave(toPayload(values));
              onOpenChange(false);
            } finally {
              setIsSaving(false);
            }
          }}
        >
          <label className="grid gap-1.5" htmlFor="task-title">
            <span className="text-xs font-medium text-muted-foreground">Title</span>
            <Input
              id="task-title"
              onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
              placeholder="Call reference for Acme"
              required
              value={values.title}
            />
          </label>

          <label className="grid gap-1.5" htmlFor="task-description">
            <span className="text-xs font-medium text-muted-foreground">Description</span>
            <textarea
              className={textareaClass}
              id="task-description"
              onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
              placeholder="Capture context, owner expectations, or what good looks like."

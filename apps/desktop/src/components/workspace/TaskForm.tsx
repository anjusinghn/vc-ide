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

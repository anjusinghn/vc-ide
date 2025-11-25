import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskInput, UpdateTaskInput } from "@vc-ide/shared";
import { CheckSquare, PlusSquare } from "lucide-react";

import { usePipeline } from "../../hooks/usePipeline";
import { useCreateTask, useTasks } from "../../hooks/useTasks";
import { useLayout } from "../../contexts/LayoutContext";
import { api, queryKeys } from "../../lib/api";
import { sortOpenTasks } from "../../lib/dates";
import { EmptyState } from "./EmptyState";
import { TaskForm } from "../workspace/TaskForm";
import { TaskItem } from "../workspace/TaskItem";

export function TaskList() {
  const tasks = useTasks();
  const pipeline = usePipeline();
  const createTask = useCreateTask();
  const queryClient = useQueryClient();
  const { openTab } = useLayout();
  const [formOpen, setFormOpen] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string>();
  const updateTask = useMutation({
    mutationFn: ({ payload, taskId }: { payload: UpdateTaskInput; taskId: string }) =>
      api.tasks.update(taskId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.task(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
  });

  const dealsById = useMemo(
    () => new Map((pipeline.deals.data ?? []).map((deal) => [deal.id, deal])),
    [pipeline.deals.data],
  );
  const openTasks = useMemo(() => sortOpenTasks(tasks.data ?? []), [tasks.data]);

  if (tasks.isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <div className="skeleton h-5 rounded" />
        <div className="skeleton h-5 rounded w-4/5" />
        <div className="skeleton h-5 rounded w-3/5" />
        <div className="skeleton h-5 rounded w-4/5" />
      </div>
    );
  }

  const updateTaskStatus = async (taskId: string, payload: UpdateTaskInput) => {
    setUpdatingTaskId(taskId);

    try {
      await updateTask.mutateAsync({ payload, taskId });
    } finally {
      setUpdatingTaskId(undefined);
    }
  };

  return (
    <>
      <section style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          className="split-inline"
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "10px 12px",
          }}
        >
          <div style={{ display: "grid", gap: 2 }}>
            <strong style={{ fontSize: 12 }}>Open Tasks</strong>
            <span className="muted" style={{ fontSize: 11 }}>
              Sorted by due date
            </span>
          </div>
          <button className="small-action active" onClick={() => setFormOpen(true)} type="button">
            <PlusSquare size={12} />
            New Task
          </button>
        </div>

        {openTasks.length === 0 ? (
          <EmptyState
            actionLabel="Create task"
            description="Tasks created here stay visible in the bottom panel and roll into activity automatically."
            icon={CheckSquare}

import type { Task } from "@vc-ide/shared";

import { formatRelativeDate } from "./utils";

export function compareDueDates(left?: string | null, right?: string | null) {
  if (!left && !right) {
    return 0;
  }

  if (!left) {
    return 1;
  }

  if (!right) {
    return -1;
  }

  return left.localeCompare(right);
}

export function sortOpenTasks(tasks: Task[]) {
  return [...tasks]
    .filter((task) => task.status === "open")
    .sort((left, right) => {
      const dueDateComparison = compareDueDates(left.dueDate, right.dueDate);
      if (dueDateComparison !== 0) {

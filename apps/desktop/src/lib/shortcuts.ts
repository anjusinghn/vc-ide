export type BottomPanelTab = "activity" | "tasks" | "notes";

export const BOTTOM_PANEL_STORAGE_KEY = "neuralyn.bottom-panel.v1";
export const LAYOUT_STORAGE_KEY = "neuralyn.layout.v1";
export const WORKSPACE_STORAGE_KEY = "neuralyn.workspace.v1";

export const bottomPanelTabEvent = "neuralyn:bottom-panel-tab";
export const quickNotesFocusEvent = "neuralyn:quick-notes-focus";

export function emitBottomPanelTab(tab: BottomPanelTab) {
  window.dispatchEvent(new CustomEvent<BottomPanelTab>(bottomPanelTabEvent, { detail: tab }));
}

export function focusQuickNotes() {
  emitBottomPanelTab("notes");
  window.dispatchEvent(new Event(quickNotesFocusEvent));
}

export function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

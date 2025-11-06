import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Database, RefreshCcw, Trash2 } from "lucide-react";

import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import {
  BOTTOM_PANEL_STORAGE_KEY,
  LAYOUT_STORAGE_KEY,
  WORKSPACE_STORAGE_KEY,
} from "../lib/shortcuts";

type SettingsInfo = {
  apiBase: string;
  dataPath: string;
  productName: string;
  version: string;
};

export function SettingsView() {
  const queryClient = useQueryClient();
  const settings = useQuery<SettingsInfo>({
    queryKey: ["settings"],
    queryFn: () => api.settings.get(),
  });

  return (
    <div className="list-stack">
      <section className="data-card">
        <div className="split-inline">
          <div>
            <div className="muted">Settings</div>
            <strong>Workspace configuration</strong>
          </div>
          <span className="badge">Desktop</span>
        </div>
      </section>

      <section className="data-card">
        <div className="split-inline">
          <div>
            <div className="muted">About</div>
            <strong>
              {settings.data?.productName ?? "Neuralyn"} {settings.data?.version ?? "0.1.0"}
            </strong>
          </div>
          <Database size={16} />
        </div>
        <div className="flex flex-col gap-2.5 mt-3.5">
          <div>
            <p className="text-[11px] text-muted-foreground">API base</p>
            <p className="text-xs font-mono mt-1">
              {settings.data?.apiBase ?? "http://localhost:3001/api"}
            </p>
          </div>
          <div>

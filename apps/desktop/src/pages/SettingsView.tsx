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
            <p className="text-[11px] text-muted-foreground">Data path</p>
            <p className="text-xs font-mono mt-1">
              {settings.isLoading
                ? "Resolving database path…"
                : settings.data?.dataPath ?? "Unavailable"}
            </p>
          </div>
        </div>
      </section>

      <section className="data-card">
        <div className="muted">Maintenance</div>
        <div className="flex flex-col gap-2 mt-3.5">
          <Button
            className="w-full justify-center gap-1.5"
            onClick={() => {
              void settings.refetch();
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            <RefreshCcw size={12} />
            Refresh metadata
          </Button>
          <Button
            className="w-full justify-center gap-1.5"
            onClick={async () => {
              const confirmed = window.confirm(
                "Clear all seeded records and reset local workspace state?",
              );
              if (!confirmed) {
                return;
              }

              await api.settings.clearSampleData();
              window.localStorage.removeItem(BOTTOM_PANEL_STORAGE_KEY);
              window.localStorage.removeItem(LAYOUT_STORAGE_KEY);
              window.localStorage.removeItem(WORKSPACE_STORAGE_KEY);
              await queryClient.invalidateQueries();
              window.location.reload();
            }}
            size="sm"
            type="button"
            variant="destructive"
          >
            <Trash2 size={12} />
            Clear sample data
          </Button>
        </div>
      </section>
    </div>
  );
}

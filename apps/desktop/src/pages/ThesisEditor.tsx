import { ThesisForm } from "../components/workspace/ThesisForm";
import { useTheses, useUpdateThesis } from "../hooks/useTheses";
import { useWorkspace } from "../contexts/WorkspaceContext";

export function ThesisEditor({ thesisId }: { thesisId?: string }) {
  const thesesQuery = useTheses();
  const thesis = thesesQuery.data?.find((item) => item.id === thesisId) ?? thesesQuery.data?.[0];
  const updateThesis = useUpdateThesis(thesis?.id ?? "");
  const { addRecentItem } = useWorkspace();

  if (thesesQuery.isLoading) {
    return (
      <div className="flex flex-col gap-3 p-5">
        <div className="skeleton h-4 rounded w-2/5" />
        <div className="skeleton h-4 rounded w-full" />
        <div className="skeleton h-4 rounded w-4/5" />
        <div className="skeleton h-4 rounded w-3/5" />
      </div>
    );
  }

  if (!thesis) {
    return (
      <p className="flex items-center justify-center h-full text-xs text-muted-foreground">
        No thesis records available.
      </p>
    );
  }

  return (
    <div className="list-stack">
      <section className="data-card">
        <div className="split-inline">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Thesis Editor
            </p>
            <p className="text-sm font-medium mt-0.5">{thesis.name}</p>
          </div>
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
              thesis.active
                ? "text-accent border-accent/30"
                : "text-muted-foreground border-border"
            }`}
          >
            {thesis.active ? "Active" : "Inactive"}
          </span>
        </div>
      </section>
      <section className="data-card">
        <ThesisForm
          onSave={async (payload) => {
            await updateThesis.mutateAsync(payload);
            addRecentItem({
              id: `thesis:${thesis.id}`,
              title: thesis.name,
              kind: "thesis",
            });
          }}
          thesis={thesis}
        />
      </section>
    </div>
  );
}

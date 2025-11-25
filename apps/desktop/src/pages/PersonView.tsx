import { useEffect } from "react";

import { PersonCard } from "../components/workspace/PersonCard";
import { usePeople } from "../hooks/usePeople";
import { useWorkspace } from "../contexts/WorkspaceContext";

export function PersonView({ personId }: { personId?: string }) {
  const peopleQuery = usePeople();
  const person = peopleQuery.data?.find((entry) => entry.id === personId) ?? peopleQuery.data?.[0];
  const { addRecentItem } = useWorkspace();

  useEffect(() => {
    if (!person) {
      return;
    }

    addRecentItem({
      id: `person:${person.id}`,
      title: person.name,
      kind: "person",
    });
  }, [addRecentItem, person]);

  if (peopleQuery.isLoading) {
    return (
      <div className="flex flex-col gap-3 p-5">
        <div className="skeleton h-4 rounded w-2/5" />
        <div className="skeleton h-4 rounded w-full" />
        <div className="skeleton h-4 rounded w-4/5" />
        <div className="skeleton h-4 rounded w-3/5" />
      </div>
    );
  }

  if (!person) {
    return (
      <p className="flex items-center justify-center h-full text-xs text-muted-foreground">
        No people records available.
      </p>
    );
  }

  return (
    <div className="list-stack">
      <PersonCard person={person} />
      <section className="data-card">
        <div className="muted">Connections</div>
        <p className="text-xs mt-2">
          {person.name} is currently tagged as {person.tags.join(", ") || "unclassified"} with a relationship score of{" "}
          {person.relationshipScore ?? "—"}.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Use the command palette to jump between people and the associated company or deal context.
        </p>
      </section>
    </div>
  );
}

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

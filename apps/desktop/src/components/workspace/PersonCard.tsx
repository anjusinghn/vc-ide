import type { Person } from "@vc-ide/shared";

import { formatRelativeDate } from "../../lib/utils";

export function PersonCard({ person }: { person: Person }) {
  return (
    <section className="data-card">
      <div className="split-inline">
        <div>
          <div className="muted">Person</div>
          <span className="font-medium text-foreground text-xs">{person.name}</span>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          {person.relationshipScore ?? "—"}
        </span>
      </div>
      <p className="muted">{person.role ?? "No role captured"}</p>
      <div className="action-row">
        {person.tags.map((tag) => (
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Last contact {formatRelativeDate(person.lastContactAt)}
      </p>
    </section>
  );
}

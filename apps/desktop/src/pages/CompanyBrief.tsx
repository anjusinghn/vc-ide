import { CompanyCard } from "../components/workspace/CompanyCard";
import { useDealFull } from "../hooks/useDeals";
import { formatRelativeDate } from "../lib/utils";

export function CompanyBrief({ dealId }: { dealId?: string }) {
  const dealQuery = useDealFull(dealId);

  if (!dealId) {
    return (
      <p className="flex items-center justify-center h-full text-xs text-muted-foreground">
        Choose a deal to inspect the linked company brief.
      </p>
    );
  }

  if (dealQuery.isLoading) {
    return (
      <div className="flex flex-col gap-3 p-5">
        <div className="skeleton h-4 rounded w-2/5" />
        <div className="skeleton h-4 rounded w-full" />
        <div className="skeleton h-4 rounded w-4/5" />
        <div className="skeleton h-4 rounded w-3/5" />
        <div className="skeleton h-4 rounded w-full" />
      </div>
    );
  }

  if (!dealQuery.data) {
    return (
      <p className="flex items-center justify-center h-full text-xs text-muted-foreground">
        Company brief unavailable.
      </p>
    );
  }

  const deal = dealQuery.data;

  return (
    <div className="flex flex-col gap-3 p-4">
      <CompanyCard company={deal.company} thesis={deal.thesis} />
      <section className="data-card">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
          Team
        </p>
        <div className="list-stack mt-3">
          {deal.people.map((person) => (
            <div className="list-item" key={person.id}>
              <div className="split-inline">
                <strong>{person.name}</strong>
                <span className="badge">{person.role ?? "Contact"}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{person.email ?? "No email captured"}</p>
            </div>
          ))}
          {deal.people.length === 0 ? (
            <p className="text-xs text-muted-foreground py-3 text-center">No team contacts linked yet.</p>
          ) : null}
        </div>
      </section>
      <section className="data-card">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
          Recent Activity
        </p>
        <div className="list-stack mt-3">
          {deal.activity.slice(0, 6).map((entry) => (
            <div className="list-item" key={`${entry.entityType}:${entry.entityId}:${entry.timestamp}`}>
              <div className="split-inline">
                <strong>{entry.entityName}</strong>
                <span className="muted">{formatRelativeDate(entry.timestamp)}</span>
              </div>
              <div className="muted">
                {entry.entityType} {entry.action}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

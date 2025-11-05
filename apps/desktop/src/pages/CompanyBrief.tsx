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

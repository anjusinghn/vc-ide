import type { Company, Thesis } from "@vc-ide/shared";

import { formatCurrency } from "../../lib/utils";

export function CompanyCard({
  company,
  thesis,
}: {
  company: Company;
  thesis?: Thesis | null;
}) {
  return (
    <section className="data-card">
      <div className="split-inline">
        <div>
          <div className="muted">Company</div>
          <span className="font-medium text-foreground text-xs">{company.name}</span>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          {company.stage ?? "Unstaged"}
        </span>
      </div>
      <dl className="mt-3 grid gap-1.5">
        {(

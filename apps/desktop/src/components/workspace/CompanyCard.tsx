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
          [
            ["Sector", company.sector ?? "—"],
            ["Geography", company.geography ?? "—"],
            ["Funding", formatCurrency(company.fundingTotal)],
            ["Employees", company.employeeCount ?? "—"],
          ] as [string, string | number][]
        ).map(([label, value]) => (
          <div key={label} className="flex items-baseline gap-2 text-xs">
            <dt className="text-muted-foreground w-20 shrink-0">{label}</dt>
            <dd className="font-medium tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-foreground/80 leading-relaxed">
        {company.description ?? "No company summary recorded."}
      </p>
      {thesis ? (
        <span className="mt-3 inline-flex items-center gap-1 text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
          {thesis.name}
        </span>
      ) : null}
    </section>
  );
}

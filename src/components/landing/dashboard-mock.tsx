import { AlertTriangle, CheckCircle2, Clock, FileQuestion } from "lucide-react";

import { cn } from "@/lib/utils";
import { StatusPill, type CoiStatus } from "./status-pill";

const COUNTERS = [
  {
    label: "Compliant",
    value: 42,
    Icon: CheckCircle2,
    tone: "text-success bg-success-soft",
  },
  {
    label: "Expiring in 30 days",
    value: 6,
    Icon: Clock,
    tone: "text-warning bg-warning-soft",
  },
  {
    label: "Non-compliant",
    value: 3,
    Icon: AlertTriangle,
    tone: "text-danger bg-danger-soft",
  },
  {
    label: "Missing COI",
    value: 2,
    Icon: FileQuestion,
    tone: "text-primary bg-primary-soft",
  },
] as const;

const ROWS: {
  name: string;
  trade: string;
  status: CoiStatus;
  detail: string;
}[] = [
  {
    name: "Ridgeline Electric",
    trade: "Electrical",
    status: "compliant",
    detail: "All policies valid to Apr 2027",
  },
  {
    name: "Martinez Concrete",
    trade: "Concrete",
    status: "expiring",
    detail: "GL policy expires in 12 days",
  },
  {
    name: "Summit Roofing",
    trade: "Roofing",
    status: "noncompliant",
    detail: "Umbrella $1M, you require $2M",
  },
  {
    name: "Blue Valley Plumbing",
    trade: "Plumbing",
    status: "compliant",
    detail: "Additional insured confirmed",
  },
  {
    name: "Okafor Drywall",
    trade: "Drywall",
    status: "missing",
    detail: "Upload link sent 2 days ago",
  },
];

/**
 * Illustrative product preview built in HTML/CSS. Decorative: the
 * whole thing is exposed to assistive tech as one labelled image.
 */
export function DashboardMock({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Preview of the Subproof dashboard: 42 subcontractors compliant, 6 expiring within 30 days, 3 non-compliant and 2 missing a certificate, with a list of subcontractors and their status."
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(11,21,38,0.06),0_12px_32px_-8px_rgba(19,41,75,0.18)]",
        className,
      )}
    >
      <div aria-hidden="true">
        {/* App chrome */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-primary px-4 py-2.5 text-primary-foreground">
          <div className="flex min-w-0 items-center gap-2">
            <span className="size-2.5 rounded-full bg-white/30" />
            <span className="size-2.5 rounded-full bg-white/30" />
            <span className="size-2.5 rounded-full bg-white/30" />
            <span className="ml-2 truncate text-xs font-semibold">
              Subcontractors · Hartwell Builders
            </span>
          </div>
          <span className="hidden rounded bg-white/15 px-2 py-0.5 text-[11px] font-medium sm:inline">
            53 subs
          </span>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4 sm:gap-3 sm:p-4">
          {COUNTERS.map(({ label, value, Icon, tone }) => (
            <div
              key={label}
              className="rounded-lg border border-border bg-background p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xl leading-none font-bold tabular-nums text-foreground">
                  {value}
                </span>
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-md",
                    tone,
                  )}
                >
                  <Icon className="size-3.5" />
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-tight font-medium text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="border-t border-border">
          <div className="hidden grid-cols-[1.3fr_auto_1.4fr] gap-3 bg-muted px-4 py-2 text-[11px] font-semibold text-muted-foreground sm:grid">
            <span>Subcontractor</span>
            <span>Status</span>
            <span>Details</span>
          </div>
          <ul className="divide-y divide-border">
            {ROWS.map((row) => (
              <li
                key={row.name}
                className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-2.5 sm:grid-cols-[1.15fr_auto_1.5fr]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {row.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {row.trade}
                  </p>
                </div>
                <StatusPill status={row.status} />
                <p className="col-span-2 truncate text-xs text-muted-foreground sm:col-span-1">
                  {row.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

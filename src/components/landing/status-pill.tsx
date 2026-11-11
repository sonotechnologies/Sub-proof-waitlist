import { AlertTriangle, CheckCircle2, Clock, FileQuestion } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export type CoiStatus = "compliant" | "expiring" | "noncompliant" | "missing";

const STATUS = {
  compliant: { label: "Compliant", variant: "success", Icon: CheckCircle2 },
  expiring: { label: "Expiring soon", variant: "warning", Icon: Clock },
  noncompliant: {
    label: "Non-compliant",
    variant: "danger",
    Icon: AlertTriangle,
  },
  missing: { label: "Missing", variant: "outline", Icon: FileQuestion },
} as const;

/** Status pill. Always pairs colour with an icon + text so it never relies on colour alone. */
export function StatusPill({ status }: { status: CoiStatus }) {
  const { label, variant, Icon } = STATUS[status];
  return (
    <Badge variant={variant}>
      <Icon aria-hidden="true" />
      {label}
    </Badge>
  );
}

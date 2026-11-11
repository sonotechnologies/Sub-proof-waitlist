import { isAdmin } from "@/lib/admin-auth";
import { subCountLabel } from "@/lib/waitlist";
import { listWaitlist } from "@/lib/waitlist-queries";

/**
 * Escape a value for CSV, and neutralise spreadsheet formula injection
 * (cells starting with = + - @ tab or CR are prefixed with a quote).
 */
function csvCell(value: unknown) {
  if (value === null || value === undefined) return "";
  let s = value instanceof Date ? value.toISOString() : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  if (!(await isAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await listWaitlist();
  const header = [
    "created_at",
    "name",
    "email",
    "company",
    "sub_count",
    "current_tracking",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "referrer",
  ];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        r.createdAt,
        r.name,
        r.email,
        r.company,
        subCountLabel(r.subCount),
        r.currentTracking,
        r.utmSource,
        r.utmMedium,
        r.utmCampaign,
        r.referrer,
      ]
        .map(csvCell)
        .join(","),
    ),
  ];

  const date = new Date().toISOString().slice(0, 10);
  // BOM so Excel opens UTF-8 (e.g. en dashes in "10–25") correctly.
  return new Response("﻿" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subproof-waitlist-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

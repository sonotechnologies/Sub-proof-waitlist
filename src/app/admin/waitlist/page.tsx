import { Download, LogOut } from "lucide-react";
import { connection } from "next/server";

import { Logo } from "@/components/landing/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { SUB_COUNT_OPTIONS, subCountLabel } from "@/lib/waitlist";
import { listWaitlist } from "@/lib/waitlist-queries";
import { logout } from "./actions";
import { LoginForm } from "./login-form";

export const metadata = { title: "Waitlist" };

const dateFmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/New_York",
});

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">{children}</Card>
    </main>
  );
}

export default async function AdminWaitlistPage() {
  // Always render per request: env and cookies must be read at runtime.
  await connection();
  if (!isAdminConfigured()) {
    return (
      <Centered>
        <CardHeader>
          <CardTitle>Admin is disabled</CardTitle>
          <CardDescription>
            Set <code className="font-mono">ADMIN_PASSWORD</code> in your
            environment to enable this page.
          </CardDescription>
        </CardHeader>
      </Centered>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Centered>
        <CardHeader>
          <Logo />
          <CardTitle className="pt-4">Waitlist admin</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Centered>
    );
  }

  let rows: Awaited<ReturnType<typeof listWaitlist>> = [];
  let loadError: string | null = null;
  try {
    rows = await listWaitlist();
  } catch (err) {
    console.error("[admin] failed to load waitlist", err);
    loadError =
      err instanceof Error ? err.message : "Could not load the waitlist.";
  }

  const counts = SUB_COUNT_OPTIONS.map((o) => ({
    ...o,
    count: rows.filter((r) => r.subCount === o.value).length,
  }));

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-muted-foreground">/</span>
          <h1 className="text-lg font-bold">Waitlist</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="default" size="sm">
            {/* Plain <a> so the browser downloads the file instead of client-navigating. */}
            <a href="/admin/waitlist/export" download>
              <Download aria-hidden="true" />
              Export CSV
            </a>
          </Button>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              <LogOut aria-hidden="true" />
              Sign out
            </Button>
          </form>
        </div>
      </div>

      {loadError ? (
        <p
          role="alert"
          className="mt-6 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger"
        >
          {loadError}
        </p>
      ) : (
        <>
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-lg border border-border bg-card p-4">
              <dt className="text-xs font-semibold text-muted-foreground">
                Total signups
              </dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">
                {rows.length}
              </dd>
            </div>
            {counts.map((c) => (
              <div
                key={c.value}
                className="rounded-lg border border-border bg-card p-4"
              >
                <dt className="text-xs font-semibold text-muted-foreground">
                  {c.label} subs
                </dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums">
                  {c.count}
                </dd>
              </div>
            ))}
          </dl>

          <Card className="mt-6 gap-0 py-0">
            {rows.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                No signups yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Joined (ET)</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Subs</TableHead>
                    <TableHead>Tracks COIs today</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap tabular-nums">
                        {dateFmt.format(r.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${r.email}`}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          {r.email}
                        </a>
                      </TableCell>
                      <TableCell>{r.company}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {subCountLabel(r.subCount)}
                      </TableCell>
                      <TableCell className="max-w-xs text-muted-foreground">
                        {r.currentTracking ?? "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {[r.utmSource, r.utmMedium, r.utmCampaign]
                          .filter(Boolean)
                          .join(" / ") ||
                          (r.referrer ? safeHost(r.referrer) : "direct")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </>
      )}
    </main>
  );
}

function safeHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

import { site } from "@/lib/site";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Logo className="[&_span]:text-base" />
          <p>
            Subproof tracks documents and is not insurance or legal advice.
          </p>
        </div>
        <div className="flex flex-col gap-1 md:items-end">
          <a
            href={`mailto:${site.contactEmail}`}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            {site.contactEmail}
          </a>
          <p>&copy; {new Date().getFullYear()} Subproof</p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" aria-label="Subproof home" className="rounded-md">
          <Logo />
        </Link>
        <Button asChild size="sm" className="h-9 px-3.5 text-sm">
          <a href="#waitlist">Join the waitlist</a>
        </Button>
      </div>
    </header>
  );
}

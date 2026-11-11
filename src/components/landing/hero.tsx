import { Button } from "@/components/ui/button";
import { DashboardMock } from "./dashboard-mock";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-soft/70 to-background"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-14 sm:px-6 sm:pt-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12 lg:pt-24 lg:pb-24">
        <div className="max-w-xl">
          <h1
            id="hero-heading"
            className="text-[2.25rem] leading-[1.08] font-extrabold tracking-tight text-primary text-balance sm:text-5xl lg:text-[3.5rem]"
          >
            Stop chasing subs for insurance certificates.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-foreground/85 text-pretty sm:text-xl">
            Subproof collects your subcontractors&rsquo; COIs, reads them with
            AI, flags anything that doesn&rsquo;t meet your requirements, and
            reminds subs before their coverage expires. No more spreadsheets.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button asChild size="lg" className="h-12 w-full px-7 sm:w-auto">
              <a href="#waitlist">Join the waitlist</a>
            </Button>
            <p className="text-sm font-medium text-foreground/80">
              <span className="mr-1.5 inline-block rounded bg-success-soft px-1.5 py-0.5 text-xs font-bold text-success">
                40% off
              </span>
              Founding members get 40% off for life
            </p>
          </div>
        </div>

        <DashboardMock className="lg:justify-self-end" />
      </div>
    </section>
  );
}

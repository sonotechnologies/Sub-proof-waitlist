import { WaitlistForm } from "./waitlist-form";

export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-heading"
      className="scroll-mt-16 border-t border-border bg-muted/50 py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2
            id="waitlist-heading"
            className="text-3xl font-bold tracking-tight text-primary sm:text-4xl"
          >
            Join the waitlist
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-foreground/85">
            We&rsquo;re opening Subproof to a small group of general
            contractors first.
          </p>
          <p className="mt-4 inline-flex items-center rounded-md bg-success-soft px-3 py-1.5 text-sm font-semibold text-success">
            Founding members get 40% off for life
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}

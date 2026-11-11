import { Button } from "@/components/ui/button";

export function PricingTeaser() {
  return (
    <section aria-labelledby="pricing-heading" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2
              id="pricing-heading"
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Plans from $49/month.
            </h2>
            <p className="mt-2 text-lg text-primary-foreground/85">
              Flat pricing, no per-vendor fees.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-12 w-full bg-white px-7 text-primary hover:bg-white/90 md:w-auto"
          >
            <a href="#waitlist">Get founding-member pricing</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: "Add your subs",
    body: "Import your spreadsheet in a minute.",
  },
  {
    title: "They upload",
    body: "Each sub gets a simple link, no login.",
  },
  {
    title: "Subproof does the chasing",
    body: "Reads every certificate, checks your limits, emails subs and their agents before anything lapses.",
  },
];

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-heading"
      className="border-y border-border bg-muted/50 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="how-heading"
          className="text-3xl font-bold tracking-tight text-primary sm:text-4xl"
        >
          How it works
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 md:flex-col">
              <span
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-base font-bold text-primary-foreground tabular-nums"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-1.5 text-base leading-relaxed text-foreground/80">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

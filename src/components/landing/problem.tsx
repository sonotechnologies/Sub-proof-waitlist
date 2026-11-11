import { FileSpreadsheet, Mail, ShieldAlert } from "lucide-react";

const PROBLEMS = [
  {
    Icon: FileSpreadsheet,
    text: "That spreadsheet is always out of date.",
  },
  {
    Icon: ShieldAlert,
    text: "An expired policy you missed can land the claim on you.",
  },
  {
    Icon: Mail,
    text: "When the owner asks for proof, you’re digging through email.",
  },
];

export function Problem() {
  return (
    <section aria-labelledby="problem-heading" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="problem-heading"
          className="text-sm font-semibold text-muted-foreground"
        >
          Tracking COIs today
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3 md:gap-6">
          {PROBLEMS.map(({ Icon, text }) => (
            <li
              key={text}
              className="flex gap-4 rounded-xl border border-border bg-muted/60 p-5 md:flex-col md:p-6"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-background text-danger ring-1 ring-border">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <p className="text-lg leading-snug font-semibold text-foreground">
                {text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";

/** Wordmark: a shield-with-check mark plus the product name. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-7 shrink-0"
        fill="none"
      >
        <path
          d="M12 2.5 4 5.6v6.1c0 4.9 3.4 8.6 8 9.8 4.6-1.2 8-4.9 8-9.8V5.6L12 2.5Z"
          className="fill-primary"
        />
        <path
          d="m8.4 12.1 2.5 2.5 4.9-5"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-lg font-bold tracking-tight text-primary">
        Subproof
      </span>
    </span>
  );
}

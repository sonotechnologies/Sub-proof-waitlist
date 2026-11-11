import { z } from "zod";

export const SUB_COUNT_OPTIONS = [
  { value: "under_10", label: "Under 10" },
  { value: "10_25", label: "10–25" },
  { value: "25_100", label: "25–100" },
  { value: "100_plus", label: "100+" },
] as const;

export type SubCount = (typeof SUB_COUNT_OPTIONS)[number]["value"];

const subCountValues = SUB_COUNT_OPTIONS.map((o) => o.value) as [
  SubCount,
  ...SubCount[],
];

export function subCountLabel(value: string) {
  return SUB_COUNT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

const optionalTracking = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

export const waitlistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please tell us your name.")
    .max(120, "That name is a bit long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "That email is too long.")
    .pipe(z.email("Please enter a valid email address.")),
  company: z
    .string()
    .trim()
    .min(1, "Please add your company name.")
    .max(160, "That company name is a bit long."),
  subCount: z.enum(subCountValues, {
    error: "Please pick how many subs you work with.",
  }),
  currentTracking: z
    .string()
    .trim()
    .max(1000, "Please keep this under 1,000 characters.")
    .optional()
    .transform((v) => (v ? v : null)),
  utmSource: optionalTracking(200),
  utmMedium: optionalTracking(200),
  utmCampaign: optionalTracking(200),
  referrer: optionalTracking(500),
});

export type WaitlistInput = z.input<typeof waitlistSchema>;

export type WaitlistFieldErrors = Partial<
  Record<"name" | "email" | "company" | "subCount" | "currentTracking", string>
>;

export type WaitlistState =
  | { status: "idle" }
  | { status: "success"; name: string; alreadyJoined: boolean }
  | {
      status: "error";
      message: string;
      fieldErrors?: WaitlistFieldErrors;
      values?: Record<string, string>;
    };

"use server";

import { getDb, schema } from "@/db";
import {
  waitlistSchema,
  type WaitlistFieldErrors,
  type WaitlistState,
} from "@/lib/waitlist";

const FIELDS = [
  "name",
  "email",
  "company",
  "subCount",
  "currentTracking",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "referrer",
] as const;

export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const raw: Record<string, string> = {};
  for (const key of FIELDS) {
    const v = formData.get(key);
    if (typeof v === "string") raw[key] = v;
  }

  // Honeypot: real people never see or fill this field. Pretend it worked.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success", name: "", alreadyJoined: false };
  }

  const parsed = waitlistSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: WaitlistFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof WaitlistFieldErrors;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      values: raw,
    };
  }

  const data = parsed.data;
  const firstName = data.name.split(/\s+/)[0] ?? data.name;

  try {
    const inserted = await getDb()
      .insert(schema.waitlist)
      .values(data)
      .onConflictDoNothing({ target: schema.waitlist.email })
      .returning({ id: schema.waitlist.id });

    return {
      status: "success",
      name: firstName,
      alreadyJoined: inserted.length === 0,
    };
  } catch (err) {
    console.error("[waitlist] insert failed", err);
    return {
      status: "error",
      message:
        "Something went wrong on our end and your signup wasn't saved. Please try again in a minute.",
      values: raw,
    };
  }
}

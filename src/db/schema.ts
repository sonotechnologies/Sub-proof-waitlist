import {
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const waitlist = pgTable(
  "waitlist",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    /** Always stored trimmed + lowercased so the unique index blocks duplicates. */
    email: text("email").notNull(),
    company: text("company").notNull(),
    /** One of SUB_COUNT_OPTIONS values: under_10 | 10_25 | 25_100 | 100_plus */
    subCount: text("sub_count").notNull(),
    currentTracking: text("current_tracking"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    referrer: text("referrer"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("waitlist_email_unique").on(t.email),
    index("waitlist_created_at_idx").on(t.createdAt),
  ],
);

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type NewWaitlistEntry = typeof waitlist.$inferInsert;

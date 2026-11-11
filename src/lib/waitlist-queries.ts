import "server-only";

import { desc } from "drizzle-orm";

import { getDb, schema } from "@/db";

export async function listWaitlist() {
  return getDb()
    .select()
    .from(schema.waitlist)
    .orderBy(desc(schema.waitlist.createdAt));
}

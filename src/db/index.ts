import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

type Db = ReturnType<typeof drizzleNeon<typeof schema>>;

let _db: Db | null = null;

function isLocalPostgres(url: string) {
  try {
    const { hostname } = new URL(url);
    return ["localhost", "127.0.0.1", "::1", "[::1]"].includes(hostname);
  } catch {
    return false;
  }
}

/**
 * Lazily create the Drizzle client so `next build` works without
 * DATABASE_URL set (e.g. preview builds); it only fails when a request
 * actually touches the database.
 *
 * Production uses Neon's serverless HTTP driver. A localhost URL uses
 * node-postgres instead, so you can develop against a local Postgres.
 */
export function getDb(): Db {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. See .env.example.");
  }
  _db = isLocalPostgres(url)
    ? // Both drivers expose the same query-builder API we use.
      (drizzlePg(url, { schema }) as unknown as Db)
    : drizzleNeon(neon(url), { schema });
  return _db;
}

export { schema };

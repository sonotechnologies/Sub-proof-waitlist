import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "subproof_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getPassword() {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.length > 0 ? pw : null;
}

export function isAdminConfigured() {
  return getPassword() !== null;
}

/**
 * Session token = HMAC(password, issuedAt). Changing ADMIN_PASSWORD
 * invalidates every existing session; tokens expire after MAX_AGE_SECONDS.
 */
function sign(issuedAt: string, password: string) {
  return createHmac("sha256", password)
    .update(`subproof-admin:${issuedAt}`)
    .digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    // Still do a comparison so timing doesn't reveal the length mismatch early.
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

export function checkPassword(candidate: string) {
  const pw = getPassword();
  if (!pw) return false;
  // Compare fixed-length digests so lengths never leak.
  const a = createHmac("sha256", "subproof-pw").update(candidate).digest("hex");
  const b = createHmac("sha256", "subproof-pw").update(pw).digest("hex");
  return safeEqual(a, b);
}

export function createSessionToken() {
  const pw = getPassword();
  if (!pw) throw new Error("ADMIN_PASSWORD is not set");
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt, pw)}`;
}

export function verifySessionToken(token: string | undefined) {
  const pw = getPassword();
  if (!pw || !token) return false;
  const [issuedAt, sig] = token.split(".");
  if (!issuedAt || !sig || !/^\d+$/.test(issuedAt)) return false;
  const age = Date.now() - Number(issuedAt);
  if (age < 0 || age > MAX_AGE_SECONDS * 1000) return false;
  return safeEqual(sig, sign(issuedAt, pw));
}

export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, "", { path: "/admin", maxAge: 0 });
}

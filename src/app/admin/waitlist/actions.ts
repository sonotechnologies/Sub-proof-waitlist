"use server";

import { redirect } from "next/navigation";

import {
  checkPassword,
  clearAdminSession,
  setAdminSession,
} from "@/lib/admin-auth";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password");
  if (typeof password !== "string" || !checkPassword(password)) {
    // Small fixed delay to slow down guessing.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "That password isn’t right." };
  }
  await setAdminSession();
  redirect("/admin/waitlist");
}

export async function logout() {
  await clearAdminSession();
  redirect("/admin/waitlist");
}

/** Central site config so copy and URLs stay in one place. */
export const site = {
  name: "Subproof",
  tagline: "COI tracking for general contractors",
  title: "Subproof — Stop chasing subs for insurance certificates",
  description:
    "Subproof collects your subcontractors' COIs, reads them with AI, flags anything that doesn't meet your requirements, and reminds subs before their coverage expires. Join the waitlist.",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com",
} as const;

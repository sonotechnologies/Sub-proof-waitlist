"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { joinWaitlist } from "@/app/actions/waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SUB_COUNT_OPTIONS, type WaitlistState } from "@/lib/waitlist";

type Attribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
};

const ATTRIBUTION_KEY = "subproof:attribution";
const EMPTY: Attribution = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  referrer: "",
};

/**
 * First-touch attribution: UTM params from the landing URL (kept for the
 * session so an in-page reload without them doesn't lose the source) and
 * an external document.referrer.
 */
function readAttribution(): Attribution {
  try {
    const stored = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (stored) return { ...EMPTY, ...JSON.parse(stored) };
  } catch {
    /* storage unavailable */
  }
  const params = new URLSearchParams(window.location.search);
  let referrer = "";
  try {
    if (document.referrer) {
      const ref = new URL(document.referrer);
      if (ref.host !== window.location.host) referrer = ref.href;
    }
  } catch {
    /* malformed referrer */
  }
  const attribution: Attribution = {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    referrer,
  };
  try {
    if (Object.values(attribution).some(Boolean)) {
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    }
  } catch {
    /* storage unavailable */
  }
  return attribution;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm font-medium text-danger">
      {message}
    </p>
  );
}

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState<WaitlistState, FormData>(
    joinWaitlist,
    { status: "idle" },
  );
  const [attribution, setAttribution] = useState<Attribution>(EMPTY);
  const successRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only APIs after hydration
    setAttribution(readAttribution());
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      successRef.current?.focus();
    } else if (state.status === "error" && state.fieldErrors) {
      const first = formRef.current?.querySelector<HTMLElement>(
        "[aria-invalid='true']",
      );
      first?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        className="rounded-xl border border-success/30 bg-success-soft p-6 sm:p-8"
        role="status"
      >
        <CheckCircle2 className="size-8 text-success" aria-hidden="true" />
        <h3
          ref={successRef}
          tabIndex={-1}
          className="mt-4 text-2xl font-bold tracking-tight text-foreground outline-none"
        >
          {state.alreadyJoined
            ? "You’re already on the list."
            : `You’re on the list${state.name ? `, ${state.name}` : ""}!`}
        </h3>
        <p className="mt-2 text-base leading-relaxed text-foreground/85">
          {state.alreadyJoined
            ? "Good news: that email is already signed up, so there’s nothing else to do. We’ll email you as soon as Subproof is ready."
            : "Thanks for signing up. We’ll email you when Subproof is ready for early access, and your founding-member discount of 40% off for life is locked in."}
        </p>
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};
  const values = state.status === "error" ? state.values ?? {} : {};
  // Re-mount fields with previous values after a failed submit
  // (React resets uncontrolled forms after an action runs).
  const formKey = state.status === "error" ? JSON.stringify(values) : "fresh";

  return (
    <form
      ref={formRef}
      key={formKey}
      action={formAction}
      noValidate
      className="relative grid gap-5"
    >
      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="wl-name">Name</Label>
          <Input
            id="wl-name"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            defaultValue={values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "wl-name-error" : undefined}
          />
          <FieldError id="wl-name-error" message={errors.name} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="wl-email">Work email</Label>
          <Input
            id="wl-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={254}
            defaultValue={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "wl-email-error" : undefined}
          />
          <FieldError id="wl-email-error" message={errors.email} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="wl-company">Company</Label>
        <Input
          id="wl-company"
          name="company"
          autoComplete="organization"
          required
          maxLength={160}
          defaultValue={values.company}
          aria-invalid={errors.company ? true : undefined}
          aria-describedby={errors.company ? "wl-company-error" : undefined}
        />
        <FieldError id="wl-company-error" message={errors.company} />
      </div>

      <fieldset
        className="grid gap-2"
        aria-invalid={errors.subCount ? true : undefined}
        aria-describedby={errors.subCount ? "wl-subcount-error" : undefined}
      >
        <legend className="mb-2 text-sm font-semibold text-foreground">
          How many subs do you work with?
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SUB_COUNT_OPTIONS.map((opt, i) => (
            <label
              key={opt.value}
              className={cn(
                "relative flex h-11 cursor-pointer items-center justify-center rounded-md border border-input bg-background text-sm font-semibold text-foreground transition-colors select-none",
                "hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground",
                "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/40",
                errors.subCount && "border-danger",
              )}
            >
              <input
                type="radio"
                name="subCount"
                value={opt.value}
                required
                defaultChecked={values.subCount === opt.value}
                aria-invalid={errors.subCount && i === 0 ? true : undefined}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
        <FieldError id="wl-subcount-error" message={errors.subCount} />
      </fieldset>

      <div className="grid gap-2">
        <Label htmlFor="wl-tracking">
          How do you track COIs today?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="wl-tracking"
          name="currentTracking"
          rows={3}
          maxLength={1000}
          placeholder="e.g. an Excel sheet and a folder in Outlook"
          defaultValue={values.currentTracking}
          aria-invalid={errors.currentTracking ? true : undefined}
          aria-describedby={
            errors.currentTracking ? "wl-tracking-error" : undefined
          }
        />
        <FieldError id="wl-tracking-error" message={errors.currentTracking} />
      </div>

      {/* Attribution (first touch) */}
      <input type="hidden" name="utmSource" value={attribution.utmSource} />
      <input type="hidden" name="utmMedium" value={attribution.utmMedium} />
      <input type="hidden" name="utmCampaign" value={attribution.utmCampaign} />
      <input type="hidden" name="referrer" value={attribution.referrer} />

      {/* Honeypot: hidden from people and screen readers, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-12 w-full px-7 sm:w-auto"
        >
          {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {pending ? "Joining…" : "Join the waitlist"}
        </Button>
        <p className="text-sm text-muted-foreground">
          No spam. We&rsquo;ll only email you about Subproof&rsquo;s launch.
        </p>
      </div>
    </form>
  );
}

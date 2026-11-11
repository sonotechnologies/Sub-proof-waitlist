import { SiteFooter } from "@/components/landing/footer";
import { SiteHeader } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { Problem } from "@/components/landing/problem";
import { WaitlistSection } from "@/components/landing/waitlist-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <Problem />
        <HowItWorks />
        <PricingTeaser />
        <WaitlistSection />
      </main>
      <SiteFooter />
    </>
  );
}

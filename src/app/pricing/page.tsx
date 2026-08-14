import type { Metadata } from "next";
import { plans } from "@/content/pricing";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GridTexture } from "@/components/ui/GridTexture";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Pricing | GC Career Studio",
  description: "Simple, transparent packages for every stage of your job search.",
};

export default function PricingPage() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Simple packages, no surprises"
            description="Not sure what you need? Book a free call and we'll recommend the right starting point."
            align="center"
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-[28px] border p-8 transition-[transform,box-shadow] duration-200 ${
                  plan.highlighted
                    ? "border-primary bg-primary text-white shadow-xl lg:scale-[1.03]"
                    : "border-border bg-white hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
                }`}
              >
                {plan.highlighted && <GridTexture color="white" size={32} opacity={0.06} />}

                <div className="relative">
                  {plan.highlighted && (
                    <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  )}
                  <h3
                    className={`mt-4 font-serif text-2xl font-medium ${
                      plan.highlighted ? "text-white" : "text-primary"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className={`mt-2 text-sm ${plan.highlighted ? "text-white/70" : "text-muted"}`}>
                    {plan.description}
                  </p>
                  <p className="mt-6">
                    <span className="font-serif text-4xl font-medium">{plan.price}</span>
                    <span className={`text-sm ${plan.highlighted ? "text-white/60" : "text-muted"}`}>
                      {" "}/ {plan.cadence}
                    </span>
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className={plan.highlighted ? "text-accent" : "text-success"}>✓</span>
                        <span className={plan.highlighted ? "text-white/90" : ""}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    href="/book-a-call"
                    variant={plan.highlighted ? "primary" : "ghost"}
                    className="mt-8 w-full"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}

import type { Metadata } from "next";
import { services } from "@/content/services";
import { formatINR } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GridTexture } from "@/components/ui/GridTexture";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Pricing | GC Career Studio",
  description: "Simple, transparent career packages — priced in INR.",
};

export default function PricingPage() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Four packages, no surprises"
            description="Not sure what you need? Book a free call and we'll recommend the right starting point. Pricing shown in INR; final numbers to be confirmed with GC Career Studio."
            align="center"
          />

          <div className="mt-14 flex flex-col gap-6">
            {services.map((service, i) => (
              <RevealOnScroll key={service.slug} delay={i * 100}>
                <div
                  className={`relative overflow-hidden rounded-[28px] border p-8 transition-shadow duration-200 sm:p-10 ${
                    service.recommended
                      ? "border-primary bg-primary text-white shadow-xl"
                      : "border-border bg-white hover:shadow-lg hover:shadow-primary/5"
                  }`}
                >
                  {service.recommended && <GridTexture color="white" size={32} opacity={0.06} />}

                  <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="lg:max-w-xs lg:shrink-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            service.recommended ? "bg-accent text-white" : "bg-surface text-muted"
                          }`}
                        >
                          {service.duration}
                        </span>
                        {service.recommended && (
                          <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                            Recommended
                          </span>
                        )}
                      </div>
                      <h3
                        className={`mt-4 font-serif text-2xl font-medium ${
                          service.recommended ? "text-white" : "text-primary"
                        }`}
                      >
                        {service.name}
                      </h3>
                      <p className={`mt-2 text-sm ${service.recommended ? "text-white/70" : "text-muted"}`}>
                        {service.tagline}
                      </p>
                    </div>

                    <ul className="grid gap-2.5 sm:grid-cols-2 lg:flex-1 lg:px-4">
                      {service.additions.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <span className={service.recommended ? "text-accent" : "text-success"}>✓</span>
                          <span className={service.recommended ? "text-white/90" : ""}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div
                      className={`flex flex-col items-start gap-4 border-t pt-6 lg:shrink-0 lg:items-end lg:border-t-0 lg:pt-0 lg:text-right ${
                        service.recommended ? "border-white/10" : "border-border"
                      }`}
                    >
                      <div>
                        <span className="font-serif text-4xl font-medium">{formatINR(service.priceINR)}</span>
                        <p className={`mt-1 text-xs ${service.recommended ? "text-white/50" : "text-muted"}`}>
                          Indicative — to be confirmed
                        </p>
                      </div>
                      <Button
                        href="/book-a-call"
                        variant={service.recommended ? "primary" : "ghost"}
                        className="w-full sm:w-auto"
                      >
                        Book {service.name}
                      </Button>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}

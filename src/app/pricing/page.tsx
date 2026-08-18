import type { Metadata } from "next";
import { services } from "@/content/services";
import { formatINR } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GridTexture } from "@/components/ui/GridTexture";
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

          <div className="mt-14 grid gap-6 lg:grid-cols-4 lg:items-stretch">
            {services.map((service) => (
              <div
                key={service.slug}
                className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border p-8 transition-[transform,box-shadow] duration-200 ${
                  service.recommended
                    ? "border-primary bg-primary text-white shadow-xl lg:scale-[1.03]"
                    : "border-border bg-white hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
                }`}
              >
                {service.recommended && <GridTexture color="white" size={32} opacity={0.06} />}

                <div className="relative flex h-full flex-col">
                  <span
                    className={`inline-block self-start rounded-full px-3 py-1 text-xs font-semibold ${
                      service.recommended ? "bg-accent text-white" : "bg-surface text-muted"
                    }`}
                  >
                    {service.recommended ? "Recommended" : service.duration}
                  </span>
                  <h3
                    className={`mt-4 font-serif text-2xl font-medium ${
                      service.recommended ? "text-white" : "text-primary"
                    }`}
                  >
                    {service.name}
                  </h3>
                  <p className={`mt-1 text-xs font-semibold ${service.recommended ? "text-white/60" : "text-muted"}`}>
                    {service.duration}
                  </p>
                  <p className={`mt-2 text-sm ${service.recommended ? "text-white/70" : "text-muted"}`}>
                    {service.tagline}
                  </p>
                  <p className="mt-6">
                    <span className="font-serif text-4xl font-medium">{formatINR(service.priceINR)}</span>
                  </p>
                  <p className={`text-xs ${service.recommended ? "text-white/50" : "text-muted"}`}>
                    Indicative — to be confirmed
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {service.additions.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className={service.recommended ? "text-accent" : "text-success"}>✓</span>
                        <span className={service.recommended ? "text-white/90" : ""}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    href="/book-a-call"
                    variant={service.recommended ? "primary" : "ghost"}
                    className="mt-8 w-full lg:mt-auto"
                  >
                    Book {service.name}
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

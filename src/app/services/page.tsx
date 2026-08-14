import type { Metadata } from "next";
import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/sections/ServiceIcon";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Services | GC Career Studio",
  description: "Resume review, LinkedIn optimization, interview coaching, and career strategy.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Practical support for every stage of your search"
            description="Pick a single service or combine them into a package — every engagement starts with a free discovery call."
            align="center"
          />

          <div className="mt-16 space-y-16">
            {services.map((service, i) => (
              <div
                key={service.slug}
                id={service.slug}
                className={`grid gap-8 lg:grid-cols-2 lg:items-center scroll-mt-24 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent-dark">
                    <ServiceIcon icon={service.icon} />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-primary">{service.title}</h2>
                  <p className="mt-3 text-muted leading-relaxed">{service.description}</p>
                  <ul className="mt-5 space-y-2">
                    {service.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 text-success">✓</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button href="/book-a-call">Book a Free Call</Button>
                  </div>
                </div>
                <div className="rounded-3xl border border-border bg-surface aspect-[4/3]" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}

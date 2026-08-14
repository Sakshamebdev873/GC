import type { Metadata } from "next";
import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GridTexture } from "@/components/ui/GridTexture";
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
            {services.map((service, i) => {
              const numeral = String(i + 1).padStart(2, "0");
              return (
                <div
                  key={service.slug}
                  id={service.slug}
                  className={`grid gap-8 lg:grid-cols-2 lg:items-center scroll-mt-24 ${
                    i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div>
                    <p className="font-serif text-3xl font-medium text-accent/30">
                      {numeral}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-medium text-primary">{service.title}</h2>
                    <p className="mt-3 text-muted leading-relaxed">{service.description}</p>
                    <ul className="mt-5 space-y-2.5">
                      {service.outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-start gap-2.5 text-sm">
                          <span className="mt-0.5 text-success">✓</span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Button href="/book-a-call">Book a Free Call</Button>
                    </div>
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-border bg-surface">
                    <GridTexture color="var(--border)" size={28} opacity={0.35} />
                    <span className="absolute -bottom-6 -right-2 font-serif text-[10rem] font-medium leading-none text-primary/[0.06]">
                      {numeral}
                    </span>
                    <div className="relative flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent-dark">
                        <ServiceIcon icon={service.icon} />
                      </div>
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary/70">
                        {service.title}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}

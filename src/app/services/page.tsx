import type { Metadata } from "next";
import { services, serviceBySlug } from "@/content/services";
import { formatINR } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GridTexture } from "@/components/ui/GridTexture";
import { ServiceIcon } from "@/components/sections/ServiceIcon";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Services & Packages | GC Career Studio",
  description:
    "Resume & LinkedIn, Career Acceleration, Career Transformation, and Premium Placement Support — structured career packages for every stage of your search.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Services & Packages"
            title="Structured support for every stage of your career"
            description="Each package builds on the one before it — start where you are, and upgrade as your needs grow. Every engagement starts with a free discovery call."
            align="center"
          />

          <div className="mt-16 space-y-16">
            {services.map((service, i) => {
              const numeral = String(i + 1).padStart(2, "0");
              const builtOn = service.builtOnSlug ? serviceBySlug(service.builtOnSlug) : undefined;
              return (
                <div
                  key={service.slug}
                  id={service.slug}
                  className={`grid gap-8 lg:grid-cols-2 lg:items-center scroll-mt-24 ${
                    i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-serif text-3xl font-medium text-accent/30">{numeral}</p>
                      <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">
                        {service.duration}
                      </span>
                      {service.recommended && (
                        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                          Recommended
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 font-serif text-2xl font-medium text-primary">{service.name}</h2>
                    <p className="mt-3 text-muted leading-relaxed">{service.tagline}</p>

                    {builtOn && (
                      <p className="mt-5 text-sm font-semibold text-primary/70">
                        Everything in {builtOn.name}, plus:
                      </p>
                    )}
                    <ul className="mt-3 space-y-2.5">
                      {service.additions.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm">
                          <span className="mt-0.5 text-success">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-6 font-serif text-2xl font-medium text-primary">
                      {formatINR(service.priceINR)}
                    </p>
                    <p className="text-xs text-muted">
                      Indicative pricing — to be confirmed. See docs/next-steps.md.
                    </p>

                    <div className="mt-6">
                      <Button href="/book-a-call">Book a Free Call</Button>
                    </div>
                  </div>

                  <div className="relative min-h-[280px] overflow-hidden rounded-[28px] border border-border bg-surface">
                    <GridTexture color="var(--border)" size={28} opacity={0.35} />
                    <span className="absolute -bottom-6 -right-2 font-serif text-[10rem] font-medium leading-none text-primary/[0.06]">
                      {numeral}
                    </span>
                    <div className="relative flex min-h-[280px] flex-col items-center justify-center gap-4 p-8 text-center">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent-dark">
                        <ServiceIcon icon={service.icon} />
                      </div>
                      <p className="max-w-[16rem] text-sm font-semibold uppercase tracking-[0.14em] text-primary/70">
                        {service.name}
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

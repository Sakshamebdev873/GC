import Link from "next/link";
import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/sections/ServiceIcon";

export function ServicesGrid({ compact = false }: { compact?: boolean }) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="What We Offer"
          title="Everything you need to get hired"
          description="Focused, practical services designed around one goal: getting you an offer."
          align="center"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={compact ? "/services" : `/services#${service.slug}`}
              className="group rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent-dark">
                <ServiceIcon icon={service.icon} />
              </div>
              <h3 className="mt-4 font-semibold text-primary">{service.title}</h3>
              <p className="mt-2 text-sm text-muted">{service.summary}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-accent-dark group-hover:underline">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

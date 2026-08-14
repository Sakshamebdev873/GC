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

        <div className="mt-14 divide-y divide-border border-y border-border">
          {services.map((service, i) => (
            <Link
              key={service.slug}
              href={compact ? "/services" : `/services#${service.slug}`}
              className="group grid gap-4 py-8 transition-colors sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-10 hover:bg-surface/60"
            >
              <span className="font-serif text-4xl font-medium text-accent/25 group-hover:text-accent-dark/40 transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex items-start gap-4">
                <div className="mt-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-dark sm:flex">
                  <ServiceIcon icon={service.icon} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-primary">{service.title}</h3>
                  <p className="mt-1 text-sm text-muted max-w-md">{service.summary}</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-dark whitespace-nowrap sm:justify-self-end">
                Learn more
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

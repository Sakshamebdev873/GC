import { testimonials } from "@/content/testimonials";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Success Stories"
          title="Real results from real candidates"
          align="center"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-border bg-white p-6 flex flex-col"
            >
              <blockquote className="text-foreground/90 leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 pt-6 border-t border-border">
                <p className="font-semibold text-primary">{t.name}</p>
                <p className="text-sm text-muted">{t.role}</p>
                <p className="mt-2 inline-block rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  {t.result}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

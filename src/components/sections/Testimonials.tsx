import { testimonials } from "@/content/testimonials";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Success Stories"
          title="Real results from real candidates"
          align="center"
        />

        <div className={`mt-14 grid gap-6 ${rest.length > 0 ? "lg:grid-cols-3" : ""}`}>
          {featured && (
            <figure
              className={`flex flex-col justify-between rounded-[28px] bg-primary p-10 text-white sm:p-12 ${
                rest.length > 0 ? "lg:col-span-2" : ""
              }`}
            >
              <blockquote className="font-serif text-2xl font-medium leading-snug sm:text-3xl">
                “{featured.quote}”
              </blockquote>
              <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="font-semibold text-white">{featured.name}</p>
                  <p className="text-sm text-white/60">{featured.role}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  {featured.result}
                </span>
              </figcaption>
            </figure>
          )}

          {rest.length > 0 && (
            <div className="flex flex-col gap-6">
              {rest.map((t) => (
                <figure
                  key={t.name}
                  className="flex flex-1 flex-col rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
                >
                  <blockquote className="text-sm leading-relaxed text-foreground/90">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-border pt-4">
                    <p className="font-semibold text-primary">{t.name}</p>
                    <p className="text-sm text-muted">{t.role}</p>
                    <p className="mt-2 inline-block rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                      {t.result}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

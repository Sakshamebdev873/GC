import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const stats = [
  { value: "500+", label: "Candidates coached" },
  { value: "85%", label: "Landed interviews within 30 days" },
  { value: "4.9/5", label: "Average client rating" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <Container className="relative py-20 sm:py-28">
        <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="max-w-xl">
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent-dark">
              <span className="h-px w-8 bg-accent-dark/40" />
              Career Coaching That Gets Results
            </p>
            <h1 className="mt-5 font-serif text-5xl sm:text-6xl font-medium tracking-tight leading-[1.05] text-primary">
              Land the role you actually want.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted max-w-md">
              Resume reviews, LinkedIn optimization, interview coaching, and job
              search strategy from consultants who&apos;ve helped hundreds of
              candidates get hired.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="/book-a-call">Book a Free Discovery Call</Button>
              <Button href="/services" variant="ghost">
                Explore Services
              </Button>
            </div>
          </div>

          <div className="relative lg:justify-self-end lg:translate-y-4">
            <div className="rounded-[28px] bg-primary px-8 py-9 text-white shadow-xl shadow-primary/20 sm:rotate-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Track record
              </p>
              <div className="mt-6 divide-y divide-white/10">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                    <span className="font-serif text-3xl font-medium text-white">{s.value}</span>
                    <span className="text-right text-sm text-white/60">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-[28px] border border-border sm:block hidden" />
          </div>
        </div>
      </Container>
    </section>
  );
}

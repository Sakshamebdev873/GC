import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 0%, white 0, transparent 35%)",
        }}
      />
      <Container className="relative py-24 sm:py-32">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Career Coaching That Gets Results
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
            Land the role you actually want.
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-xl">
            Resume reviews, LinkedIn optimization, interview coaching, and job
            search strategy from consultants who&apos;ve helped hundreds of
            candidates get hired.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/book-a-call">Book a Free Discovery Call</Button>
            <Button href="/services" variant="ghost" className="!border-white/30 !text-white hover:!bg-white/10">
              Explore Services
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-8 text-sm text-white/60">
            <div>
              <p className="text-2xl font-bold text-white">500+</p>
              <p>Candidates coached</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">85%</p>
              <p>Landed interviews within 30 days</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">4.9/5</p>
              <p>Average client rating</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

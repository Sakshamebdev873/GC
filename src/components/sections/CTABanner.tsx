import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CTABanner() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[32px] bg-primary px-8 py-16 text-center text-white sm:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="relative">
            <p className="flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/50">
              <span className="h-px w-8 bg-white/30" />
              Start Today
              <span className="h-px w-8 bg-white/30" />
            </p>
            <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
              Ready to take the next step in your career?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-white/70">
              Book a free 20-minute discovery call and leave with a clear plan —
              no pressure, no obligation.
            </p>
            <div className="mt-9">
              <Button href="/book-a-call">Book a Free Discovery Call</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

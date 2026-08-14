import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CTABanner() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="rounded-3xl bg-primary px-8 py-14 text-center text-white sm:px-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to take the next step in your career?
          </h2>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">
            Book a free 20-minute discovery call and leave with a clear plan —
            no pressure, no obligation.
          </p>
          <div className="mt-8">
            <Button href="/book-a-call">Book a Free Discovery Call</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

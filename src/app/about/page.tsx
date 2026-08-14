import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "About | GC Career Studio",
  description: "Why GC Career Studio exists and how we work with our clients.",
};

export default function AboutPage() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="About Us"
            title="We've been on the other side of the table"
            description="GC Career Studio was founded to close the gap between qualified candidates and the roles they deserve — with honest, practical, one-on-one coaching instead of generic advice."
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5 text-muted leading-relaxed">
              <p>
                Job searching shouldn&apos;t feel like shouting into the void.
                Too many talented people get overlooked because of a resume
                that doesn&apos;t translate their impact, or an interview
                answer that doesn&apos;t land — not because they lack the
                skills for the role.
              </p>
              <p>
                Our consultants have worked inside hiring teams and know what
                separates a resume that gets a callback from one that
                doesn&apos;t. We combine that insider perspective with
                structured, 1:1 coaching so you walk away with a plan you can
                actually execute.
              </p>
              <p>
                We work with early-career candidates, career switchers, and
                experienced professionals alike — the throughline is always
                the same: clarity, preparation, and a plan.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
              <div>
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted">Candidates coached</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">85%</p>
                <p className="text-sm text-muted">Land interviews within 30 days</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">4.9 / 5</p>
                <p className="text-sm text-muted">Average client rating</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}

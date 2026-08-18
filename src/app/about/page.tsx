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
                We work primarily with students, freshers, and early-career
                professionals across every industry — the throughline is
                always the same: clarity, preparation, and a plan.
              </p>
            </div>

            {/* Structural facts, not performance claims — GC Career Studio
                asked us not to invent stats before real numbers exist. */}
            <div className="rounded-[28px] bg-primary p-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                How we work
              </p>
              <div className="mt-6 divide-y divide-white/10">
                <div className="py-4 first:pt-0 last:pb-0">
                  <p className="font-serif text-3xl font-medium text-white">4</p>
                  <p className="mt-1 text-sm text-white/60">Structured career packages</p>
                </div>
                <div className="py-4 first:pt-0 last:pb-0">
                  <p className="font-serif text-3xl font-medium text-white">30–90</p>
                  <p className="mt-1 text-sm text-white/60">Day programs, matched to your goals</p>
                </div>
                <div className="py-4 first:pt-0 last:pb-0">
                  <p className="font-serif text-3xl font-medium text-white">1:1</p>
                  <p className="mt-1 text-sm text-white/60">Personalized mentoring, every package</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}

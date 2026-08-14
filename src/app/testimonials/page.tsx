import type { Metadata } from "next";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Testimonials | GC Career Studio",
  description: "Real results from real candidates we've coached.",
};

export default function TestimonialsPage() {
  return (
    <>
      <section className="pt-20 sm:pt-24">
        <Container>
          <SectionHeading
            eyebrow="Success Stories"
            title="What our clients say"
            align="center"
          />
        </Container>
      </section>
      <Testimonials />
      <CTABanner />
    </>
  );
}

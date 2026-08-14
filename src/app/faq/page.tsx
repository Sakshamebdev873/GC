import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "FAQ | GC Career Studio",
  description: "Answers to common questions about working with GC Career Studio.",
};

export default function FaqPage() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            align="center"
          />
          <div className="mt-12">
            <FAQAccordion />
          </div>
        </Container>
      </section>
      <CTABanner />
    </>
  );
}

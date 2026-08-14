import type { Metadata } from "next";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "How It Works | GC Career Studio",
  description: "A simple, guided path from where you are to your next role.",
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="py-20 sm:pt-24">
        <Container>
          <SectionHeading
            eyebrow="Your Journey"
            title="A clear path, start to finish"
            description="No guesswork — every client goes through the same proven process, tailored to their goals."
            align="center"
          />
        </Container>
      </section>
      <HowItWorks />
      <CTABanner />
    </>
  );
}

import { Hero } from "@/components/sections/Hero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesGrid compact />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </>
  );
}

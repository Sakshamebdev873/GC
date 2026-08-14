import type { Metadata } from "next";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Testimonials | GC Career Studio",
  description: "Real results from real candidates we've coached.",
};

export default function TestimonialsPage() {
  return (
    <>
      <Testimonials />
      <CTABanner />
    </>
  );
}

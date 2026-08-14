import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    step: "01",
    title: "Book a free discovery call",
    description: "Tell us where you're stuck and what you're aiming for — no pressure, no obligation.",
  },
  {
    step: "02",
    title: "Get a tailored plan",
    description: "We recommend the right services and timeline based on your goals and target roles.",
  },
  {
    step: "03",
    title: "Work with your consultant",
    description: "Resume, LinkedIn, and interview prep — hands-on, iterative, and specific to you.",
  },
  {
    step: "04",
    title: "Land the offer",
    description: "Walk into interviews prepared and negotiate with confidence.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="The Process"
          title="How it works"
          description="A simple, guided path from where you are to your next role."
          align="center"
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.step} className="relative">
              <span className="text-4xl font-bold text-accent/30">{s.step}</span>
              <h3 className="mt-3 font-semibold text-primary">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

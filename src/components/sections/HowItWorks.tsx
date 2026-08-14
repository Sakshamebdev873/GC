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

export function HowItWorks({ hideHeading = false }: { hideHeading?: boolean }) {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container>
        {!hideHeading && (
          <SectionHeading
            eyebrow="The Process"
            title="How it works"
            description="A simple, guided path from where you are to your next role."
            align="center"
          />
        )}

        <div className={hideHeading ? "relative" : "relative mt-16"}>
          <div className="absolute left-6 top-6 bottom-6 w-px bg-primary/12 sm:left-0 sm:right-0 sm:top-6 sm:bottom-auto sm:h-px sm:w-auto" />
          <div className="grid gap-10 sm:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative flex gap-4 sm:block">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-base font-medium text-white">
                  {s.step}
                </div>
                <div className="sm:mt-5">
                  <h3 className="font-serif text-lg font-medium text-primary">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

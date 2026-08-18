import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GridTexture } from "@/components/ui/GridTexture";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "AI Resume Scorer (Coming Soon) | GC Career Studio",
  description:
    "Upload your resume, get an ATS-style score and AI-generated suggestions, and see which GC Career Studio package fits you best.",
};

const steps = [
  { step: "01", title: "Upload your resume", description: "PDF or DOCX — nothing leaves your session until you choose to share it." },
  { step: "02", title: "Get an ATS-style score", description: "Formatting, keyword match, and structure checked against real applicant-tracking-system rules." },
  { step: "03", title: "See AI-generated suggestions", description: "Specific, actionable fixes — not generic advice." },
  { step: "04", title: "Get matched to a package", description: "Based on your score and goals, we recommend the right starting point." },
];

export default function ResumeScorerPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden py-20 sm:py-24">
        <GridTexture
          color="var(--primary)"
          size={40}
          opacity={0.06}
          className="absolute inset-x-0 top-0 -z-10 h-[420px]"
        />
        <Container className="max-w-3xl text-center">
          <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-dark">
            Coming soon
          </span>
          <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight text-primary sm:text-5xl">
            Free AI Resume Scorer
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            We&apos;re building a free tool to score your resume like an ATS
            would, and point you toward the fastest fixes. It&apos;s not live
            yet — this page reserves the intended flow so it can plug into the
            site without a rebuild once it&apos;s ready. In the meantime, a
            free discovery call gets you the same feedback from a real
            consultant.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/book-a-call">Book a Free Discovery Call Instead</Button>
            <Button href="/services" variant="ghost">
              See Packages
            </Button>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="How it will work"
            title="Upload → score → suggestions → next step"
            align="center"
          />
          <div className="relative mt-16">
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
          <p className="mx-auto mt-14 max-w-2xl text-center text-sm text-muted">
            Architecture note: this route is a deliberate placeholder — see
            docs/architecture/future-schema.md for the planned
            <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs">resume_analyses</code>
            table and how a score would route a visitor into the right
            package.
          </p>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}

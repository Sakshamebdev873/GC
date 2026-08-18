import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GridTexture } from "@/components/ui/GridTexture";
import { ResumeScorerForm } from "@/components/sections/ResumeScorerForm";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "AI Resume Scorer (Demo) | GC Career Studio",
  description:
    "Upload your resume, get an ATS-style score and suggestions, and see which GC Career Studio package fits you best.",
};

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
        <Container className="max-w-2xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-dark">
              Demo
            </span>
            <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight text-primary sm:text-5xl">
              Free AI Resume Scorer
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Upload your resume for an ATS-style score, a few suggestions,
              and a package recommendation based on where you land.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-surface/60 p-4 text-center text-sm text-muted">
            <strong className="text-primary">Demo mode:</strong> this is a
            mock analyzer for demonstration purposes — it does not read your
            resume&apos;s contents or use real AI. Scoring is deterministic
            per file (same file → same result) so the flow is repeatable to
            test, not real ATS output. Nothing you upload is stored; only
            the file name and size are used to generate the demo result.
          </div>

          <div className="mt-8">
            <ResumeScorerForm />
          </div>
        </Container>
      </section>

      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="How this demo works"
            title="Upload → score → suggestions → next step"
            align="center"
          />
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted">
            The result you see is generated in{" "}
            <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs">
              src/lib/resumeScorer.ts
            </code>
            and written to a real{" "}
            <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs">ResumeAnalysis</code>
            row — visible live at{" "}
            <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs">/internal/demo</code>.
            A production version would swap the mock scoring function for
            real document parsing and an AI scoring call — the upload flow,
            data model, and package-routing logic here would stay the same.
            See docs/architecture/future-schema.md for scope details.
          </p>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}

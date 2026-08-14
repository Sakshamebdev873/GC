import type { Metadata } from "next";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Book a Free Call | GC Career Studio",
  description: "Book a free 20-minute discovery call with GC Career Studio.",
};

export default function BookACallPage() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Book a Call"
          title="Let's talk about your job search"
          description="Pick a time below for a free 20-minute discovery call — no pressure, no obligation."
          align="center"
        />

        <div className="mt-12">
          {site.calendlyUrl ? (
            <iframe
              src={site.calendlyUrl}
              title="Book a call"
              className="w-full rounded-[28px] border border-border"
              style={{ height: 700 }}
            />
          ) : (
            <div className="rounded-[28px] border border-dashed border-border bg-surface p-10 text-center">
              <p className="font-serif text-xl font-medium text-primary">Scheduling isn&apos;t connected yet</p>
              <p className="mt-2 text-sm text-muted max-w-md mx-auto">
                Set the <code className="rounded bg-surface-alt px-1.5 py-0.5">NEXT_PUBLIC_CALENDLY_URL</code>{" "}
                environment variable to your Calendly (or Cal.com) embed link
                to activate live booking here.
              </p>
              <p className="mt-4 text-sm text-muted">
                In the meantime, reach out at{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-medium text-accent-dark underline-offset-2 hover:underline"
                >
                  {site.email}
                </a>{" "}
                to schedule directly.
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

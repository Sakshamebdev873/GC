import type { Metadata } from "next";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LeadForm } from "@/components/sections/LeadForm";

export const metadata: Metadata = {
  title: "Contact | GC Career Studio",
  description: "Get in touch with GC Career Studio.",
};

export default function ContactPage() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Contact"
          title="Get in touch"
          description="Have a question before booking a call? Send us a message and we'll reply within one business day."
          align="center"
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="rounded-[28px] border border-border bg-surface p-8">
            <LeadForm />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-primary">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="text-muted transition-colors hover:text-primary"
              >
                {site.email}
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Phone</p>
              <p className="text-muted">{site.phone}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Prefer to book directly?</p>
              <a
                href="/book-a-call"
                className="group inline-flex items-center gap-1 text-accent-dark"
              >
                <span className="underline-offset-2 group-hover:underline">Book a free discovery call</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

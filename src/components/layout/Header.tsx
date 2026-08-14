"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-xl font-medium tracking-tight text-primary">
          {site.shortName}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent-dark transition-[width] duration-200 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="/book-a-call" className="!px-5 !py-2.5">
            Book a Free Call
          </Button>
        </div>

        <button
          className="md:hidden text-primary transition-transform active:scale-90"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <Container className="flex flex-col gap-1 py-4">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-surface hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Button href="/book-a-call" className="mt-2 w-full">
              Book a Free Call
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}

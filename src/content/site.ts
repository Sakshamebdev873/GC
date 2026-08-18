export const site = {
  name: "GC Career Studio",
  shortName: "GC Career Studio",
  tagline: "Land the role you actually want.",
  description:
    "GC Career Studio helps students, freshers, and early-career professionals build standout resumes, sharpen interview skills, and navigate their job search with 1:1 expert coaching — across every industry.",
  email: "hello@gccareerstudio.com",
  // Placeholder — real business contact number pending from GC Career Studio.
  phone: "+91 98765 43210",
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
  nav: [
    { label: "Services", href: "/services" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
  ],
  footerLinks: [
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "AI Resume Scorer (Demo)", href: "/tools/resume-scorer" },
  ],
};

export const site = {
  name: "GC Career Studio",
  shortName: "GC Career Studio",
  tagline: "Land the role you actually want.",
  description:
    "GC Career Studio helps job seekers build standout resumes, sharpen interview skills, and navigate their job search with 1:1 expert coaching.",
  email: "hello@gccareerstudio.com",
  phone: "+1 (555) 010-2024",
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
  ],
};

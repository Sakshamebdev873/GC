export type Service = {
  slug: string;
  name: string;
  duration: string;
  tagline: string;
  /** Slug of the package this one is built on ("Everything in X, plus:") */
  builtOnSlug?: string;
  /** What this tier adds on top of builtOnSlug (or the full list, if no builtOnSlug) */
  additions: string[];
  recommended?: boolean;
  icon: "resume" | "acceleration" | "transformation" | "placement";
  /**
   * Indicative price in INR. Mind Loop has not confirmed final numbers yet —
   * treat as a placeholder until real pricing is provided. See
   * docs/next-steps.md.
   */
  priceINR: number;
};

export const services: Service[] = [
  {
    slug: "resume-linkedin",
    name: "Resume & LinkedIn",
    duration: "30 Days",
    tagline:
      "Get your foundation right — a resume and LinkedIn profile built to actually get noticed.",
    additions: [
      "ATS-friendly Resume",
      "LinkedIn Profile Optimization",
      "Profile Review & Suggestions",
    ],
    icon: "resume",
    priceINR: 4999,
  },
  {
    slug: "career-acceleration",
    name: "Career Acceleration",
    duration: "60 Days",
    tagline: "Move from a strong profile to active, strategic job search execution.",
    builtOnSlug: "resume-linkedin",
    additions: [
      "Interview Preparation",
      "Job Application Strategy",
      "HR Guidance",
      "Career Roadmap",
    ],
    icon: "acceleration",
    priceINR: 9999,
  },
  {
    slug: "career-transformation",
    name: "Career Transformation",
    duration: "75 Days",
    tagline: "Hands-on 1:1 mentoring to take you from applying to landing offers.",
    builtOnSlug: "career-acceleration",
    additions: [
      "Personalized 1:1 Career Mentoring",
      "Weekly Progress Reviews",
      "Mock Interviews",
      "Networking & Referral Strategy",
      "Offer Evaluation & Negotiation Guidance",
    ],
    recommended: true,
    icon: "transformation",
    priceINR: 16999,
  },
  {
    slug: "premium-placement",
    name: "Premium Placement Support",
    duration: "90 Days",
    tagline: "End-to-end support until you land the right role — our most comprehensive package.",
    builtOnSlug: "career-transformation",
    additions: [
      "Unlimited 1:1 Coaching",
      "Priority WhatsApp Support",
      "Advanced Mock Interviews",
      "End-to-End Placement Support until you land the right role",
    ],
    icon: "placement",
    priceINR: 24999,
  },
];

export function serviceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

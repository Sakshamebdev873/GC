export type Plan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export const plans: Plan[] = [
  {
    name: "Starter",
    price: "$149",
    cadence: "one-time",
    description: "A single focused session to fix your biggest blocker.",
    features: [
      "1 resume or LinkedIn review",
      "Written feedback + revision",
      "48-hour turnaround",
    ],
    cta: "Book Starter",
  },
  {
    name: "Job Search Accelerator",
    price: "$499",
    cadence: "one-time",
    description: "The most popular package — everything you need for an active search.",
    features: [
      "Resume + LinkedIn overhaul",
      "2 mock interview sessions",
      "Personalized job search strategy",
      "4 weeks of email support",
    ],
    highlighted: true,
    cta: "Book Accelerator",
  },
  {
    name: "Career Coaching",
    price: "$899",
    cadence: "3 months",
    description: "Ongoing 1:1 coaching for career transitions or senior-level searches.",
    features: [
      "Everything in Accelerator",
      "Biweekly 1:1 coaching calls",
      "Salary negotiation support",
      "Unlimited async feedback",
    ],
    cta: "Book Coaching",
  },
];

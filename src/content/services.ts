export type Service = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  outcomes: string[];
  icon: "resume" | "linkedin" | "interview" | "strategy";
};

export const services: Service[] = [
  {
    slug: "resume-review",
    title: "Resume & Cover Letter Review",
    summary: "Turn your resume into a document that gets past screeners and lands interviews.",
    description:
      "We rebuild your resume around the roles you actually want — clear achievements, ATS-friendly formatting, and language that speaks to hiring managers, not just keyword filters.",
    outcomes: [
      "ATS-optimized formatting and structure",
      "Achievement-focused bullet points with real metrics",
      "Tailored versions for your target roles",
    ],
    icon: "resume",
  },
  {
    slug: "linkedin-optimization",
    title: "LinkedIn Optimization",
    summary: "Make your profile work for you — even when you're not actively applying.",
    description:
      "A stronger LinkedIn presence means recruiters find you first. We optimize your headline, summary, and experience section, and show you how to build visibility in your industry.",
    outcomes: [
      "Recruiter-optimized headline and summary",
      "Keyword strategy for your target industry",
      "Guidance on building a visible, active profile",
    ],
    icon: "linkedin",
  },
  {
    slug: "interview-coaching",
    title: "Interview Coaching",
    summary: "Walk into every interview prepared, confident, and ready for the hard questions.",
    description:
      "Live mock interviews with real feedback, tailored to your target companies and roles — behavioral, technical, and case-style formats covered.",
    outcomes: [
      "1:1 mock interviews with actionable feedback",
      "Frameworks for behavioral and situational questions",
      "Salary negotiation guidance",
    ],
    icon: "interview",
  },
  {
    slug: "career-strategy",
    title: "Career & Job Search Strategy",
    summary: "A clear plan for what to apply to, how, and where — not just spray-and-pray.",
    description:
      "One-on-one coaching to map your target roles, build a job search system, and navigate career transitions with a plan instead of guesswork.",
    outcomes: [
      "Personalized job search roadmap",
      "Target company and role identification",
      "Ongoing accountability check-ins",
    ],
    icon: "strategy",
  },
];

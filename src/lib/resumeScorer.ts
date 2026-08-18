/**
 * Demo-mode resume "analysis" — deterministic mock scoring, not real AI or
 * document parsing. The uploaded file's name and size seed the result so
 * the same file always produces the same demo output (rather than a new
 * random result on every click, which would look broken). Clearly labeled
 * as a demo in the UI — see docs/architecture/future-schema.md.
 */

const SUGGESTION_POOL = [
  "Add measurable outcomes to your bullet points (\"increased X by Y%\") instead of just listing responsibilities.",
  "Move your skills section above education — ATS parsers weight the top third of the page more heavily.",
  "Remove the objective paragraph at the top; it repeats what your summary already says.",
  "Use standard section headings (\"Experience\", \"Education\", \"Skills\") — creative headings can confuse ATS parsers.",
  "Trim your resume to one page if you have under 5 years of experience.",
  "Spell out acronyms the first time you use them — some ATS keyword matches are exact-string.",
  "Replace passive phrasing (\"was responsible for\") with active verbs (\"led\", \"built\", \"shipped\").",
  "Add a dedicated skills line matching the exact keywords from job postings you're targeting.",
  "Make sure your contact info and links are in the body text, not just a header/footer image ATS can't read.",
  "Group related projects under one role instead of listing each as a separate entry.",
];

export type ResumeAnalysisResult = {
  score: number;
  suggestions: string[];
  recommendedPackageSlug: string;
};

function seedFrom(name: string, size: number): number {
  let hash = 0;
  const input = `${name}:${size}`;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function analyzeResume(fileName: string, fileSize: number): ResumeAnalysisResult {
  const seed = seedFrom(fileName, fileSize);

  // Score in a plausible 40-92 range — avoids implying false precision at
  // the extremes (nobody scores a real ATS check at 0 or 100).
  const score = 40 + (seed % 53);

  // Deterministically pick 3 distinct suggestions from the pool using the
  // seed, so results are stable per file but vary across files.
  const suggestions: string[] = [];
  let cursor = seed;
  while (suggestions.length < 3) {
    cursor = (cursor * 1103515245 + 12345) >>> 0;
    const candidate = SUGGESTION_POOL[cursor % SUGGESTION_POOL.length];
    if (!suggestions.includes(candidate)) suggestions.push(candidate);
  }

  // Lower score -> foundational help; higher score -> the resume itself is
  // in decent shape, so point toward interview/placement-stage packages.
  const recommendedPackageSlug =
    score < 55
      ? "resume-linkedin"
      : score < 70
        ? "career-acceleration"
        : score < 85
          ? "career-transformation"
          : "premium-placement";

  return { score, suggestions, recommendedPackageSlug };
}

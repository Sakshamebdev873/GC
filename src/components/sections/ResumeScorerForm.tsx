"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

type Result = {
  score: number;
  suggestions: string[];
  recommendedPackage: { name: string; slug: string } | null;
};

type Status = "idle" | "submitting" | "success" | "error";

function scoreColor(score: number): string {
  if (score >= 75) return "text-success";
  if (score >= 55) return "text-accent-dark";
  return "text-red-600";
}

function scoreBarColor(score: number): string {
  if (score >= 75) return "bg-success";
  if (score >= 55) return "bg-accent";
  return "bg-red-500";
}

export function ResumeScorerForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;

    setStatus("submitting");
    setError(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await fetch("/api/resume-scorer", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    setStatus("idle");
    setError(null);
  }

  if (status === "success" && result) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Your ATS-style score (demo)
            </p>
            <p className={`mt-1 font-serif text-5xl font-medium ${scoreColor(result.score)}`}>
              {result.score}
              <span className="text-2xl text-muted">/100</span>
            </p>
          </div>
          <Button variant="ghost" onClick={reset}>
            Try another file
          </Button>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface">
          <div
            className={`h-full rounded-full ${scoreBarColor(result.score)}`}
            style={{ width: `${result.score}%` }}
          />
        </div>

        <h3 className="mt-8 font-serif text-lg font-medium text-primary">Suggestions</h3>
        <ul className="mt-3 space-y-2.5">
          {result.suggestions.map((s) => (
            <li key={s} className="flex items-start gap-2.5 text-sm text-foreground/90">
              <span className="mt-0.5 text-accent-dark">→</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>

        {result.recommendedPackage && (
          <div className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-5">
            <p className="text-sm font-semibold text-primary">
              Based on this score, we&apos;d recommend: {result.recommendedPackage.name}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button href={`/services#${result.recommendedPackage.slug}`} className="!px-5 !py-2.5">
                See this package
              </Button>
              <Button href="/book-a-call" variant="ghost" className="!px-5 !py-2.5">
                Book a Free Call
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-8">
      <label htmlFor="resume" className="text-sm font-medium text-foreground">
        Resume file
      </label>
      <input
        id="resume"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mt-2 w-full rounded-lg border border-border px-4 py-2.5 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-surface file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-primary"
      />
      <p className="mt-1.5 text-xs text-muted">PDF, DOC, or DOCX — 5MB max.</p>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <Button type="submit" className="mt-6 w-full" disabled={!file || status === "submitting"}>
        {status === "submitting" ? "Analyzing…" : "Analyze My Resume"}
      </Button>
    </form>
  );
}

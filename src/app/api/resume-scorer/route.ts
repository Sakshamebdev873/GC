import { NextResponse } from "next/server";
import { analyzeResume } from "@/lib/resumeScorer";
import { prisma } from "@/lib/prisma";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const file = formData.get("resume");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Please choose a resume file to upload." }, { status: 422 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File is too large — 5MB max." }, { status: 422 });
  }

  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return NextResponse.json({ error: "Please upload a PDF, DOC, or DOCX file." }, { status: 422 });
  }

  // Demo mode: the file's contents are never read or stored — only its name
  // and size seed a deterministic mock result. See src/lib/resumeScorer.ts.
  const result = analyzeResume(file.name, file.size);

  const recommendedPackage = await prisma.package
    .findUnique({ where: { slug: result.recommendedPackageSlug } })
    .catch(() => null);

  try {
    await prisma.resumeAnalysis.create({
      data: {
        fileRef: file.name,
        atsScore: result.score,
        suggestions: JSON.stringify(result.suggestions),
        recommendedPackageId: recommendedPackage?.id,
      },
    });
  } catch (err) {
    console.error("[resume-scorer] Demo DB write failed (non-fatal):", err);
  }

  return NextResponse.json({
    score: result.score,
    suggestions: result.suggestions,
    recommendedPackage: recommendedPackage
      ? { name: recommendedPackage.name, slug: recommendedPackage.slug }
      : null,
  });
}

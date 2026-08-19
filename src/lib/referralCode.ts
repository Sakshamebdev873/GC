// Generates a shareable referral code for a newly converted client. Not
// cryptographically sensitive — collisions are handled by the caller
// retrying against Referral.code's unique constraint (see
// src/app/api/admin/convert-lead/route.ts).

function namePrefix(name: string): string {
  const firstWord = name.trim().split(/\s+/)[0] ?? "";
  const letters = firstWord.toUpperCase().replace(/[^A-Z]/g, "");
  return letters.slice(0, 8) || "GC";
}

export function generateReferralCode(clientName: string): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${namePrefix(clientName)}${suffix}`;
}

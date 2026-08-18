export type LeadFormInput = {
  name: string;
  email: string;
  message: string;
  /** Optional — friend's referral code. Reward logic isn't built yet; this
   * just captures attribution so a future referrals table has the data. */
  referralCode?: string;
};

export type ValidationErrors = Partial<Record<keyof LeadFormInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLeadForm(input: LeadFormInput): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!input.name.trim()) errors.name = "Name is required.";
  if (!input.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!input.message.trim()) errors.message = "Tell us a bit about your goals.";

  return errors;
}

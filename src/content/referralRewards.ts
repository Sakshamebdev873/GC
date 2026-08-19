// Single source of truth for referral reward types. Mind Loop asked that
// reward types be configurable rather than hardcoded — adding or renaming a
// type is a one-object edit here, not a schema migration: `Referral.rewardType`
// in prisma/schema.prisma is a plain String, validated against this list at
// the application layer instead of a DB enum.

export type ReferralRewardType = {
  id: string;
  label: string;
  description: string;
};

export const referralRewardTypes: ReferralRewardType[] = [
  {
    id: "free_session",
    label: "Free Session",
    description:
      "One complimentary 1:1 coaching session added to the referrer's active package.",
  },
  {
    id: "bonus_service",
    label: "Bonus Service / Upgrade",
    description:
      "A bonus add-on service, or a one-tier upgrade on the referrer's current package.",
  },
  {
    id: "extended_timeline",
    label: "Extended Timeline",
    description:
      "The referrer's active package duration is extended by an agreed number of days.",
  },
];

export const DEFAULT_REFERRAL_REWARD_TYPE_ID = referralRewardTypes[0].id;

export function isValidReferralRewardTypeId(id: string): boolean {
  return referralRewardTypes.some((r) => r.id === id);
}

export function rewardTypeLabel(id: string): string {
  return referralRewardTypes.find((r) => r.id === id)?.label ?? id;
}

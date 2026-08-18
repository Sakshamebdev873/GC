import { Service } from "@/content/services";

const paths: Record<Service["icon"], string> = {
  resume: "M9 12h6m-6 4h6M9 8h6M6 4h12a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z",
  acceleration: "M3 17l6-6 4 4 8-8M15 6h6v6",
  transformation: "M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0114-5M20 14a8 8 0 01-14 5",
  placement: "M6 21V3M6 4h12l-3 4 3 4H6",
};

export function ServiceIcon({ icon }: { icon: Service["icon"] }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[icon]} />
    </svg>
  );
}

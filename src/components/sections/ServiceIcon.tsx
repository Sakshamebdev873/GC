import { Service } from "@/content/services";

const paths: Record<Service["icon"], string> = {
  resume: "M9 12h6m-6 4h6M9 8h6M6 4h12a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z",
  linkedin:
    "M4 4h16v16H4V4zm3.5 4.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM7 10v7m4-7v7m0-4c0-1.5 1-2.5 2.5-2.5S16 11.5 16 13v4",
  interview:
    "M8 10h8M8 14h5m5-8H3v12h4l3 3 3-3h4V6z",
  strategy: "M4 19h16M6 15l4-4 3 3 5-5M18 6h2v2",
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

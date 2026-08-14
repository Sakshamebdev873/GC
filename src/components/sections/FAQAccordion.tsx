"use client";

import { useState } from "react";
import { faqs } from "@/content/faq";

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-white">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.question}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-primary">{faq.question}</span>
              <span
                className={`shrink-0 text-accent-dark transition-transform ${isOpen ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-5 text-sm text-muted leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

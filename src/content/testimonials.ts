export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  result: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Priya S.",
    role: "Product Analyst → Product Manager",
    quote:
      "My resume had been getting silent rejections for months. After the rewrite and two mock interviews, I had three offers in six weeks.",
    result: "3 offers in 6 weeks",
  },
  {
    name: "Daniel K.",
    role: "New Grad, Software Engineering",
    quote:
      "I didn't know how to talk about my projects in interviews. The coaching sessions gave me a framework I still use today.",
    result: "Landed first full-time role",
  },
  {
    name: "Amara O.",
    role: "Marketing Manager, Career Switcher",
    quote:
      "Switching industries felt impossible until we built an actual strategy instead of just applying everywhere.",
    result: "Successfully switched industries",
  },
];

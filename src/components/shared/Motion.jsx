import { motion } from "framer-motion";

// Shared, calm Wabi-Sabi motion primitives — slow, soft, minimal.

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// A section wrapper that fades up when scrolled into view
export function FadeUp({ children, className = "", delay = 0, as = "div" }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

// Section heading block: eyebrow + title + optional lead paragraph
export function SectionHeading({ eyebrow, title, lead, align = "left" }) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";
  return (
    <FadeUp className={`max-w-2xl ${alignCls}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="heading-lg">{title}</h2>
      {lead && <p className="body-muted mt-6">{lead}</p>}
    </FadeUp>
  );
}

export function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

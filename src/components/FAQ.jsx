import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading, FadeUp } from "./shared/Motion.jsx";
import { faqs } from "../data/faqs.js";

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="border-b border-sand">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-lg text-forest sm:text-xl">{item.q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 text-xl font-light text-gold"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="body-muted pb-6 pr-10 text-sm">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="section bg-linen">
      <div className="section-inner grid gap-14 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading
          eyebrow="Questions"
          title="Asked, answered, honestly"
          lead="Clear answers about what you're buying today and what remains a planned vision."
        />

        <FadeUp delay={0.1}>
          {faqs.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </FadeUp>
      </div>
    </section>
  );
}

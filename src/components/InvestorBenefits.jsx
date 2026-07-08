import { motion } from "framer-motion";
import { SectionHeading, stagger, fadeUp } from "./shared/Motion.jsx";
import { benefits } from "../data/benefits.js";

export default function InvestorBenefits() {
  return (
    <section id="benefits" className="section bg-paper">
      <div className="section-inner">
        <SectionHeading
          eyebrow="For Investors"
          title="Why enter now"
          lead="A clear-eyed case for early entry — grounded in land, progress and scarcity, not promises. No returns are guaranteed."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              variants={fadeUp}
              className="card group px-8 py-9 transition-shadow duration-500 hover:shadow-lift"
            >
              <span className="block h-px w-10 bg-gold transition-all duration-500 group-hover:w-16" />
              <h3 className="mt-5 font-display text-2xl text-forest">{b.title}</h3>
              <p className="body-muted mt-3 text-sm">{b.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { SectionHeading, stagger, fadeUp } from "./shared/Motion.jsx";
import { whyAttappadi } from "../data/whyAttappadi.js";

export default function WhyAttappadi() {
  return (
    <section id="why" className="section bg-forest text-paper">
      <div className="section-inner">
        <div className="max-w-2xl">
          <span className="eyebrow !text-goldsoft">The Place</span>
          <h2 className="font-display text-3xl font-light leading-snug text-paper sm:text-4xl md:text-5xl">
            Why Attappadi
          </h2>
          <p className="mt-6 text-base font-light leading-relaxed text-paper/70">
            Some places cannot be replicated. Attappadi is a valley held between mountain
            ranges — quiet, green, and still largely untouched. That is the land AKASA is
            built on.
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {whyAttappadi.map((item, i) => (
            <motion.div key={item.title} variants={fadeUp} className="border-t border-paper/15 pt-6">
              <p className="font-display text-lg text-goldsoft">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-2xl text-paper">{item.title}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-paper/65">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

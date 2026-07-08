import { motion } from "framer-motion";
import { SectionHeading, stagger, fadeUp } from "./shared/Motion.jsx";
import { amenityGroups } from "../data/amenities.js";

export default function Amenities() {
  return (
    <section id="amenities" className="section bg-linen">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Phase 2 Concept"
          title="Planned Future Resort Amenities"
          lead="Amenities planned around the lots as part of the future resort vision — subject to approvals and development timelines."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {amenityGroups.map((g) => (
            <motion.div key={g.group} variants={fadeUp} className="card px-8 py-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-moss/10 text-lg">
                  {g.icon}
                </span>
                <h3 className="font-display text-2xl text-forest">{g.group}</h3>
              </div>
              <ul className="mt-5 space-y-2.5">
                {g.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-charcoal/75">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

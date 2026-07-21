import { motion } from "framer-motion";
import { SectionHeading, stagger, fadeUp } from "./shared/Motion.jsx";
import { amenityGroups } from "../data/amenities.js";

// Thin-line icons, drawn to match the site's calm luxury palette
const iconPaths = {
  wellness: (
    // Lotus bloom over a shallow bowl
    <>
      <path d="M12 14c-1.9-1.7-2.4-4.7 0-7 2.4 2.3 1.9 5.3 0 7z" />
      <path d="M12 14c-2.6.6-5.3-.4-6.7-3 2.7-1.2 5.4-.2 6.7 3z" />
      <path d="M12 14c2.6.6 5.3-.4 6.7-3-2.7-1.2-5.4-.2-6.7 3z" />
      <path d="M4.5 15.8c1.6 2.8 4.3 4.2 7.5 4.2s5.9-1.4 7.5-4.2" />
    </>
  ),
  dining: (
    // Fork & knife
    <>
      <path d="M6 3v5.5a2.5 2.5 0 0 0 5 0V3" />
      <path d="M8.5 3v18" />
      <path d="M18.5 3a4 4 0 0 0-4 4v5.5c0 1.1.9 2 2 2h2V3z" />
      <path d="M18.5 14.5V21" />
    </>
  ),
  adventure: (
    // Valley peaks under the sun
    <>
      <path d="m3 18 5.5-9.5L13 15l2.5-4L21 18H3z" />
      <circle cx="17.5" cy="6" r="1.8" />
    </>
  ),
  family: (
    // Two adults with a child between them
    <>
      <circle cx="8.5" cy="7.5" r="2.2" />
      <circle cx="15.5" cy="7.5" r="2.2" />
      <circle cx="12" cy="12.5" r="1.8" />
      <path d="M4 18.5c0-2.8 2-4.5 4.5-4.5.9 0 1.8.2 2.5.7" />
      <path d="M20 18.5c0-2.8-2-4.5-4.5-4.5-.9 0-1.8.2-2.5.7" />
      <path d="M9.5 18.5c0-2 1.1-3.2 2.5-3.2s2.5 1.2 2.5 3.2" />
    </>
  ),
  hospitality: (
    // Concierge service bell
    <>
      <path d="M5 16a7 7 0 0 1 14 0" />
      <circle cx="12" cy="7.5" r="1.1" />
      <path d="M4 16h16" />
      <path d="M6.5 19h11" />
    </>
  ),
  safety: (
    // Shield with a first-aid cross
    <>
      <path d="M12 3.5 18.5 6v4.8c0 4.3-2.7 8-6.5 9.7-3.8-1.7-6.5-5.4-6.5-9.7V6L12 3.5z" />
      <path d="M12 8.8v6" />
      <path d="M9 11.8h6" />
    </>
  ),
};

const AmenityIcon = ({ name }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    {iconPaths[name]}
  </svg>
);

export default function Amenities() {
  return (
    <section id="amenities" className="section bg-linen">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Resort Amenities"
          title="Four Star Class Resort Amenities"
          lead="Amenities built around the lots to four-star class standards — wellness, dining, adventure, family, hospitality, and round-the-clock safety and utilities."
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
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-moss/10 text-gold">
                  <AmenityIcon name={g.icon} />
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

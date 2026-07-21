import { motion } from "framer-motion";
import { SectionHeading, stagger, fadeUp } from "./shared/Motion.jsx";
import { Parallax } from "./shared/ScrollFx.jsx";
import { typologies } from "../data/typologies.js";

export default function Typologies() {
  return (
    <section id="typologies" className="section bg-paper">
      <div className="section-inner">
        <SectionHeading
          eyebrow="The Cottages"
          title="Themed Cottages"
          lead="Three themed cottage designs — built for consistency across the retreat and maintained to top-class resort standards."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-8 lg:grid-cols-3"
        >
          {typologies.map((t) => (
            <motion.article
              key={t.id}
              variants={fadeUp}
              className="card group overflow-hidden transition-shadow duration-500 hover:shadow-lift"
            >
              <div className="relative h-60 overflow-hidden">
                <Parallax speed={0.08} className="h-full">
                  <img
                    src={t.image}
                    alt={`${t.name} — themed cottage`}
                    className="h-[115%] w-full -translate-y-[7%] object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                </Parallax>
                <span className="absolute left-4 top-4 rounded-full bg-ink/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-paper backdrop-blur-sm">
                  Themed Cottage
                </span>
              </div>

              <div className="px-7 py-7">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl text-forest">{t.name}</h3>
                  <span className="text-sm font-medium text-gold">{t.area}</span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-widest2 text-charcoal/50">
                  {t.config}
                </p>

                <ul className="mt-5 space-y-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-charcoal/75">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 border-t border-sand pt-4 text-xs font-medium uppercase tracking-wider text-moss">
                  {t.bestFor}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

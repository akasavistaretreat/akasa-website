import { motion } from "framer-motion";
import { SectionHeading, stagger, fadeUp } from "./shared/Motion.jsx";
import { Parallax } from "./shared/ScrollFx.jsx";
import { galleryItems } from "../data/gallery.js";

export default function Gallery() {
  return (
    <section id="gallery" className="section bg-paper">
      <div className="section-inner">
        <SectionHeading
          eyebrow="The Land Today"
          title="Mist, hills and honest ground"
          lead="Photographs of the valley and the work in progress — the land as it is, not as a render."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4"
        >
          {galleryItems.map((img, i) => (
            <motion.figure
              key={img.src}
              variants={fadeUp}
              className={`group relative overflow-hidden rounded-card bg-sand shadow-card ${
                img.span === "wide" ? "col-span-2" : ""
              } ${img.span === "tall" ? "row-span-2" : ""}`}
            >
              {/* Parallax drift — alternating speeds give the grid depth */}
              <Parallax speed={i % 2 === 0 ? 0.07 : 0.11} className="h-full">
                <img
                  src={img.src}
                  alt={img.caption}
                  loading="lazy"
                  className="h-[115%] w-full -translate-y-[7%] object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                />
              </Parallax>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent px-4 pb-3 pt-10 text-xs font-light text-paper opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {img.caption}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

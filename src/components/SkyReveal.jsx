import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

/**
 * Cinematic scroll-scrub reveal — simulates descending through cloud cover
 * into the valley, using the aerial masterplan render. Sits directly below
 * the Hero section.
 *
 * The Hero ends in a white cloud veil; this section opens under full cloud
 * cover and clears it, so the two read as one continuous camera move.
 * Progress is spring-smoothed and the zoom is spread across most of the
 * (taller) scroll track so it feels slow and fluid rather than snappy.
 */
export default function SkyReveal() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Spring-smoothed progress — transforms glide toward the scroll position
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.5,
    restDelta: 0.001,
  });

  // Slow descent: zoom resolves across 75% of the track instead of 40%
  const scale = useTransform(smooth, [0, 0.75], reduced ? [1, 1] : [1.22, 1.02]);
  const imgY = useTransform(smooth, [0, 0.75], reduced ? [0, 0] : [18, 0]);

  // Full cloud cover at the start — continues the hero's white veil,
  // then burns off in the first third of the descent
  const cloudCoverOpacity = useTransform(smooth, [0, 0.32], [1, 0]);

  // Lingering cloud wisps in the corners, clearing a little later
  const fogTopOpacity = useTransform(smooth, [0.1, 0.45], [0.4, 0]);
  const fogTopY = useTransform(smooth, [0.1, 0.5], [0, -100]);
  const fogLeftOpacity = useTransform(smooth, [0.12, 0.48], [0.42, 0]);
  const fogLeftX = useTransform(smooth, [0.12, 0.55], [0, -140]);
  const fogRightOpacity = useTransform(smooth, [0.12, 0.48], [0.38, 0]);
  const fogRightX = useTransform(smooth, [0.12, 0.55], [0, 140]);

  const captionOpacity = useTransform(smooth, [0.12, 0.3, 0.88, 1], [0, 1, 1, 0]);
  const captionY = useTransform(smooth, [0.12, 0.3], [18, 0]);
  const eyebrowOpacity = useTransform(smooth, [0.1, 0.22], [0, 1]);

  return (
    <section ref={ref} className="relative h-[200vh] bg-forest">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Aerial render */}
        <motion.div style={{ scale, y: imgY }} className="absolute inset-0">
          <img
            src="/images/masterplan-aerial.jpg"
            alt="Aerial rendered view of the planned AKASA Valley Retreat masterplan"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Full cloud cover — seamless handoff from the hero's ending veil */}
        <motion.div
          style={{ opacity: cloudCoverOpacity }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white/85 to-white/60"
        />

        {/* Cloud wisps — corner accents that linger after the cover clears */}
        <motion.div
          style={{ opacity: fogTopOpacity, y: fogTopY }}
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/80 to-transparent blur-2xl"
        />
        <motion.div
          style={{ opacity: fogLeftOpacity, x: fogLeftX }}
          className="pointer-events-none absolute left-0 top-0 h-1/2 w-1/2 bg-gradient-to-br from-white/70 to-transparent blur-2xl"
        />
        <motion.div
          style={{ opacity: fogRightOpacity, x: fogRightX }}
          className="pointer-events-none absolute right-0 top-0 h-1/2 w-1/2 bg-gradient-to-bl from-white/65 to-transparent blur-2xl"
        />

        {/* Legibility washes — subtle, don't obscure the image */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-forest/70 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/5 via-transparent to-ink/65" />

        {/* Caption */}
        <motion.div
          style={{ opacity: captionOpacity, y: captionY }}
          className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-6 pb-16 text-center sm:px-10 sm:pb-20"
        >
          <motion.span style={{ opacity: eyebrowOpacity }} className="eyebrow !text-goldsoft">
            From Above
          </motion.span>
          <h2 className="font-display text-3xl font-light text-paper sm:text-4xl md:text-5xl">
            Descending Into the Valley
          </h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-paper/75 sm:text-base">
            A conceptual aerial view of the planned future resort vision at AKASA Valley
            Retreat — cottages, pools and shared amenities as currently envisioned.
          </p>
          <p className="mt-2 text-[11px] font-light uppercase tracking-widest2 text-paper/45">
            Artist&rsquo;s impression only — subject to approvals and development timelines
          </p>
        </motion.div>
      </div>
    </section>
  );
}

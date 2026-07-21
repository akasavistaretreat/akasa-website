import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useVideoScrub } from "./shared/ScrollFx.jsx";
import { videoSrc } from "./shared/media.js";

/**
 * CinematicShowcase — Apple-style pinned film moment.
 *
 * A full-screen sticky stage. As the visitor scrolls, the pool-villa clip
 * scrubs forward, crossfades into the cottage clip, and large typographic
 * beats fade through — one continuous cinematic move.
 *
 * Clips (Higgsfield, re-encoded keyframe-per-frame):
 *   /videos/pool-villa.mp4      — slow dolly-in across the pool at dusk
 *   /videos/cottage-glide.mp4   — lateral glide across the suite courtyard
 * Falls back to poster images when videos are missing or when the visitor
 * prefers reduced motion.
 */

function Beat({ progress, range, eyebrow, title, copy }) {
  const opacity = useTransform(
    progress,
    [range[0], range[0] + 0.07, range[1] - 0.07, range[1]],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [range[0], range[0] + 0.07], [26, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-6 pb-16 text-center sm:px-10 sm:pb-24 [@media(max-height:680px)]:pb-8"
    >
      <span className="eyebrow !text-goldsoft">{eyebrow}</span>
      <h2 className="font-display text-3xl font-light text-paper sm:text-5xl md:text-6xl [@media(max-height:680px)]:!text-2xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-relaxed text-paper/80 sm:text-base">
        {copy}
      </p>
    </motion.div>
  );
}

export default function CinematicShowcase() {
  const ref = useRef(null);
  const villaRef = useRef(null);
  const cottageRef = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.5,
    restDelta: 0.001,
  });

  // Each clip scrubs across its half of the pinned track
  const villaProgress = useTransform(smooth, [0.02, 0.5], [0, 1]);
  const cottageProgress = useTransform(smooth, [0.5, 0.98], [0, 1]);
  useVideoScrub(villaProgress, villaRef, !reduced);
  useVideoScrub(cottageProgress, cottageRef, !reduced);

  // Crossfade between the two films at the midpoint
  const cottageOpacity = useTransform(smooth, [0.46, 0.54], [0, 1]);
  const villaScale = useTransform(smooth, [0, 0.5], reduced ? [1, 1] : [1.06, 1]);
  const cottageScale = useTransform(smooth, [0.5, 1], reduced ? [1, 1] : [1.06, 1]);

  const videoProps = {
    muted: true,
    playsInline: true,
    preload: "auto",
    autoPlay: reduced || undefined,
    loop: reduced || undefined,
  };

  return (
    <section ref={ref} aria-label="Planned resort film" className="relative h-[340vh] bg-ink">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Film 1 — Pool Villa dolly-in.
            The poster <img> sits behind the video so there is never a
            black frame while the decoder catches up. */}
        <motion.div style={{ scale: villaScale }} className="absolute inset-0">
          <img
            src="/images/pool-villa.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          <video
            ref={villaRef}
            poster="/images/pool-villa.jpg"
            className="relative h-full w-full object-cover"
            {...videoProps}
          >
            <source src={videoSrc("pool-villa")} type="video/mp4" />
          </video>
        </motion.div>

        {/* Film 2 — Cottage courtyard glide */}
        <motion.div
          style={{ opacity: cottageOpacity, scale: cottageScale }}
          className="absolute inset-0"
        >
          <img
            src="/images/suite-room.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          <video
            ref={cottageRef}
            poster="/images/suite-room.jpg"
            className="relative h-full w-full object-cover"
            {...videoProps}
          >
            <source src={videoSrc("cottage-glide")} type="video/mp4" />
          </video>
        </motion.div>

        {/* Legibility washes */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/60 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/70" />

        {/* Typographic beats */}
        <Beat
          progress={smooth}
          range={[0.06, 0.3]}
          eyebrow="The Resort"
          title="Designed around stillness."
          copy="A valley retreat of pool villas, suites and themed cottages — shaped by the contours of Attappadi itself."
        />
        <Beat
          progress={smooth}
          range={[0.3, 0.5]}
          eyebrow="Pool Villa — Themed Cottage"
          title="1,230 sq.ft of private calm."
          copy="Two bedrooms, a private pool and an outdoor deck facing the hills. An artist's impression of the design."
        />
        <Beat
          progress={smooth}
          range={[0.54, 0.78]}
          eyebrow="Suites & Cottages — Themed Designs"
          title="Every window, a valley."
          copy="Suite rooms with private jacuzzis and studio cottages with quiet sit-outs — designed for couples, families and solo travellers."
        />
        <Beat
          progress={smooth}
          range={[0.78, 0.97]}
          eyebrow="Limited Hill-Top Plots"
          title="Own the land beneath it."
          copy="The plot is your entry. The resort rising around it is the future it sits inside. 15 of 39 lots remain."
        />
      </div>
    </section>
  );
}

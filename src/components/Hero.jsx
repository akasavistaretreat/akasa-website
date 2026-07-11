import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { scrollToId } from "./shared/Motion.jsx";
import { videoSrc } from "./shared/media.js";
import { site } from "../data/site.js";

const highlights = [
  { value: "39", label: "Total Lots" },
  { value: "24", label: "Sold" },
  { value: "15", label: "Available" },
  { value: "6 / 9", label: "Progress Level" },
  { value: "Aug 2026", label: "Cottage Units Approval" },
  { value: "Apr 2028", label: "Resort Launch Planned" },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  // Pause the ambient loop once the hero scrolls out of view — a playing
  // video keeps the decoder busy even when hidden, stealing scroll budget
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Progress through the tall hero section (0 at top, 1 when scrolled past)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Spring-smoothed progress — visual transforms ease toward the scroll
  // position instead of snapping to it, so fast flicks stay fluid
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.4,
    restDelta: 0.001,
  });

  // Content gently lifts and fades as the visitor scrolls deeper —
  // held longer (to 0.9) so there is no empty stretch before the reveal
  const contentOpacity = useTransform(smooth, [0, 0.55, 0.9], [1, 1, 0]);
  const contentY = useTransform(smooth, [0, 0.9], [0, -60]);
  const hintOpacity = useTransform(smooth, [0, 0.12], [1, 0]);
  // Night veil: the hero darkens to sky at its end, and SkyReveal opens
  // in space — one continuous "leave the valley, see the Earth" move
  const veilOpacity = useTransform(smooth, [0.85, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="relative h-[150vh] bg-forest">
      {/* Pinned viewport — stays fixed while the section scrolls beneath */}
      <div className="sticky top-0 flex h-screen flex-col justify-end overflow-hidden">
        {/* Background video: slow ambient loop — plays on the media pipeline,
            costs nothing while scrolling (scrubbing is reserved for the
            pinned showcase sections) */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-60"
          muted
          playsInline
          preload="auto"
          poster="/images/hero-valley.jpg"
          autoPlay
          loop
        >
          <source src={videoSrc("hero-valley")} type="video/mp4" />
        </video>
        {/* Soft charcoal wash for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/20 to-ink/70" />
        {/* Night veil — darkens at the end of the hero and hands off to
            SkyReveal's opening shot of Earth from space */}
        <motion.div
          style={{ opacity: veilOpacity }}
          className="pointer-events-none absolute inset-0 bg-ink"
        />

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-40 sm:px-10"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="mb-5 text-xs font-medium uppercase tracking-widest2 text-goldsoft"
          >
            Attappadi · Agali · Kerala — Phase 1 Plot Offering
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl font-display text-4xl font-light leading-[1.15] text-paper sm:text-6xl md:text-7xl"
          >
            Own a Plot in a Future Luxury Valley Retreat
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="mt-6 max-w-xl text-base font-light leading-relaxed text-paper/80"
          >
            AKASA Valley Retreat is a nature-led investment opportunity in Attappadi, planned
            around wellness, luxury villas, eco-tourism, and future resort hospitality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <button onClick={() => scrollToId("contact")} className="btn bg-gold text-ink hover:bg-goldsoft">
              Enquire Now
            </button>
            <button
              onClick={() => scrollToId("contact")}
              className="btn border border-paper/40 text-paper hover:bg-paper/10"
            >
              Book a Site Visit
            </button>
            <a
              href={site.brochurePath}
              download
              className="btn border border-paper/25 text-paper/80 hover:bg-paper/10"
            >
              Download Brochure
            </a>
          </motion.div>

          {/* Highlight cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } } }}
            className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          >
            {highlights.map((h) => (
              <motion.div
                key={h.label}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                }}
                className="rounded-card border border-paper/15 bg-ink/35 px-4 py-4"
              >
                <p className="font-display text-xl text-goldsoft sm:text-2xl">{h.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-paper/70">{h.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="mt-8 text-[11px] font-light text-paper/50"
          >
            Planned future resort vision. Subject to approvals and development timelines.
          </motion.p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-6 items-start justify-center rounded-full border border-paper/40 pt-1.5"
          >
            <div className="h-2 w-1 rounded-full bg-goldsoft" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

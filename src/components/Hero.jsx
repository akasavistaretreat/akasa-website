import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { scrollToId } from "./shared/Motion.jsx";
import { useVideoSrc } from "./shared/media.js";
import { site } from "../data/site.js";

const highlights = [
  { value: "39", label: "Total Lots" },
  { value: "23", label: "Sold" },
  { value: "15", label: "Available" },
  { value: "6 / 9", label: "Progress Level" },
  { value: "Aug 2026", label: "Cottage Units Approval" },
  { value: "Apr 2028", label: "Resort Launch Planned" },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const heroSrc = useVideoSrc("hero-valley");

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

  return (
    // Fluid, self-fitting hero — no height breakpoints, so it behaves the
    // same on every aspect ratio. `min-h-svh` + `my-auto` centres the
    // content when it fits and lets it flow/grow when it doesn't (never
    // clipping or overlapping). The top padding always clears the fixed
    // navbar, and the heading scales with clamp() instead of snapping at
    // breakpoints.
    <section
      ref={sectionRef}
      className="relative flex min-h-svh flex-col overflow-hidden bg-forest"
    >
      {/* Background video: slow ambient loop */}
      <video
        ref={videoRef}
        key={heroSrc}
        className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-60"
        muted
        playsInline
        preload="auto"
        poster="/images/hero-valley.jpg"
        autoPlay
        loop
      >
        <source src={heroSrc} type="video/mp4" />
      </video>
      {/* Soft charcoal wash for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/20 to-ink/70" />

      {/* Content — vertically auto-centred (balanced on tall screens), with a
          top pad that always clears the navbar. When content is taller than
          the screen the auto margins collapse and it simply flows down. */}
      <div className="relative my-auto mx-auto w-full max-w-6xl px-6 pb-16 pt-28 sm:px-10 sm:pb-20 sm:pt-32">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="mb-5 text-xs font-medium uppercase tracking-widest2 text-goldsoft"
          >
            Attappadi · Agali · Kerala — Plots & Villa Plots
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl font-display text-[clamp(2rem,5.2vw,4.5rem)] font-light leading-[1.12] text-paper"
          >
            Own a Slice of Paradise in the Luxury Hill-Top Retreat
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="mt-4 max-w-xl text-sm font-light leading-relaxed text-paper/80 sm:mt-6 sm:text-base"
          >
            AKASA Valley Retreat is a nature-led investment opportunity in Attappadi, built
            around wellness, luxury villas, eco-tourism, and star-class resort hospitality.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.65 }}
            className="mt-3 text-xs font-medium uppercase tracking-widest2 text-goldsoft sm:mt-4 sm:text-sm"
          >
            Near Coimbatore, Anaikatti · By the Siruvani River
          </motion.p>

          {/* Price. A number is the single strongest qualifier on a plot
              landing page — it filters out browsers and gives serious buyers a
              reason to enquire instead of bouncing to ask "how much?".
              Editorial treatment rather than a bordered card: a hairline gold
              rule carries the emphasis, so the figure reads as a considered
              statement instead of a price sticker, which suits a retreat
              better than a badge would. Scarcity sits directly beneath so the
              two are read together. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-7 border-l border-gold/50 pl-5 sm:mt-9 sm:pl-6"
          >
            <span className="block text-[10px] font-medium uppercase tracking-widest2 text-goldsoft sm:text-[11px]">
              {site.pricing.eyebrow}
            </span>
            <span className="mt-1.5 flex items-baseline gap-2.5">
              <span className="font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-light leading-none text-paper">
                {site.pricing.from}
              </span>
              <span className="text-sm font-light text-paper/55">
                {site.pricing.qualifier}
              </span>
            </span>
            <span className="mt-2.5 block text-xs font-light text-paper/70 sm:text-sm">
              Only <span className="font-medium text-goldsoft">15 of 39</span> plots still
              available
            </span>
            <p className="mt-2.5 max-w-md text-[11px] font-light leading-relaxed text-paper/40">
              {site.pricing.note}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="mt-6 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3"
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
            {/* download alone isn't enough: iOS Safari ignores it and navigates
                away, losing the visitor's place. target=_blank keeps the page. */}
            <a
              href={site.brochurePath}
              download
              target="_blank"
              rel="noopener"
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
            className="-mx-6 mt-8 flex gap-2.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0 lg:grid-cols-6"
          >
            {highlights.map((h) => (
              <motion.div
                key={h.label}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                }}
                className="min-w-[124px] shrink-0 rounded-card border border-paper/15 bg-ink/35 px-3.5 py-3 sm:min-w-0 sm:shrink sm:px-4 sm:py-4"
              >
                <p className="font-display text-lg text-goldsoft sm:text-2xl">{h.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-paper/70 sm:text-[11px]">{h.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="mt-5 text-[11px] font-light text-paper/50 sm:mt-8"
          >
            Resort under active development. Details subject to approvals and development timelines.
          </motion.p>
        </div>

      {/* Scroll hint — sits at the very bottom of the hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
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
    </section>
  );
}

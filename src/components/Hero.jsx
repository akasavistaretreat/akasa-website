import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
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

  return (
    // Clean single-screen hero — no tall pinned scroll zone, so there is
    // never an empty stretch of video after the content. The next section
    // begins immediately below.
    <section
      ref={sectionRef}
      className="relative h-svh min-h-[600px] overflow-hidden bg-forest"
    >
      {/* Background video: slow ambient loop */}
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

      {/* Content column — anchored to the bottom on tall screens, and to the
          top on small / short screens so the heading never slides under the
          fixed navbar. */}
      <div className="relative flex h-full flex-col justify-end overflow-hidden max-md:justify-start [@media(max-height:740px)]:justify-start">
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-12 pt-28 sm:px-10 sm:pb-16 sm:pt-40 [@media(max-height:820px)]:!pt-24 [@media(max-height:820px)]:!pb-8 [@media(max-height:680px)]:!pt-24 [@media(max-height:680px)]:!pb-6">
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
            className="max-w-3xl font-display text-4xl font-light leading-[1.15] text-paper sm:text-6xl md:text-7xl [@media(max-height:820px)]:!text-5xl [@media(max-height:680px)]:!text-4xl"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="mt-6 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3"
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
            className="-mx-6 mt-8 flex gap-2.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0 lg:grid-cols-6 [@media(max-height:820px)]:!mt-6 [@media(max-height:680px)]:!mt-4"
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
            className="mt-5 text-[11px] font-light text-paper/50 sm:mt-8 [@media(max-height:820px)]:!mt-4 [@media(max-height:680px)]:!mt-3"
          >
            Resort under active development. Details subject to approvals and development timelines.
          </motion.p>
        </div>

        {/* Scroll hint — hidden on short screens where it would crowd the content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 [@media(max-height:760px)]:hidden"
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

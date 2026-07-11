import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { videoSrc } from "./shared/media.js";

/**
 * SkyReveal — the Earth dive, as a self-playing film.
 *
 * One continuous 15-second shot: planet Earth → India → the Western
 * Ghats near Coimbatore → Attappadi → the AKASA masterplan. The video
 * plays automatically (muted, looping) when the section is on screen
 * and pauses off screen. Location captions fade in and out in sync
 * with the film's timeline — no scroll scrubbing involved.
 *
 * /videos/earth-zoom.mp4 · 2560×1440 · lazy-loaded when the section
 * approaches the viewport. Falls back to the poster image if the video
 * is missing; under prefers-reduced-motion the poster shows instead.
 */

const STAGES = [
  {
    eyebrow: "Planet Earth",
    line: "One planet. One address worth finding.",
    from: 0.3,
    to: 2.8,
  },
  {
    eyebrow: "India",
    line: "The southern peninsula comes into view.",
    from: 3.2,
    to: 5.8,
  },
  {
    eyebrow: "The Western Ghats · Near Coimbatore",
    line: "A UNESCO-listed mountain range, minutes from the city.",
    from: 6.2,
    to: 8.6,
  },
  {
    eyebrow: "Attappadi · Agali · Kerala",
    line: "11.07° N · 76.62° E — a valley held by the hills.",
    from: 9.0,
    to: 11.2,
  },
];

const FINAL_FROM = 12.2;

export default function SkyReveal() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const reduced = useReducedMotion();

  const [loadVideo, setLoadVideo] = useState(false);
  const [stage, setStage] = useState(-1); // index into STAGES, -1 = none
  const [showFinal, setShowFinal] = useState(false);

  // Lazy-load the film shortly before the section scrolls into view,
  // then play/pause with visibility
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const loader = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideo(true);
          loader.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    loader.observe(section);

    const player = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      // The section is 250vh, so only ~40% can ever be visible at once —
      // keep the threshold low so playback covers the whole pinned hold
      { threshold: 0.1 }
    );
    player.observe(section);

    return () => {
      loader.disconnect();
      player.disconnect();
    };
  }, [reduced]);

  // Sync captions to the film's clock
  const onTimeUpdate = () => {
    const t = videoRef.current?.currentTime ?? 0;
    let idx = -1;
    for (let i = 0; i < STAGES.length; i++) {
      if (t >= STAGES[i].from && t <= STAGES[i].to) {
        idx = i;
        break;
      }
    }
    setStage(idx);
    setShowFinal(t >= FINAL_FROM);
  };

  return (
    // Taller track + sticky stage: the film stays pinned fullscreen while
    // ~1.5 viewports of scroll pass through — a natural "hold" that gives
    // people time to watch, without ever taking control of their scroll.
    <section ref={sectionRef} className="relative h-[250vh] bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Poster fallback behind the film — never a black frame */}
        <img
          src="/images/masterplan-aerial.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* The Earth-dive film */}
        {loadVideo && !reduced && (
          <video
            ref={videoRef}
            className="relative h-full w-full object-cover"
            muted
            playsInline
            loop
            preload="auto"
            poster="/images/masterplan-aerial.jpg"
            onTimeUpdate={onTimeUpdate}
          >
            <source src={videoSrc("earth-zoom")} type="video/mp4" />
          </video>
        )}

        {/* Vignette — keeps the frame premium, focuses the centre */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(10,14,12,0.5) 100%)",
          }}
        />

        {/* Cinematic letterbox bars — retract once the masterplan resolves */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[6vh] origin-top bg-ink transition-transform duration-1000 ${
            showFinal ? "scale-y-0" : "scale-y-100"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-[6vh] origin-bottom bg-ink transition-transform duration-1000 ${
            showFinal ? "scale-y-0" : "scale-y-100"
          }`}
        />

        {/* Journey stage captions — synced to the film */}
        {STAGES.map((s, i) => (
          <div
            key={s.eyebrow}
            className={`pointer-events-none absolute inset-x-0 bottom-24 text-center transition-all duration-700 sm:bottom-28 ${
              stage === i && !showFinal
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <span className="eyebrow !text-goldsoft drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
              {s.eyebrow}
            </span>
            <p className="mx-auto mt-2 max-w-xl px-6 font-display text-lg font-light text-paper/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.8)] sm:text-xl">
              {s.line}
            </p>
          </div>
        ))}

        {/* Bottom wash + final caption once the masterplan resolves */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/70 to-transparent transition-opacity duration-700 ${
            showFinal || reduced ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-6 pb-16 text-center transition-all duration-700 sm:px-10 sm:pb-20 ${
            showFinal || reduced
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          <span className="eyebrow !text-goldsoft">
            From Orbit to Attappadi
          </span>
          <h2 className="font-display text-3xl font-light text-paper sm:text-4xl md:text-5xl">
            The Masterplan, Unveiled
          </h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-paper/75 sm:text-base">
            The planned future resort vision at AKASA Valley Retreat — cottages, pools
            and shared amenities as currently envisioned.
          </p>
          <p className="mt-2 text-[11px] font-light uppercase tracking-widest2 text-paper/45">
            Artist&rsquo;s impression only — subject to approvals and development timelines
          </p>
        </div>
      </div>
    </section>
  );
}

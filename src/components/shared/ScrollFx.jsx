import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

/**
 * Scroll effects toolkit — cinematic, Higgsfield-video-ready.
 *
 * useVideoScrub : ties a <video>'s currentTime to a scroll progress value (0–1),
 *                 with a small lerp so scrubbing feels buttery, not steppy.
 * ScrubVideo    : an in-flow video that scrubs as it passes through the viewport.
 * Parallax      : wraps anything and drifts it vertically at a different speed.
 *
 * All effects respect prefers-reduced-motion (videos fall back to autoplay loop,
 * parallax disables itself).
 */

export function useVideoScrub(progress, videoRef, enabled = true) {
  const target = useRef(0);
  const raf = useRef(null);

  useMotionValueEvent(progress, "change", (v) => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;

    target.current = Math.min(Math.max(v, 0), 0.999) * video.duration;
    if (raf.current) return;

    const step = () => {
      const vid = videoRef.current;
      if (!vid) {
        raf.current = null;
        return;
      }
      const diff = target.current - vid.currentTime;
      if (Math.abs(diff) < 0.02) {
        vid.currentTime = target.current;
        raf.current = null;
        return;
      }
      vid.currentTime += diff * 0.25;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  });
}

/**
 * In-flow scroll-scrubbed video. As the element travels through the viewport,
 * the video plays forward/backward with the scroll.
 * If the video file is missing, the poster image shows instead — safe placeholder.
 */
export function ScrubVideo({ src, poster, className = "" }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 85%", "end 15%"],
  });
  useVideoScrub(scrollYProgress, videoRef, !reduced);

  return (
    <div ref={wrapRef} className={className}>
      <video
        ref={videoRef}
        className="block h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
        poster={poster}
        autoPlay={reduced || undefined}
        loop={reduced || undefined}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

/**
 * Subtle parallax drift. speed 0.1 ≈ gentle, 0.2 ≈ noticeable.
 * Place inside an overflow-hidden parent for a clean crop.
 */
export function Parallax({ children, speed = 0.12, className = "" }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [speed * 100, speed * -100]
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

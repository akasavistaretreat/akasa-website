/**
 * Responsive video source picker.
 *
 * Two kinds of video live on this site and they need different rules:
 *
 *   "cover" — full-bleed films (Hero, SkyReveal, CinematicShowcase). These sit
 *     in a viewport-sized box with object-cover, so what matters is the SHAPE
 *     of the viewport, not its width. A 16:9 film in a portrait phone frame
 *     shows ~26% of its width; a 9:16 film in a landscape frame is just as bad
 *     the other way. So we pick on aspect ratio: portrait-ish viewport gets the
 *     portrait "-mobile" cut, everything else keeps the landscape master.
 *     This also fixes tablets in portrait (iPad 0.75, Fold 0.80), which the old
 *     767px width rule sent to the landscape file.
 *
 *   "box" — videos in a fixed-ratio container (FutureVision's 4:3 frame). The
 *     container shape never changes, so the only reason to switch is bandwidth.
 *     Those stay on a plain width breakpoint.
 *
 * The choice is reactive: rotating a phone or resizing a window re-picks. Only
 * a boolean is stored, so the mobile URL bar sliding in and out (which nudges
 * innerHeight) can't cause churn — the ratio has to actually cross the
 * threshold. Call sites should key their <video> on the returned src so the
 * element remounts and the browser loads the new file.
 */
import { useEffect, useState } from "react";

/** Viewport w/h below this counts as portrait-ish. 0.85 keeps near-square
 *  foldables on the portrait cut while leaving 1:1-ish desktop windows alone. */
const PORTRAIT_MAX_RATIO = 0.85;
const SMALL_MAX_WIDTH = 767;

const prefersMobileCut = (mode) => {
  if (typeof window === "undefined") return false; // SSR / prerender: landscape
  return mode === "box"
    ? window.innerWidth <= SMALL_MAX_WIDTH
    : window.innerWidth / window.innerHeight < PORTRAIT_MAX_RATIO;
};

const build = (name, mobile) => `/videos/${name}${mobile ? "-mobile" : ""}.mp4`;

/** Non-reactive read — fine for one-shot use outside React. */
export const videoSrc = (name, mode = "cover") =>
  build(name, prefersMobileCut(mode));

/** Reactive source. Re-picks on resize / orientation change. */
export function useVideoSrc(name, mode = "cover") {
  const [mobile, setMobile] = useState(() => prefersMobileCut(mode));

  useEffect(() => {
    let frame = 0;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = prefersMobileCut(mode);
        setMobile((prev) => (prev === next ? prev : next));
      });
    };
    check(); // reconcile after hydration, in case SSR guessed
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, [mode]);

  return build(name, mobile);
}

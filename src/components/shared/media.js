/**
 * Responsive video source picker.
 *
 * Phones get "-mobile" variants: portrait-cropped (9:16, centre-framed)
 * and much smaller — e.g. earth-zoom is 6 MB instead of 23 MB — while
 * desktops keep the full 2K films. Decided once at load; a phone rotating
 * mid-session keeps its file, which is fine (both crops cover the frame).
 */
const isSmallScreen =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(max-width: 767px)").matches;

export const videoSrc = (name) =>
  `/videos/${name}${isSmallScreen ? "-mobile" : ""}.mp4`;

# Higgsfield Scroll-Video Guide — AKASA Valley Retreat

The site now has cinematic scroll effects built in. The code scrubs videos frame-by-frame as visitors scroll (Apple-style). Higgsfield's job is only to **generate the video clips** — everything else is already wired up.

## What's already built

| Effect | Where | File it expects |
|---|---|---|
| Pinned hero: video scrubs as you scroll, text lifts away | Hero section | `public/videos/hero-valley.mp4` |
| In-flow scrub: masterplan reveal plays with scroll | Future Resort Vision | `public/videos/masterplan-reveal.mp4` |
| Parallax drift on imagery | Gallery + Typologies | uses existing images |

Until the videos exist, the poster images (`public/images/hero-valley.jpg`, `public/images/masterplan.jpg`) show instead — nothing breaks.

## Step 1 — Generate clips on Higgsfield

Go to [higgsfield.ai](https://higgsfield.ai), create a video, and use prompts like these:

**Hero (hero-valley.mp4):**
> Slow cinematic aerial drone flyover of a lush green valley in Kerala, India at golden hour. Misty hills, terraced land, soft warm light. Camera glides forward slowly and steadily. No people, no text. Calm, premium, luxury resort mood.

**Masterplan reveal (masterplan-reveal.mp4):**
> Slow top-down aerial camera descending over a landscaped hillside resort masterplan, terraced plots, winding paths, tropical greenery. Smooth continuous camera motion, golden hour light, architectural visualization style.

Tips for scroll-scrub clips: pick **one continuous, slow camera move** (no cuts, no shaky motion), 5–10 seconds, landscape 16:9, highest resolution offered.

## Step 2 — Re-encode for smooth scrubbing (important)

Scrubbing jumps around the video timeline, so the file needs a keyframe on every frame. After downloading from Higgsfield, run this once per file (install [ffmpeg](https://ffmpeg.org) if needed — `brew install ffmpeg` on Mac):

```bash
ffmpeg -i higgsfield-download.mp4 -vf scale=1920:-2 -an -g 1 -crf 24 -movflags +faststart hero-valley.mp4
```

- `-g 1` = keyframe every frame (this is what makes scrubbing smooth)
- `-an` = strips audio (not needed, smaller file)
- Aim for a final file under ~15 MB

## Step 3 — Drop files in

Put the finished files here:

```
akasa-website/public/videos/hero-valley.mp4
akasa-website/public/videos/masterplan-reveal.mp4
```

Refresh the browser — done. No code changes needed.

## Run the site

```bash
cd akasa-website
npm install
npm run dev
```

## Optional upgrades

- **Lenis smooth scrolling** (inertia feel): `npm install lenis`, then in `src/App.jsx` add:
  ```jsx
  import { useEffect } from "react";
  import Lenis from "lenis";

  // inside App(), before return:
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
  ```
- **More scrub moments**: reuse `<ScrubVideo src="..." poster="..." />` from `src/components/shared/ScrollFx.jsx` in any section.
- **Adjust hero scroll length**: in `Hero.jsx`, change `h-[240vh]` (bigger = slower scrub).

## Notes

- All effects respect `prefers-reduced-motion` (videos autoplay-loop instead of scrubbing).
- Keep clips short and slow — fast motion looks jittery when scrubbed.

import { FadeUp } from "./shared/Motion.jsx";
import { scrollToId } from "./shared/Motion.jsx";
import { ScrubVideo } from "./shared/ScrollFx.jsx";
import { videoSrc } from "./shared/media.js";

export default function FutureVision() {
  return (
    <section id="vision" className="section bg-linen">
      <div className="section-inner grid items-center gap-14 lg:grid-cols-2">
        {/* Text */}
        <FadeUp>
          <span className="eyebrow">The Resort Vision</span>
          <h2 className="heading-lg">A valley retreat, in the making</h2>
          <p className="body-muted mt-6">
            AKASA is shaping a calm luxury retreat woven into the valley — pool villas,
            suites and themed cottages set among wellness gardens, dining spaces and
            quiet trails. Plot owners sit at the heart of this ecosystem.
          </p>
          <p className="body-muted mt-4">
            Construction is underway. Cottage units approval is expected in August 2026,
            with cottages handover planned for March 2028 and resort launch planned for
            April 2028.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => scrollToId("typologies")} className="btn-outline">
              View Themed Cottages
            </button>
            <button onClick={() => scrollToId("amenities")} className="btn-gold">
              Resort Amenities
            </button>
          </div>
        </FadeUp>

        {/* Video / visual — falls back to the aerial masterplan render
            until /videos/masterplan-reveal.mp4 is added */}
        <FadeUp delay={0.15}>
          <div className="overflow-hidden rounded-card shadow-soft">
            {/* Scrubs forward as the visitor scrolls this section into view */}
            <ScrubVideo
              src={videoSrc("masterplan-reveal")}
              poster="/images/gallery-masterplan.jpg"
              className="aspect-[4/3] w-full"
            />
          </div>
          <p className="mt-3 text-xs font-light text-charcoal/50">
            Conceptual visualisation of the resort. Illustrative only.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

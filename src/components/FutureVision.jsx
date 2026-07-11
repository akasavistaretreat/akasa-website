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
          <span className="eyebrow">Phase 2 — Planned Future Resort Vision</span>
          <h2 className="heading-lg">A valley retreat, in the making</h2>
          <p className="body-muted mt-6">
            AKASA's second phase envisions a calm luxury retreat woven into the valley —
            pool villas, suites and cottages set among wellness gardens, dining spaces and
            quiet trails. Owners of Phase 1 plots sit at the heart of this planned
            ecosystem.
          </p>
          <p className="body-muted mt-4">
            This is a vision under development, not an operating resort. Cottage units
            approval is expected in August 2026, with cottages handover planned for March
            2028 and resort launch planned for April 2028 — subject to approvals and
            development timelines.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => scrollToId("typologies")} className="btn-outline">
              View Planned Typologies
            </button>
            <button onClick={() => scrollToId("amenities")} className="btn-gold">
              Planned Amenities
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
            Conceptual visualisation of the planned future resort. Illustrative only.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

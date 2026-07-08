import { motion } from "framer-motion";
import { FadeUp, SectionHeading } from "./shared/Motion.jsx";
import { timeline } from "../data/timeline.js";

const statusStyle = {
  completed: {
    dot: "bg-moss ring-moss/20",
    badge: "bg-moss/10 text-moss",
    card: "border border-moss/15 bg-white/55",
    label: "Completed",
  },
  current: {
    dot: "bg-gold ring-gold/30",
    badge: "bg-gold text-white shadow-[0_4px_14px_rgba(180,155,94,0.45)]",
    card: "border border-gold/50 bg-white shadow-lift ring-1 ring-gold/10",
    label: "Current Transition Point",
  },
  upcoming: {
    dot: "bg-paper ring-gold/30 border border-dashed border-gold/60",
    badge: "bg-gold/10 text-clay",
    card: "border border-dashed border-gold/35 bg-white/40",
    label: "Upcoming",
  },
  planned: {
    dot: "bg-paper ring-sand border border-sand",
    badge: "bg-sand/60 text-charcoal/55",
    card: "border border-sand/60 bg-paper/40",
    label: "Planned",
  },
};

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-[18px] sm:w-[18px]">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ProjectTimeline() {
  const currentIndex = timeline.findIndex((t) => t.status === "current");
  const progressPct = ((currentIndex + 1) / timeline.length) * 100;
  const remaining = timeline.length - (currentIndex + 1);

  return (
    <section id="progress" className="section bg-paper">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Progress You Can Verify"
          title="Nine levels. We are at Level 6."
          lead="Five levels complete, ground work underway. Every stage below can be verified on a site visit. Future stages are subject to approvals and development timelines."
        />

        {/* Overall progress meter */}
        <FadeUp className="mt-12" delay={0.1}>
          <div className="rounded-card border border-sand bg-white/60 px-6 py-7 shadow-card backdrop-blur-sm sm:px-9 sm:py-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="eyebrow mb-2">Overall Progress</span>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-5xl font-light text-forest sm:text-6xl">
                    {currentIndex + 1}
                    <span className="text-2xl text-charcoal/40 sm:text-3xl"> / {timeline.length}</span>
                  </span>
                  <span className="text-sm font-medium uppercase tracking-wider text-gold">
                    Levels Reached
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-display text-3xl font-light text-gold sm:text-4xl">
                  {Math.round(progressPct)}%
                </p>
                <p className="mt-0.5 text-xs uppercase tracking-widest2 text-charcoal/50">
                  {remaining} {remaining === 1 ? "stage" : "stages"} to resort launch
                </p>
              </div>
            </div>

            {/* Segment tracker */}
            <div className="mt-7 flex gap-1.5 sm:gap-2">
              {timeline.map((item, i) => {
                const reached = i <= currentIndex;
                const isCurrent = item.status === "current";
                return (
                  <div key={item.level} className="relative h-2 flex-1 overflow-hidden rounded-full bg-sand">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: reached ? "100%" : "0%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full ${
                        isCurrent
                          ? "bg-gradient-to-r from-gold to-goldsoft"
                          : reached
                          ? "bg-gradient-to-r from-forest to-moss"
                          : ""
                      }`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-2.5 flex justify-between text-[10px] uppercase tracking-widest2 text-charcoal/40">
              <span>Land Acquisition</span>
              <span>Resort Launch</span>
            </div>
          </div>
        </FadeUp>

        {/* Detailed rail */}
        <div className="relative mt-16">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-sand sm:left-6" />
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: `${progressPct}%` }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-5 top-2 w-px bg-gradient-to-b from-forest via-moss to-gold sm:left-6"
          />

          <div className="space-y-6">
            {timeline.map((item, i) => {
              const s = statusStyle[item.status];
              const isCurrent = item.status === "current";
              return (
                <motion.div
                  key={item.level}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="relative grid grid-cols-[40px_1fr] gap-x-5 sm:grid-cols-[48px_1fr] sm:gap-x-8"
                >
                  {/* Dot */}
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12">
                    {isCurrent && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/40" />
                    )}
                    <span
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full ring-4 sm:h-9 sm:w-9 ${s.dot}`}
                    >
                      {item.status === "completed" ? (
                        <span className="text-white">
                          <CheckIcon />
                        </span>
                      ) : (
                        <span
                          className={`text-[11px] font-semibold ${
                            isCurrent ? "text-white" : "text-charcoal/50"
                          }`}
                        >
                          {item.level}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="relative">
                    {isCurrent && (
                      <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[1.75rem] bg-gold/10 blur-xl" />
                    )}
                    <div
                      className={`rounded-card px-6 py-6 transition-shadow duration-500 sm:px-7 sm:py-7 ${s.card} ${
                        isCurrent ? "sm:scale-[1.015]" : "hover:shadow-card"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${s.badge}`}
                        >
                          {isCurrent ? s.label : s.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-medium uppercase tracking-widest2 text-gold/80">
                            ● You are here
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 font-display text-xl text-forest sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gold">
                        {item.date}
                      </p>
                      <p className="body-muted mt-2 text-sm">{item.detail}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { FadeUp, SectionHeading, stagger, fadeUp, scrollToId } from "./shared/Motion.jsx";
import { lotStats } from "../data/lots.js";

const cards = [
  { value: lotStats.total, label: "Total Lots", note: "Low-density valley community" },
  { value: lotStats.sold, label: "Lots Sold", note: "Taken by early investors" },
  { value: lotStats.available, label: "Lots Available", note: "Limited lot availability" },
];

const soldPct = Math.round((lotStats.sold / lotStats.total) * 100);

// SVG radial gauge geometry
const R = 84;
const CIRC = 2 * Math.PI * R;

export default function LotSummary() {
  return (
    <section id="lots" className="section bg-paper">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Availability"
          title="Most of the valley is already spoken for"
          lead={`${lotStats.total} lots. ${lotStats.sold} sold. ${lotStats.available} remain. AKASA is intentionally small — a quiet, low-density community rather than a crowded township.`}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_1fr] lg:items-center lg:gap-14">
          {/* Big exaggerated sold gauge */}
          <FadeUp>
            <div className="relative overflow-hidden rounded-card border border-gold/25 bg-gradient-to-br from-forest to-[#2c362b] px-8 py-12 text-center shadow-lift sm:px-10">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-moss/20 blur-3xl" />

              <span className="eyebrow relative !text-goldsoft">Selling Fast</span>

              <div className="relative mx-auto mt-4 flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
                <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                  <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(247,244,238,0.12)" strokeWidth="10" />
                  <motion.circle
                    cx="100"
                    cy="100"
                    r={R}
                    fill="none"
                    stroke="url(#goldGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    initial={{ strokeDashoffset: CIRC }}
                    whileInView={{ strokeDashoffset: CIRC * (1 - soldPct / 100) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  />
                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#CBB98A" />
                      <stop offset="100%" stopColor="#B49B5E" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-6xl font-light text-paper sm:text-7xl">
                    {soldPct}%
                  </span>
                  <span className="mt-1 text-[11px] font-medium uppercase tracking-widest2 text-goldsoft">
                    Already Sold
                  </span>
                </div>
              </div>

              <p className="relative mx-auto mt-6 max-w-xs text-sm font-light text-paper/75">
                Only <span className="font-medium text-goldsoft">{lotStats.available} lots</span>{" "}
                remain in the entire valley. Early-entry opportunity — subject to availability.
              </p>

              <button
                onClick={() => scrollToId("contact")}
                className="btn-gold relative mt-7 !border-gold/60 !text-goldsoft hover:!bg-gold/15"
              >
                Check current availability →
              </button>
            </div>
          </FadeUp>

          {/* Stat cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1"
          >
            {cards.map((c) => (
              <motion.div
                key={c.label}
                variants={fadeUp}
                className="card flex items-center justify-between gap-4 px-8 py-7 lg:px-9"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest2 text-gold">
                    {c.label}
                  </p>
                  <p className="body-muted mt-1.5 text-sm">{c.note}</p>
                </div>
                <p className="shrink-0 font-display text-5xl font-light text-forest">{c.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading, scrollToId } from "./shared/Motion.jsx";
import { lots, lotStats, statusMeta } from "../data/lots.js";
import {
  VIEWBOX,
  sitePath,
  boundaryPaths,
  roadPaths,
  amenityAreas,
  lotGeometry,
} from "../data/masterplanGeometry.js";

// ── Colour system ────────────────────────────────────────────
const FILL = {
  available: { base: "#B49B5E", hover: "#9c8449", text: "#FFFFFF" },
  sold: { base: "#A9A398", hover: "#948E82", text: "#FFFFFF" },
  reserved: { base: "#D97706", hover: "#B45309", text: "#FFFFFF" },
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

function Legend() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-charcoal/70">
      <span className="flex items-center gap-2">
        <i className="h-3 w-3 rounded-full bg-gold" /> Available ({lotStats.available})
      </span>
      <span className="flex items-center gap-2">
        <i className="h-3 w-3 rounded-full bg-stone" /> Sold ({lotStats.sold})
      </span>
      <span className="flex items-center gap-2">
        <i className="h-3 w-3 rounded-full bg-amber-500" /> Reserved / In discussion
      </span>
      <span className="hidden items-center gap-2 sm:flex">
        <i className="h-3 w-3 rounded-sm bg-[#DCE0CB]" /> Resort &amp; recreation greens
      </span>
    </div>
  );
}

function LotPanel({ lot, onClose }) {
  const meta = statusMeta[lot.status];
  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-y-0 right-0 z-20 flex w-full max-w-sm flex-col justify-between overflow-y-auto rounded-card bg-paper/95 p-8 shadow-lift backdrop-blur-md sm:m-4"
    >
      <div>
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow !mb-2">{meta.label}</p>
            <h3 className="font-display text-4xl font-light text-forest">Plot {lot.number}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border border-charcoal/15 p-2 text-charcoal/60 transition hover:border-charcoal/40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <dl className="mt-8 space-y-5 text-sm">
          <div className="flex gap-8">
            <div>
              <dt className="text-xs uppercase tracking-widest2 text-charcoal/50">Area</dt>
              <dd className="mt-1 text-charcoal">
                {lot.sqm.toLocaleString()} sq.m
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest2 text-charcoal/50">Cents</dt>
              <dd className="mt-1 text-charcoal">{lot.cents}</dd>
            </div>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest2 text-charcoal/50">Plot / Unit Type</dt>
            <dd className="mt-1 text-charcoal">{lot.type}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest2 text-charcoal/50">View / Location</dt>
            <dd className="mt-1 text-charcoal">{lot.view}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest2 text-charcoal/50">Notes</dt>
            <dd className="mt-1 leading-relaxed text-charcoal/80">{lot.notes}</dd>
          </div>
        </dl>
      </div>

      {lot.status !== "sold" ? (
        <button
          onClick={() => {
            onClose();
            scrollToId("contact");
          }}
          className="btn-primary mt-8 w-full"
        >
          Enquire About Plot {lot.number}
        </button>
      ) : (
        <button
          onClick={() => {
            onClose();
            scrollToId("contact");
          }}
          className="btn-outline mt-8 w-full"
        >
          Ask About Similar Lots
        </button>
      )}
    </motion.aside>
  );
}

function ZoomControls({ zoom, setZoom, reset }) {
  const btn =
    "flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-charcoal shadow-card backdrop-blur transition hover:bg-paper disabled:opacity-40";
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
      <button className={btn} aria-label="Zoom in" disabled={zoom >= MAX_ZOOM} onClick={() => setZoom(Math.min(MAX_ZOOM, zoom * 1.5))}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
      </button>
      <button className={btn} aria-label="Zoom out" disabled={zoom <= MIN_ZOOM} onClick={() => setZoom(Math.max(MIN_ZOOM, zoom / 1.5))}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg>
      </button>
      <button className={btn} aria-label="Reset view" onClick={reset}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v5h5" />
        </svg>
      </button>
    </div>
  );
}

export default function InteractiveMasterplan() {
  const [active, setActive] = useState(null);
  const [shown, setShown] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [tip, setTip] = useState(null); // {x, y}
  const [zoom, setZoomRaw] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef(null);
  const boxRef = useRef(null);

  // Fallback: never leave the lots invisible if the viewport callback misses
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const lotById = Object.fromEntries(lots.map((l) => [l.id, l]));

  function clampPan(p, z) {
    const lim = 300 * (z - 1);
    return { x: Math.max(-lim, Math.min(lim, p.x)), y: Math.max(-lim, Math.min(lim, p.y)) };
  }
  function setZoom(z) {
    setZoomRaw(z);
    setPan((p) => clampPan(p, z));
  }

  function onPointerDown(e) {
    if (zoom === 1) return;
    drag.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!drag.current) {
      if (boxRef.current) {
        const r = boxRef.current.getBoundingClientRect();
        setTip({ x: e.clientX - r.left, y: e.clientY - r.top });
      }
      return;
    }
    const dx = e.clientX - drag.current.sx;
    const dy = e.clientY - drag.current.sy;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true;
    setPan(clampPan({ x: drag.current.px + dx, y: drag.current.py + dy }, zoom));
  }
  function onPointerUp() {
    drag.current = null;
  }

  const hoveredLot = hovered != null ? lotById[hovered] : null;

  return (
    <section id="masterplan" className="section bg-linen">
      <div className="section-inner">
        <SectionHeading
          eyebrow="The Masterplan"
          title="Walk the land, lot by lot"
          lead="Drawn directly from the approved DTCP layout. Tap any plot to see its status, size and setting — gold plots are open for enquiry."
        />
        <Legend />

        <div
          ref={boxRef}
          className="relative mt-10 overflow-hidden rounded-card bg-[#F3EFE4] shadow-soft"
          onPointerLeave={() => {
            setHovered(null);
            setTip(null);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            onViewportEnter={() => setShown(true)}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ touchAction: zoom > 1 ? "none" : "auto" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""}
          >
            <svg
              viewBox={VIEWBOX}
              className="block h-auto w-full select-none"
              role="img"
              aria-label="AKASA Valley Retreat masterplan with plot availability"
            >
              <defs>
                <clipPath id="akasa-site-clip">
                  <path d={sitePath} />
                </clipPath>
                <linearGradient id="akasa-site-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#EFE9DB" />
                  <stop offset="100%" stopColor="#E9E1CE" />
                </linearGradient>
              </defs>

              <g
                transform={`translate(${pan.x / 2} ${pan.y / 2}) scale(${zoom})`}
                style={{
                  transformOrigin: "center",
                  transformBox: "view-box",
                  transition: drag.current ? "none" : "transform .45s cubic-bezier(.22,1,.36,1)",
                }}
              >
                {/* Site ground */}
                <path d={sitePath} fill="url(#akasa-site-fill)" />

                <g clipPath="url(#akasa-site-clip)">
                  {/* Resort / recreation greens */}
                  {amenityAreas.map((a) => (
                    <path key={a.name + a.cx} d={a.d} fill="#DCE0CB" stroke="#C9CFB4" strokeWidth="0.6" />
                  ))}

                  {/* Internal roads (from DTCP linework) */}
                  <g fill="none" stroke="#C3AE87" strokeWidth="1.1" strokeLinecap="round" opacity="0.9">
                    {roadPaths.map((d, i) => (
                      <path key={i} d={d} />
                    ))}
                  </g>

                  {/* Premium illustrative features — additive only, roads & lots untouched */}
                  <g style={{ pointerEvents: "none" }}>
                    {/* Basketball court — fills the former café area */}
                    {(() => {
                      const courtArea = amenityAreas.find((a) => a.name === "Coffee Shop");
                      if (!courtArea) return null;
                      return (
                        <g>
                          <clipPath id="akasa-court-clip">
                            <path d={courtArea.d} />
                          </clipPath>
                          <path d={courtArea.d} fill="#8FA9C0" stroke="#F7F4EE" strokeWidth="1" />
                          {/* court markings, clipped to the area */}
                          <g clipPath="url(#akasa-court-clip)">
                            <g transform="translate(325 321) rotate(-22)" fill="none" stroke="#F7F4EE">
                              <rect x="-32" y="-13" width="64" height="26" strokeWidth="0.7" />
                              <line x1="0" y1="-13" x2="0" y2="13" strokeWidth="0.55" />
                              <circle r="4.2" strokeWidth="0.55" />
                              <rect x="-32" y="-5.5" width="9.5" height="11" strokeWidth="0.5" />
                              <rect x="22.5" y="-5.5" width="9.5" height="11" strokeWidth="0.5" />
                              <path d="M-22.5 -5.5 A 5.5 5.5 0 0 1 -22.5 5.5" strokeWidth="0.5" />
                              <path d="M22.5 5.5 A 5.5 5.5 0 0 1 22.5 -5.5" strokeWidth="0.5" />
                            </g>
                          </g>
                        </g>
                      );
                    })()}

                    {/* Car park — west of the court */}
                    <g transform="translate(258 342) rotate(-20)">
                      <rect x="-10" y="-5.5" width="20" height="11" rx="1" fill="#DCD6C4" stroke="#B9B19C" strokeWidth="0.5" />
                      {[-6, -2, 2, 6].map((x) => (
                        <line key={x} x1={x} y1="-5.5" x2={x} y2="0" stroke="#F7F4EE" strokeWidth="0.4" />
                      ))}
                      <rect x="-5.3" y="-4.7" width="2.6" height="4" rx="0.6" fill="#9A9284" />
                      <rect x="2.7" y="-4.7" width="2.6" height="4" rx="0.6" fill="#8A8377" />
                      <text y="4.2" textAnchor="middle" fontSize="4" fontWeight="600" fill="#8A8377" fontFamily="Karla, system-ui, sans-serif">
                        P
                      </text>
                    </g>

                    {/* Pool & deck — below the west car park */}
                    <g transform="translate(262 366) rotate(-20)">
                      <rect x="-15" y="-7.5" width="30" height="15" rx="3" fill="#EAE0C9" opacity="0.85" />
                      {[-12.5, -9, -5.5, -2, 1.5, 5].map((x) => (
                        <rect key={x} x={x} y="-6.2" width="1.6" height="3" rx="0.4" fill="#B49B5E" opacity="0.85" />
                      ))}
                      <path
                        d="M-11 -0.5 C -6 -4.2, 5 -3.7, 9.5 -0.5 C 12.5 1.8, 11 5.2, 4.5 5.6 C -3.5 6, -11.6 3.4, -11 -0.5 Z"
                        fill="#7FB9CC"
                        stroke="#5E98AC"
                        strokeWidth="0.45"
                      />
                    </g>

                    {/* Car park — east of the court */}
                    <g transform="translate(344 346) rotate(-22)">
                      <rect x="-9" y="-4.5" width="18" height="9" rx="1" fill="#DCD6C4" stroke="#B9B19C" strokeWidth="0.5" />
                      {[-5.4, -1.8, 1.8, 5.4].map((x) => (
                        <line key={x} x1={x} y1="-4.5" x2={x} y2="0" stroke="#F7F4EE" strokeWidth="0.4" />
                      ))}
                      <rect x="-4.6" y="-3.9" width="2.4" height="3.4" rx="0.6" fill="#9A9284" />
                      <text y="3.6" textAnchor="middle" fontSize="3.6" fontWeight="600" fill="#8A8377" fontFamily="Karla, system-ui, sans-serif">
                        P
                      </text>
                    </g>

                    {/* Infinity-edge pool — eastern lobe of the resort core.
                        Clean rectangular basin with overflow edge on the valley side. */}
                    <g transform="translate(518 327) rotate(-50)">
                      {/* stone deck */}
                      <rect x="-14" y="-7.5" width="28" height="15" rx="2" fill="#EAE0C9" opacity="0.9" />
                      <rect x="-14" y="-7.5" width="28" height="15" rx="2" fill="none" stroke="#D8CBAB" strokeWidth="0.4" />
                      {/* loungers along the deck */}
                      {[-12, -8.8, -5.6, -2.4, 0.8, 4].map((x) => (
                        <rect key={x} x={x} y="-6.4" width="1.6" height="3" rx="0.4" fill="#B49B5E" opacity="0.85" />
                      ))}
                      {/* rectangular basin */}
                      <rect x="-11" y="-2.6" width="21" height="6.6" rx="0.8" fill="#7FB9CC" stroke="#5E98AC" strokeWidth="0.5" />
                      {/* water sheen */}
                      <line x1="-9" y1="0.4" x2="8" y2="0.4" stroke="#A8D4E0" strokeWidth="0.35" opacity="0.9" />
                      {/* square jacuzzi at the end */}
                      <rect x="10.6" y="-2.2" width="3.4" height="5.4" rx="1" fill="#7FB9CC" stroke="#5E98AC" strokeWidth="0.45" />
                      {/* infinity overflow edge on the valley side */}
                      <line x1="-11" y1="4.5" x2="10" y2="4.5" stroke="#BFE0EA" strokeWidth="1" strokeLinecap="round" />
                      <line x1="-10.5" y1="5.6" x2="9.5" y2="5.6" stroke="#5E98AC" strokeWidth="0.35" opacity="0.5" />
                    </g>

                    {/* Watchtower — highlighted lookout on the upper green */}
                    <g transform="translate(716 96)">
                      <circle r="11" fill="#B49B5E" opacity="0.16" />
                      <circle r="11" fill="none" stroke="#B49B5E" strokeWidth="0.6" strokeDasharray="2 1.6" />
                      <path d="M-3 -3.2 L3 -3.2 L3 0.6 L-3 0.6 Z" fill="#B49B5E" stroke="#8A7360" strokeWidth="0.45" />
                      <path d="M-4.4 -3.2 L0 -7.6 L4.4 -3.2 Z" fill="#8A7360" />
                      <path d="M-3 0.6 L-4.6 6 M3 0.6 L4.6 6 M-3.9 3.4 L3.9 3.4" stroke="#8A7360" strokeWidth="0.5" fill="none" />
                      {/* label pill — kept clear of the ring and the site edge */}
                      <g transform="translate(-14 16)">
                        <rect x="-17" y="-3.6" width="34" height="7.2" rx="3.6" fill="#F7F4EE" opacity="0.92" stroke="#B49B5E" strokeWidth="0.4" />
                        <text y="1.6" textAnchor="middle" fontSize="4.4" fontWeight="700" letterSpacing="0.08em" fill="#2B2B27" fontFamily="Karla, system-ui, sans-serif">
                          WATCHTOWER
                        </text>
                      </g>
                    </g>

                    {/* Security gate — guard hut with boom barrier, inside the garden by the entrance */}
                    <g transform="translate(325 500)">
                      {/* guard hut */}
                      <rect x="-10" y="-3.8" width="8.6" height="7.6" rx="1" fill="#C9A97D" stroke="#8A7360" strokeWidth="0.6" />
                      <path d="M-11.2 -3.8 L-5.7 -7.2 L-0.2 -3.8 Z" fill="#8A7360" />
                      <circle cx="-5.7" cy="0.3" r="0.9" fill="#8A7360" opacity="0.6" />
                      {/* barrier post + striped boom arm across the entry */}
                      <rect x="0.4" y="-2" width="1.8" height="6" rx="0.4" fill="#8A7360" />
                      <line x1="2.2" y1="-1.4" x2="16.5" y2="-1.4" stroke="#F7F4EE" strokeWidth="2" strokeLinecap="round" />
                      <line x1="2.2" y1="-1.4" x2="16.5" y2="-1.4" stroke="#B49B5E" strokeWidth="2" strokeLinecap="round" strokeDasharray="2.6 2.6" />
                      <circle cx="16.5" cy="-1.4" r="1" fill="#8A7360" />
                      {/* label pill */}
                      <g transform="translate(-2 10)">
                        <rect x="-14" y="-3.6" width="28" height="7.2" rx="3.6" fill="#F7F4EE" opacity="0.92" stroke="#B49B5E" strokeWidth="0.4" />
                        <text y="1.6" textAnchor="middle" fontSize="4.4" fontWeight="700" letterSpacing="0.08em" fill="#2B2B27" fontFamily="Karla, system-ui, sans-serif">
                          SECURITY
                        </text>
                      </g>
                    </g>

                    {/* Entrance marker at the boundary gap */}
                    <text x="383" y="542" textAnchor="middle" fontSize="4" letterSpacing="0.14em" fill="#8A7360" fontFamily="Karla, system-ui, sans-serif">
                      ENTRANCE
                    </text>
                  </g>
                </g>

                {/* Lots */}
                {Object.entries(lotGeometry).map(([id, g], i) => {
                  const lot = lotById[id];
                  if (!lot) return null;
                  const f = FILL[lot.status];
                  const isHover = hovered === Number(id);
                  const isActive = active?.id === Number(id);
                  return (
                    <g
                      key={id}
                      style={{
                        opacity: shown ? 1 : 0,
                        transition: `opacity .5s ease ${0.2 + i * 0.015}s`,
                      }}
                    >
                      <path
                        d={g.d}
                        fill={isHover || isActive ? f.hover : f.base}
                        fillOpacity={lot.status === "sold" ? 0.55 : 0.92}
                        stroke={isActive ? "#3C4A3A" : "#F7F4EE"}
                        strokeWidth={isActive ? 1.6 : 0.7}
                        style={{ cursor: "pointer", transition: "fill .2s, fill-opacity .2s" }}
                        onClick={() => {
                          if (drag.current?.moved) return;
                          setActive(lot);
                        }}
                        onPointerEnter={() => setHovered(Number(id))}
                        onPointerLeave={() => setHovered(null)}
                        aria-label={`Plot ${lot.number} — ${statusMeta[lot.status].label}`}
                      />
                      <text
                        x={g.cx}
                        y={g.cy + 1.8}
                        textAnchor="middle"
                        fontSize="5.2"
                        fontWeight="600"
                        fill={f.text}
                        style={{ pointerEvents: "none", fontFamily: "Karla, system-ui, sans-serif" }}
                      >
                        {lot.number}
                      </text>
                    </g>
                  );
                })}

                {/* Boundary */}
                <g fill="none" stroke="#2B2B27" strokeWidth="2" strokeLinejoin="round" opacity="0.85">
                  {boundaryPaths.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </g>

                {/* Area labels (some greens stay unlabelled by design) */}
                {amenityAreas.filter((a) => !a.hideLabel).map((a) => (
                  <text
                    key={"lbl" + a.name + a.cx}
                    x={a.cx}
                    y={a.cy}
                    textAnchor="middle"
                    fontSize="5.5"
                    letterSpacing="0.12em"
                    fill="#6B7260"
                    style={{
                      pointerEvents: "none",
                      textTransform: "uppercase",
                      fontFamily: "Karla, system-ui, sans-serif",
                    }}
                  >
                    {a.name}
                  </text>
                ))}

                {/* Entry + compass */}
                <text x="382" y="552" textAnchor="middle" fontSize="6" fill="#8A7360" style={{ pointerEvents: "none", fontFamily: "Karla, system-ui, sans-serif" }}>
                  ⌄ Entry — Agali / Kadambara road
                </text>
                <g transform="translate(78 80)" opacity="0.7" style={{ pointerEvents: "none" }}>
                  <circle r="10" fill="none" stroke="#8A7360" strokeWidth="0.8" />
                  <path d="M0 6 L0 -6 M0 -6 l-2.6 3.4 M0 -6 l2.6 3.4" stroke="#8A7360" strokeWidth="1" fill="none" />
                  <text y="-13" textAnchor="middle" fontSize="6" fill="#8A7360" fontFamily="Karla, system-ui, sans-serif">N</text>
                </g>
              </g>
            </svg>
          </motion.div>

          {/* Hover tooltip */}
          {hoveredLot && tip && !active && (
            <div
              className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-full rounded-lg bg-ink/90 px-3 py-2 text-xs text-paper shadow-lift backdrop-blur sm:block"
              style={{ left: tip.x, top: tip.y - 12 }}
            >
              <span className="font-semibold">Plot {hoveredLot.number}</span>
              <span className="mx-1.5 opacity-40">·</span>
              {hoveredLot.cents} cents
              <span className="mx-1.5 opacity-40">·</span>
              <span className={hoveredLot.status === "available" ? "text-goldsoft" : "opacity-70"}>
                {statusMeta[hoveredLot.status].label}
              </span>
            </div>
          )}

          <ZoomControls
            zoom={zoom}
            setZoom={setZoom}
            reset={() => {
              setZoomRaw(1);
              setPan({ x: 0, y: 0 });
            }}
          />

          <AnimatePresence>
            {active && <LotPanel lot={active} onClose={() => setActive(null)} />}
          </AnimatePresence>
        </div>

        <p className="mt-5 text-xs font-light text-charcoal/50">
          Plot boundaries are reproduced from the approved DTCP layout plan and are indicative at
          this scale — confirm exact boundaries and current availability with the promoters during
          your site visit. Availability shown as on 2 July 2026.
        </p>
      </div>
    </section>
  );
}

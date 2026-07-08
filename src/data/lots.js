// ─────────────────────────────────────────────────────────────
// AKASA Valley Retreat — Lot data (39 lots, A1–A39)
// Source of truth:
//  • Lot numbers, areas  → approved DTCP layout plan (Kottathara
//    Village, Sholayur Grama Panchayath, Attappadi Taluk)
//  • Status              → "Akasa Available Units" sheet, 2 July 2026
// status: "available" | "sold" | "reserved"
// ─────────────────────────────────────────────────────────────

const AVAILABLE = new Set([7, 8, 18, 21, 22, 24, 28, 29, 30, 31, 32, 33, 34, 35, 36]);

// [sq.m, cents] straight from the DTCP residential plot area table
const AREAS = {
  1: [416.84, 10.3], 2: [241.99, 5.98], 3: [170.38, 4.21], 4: [271.49, 6.71],
  5: [134.26, 3.32], 6: [131.26, 3.24], 7: [148.96, 3.68], 8: [175.07, 4.32],
  9: [150.17, 3.71], 10: [169.62, 4.19], 11: [216.04, 5.34], 12: [140.42, 3.47],
  13: [161.9, 4.0], 14: [162.0, 4.0], 15: [309.94, 7.66], 16: [166.08, 4.1],
  17: [126.47, 3.12], 18: [129.98, 3.21], 19: [285.84, 7.06], 20: [212.92, 5.26],
  21: [126.15, 3.12], 22: [172.12, 4.25], 23: [200.05, 4.94], 24: [189.56, 4.68],
  25: [369.46, 9.13], 26: [193.86, 4.79], 27: [177.97, 4.4], 28: [162.78, 4.02],
  29: [156.25, 3.86], 30: [143.34, 3.54], 31: [168.25, 4.16], 32: [183.59, 4.53],
  33: [127.11, 3.14], 34: [136.28, 3.37], 35: [148.73, 3.67], 36: [306.55, 7.57],
  37: [130.38, 3.22], 38: [202.65, 5.01], 39: [125.08, 3.09],
};

function zone(n) {
  if (n <= 6) return "Upper eastern ridge, along the serpentine drive";
  if (n <= 13) return "Upper slope terrace overlooking the valley";
  if (n <= 18) return "Central terrace beside the hairpin drive";
  if (n <= 23) return "South-facing row adjoining the planned resort core";
  if (n === 25) return "Central knoll — the largest single parcel on the layout";
  if (n === 24 || n === 39) return "Lower garden loop beside landscaped garden areas";
  if (n <= 29) return "South-west terrace near the internal pathway";
  if (n <= 35) return "Western cluster around the recreation green";
  return "Western edge near the entry approach";
}

// Planned typology per lot, by plot size (matches Typologies section names)
function typeOf(sqm) {
  if (sqm >= 250) return "Pool Villa";
  if (sqm >= 160) return "Suite Room";
  return "Single Cottage";
}

// Lot-specific highlights (shown in the lot modal notes)
const LOT_NOTES = {
  7: "Panoramic 270° views of the Siruvani river and Velliangiri hilltop.",
  8: "Panoramic 270° views of the Siruvani river and Velliangiri hilltop.",
  18: "270° views. The smallest, most pocket-friendly unit — right beside the planned café.",
  21: "Greater privacy, with access via a private road.",
  22: "Greater privacy, with access via a private road.",
  25: "Earmarked for the planned Ayurvedic Wellness Centre.",
  28: "Close to the planned pool and playground amenities.",
  29: "Close to the planned pool and playground amenities.",
  30: "Can be clubbed with A35 into one larger combined holding.",
  33: "Attappadi valley and Ooty-facing views, shared with A34 and A35.",
  34: "Attappadi valley and Ooty-facing views, shared with A33 and A35.",
  35: "Attappadi valley and Ooty-facing views, shared with A33 and A34. Can be clubbed with A30 into one larger combined holding.",
  36: "Dual-aspect north and south views — the only Pool Villa lot remaining.",
};

function noteFor(n, status) {
  const base =
    status === "sold"
      ? "This lot has been taken by an early investor."
      : "Early-entry opportunity. Contact the promoters for current pricing and availability.";
  if (n === 25) return LOT_NOTES[25]; // wellness centre parcel, not an investor lot note
  return LOT_NOTES[n] ? `${LOT_NOTES[n]} ${base}` : base;
}

export const lots = Object.keys(AREAS).map((k) => {
  const n = Number(k);
  const [sqm, cents] = AREAS[n];
  const status = AVAILABLE.has(n) ? "available" : "sold";
  return {
    id: n,
    number: `A${n}`,
    status,
    sqm,
    cents,
    type: typeOf(sqm),
    view: zone(n),
    notes: noteFor(n, status),
  };
});

export const lotStats = {
  total: lots.length,
  sold: lots.filter((l) => l.status === "sold").length,
  available: lots.filter((l) => l.status === "available").length,
  reserved: lots.filter((l) => l.status === "reserved").length,
};

export const statusMeta = {
  available: { label: "Available", dot: "bg-gold", ring: "ring-gold/40", text: "text-gold" },
  sold: { label: "Sold", dot: "bg-stone", ring: "ring-stone/40", text: "text-stone" },
  reserved: { label: "Reserved", dot: "bg-amber-500", ring: "ring-amber-400/40", text: "text-amber-600" },
};

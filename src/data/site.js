// Central site configuration — contacts, links, key facts
export const site = {
  name: "AKASA Valley Retreat",
  location: "Attappadi / Agali, Kerala",
  promoters: [
    { name: "Mr. Gopi", phone: "+919159361234", display: "+91 91593 61234" },
    { name: "Mr. Manikandan", phone: "+916384222999", display: "+91 63842 22999" },
  ],
  whatsappNumber: "919159361234",
  whatsappMessage:
    "Hi, I am interested in AKASA Valley Retreat. Please share available plot details and site visit information.",
  brochurePath: "/brochure/Akasa_Brochure.pdf",
  // Google Apps Script web app that records enquiries to the sheet.
  // Committed rather than kept only in an env var on purpose: Vite inlines
  // VITE_* vars into the public JS bundle at build time, so there's no secrecy
  // to protect here — and a committed default means a fresh deploy captures
  // leads without anyone remembering to set a dashboard variable. Override
  // with VITE_LEAD_ENDPOINT for a staging sheet. Setup: lead-capture/README.md
  leadEndpoint:
    "https://script.google.com/macros/s/AKfycby_8MsOeJalOCborzuYPN1ZSSSr9LAHLWRjSmFi02ykyNL4gkbP8ryiDe-KkrvKT3tJpg/exec",
  social: {
    instagram: "https://www.instagram.com/akasa_valley_retreat",
    instagramHandle: "@akasa_valley_retreat",
  },
  facts: {
    totalLots: 39,
    // 23 sold to buyers; the 39th plot is the wellness centre, not a sale.
    // (Nothing reads this block today — the Hero hardcodes its own numbers —
    // but it read 24 and would have been a trap for whoever wired it up next.)
    sold: 23,
    available: 15,
    progress: "Level 6 of 9",
    nextMilestone: "Cottage Units Approval — August 2026",
    handover: "Cottages Handover — March 2028",
    resortLaunch: "Resort Launch Planned — April 2028",
  },
};

export const whatsappUrl = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
  site.whatsappMessage
)}`;

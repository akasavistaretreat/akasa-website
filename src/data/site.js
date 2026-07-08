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
  facts: {
    totalLots: 39,
    sold: 24,
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

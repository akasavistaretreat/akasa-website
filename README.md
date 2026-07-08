# AKASA Valley Retreat — Phase 1 Website

Premium, investor-focused landing website for AKASA Valley Retreat (Attappadi / Agali).
Built with React + Vite + Tailwind CSS + Framer Motion in a calm, Wabi-Sabi minimalist style.

## Run locally

Requires Node.js 18+ (https://nodejs.org).

```bash
cd akasa-website
npm install
npm run dev        # opens dev server at http://localhost:5173
```

Production build:

```bash
npm run build      # outputs static site to dist/
npm run preview    # preview the production build
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, Hostinger, cPanel, etc.).

## File structure

```
akasa-website/
├── index.html                  # Fonts (Cormorant Garamond + Karla), meta tags
├── package.json
├── vite.config.js
├── tailwind.config.js          # Wabi-Sabi colour palette (paper, linen, moss, forest, gold…)
├── postcss.config.js
├── public/
│   ├── images/                 # ← add masterplan.jpg, pool-villa.jpg, suite-room.jpg,
│   │                           #   single-cottage.jpg, hero-valley.jpg, gallery-*.jpg
│   ├── videos/                 # ← add hero-valley.mp4, masterplan-reveal.mp4
│   └── brochure/               # ← add Akasa_Brochure.pdf (Download Brochure button)
└── src/
    ├── main.jsx
    ├── App.jsx                 # Section order
    ├── index.css               # Base styles, buttons, cards, section shells
    ├── components/
    │   ├── Navbar.jsx          Hero.jsx           LotSummary.jsx
    │   ├── InteractiveMasterplan.jsx              ProjectTimeline.jsx
    │   ├── WhyAttappadi.jsx    InvestorBenefits.jsx  FutureVision.jsx
    │   ├── Typologies.jsx      Amenities.jsx      Gallery.jsx
    │   ├── FAQ.jsx             Contact.jsx        Footer.jsx
    │   └── shared/Motion.jsx   # FadeUp, stagger, SectionHeading, scrollToId
    └── data/                   # ALL editable content lives here
        ├── lots.js             # 40 lots: status, type, view, notes, marker x/y positions
        ├── timeline.js         # 9-level progress timeline
        ├── typologies.js       # Pool Villa / Suite Room / Single Cottage
        ├── amenities.js        # Grouped planned amenities
        ├── benefits.js         # Investor benefits
        ├── faqs.js             # FAQ items
        ├── gallery.js          # Gallery images + captions
        ├── whyAttappadi.js     # Location story points
        └── site.js             # Contacts, WhatsApp number/message, brochure path, key facts
```

## Common edits

**Change a lot's status or details** — `src/data/lots.js`. Statuses: `"available"`,
`"sold"`, `"reserved"`. The summary counts update automatically.

**Move masterplan markers** — each lot in `lots.js` has `x` and `y` (% from the
image's left/top edge). Current positions are a placeholder grid; adjust per lot
once the real masterplan image is in place, e.g. `{ ..., x: 34, y: 52 }`.

**Update contacts / WhatsApp** — `src/data/site.js`.

**Swap images/videos** — drop files into `public/images` and `public/videos`
using the names listed in the README.txt inside each folder (or edit the paths
in the data files).

## Important wording rules (already applied)

The site never presents the resort as built or operational and never guarantees
returns. Keep these phrases when editing copy: "planned future resort vision",
"subject to approvals and development timelines", "early-entry opportunity",
"limited lot availability".

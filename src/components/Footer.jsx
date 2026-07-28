import { site } from "../data/site.js";

export default function Footer() {
  return (
    <footer className="bg-ink px-6 py-14 text-paper/60 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <img
              src="/images/logo/akasa-logo-dark-bg.png"
              alt="AKASA Valley Retreat"
              className="h-20 w-auto"
            />
            <p className="mt-3 text-sm font-light">{site.location}</p>
          </div>
          <div className="text-sm font-light">
            {site.promoters.map((p) => (
              <p key={p.phone}>
                {p.name} — <a href={`tel:${p.phone}`} className="hover:text-goldsoft">{p.display}</a>
              </p>
            ))}

            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AKASA Valley Retreat on Instagram"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2 text-xs tracking-wide transition hover:border-goldsoft hover:text-goldsoft"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
              </svg>
              {site.social.instagramHandle}
            </a>
          </div>
        </div>

        <p className="mt-10 max-w-3xl border-t border-paper/10 pt-6 text-[11px] font-light leading-relaxed text-paper/40">
          Disclaimer: AKASA Valley Retreat is a plot development within a resort project
          under development. All timelines, designs and amenities are indicative and
          subject to approvals and development timelines. Nothing on this website
          constitutes a guarantee of investment returns. Please verify all details and
          documentation before making any purchase decision.
        </p>
        <p className="mt-4 text-[11px] text-paper/30">
          © {new Date().getFullYear()} AKASA Valley Retreat. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

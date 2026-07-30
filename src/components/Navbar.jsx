import { useEffect, useState } from "react";
import { scrollToId } from "./shared/Motion.jsx";

const links = [
  { id: "masterplan", label: "Masterplan" },
  { id: "progress", label: "Progress" },
  { id: "vision", label: "Resort Vision" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Nav items are real anchors, not buttons. That costs nothing and buys three
  // things a click handler can't: right-click "open in new tab", a URL that
  // reflects where you are (so /#faq can be shared), and a working back button.
  // We still intercept the click to keep the smooth scroll, then write the hash
  // ourselves — pushState rather than replaceState so back steps through.
  const go = (e, id) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let the browser handle it
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-paper/95 shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="AKASA Valley Retreat — back to top"
        >
          <img
            src={scrolled ? "/images/logo/akasa-logo-light-bg.png" : "/images/logo/akasa-logo-dark-bg.png"}
            alt="AKASA Valley Retreat"
            className="h-12 w-auto transition-opacity duration-300 sm:h-14"
          />
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => go(e, l.id)}
              className={`text-sm tracking-wide transition-colors hover:text-gold ${
                scrolled ? "text-charcoal/70" : "text-paper/80"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => go(e, "contact")}
            className="btn-primary !px-5 !py-2 text-xs"
          >
            Enquire
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className={`md:hidden ${scrolled ? "text-forest" : "text-paper"}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="mx-4 mb-4 rounded-card bg-paper p-6 shadow-lift md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => go(e, l.id)}
              className="block w-full py-3 text-left text-charcoal/80 hover:text-forest"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => go(e, "contact")}
            className="btn-primary mt-4 block w-full text-center"
          >
            Enquire Now
          </a>
        </nav>
      )}
    </header>
  );
}

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

  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-paper/90 shadow-soft backdrop-blur-md" : "bg-transparent"
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
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`text-sm tracking-wide transition-colors hover:text-gold ${
                scrolled ? "text-charcoal/70" : "text-paper/80"
              }`}
            >
              {l.label}
            </button>
          ))}
          <button onClick={() => go("contact")} className="btn-primary !px-5 !py-2 text-xs">
            Enquire
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          className={`md:hidden ${scrolled ? "text-forest" : "text-paper"}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="mx-4 mb-4 rounded-card bg-paper p-6 shadow-lift md:hidden">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="block w-full py-3 text-left text-charcoal/80 hover:text-forest"
            >
              {l.label}
            </button>
          ))}
          <button onClick={() => go("contact")} className="btn-primary mt-4 w-full">
            Enquire Now
          </button>
        </nav>
      )}
    </header>
  );
}

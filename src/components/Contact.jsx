import { useState } from "react";
import { FadeUp } from "./shared/Motion.jsx";
import { site, whatsappUrl } from "../data/site.js";

const inputCls =
  "w-full rounded-xl border border-sand bg-white/80 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/35 outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/15";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    interest: "Plot",
    visitDate: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this to your backend / Google Form / email service.
    // For now, open WhatsApp pre-filled with the enquiry details.
    const text = encodeURIComponent(
      `Hi, I am interested in AKASA Valley Retreat.\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nCity: ${form.city}\nInterested in: ${form.interest}\nPreferred visit date: ${form.visitDate || "—"}\nMessage: ${form.message || "—"}`
    );
    window.open(`https://wa.me/${site.whatsappNumber}?text=${text}`, "_blank");
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section bg-forest">
      <div className="section-inner grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        {/* Left — copy + promoters */}
        <FadeUp>
          <span className="eyebrow !text-goldsoft">Enquire</span>
          <h2 className="font-display text-3xl font-light leading-snug text-paper sm:text-4xl md:text-5xl">
            Book a Site Visit
          </h2>
          <p className="mt-6 text-base font-light leading-relaxed text-paper/70">
            Interested in learning more about available lots at AKASA Valley Retreat?
            Connect with the promoters to check current availability, understand the
            project progress, and schedule a site visit.
          </p>

          <div className="mt-10 space-y-4">
            {site.promoters.map((p) => (
              <a
                key={p.phone}
                href={`tel:${p.phone}`}
                className="flex items-center justify-between rounded-card border border-paper/15 bg-paper/5 px-6 py-4 transition hover:bg-paper/10"
              >
                <div>
                  <p className="text-sm font-medium text-paper">{p.name}</p>
                  <p className="text-sm font-light text-paper/60">{p.display}</p>
                </div>
                <span className="text-goldsoft">Call →</span>
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn bg-gold text-ink hover:bg-goldsoft"
            >
              WhatsApp Now
            </a>
            <a
              href={`tel:${site.promoters[0].phone}`}
              className="btn border border-paper/40 text-paper hover:bg-paper/10"
            >
              Call Promoter
            </a>
          </div>
        </FadeUp>

        {/* Right — form */}
        <FadeUp delay={0.15}>
          <form
            onSubmit={handleSubmit}
            className="rounded-card bg-paper p-8 shadow-lift sm:p-10"
          >
            {submitted && (
              <p className="mb-6 rounded-xl bg-moss/10 px-4 py-3 text-sm text-moss">
                Thank you — your enquiry has been prepared. The promoters will connect
                with you shortly.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Full Name"
                value={form.name}
                onChange={set("name")}
                className={inputCls}
              />
              <input
                required
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={set("phone")}
                className={inputCls}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={set("email")}
                className={inputCls}
              />
              <input
                placeholder="City / Location"
                value={form.city}
                onChange={set("city")}
                className={inputCls}
              />
              <select value={form.interest} onChange={set("interest")} className={inputCls}>
                <option>Plot</option>
                <option>Site Visit</option>
                <option>Brochure</option>
                <option>General Enquiry</option>
              </select>
              <input
                type="date"
                aria-label="Preferred Site Visit Date"
                value={form.visitDate}
                onChange={set("visitDate")}
                className={inputCls}
              />
            </div>
            <textarea
              rows={4}
              placeholder="Message"
              value={form.message}
              onChange={set("message")}
              className={`${inputCls} mt-4`}
            />

            <button type="submit" className="btn-primary mt-6 w-full">
              Submit Enquiry
            </button>
            <p className="mt-4 text-center text-[11px] font-light text-charcoal/45">
              By submitting, you agree to be contacted about AKASA Valley Retreat. No
              investment returns are guaranteed.
            </p>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}

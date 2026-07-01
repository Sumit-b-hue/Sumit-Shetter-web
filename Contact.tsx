"use client";

import { useState, useTransition } from "react";
import type { SiteSettings } from "@/lib/types";
import { submitContactForm } from "@/lib/actions";

const STATUS_COLOR: Record<string, string> = {
  Available: "text-crt-green-bright",
  "Booking Fast": "text-orange",
  "Fully Booked": "text-gray",
};

export default function Contact({ settings }: { settings: SiteSettings | null }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: boolean } | null>(null);

  const status = settings?.availability_status ?? "Available";

  const handleSubmit = (formData: FormData) => {
    setResult(null);
    startTransition(async () => {
      const res = await submitContactForm(formData);
      setResult(res);
      if (res?.success) {
        const form = document.getElementById("contact-form") as HTMLFormElement | null;
        form?.reset();
      }
    });
  };

  return (
    <section id="contact" className="border-t border-line bg-[#070707] px-6 py-24">
      <span className="eyebrow block text-center">Contact</span>
      <h2 className="mt-3 text-center text-[clamp(28px,4vw,44px)] font-medium">
        Let&apos;s Make Something
      </h2>

      <div className="mx-auto mt-4 flex items-center justify-center gap-2">
        <span className={`h-2 w-2 rounded-full bg-current ${STATUS_COLOR[status]}`} />
        <span className={`font-mono text-[12px] uppercase tracking-[0.15em] ${STATUS_COLOR[status]}`}>
          {status}
        </span>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-10 md:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          {settings?.email && (
            <a href={`mailto:${settings.email}`} className="block group">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gray">
                Email
              </span>
              <p className="mt-1 text-lg group-hover:text-orange transition-colors">
                {settings.email}
              </p>
            </a>
          )}
          {settings?.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="block group"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gray">
                WhatsApp
              </span>
              <p className="mt-1 text-lg group-hover:text-orange transition-colors">
                {settings.whatsapp}
              </p>
            </a>
          )}
          <div className="flex gap-4 pt-2">
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] hover:border-orange hover:text-orange"
              >
                Instagram
              </a>
            )}
            {settings?.linkedin && (
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] hover:border-orange hover:text-orange"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>

        <form id="contact-form" action={handleSubmit} className="glass rounded-2xl p-7 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              required
              placeholder="Your name"
              className="admin-input"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Your email"
              className="admin-input"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="project_type"
              placeholder="Project type (Wedding, Reel...)"
              className="admin-input"
            />
            <input name="budget" placeholder="Budget (optional)" className="admin-input" />
          </div>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Tell me about your project"
            className="admin-input resize-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-orange py-3 text-center font-mono text-[12px] uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send Message"}
          </button>
          {result?.success && (
            <p className="text-center font-mono text-[12px] text-crt-green-bright">
              Message sent — I&apos;ll get back to you soon.
            </p>
          )}
          {result?.error && (
            <p className="text-center font-mono text-[12px] text-red-400">{result.error}</p>
          )}
        </form>
      </div>
    </section>
  );
}

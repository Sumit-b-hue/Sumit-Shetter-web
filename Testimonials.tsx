"use client";

import { useState } from "react";
import type { Testimonial } from "@/lib/types";

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  if (!testimonials.length) return null;

  const t = testimonials[index];
  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="border-t border-line bg-black px-6 py-24">
      <span className="eyebrow block text-center">Reviews</span>
      <h2 className="mt-3 text-center text-[clamp(28px,4vw,44px)] font-medium">
        What Clients Say
      </h2>

      <div className="glass mx-auto mt-14 max-w-2xl rounded-2xl px-8 py-10 text-center">
        <div className="flex justify-center gap-1 text-orange">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < t.rating ? "opacity-100" : "opacity-25"}>
              ★
            </span>
          ))}
        </div>
        <p className="mt-5 text-lg leading-relaxed text-off-white/90">&ldquo;{t.quote}&rdquo;</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {t.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={t.avatar_url}
              alt={t.client_name}
              className="h-10 w-10 rounded-full object-cover border border-line"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line font-mono text-sm text-orange">
              {t.client_name.charAt(0)}
            </div>
          )}
          <div className="text-left">
            <p className="text-sm font-medium">{t.client_name}</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gray">
              {t.client_role}
            </p>
          </div>
        </div>
      </div>

      {testimonials.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-orange hover:text-orange"
          >
            ←
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? "bg-orange" : "bg-gray-dim"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-orange hover:text-orange"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}

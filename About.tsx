"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteSettings } from "@/lib/types";

function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            setVal(Math.floor(p * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{val}</span>;
}

const SOFTWARE = ["Premiere Pro", "DaVinci Resolve", "After Effects", "Photoshop", "Final Cut Pro"];

const TIMELINE = [
  { year: "2019", text: "Picked up a camera for the first time, started shooting local events." },
  { year: "2021", text: "Went full-time as a freelance editor, first commercial clients." },
  { year: "2023", text: "Expanded into wedding films and music videos across the region." },
  { year: "2026", text: "Running a full creative practice — shoot, edit, deliver." },
];

export default function About({ settings }: { settings: SiteSettings | null }) {
  return (
    <section id="about" className="border-t border-line bg-black px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <span className="eyebrow block text-center">About</span>
        <h2 className="mt-3 text-center text-[clamp(28px,4vw,44px)] font-medium">
          Behind the Cuts
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-center text-gray">
          {settings?.about_bio ||
            "I tell stories with a camera and a timeline. Every project starts with what a moment felt like, not just what it looked like — and the edit is where that feeling actually gets built."}
        </p>

        <div className="mt-16 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="font-mono text-[clamp(28px,4vw,44px)] text-orange">
              <Counter target={settings?.years_experience ?? 5} />+
            </div>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-gray">
              Years
            </p>
          </div>
          <div>
            <div className="font-mono text-[clamp(28px,4vw,44px)] text-orange">
              <Counter target={settings?.projects_completed ?? 120} />+
            </div>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-gray">
              Projects
            </p>
          </div>
          <div>
            <div className="font-mono text-[clamp(28px,4vw,44px)] text-orange">
              <Counter target={settings?.happy_clients ?? 80} />+
            </div>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-gray">
              Clients
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-16 md:grid-cols-2">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray">Timeline</h3>
            <div className="mt-6 space-y-6 border-l border-line pl-6">
              {TIMELINE.map((t) => (
                <div key={t.year} className="relative">
                  <span className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-orange" />
                  <span className="font-mono text-sm text-orange">{t.year}</span>
                  <p className="mt-1 text-sm text-gray">{t.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray">
              Tools I Cut With
            </h3>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {SOFTWARE.map((s) => (
                <span
                  key={s}
                  className="glass rounded-full px-4 py-2 font-mono text-[12px] tracking-[0.05em]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

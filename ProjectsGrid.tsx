"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import VideoPlayer from "@/components/VideoPlayer";

const ALL = "All";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState(ALL);
  const [active, setActive] = useState<Project | null>(null);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );

  const filtered = filter === ALL ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="work" className="border-t border-line bg-[#070707] px-6 py-24">
      <span className="eyebrow block text-center">Selected Work</span>
      <h2 className="mt-3 text-center text-[clamp(28px,4vw,44px)] font-medium">
        The Reel Collection
      </h2>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
              filter === c
                ? "border-orange bg-orange text-black"
                : "border-line text-gray hover:border-orange hover:text-orange"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center font-mono text-sm text-gray-dim">
          No projects here yet — add some from the admin panel.
        </p>
      ) : (
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-black-2 text-left transition-transform hover:-translate-y-1"
            >
              {p.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.thumbnail_url}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-100"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1c1a17] to-[#0c0b09]" />
              )}
              {/* VHS label strip */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-black/70 px-3 py-2 backdrop-blur-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-crt-green-bright">
                  {p.category}
                </span>
                <span className="font-mono text-[10px] text-gray">{p.year}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
                <h3 className="font-medium">{p.title}</h3>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-gray">
                  {p.client}
                </p>
              </div>
              <div className="absolute right-3 top-11 h-2 w-2 rounded-full bg-orange opacity-0 shadow-[0_0_10px_2px_#e8a23a] transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}

      {active && <VideoPlayer project={active} onClose={() => setActive(null)} />}
    </section>
  );
}

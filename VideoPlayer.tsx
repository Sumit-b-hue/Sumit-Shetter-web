"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types";

export default function VideoPlayer({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "ArrowRight" && videoRef.current) videoRef.current.currentTime += 5;
      if (e.key === "ArrowLeft" && videoRef.current) videoRef.current.currentTime -= 5;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.5];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * duration;
  };

  const fmt = (s: number) => {
    if (!s || Number.isNaN(s)) return "00:00";
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className="w-[min(900px,92vw)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-[22px] bg-gradient-to-br from-[#1c1a17] to-[#0c0b09] p-6 pb-4 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-black shadow-[inset_0_0_60px_rgba(0,0,0,0.9)]">
            {project.video_url ? (
              <video
                ref={videoRef}
                src={project.video_url}
                poster={project.thumbnail_url}
                className="h-full w-full object-cover"
                onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onClick={togglePlay}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 font-mono text-gray-dim">
                <span className="text-xl text-gray">NO SIGNAL</span>
                <span className="text-xs tracking-[0.15em]">UPLOAD A VIDEO FROM THE ADMIN PANEL</span>
              </div>
            )}
            <div className="scanlines pointer-events-none absolute inset-0" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              onClick={togglePlay}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-line bg-off-white/5 text-sm hover:border-orange hover:text-orange"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <div
              className="relative h-1.5 flex-1 min-w-[120px] cursor-pointer rounded-full bg-gray-dim"
              onClick={seek}
            >
              <div
                className="h-full rounded-full bg-orange"
                style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="min-w-[74px] text-center font-mono text-[11px] text-gray">
              {fmt(progress)} / {fmt(duration)}
            </span>
            <button
              onClick={cycleSpeed}
              className="rounded-lg border border-line px-2.5 py-1.5 font-mono text-[11px] hover:border-orange hover:text-orange"
            >
              {speed}×
            </button>
            <button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-line hover:border-orange hover:text-orange"
              aria-label="Fullscreen"
            >
              ⛶
            </button>
            <button
              onClick={onClose}
              className="ml-auto flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-line hover:border-orange hover:text-orange"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 text-center">
            <h2 className="text-[clamp(20px,2.4vw,28px)] font-medium">{project.title}</h2>
            <p className="mt-1.5 font-mono text-[12px] uppercase tracking-[0.1em] text-gray">
              {project.client} · {project.year} · {project.category}
            </p>
            {project.software?.length ? (
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-gray-dim">
                {project.software.join(" · ")}
              </p>
            ) : null}
            {project.description ? (
              <p className="mx-auto mt-3 max-w-lg text-sm text-gray">{project.description}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

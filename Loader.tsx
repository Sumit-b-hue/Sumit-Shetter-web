"use client";

import { useEffect, useState } from "react";

export default function Loader({ name }: { name: string }) {
  const [progress, setProgress] = useState(0);
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 18;
        return next >= 100 ? 100 : next;
      });
    }, 140);

    const hideTimer = setTimeout(() => setHide(true), 2100);
    const goneTimer = setTimeout(() => setGone(true), 2900);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
        hide ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange">
        Loading Reel
      </span>
      <h1 className="mt-3 font-mono text-[clamp(20px,3vw,30px)] tracking-[0.08em]">{name}</h1>
      <div className="mt-8 h-px w-[220px] overflow-hidden bg-white/10">
        <div
          className="h-full bg-orange transition-[width] duration-150 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <span className="mt-3 font-mono text-[11px] text-gray-dim">
        {Math.floor(Math.min(progress, 100))}%
      </span>
    </div>
  );
}

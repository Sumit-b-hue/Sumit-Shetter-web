"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "testimonials", label: "Reviews" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("home");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 2600);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        className={`fixed left-7 top-7 z-[500] font-mono text-[13px] tracking-[0.15em] transition-opacity duration-700 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        SUMIT <b className="text-orange">SHETTAR</b>
      </div>

      <nav
        className={`fixed right-7 top-1/2 z-[500] flex -translate-y-1/2 flex-col gap-[18px] transition-opacity duration-700 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-label={s.label}
            className={`group relative block h-[9px] w-[9px] rounded-full border transition-colors ${
              active === s.id
                ? "border-orange bg-orange"
                : "border-gray hover:border-orange hover:bg-orange"
            }`}
          >
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-gray opacity-0 transition-opacity group-hover:opacity-100">
              {s.label}
            </span>
          </a>
        ))}
      </nav>
    </>
  );
}

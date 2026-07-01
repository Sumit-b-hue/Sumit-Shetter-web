import type { Service } from "@/lib/types";

export default function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="border-t border-line bg-[#070707] px-6 py-24">
      <span className="eyebrow block text-center">Services</span>
      <h2 className="mt-3 text-center text-[clamp(28px,4vw,44px)] font-medium">
        What I Can Make For You
      </h2>

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.id}
            className={`relative flex flex-col rounded-2xl border p-7 transition-transform hover:-translate-y-1 ${
              s.featured
                ? "border-orange bg-gradient-to-b from-orange-dim/20 to-transparent"
                : "border-line bg-black-2"
            }`}
          >
            {s.featured && (
              <span className="absolute -top-3 left-7 rounded-full bg-orange px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-black">
                Most Booked
              </span>
            )}
            <h3 className="text-lg font-medium">{s.name}</h3>
            <p className="mt-1 font-mono text-sm text-orange">{s.price_label}</p>
            <p className="mt-3 text-sm text-gray">{s.description}</p>
            <ul className="mt-5 flex-1 space-y-2">
              {s.features?.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-off-white/90">
                  <span className="mt-0.5 text-orange">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="mt-6 rounded-full border border-line py-2.5 text-center font-mono text-[12px] uppercase tracking-[0.1em] transition-colors hover:border-orange hover:text-orange"
            >
              Enquire
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

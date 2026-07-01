"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/types";

type ChatMsg = { from: "bot" | "user"; text: string };

const QUICK_QUESTIONS = [
  "What services do you offer?",
  "How much does a wedding film cost?",
  "How do I book you?",
  "What's your turnaround time?",
];

function buildAnswer(question: string, settings: SiteSettings | null): string {
  const q = question.toLowerCase();
  if (q.includes("cost") || q.includes("price") || q.includes("pricing")) {
    return "Pricing depends on the project — check the Services section above for package rates, or send a message in Contact with your budget and I'll reply personally.";
  }
  if (q.includes("book") || q.includes("hire") || q.includes("available")) {
    return `Current status: ${settings?.availability_status ?? "Available"}. Fill out the contact form below and I'll confirm your dates within 24 hours.`;
  }
  if (q.includes("turnaround") || q.includes("how long") || q.includes("delivery")) {
    return "Reels typically deliver in 48 hours, wedding films in 2-3 weeks, and commercial work depends on scope — I'll give you an exact timeline after our first chat.";
  }
  if (q.includes("service")) {
    return "I offer reel & social edits, full wedding films, and commercial/brand videos — scroll up to the Services section for details on each.";
  }
  return "Thanks for reaching out! For anything specific, the fastest way to get an answer is the Contact form below — I read every message personally.";
}

export default function Chatbot({ settings }: { settings: SiteSettings | null }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { from: "bot", text: "Hey! I'm Sumit's quick assistant. Ask me anything about bookings, pricing, or turnaround time." },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const answer = buildAnswer(text, settings);
    setMessages((m) => [...m, { from: "user", text }, { from: "bot", text: answer }]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[600]">
      {open && (
        <div className="glass mb-3 w-[300px] rounded-2xl p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-orange">
              Quick Assistant
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-gray hover:text-orange">
              ✕
            </button>
          </div>

          <div className="mt-3 max-h-[240px] space-y-2 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-[13px] leading-snug ${
                  m.from === "bot"
                    ? "bg-white/5 text-off-white/90"
                    : "ml-6 bg-orange/90 text-black"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-gray hover:border-orange hover:text-orange"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="admin-input flex-1 !py-2 text-[13px]"
            />
            <button
              type="submit"
              className="rounded-lg bg-orange px-3 py-2 font-mono text-[11px] text-black hover:opacity-90"
            >
              Go
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle chat assistant"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-black shadow-[0_10px_30px_-8px_rgba(232,162,58,0.6)] transition-transform hover:scale-105"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}

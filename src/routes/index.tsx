import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Pause, Play } from "lucide-react";

import { RobotScene } from "@/components/RobotScene";
import { listLanguages } from "@/lib/vatai.functions";
import type { LanguageContent } from "@/lib/languages";
import { WHATSAPP_NUMBER } from "@/lib/languages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VAT-Ai — Multilingual AI Voice Agents for Business" },
      {
        name: "description",
        content:
          "VAT-Ai deploys AI voice agents that speak Telugu, Hindi, English and more so you can do business the smarter way. Book a live demo call with our AI.",
      },
      { property: "og:title", content: "VAT-Ai — Multilingual AI Voice Agents" },
      {
        property: "og:description",
        content:
          "AI voice agents that talk to your customers in their language. Telugu, Hindi, English & more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const qc = useQueryClient();
  const fetchLanguages = useServerFn(listLanguages);
  const { data: languages = [], isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: () => fetchLanguages(),
    staleTime: 30_000,
  });

  const [selected, setSelected] = useState<LanguageContent | null>(null);

  // Keep selected in sync if admin edits happen during the session.
  useEffect(() => {
    if (!selected) return;
    const fresh = languages.find((l) => l.code === selected.code);
    if (fresh) setSelected(fresh as LanguageContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languages]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <RobotScene />
      {/* dim overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/80" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5 md:px-10">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg neon-border font-display text-neon">
              V
            </span>
            <span className="font-display text-lg tracking-widest">VAT-Ai</span>
          </div>
          {selected && (
            <button
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Change language
            </button>
          )}
        </header>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {!selected ? (
              <HeroView
                key="hero"
                languages={languages as LanguageContent[]}
                isLoading={isLoading}
                onSelect={(l) => {
                  setSelected(l);
                  qc.invalidateQueries({ queryKey: ["languages"] });
                }}
              />
            ) : (
              <ContentView key={"content-" + selected.code} content={selected} />
            )}
          </AnimatePresence>
        </div>

        <footer className="relative z-10 flex flex-col items-center gap-2 border-t border-white/5 py-6 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} VAT-Ai. Speak the smarter way.</div>
          <Link
            to="/admin"
            className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-neon"
          >
            Admin
          </Link>
        </footer>
      </div>
    </main>
  );
}

/* ------------------------------- Hero ------------------------------- */

function HeroView({
  languages,
  isLoading,
  onSelect,
}: {
  languages: LanguageContent[];
  isLoading: boolean;
  onSelect: (l: LanguageContent) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 pt-6 text-center md:pt-10"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="mb-4 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.20_195)] shadow-[0_0_10px_oklch(0.82_0.20_195)]" />
        AI Voice Agents · Made for India
      </motion.div>

      <motion.h1
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="font-display text-[clamp(3.5rem,12vw,7.5rem)] font-bold leading-none"
      >
        <span className="text-neon">VAT</span>
        <span className="text-foreground/80">-</span>
        <span className="text-neon-2">Ai</span>
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.7 }}
        className="mt-4 max-w-xl text-balance text-sm text-muted-foreground md:text-base"
      >
        Choose a language to hear your AI agent speak. Real voices, real
        conversations, tuned for Indian businesses.
      </motion.p>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.7 }}
        className="mt-10 w-full"
      >
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {languages.map((l, i) => (
              <motion.button
                key={l.code}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.04 }}
                onClick={() => onSelect(l)}
                className="chip-lang group text-left"
              >
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-neon">
                  {String(l.sort_order).padStart(2, "0")}
                </div>
                <div className="mt-1 font-display text-xl text-foreground">
                  {l.native_name}
                </div>
                <div className="text-xs text-muted-foreground">{l.name}</div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.section>
  );
}

/* ------------------------------ Content ----------------------------- */

function ContentView({ content }: { content: LanguageContent }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-4 md:grid-cols-2 md:items-center md:gap-16"
    >
      <div>
        <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-neon">
          {content.native_name} · {content.name}
        </div>
        <h2 className="font-display text-3xl leading-tight md:text-5xl">
          {content.headline}
        </h2>

        <div className="mt-8 glass-panel rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Listen To Our AI
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.22_320)] shadow-[0_0_10px_oklch(0.72_0.22_320)]" />
          </div>
          <AudioPlayer src={content.audio_url} />
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-neon mt-8 inline-flex items-center gap-2"
        >
          {content.button_text}
          <span aria-hidden>→</span>
        </a>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="scanlines neon-border relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.22_0.05_260)] to-[oklch(0.14_0.03_265)]">
          {content.image_url ? (
            <img
              src={content.image_url}
              alt="Robot talking to customers"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
              <div className="anim-pulse-glow grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.85_0.18_195)] to-[oklch(0.55_0.2_320)]">
                <span className="font-display text-3xl text-black/70">AI</span>
              </div>
              <p className="max-w-xs px-6 text-sm text-muted-foreground">
                Robot talking to customers · upload an image in the admin panel
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}

function AudioPlayer({ src }: { src: string | null }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(false);
    ref.current?.pause();
  }, [src]);

  if (!src) {
    return (
      <div className="text-sm text-muted-foreground">
        No audio uploaded yet. Add one from the admin panel.
      </div>
    );
  }

  const toggle = async () => {
    if (!ref.current) return;
    if (ref.current.paused) {
      await ref.current.play();
      setPlaying(true);
    } else {
      ref.current.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggle}
        aria-label={playing ? "Pause AI voice sample" : "Play AI voice sample"}
        className="anim-pulse-glow grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.82_0.2_195)] to-[oklch(0.72_0.22_320)] text-black transition-transform hover:scale-105"
      >
        {playing ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
      </button>
      <div className="flex-1">
        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full w-1/3 rounded-full bg-gradient-to-r from-[oklch(0.82_0.2_195)] to-[oklch(0.72_0.22_320)] transition-all ${
              playing ? "animate-pulse" : ""
            }`}
          />
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {playing ? "Playing sample…" : "Tap play to hear the AI"}
        </div>
      </div>
      <audio ref={ref} src={src} onEnded={() => setPlaying(false)} preload="none" />
    </div>
  );
}

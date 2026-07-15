import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  BadgeCheck,
  Battery,
  Calendar,
  CheckCheck,
  Infinity as InfinityIcon,
  MessageCircle,
  MousePointerClick,
  Sparkles,
  Timer,
  Workflow,
  Zap,
} from "lucide-react";

import {
  BOOKING_WHATSAPP_URL,
  DEFAULT_SHOWCASE,
  type ShowcaseItem,
} from "@/lib/showcase";
import { listShowcase } from "@/lib/vatai.functions";

/* ------------------------------ Section wrapper ---------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.35em] text-neon">
      <span className="h-px w-6 bg-[oklch(0.82_0.20_195)]/60" />
      {children}
      <span className="h-px w-6 bg-[oklch(0.82_0.20_195)]/60" />
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-3xl leading-tight md:text-5xl">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-sm text-muted-foreground md:text-base">{subtitle}</p>
      )}
    </div>
  );
}

/* ------------------------------ Problem section ---------------------------- */

const PROBLEMS = [
  {
    icon: Timer,
    title: "The Lead Bleed",
    body: "60% of leads go cold because manual agents can't call them within the first 5 minutes.",
    stat: "60%",
    accent: "from-[oklch(0.82_0.20_195)] to-[oklch(0.72_0.22_320)]",
  },
  {
    icon: Battery,
    title: "The Burnout Wall",
    body: "Human agents get fatigued by repetitive dials, wrong numbers, and busy signals — draining operational speed.",
    stat: "8h",
    accent: "from-[oklch(0.72_0.22_320)] to-[oklch(0.72_0.18_30)]",
  },
  {
    icon: InfinityIcon,
    title: "Limitless Scale",
    body: "A human caps out at ~100 calls a day. VYAt-AI dials thousands simultaneously without missing a beat.",
    stat: "∞",
    accent: "from-[oklch(0.85_0.18_150)] to-[oklch(0.82_0.20_195)]",
  },
];

export function ProblemSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="Manual Calling Hurdles"
        title={
          <>
            What is <span className="text-neon">manual calling</span> costing your
            business every day?
          </>
        }
        subtitle="Every minute a lead waits, a competitor picks up. Here's where revenue leaks before you even see it."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="glass-panel group relative overflow-hidden rounded-2xl p-6"
          >
            <div
              className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${p.accent} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`}
            />
            <div className="relative flex items-start justify-between">
              <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${p.accent} text-black shadow-lg`}>
                <p.icon className="h-5 w-5" />
              </div>
              <div className="font-display text-3xl text-neon">{p.stat}</div>
            </div>
            <h3 className="mt-5 font-display text-xl">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {p.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------- Revenue Loss Calculator ------------------------- */

const USD_TO_INR = 83;
type Currency = "USD" | "INR";

function formatMoney(n: number, currency: Currency) {
  if (currency === "INR") {
    return "₹" + Math.round(n * USD_TO_INR).toLocaleString("en-IN");
  }
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}


export function RevenueCalculator() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [leads, setLeads] = useState(1000);
  const [ticket, setTicket] = useState(100);
  const [close, setClose] = useState(10);

  const loss = useMemo(() => {
    const lostLeads = leads * 0.4;
    const lostDeals = lostLeads * (close / 100);
    return Math.round(lostDeals * ticket);
  }, [leads, ticket, close]);


  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="Revenue Loss Calculator"
        title={
          <>
            Stop the leakage.{" "}
            <span className="text-neon-2">See what you're losing.</span>
          </>
        }
        subtitle="Drag the sliders to match your business. The counter below updates live."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-5 lg:gap-10">
        <div className="glass-panel rounded-2xl p-6 lg:col-span-3">
          <Slider
            label="Average Monthly Leads"
            value={leads}
            min={100}
            max={10000}
            step={50}
            display={leads.toLocaleString()}
            onChange={setLeads}
          />
          <Slider
            label="Average Deal Value / Ticket Size"
            value={ticket}
            min={10}
            max={5000}
            step={10}
            display={formatMoney(ticket, currency)}
            onChange={setTicket}
          />
          <Slider
            label="Current Close Rate"
            value={close}
            min={1}
            max={50}
            step={1}
            display={`${close}%`}
            onChange={setClose}
            last
          />
        </div>

        <div className="relative lg:col-span-2">
          <div className="neon-border scanlines relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[oklch(0.20_0.05_265)] to-[oklch(0.14_0.03_265)] p-8 text-center">
            <div className="absolute inset-0 opacity-40 [background:radial-gradient(400px_200px_at_50%_0%,oklch(0.72_0.22_320/0.35),transparent_70%)]" />
            <div className="relative">
              <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-xs">
                {(["USD", "INR"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`rounded-full px-3 py-1 font-medium transition ${
                      currency === c
                        ? "bg-gradient-to-r from-[oklch(0.82_0.20_195)] to-[oklch(0.72_0.22_320)] text-black"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c === "USD" ? "$ USD" : "₹ INR"}
                  </button>
                ))}
              </div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                Estimated Monthly Revenue Loss
              </div>
              <motion.div
                key={loss + currency}
                initial={{ scale: 0.96, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="mt-3 font-display text-5xl leading-none md:text-6xl"
              >
                <span className="bg-gradient-to-r from-[oklch(0.82_0.20_195)] to-[oklch(0.72_0.22_320)] bg-clip-text text-transparent">
                  {formatMoney(loss, currency)}
                </span>
              </motion.div>
              <div className="mt-2 text-xs text-muted-foreground">
                ≈ {formatMoney(loss, currency === "USD" ? "INR" : "USD")}
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                VYAt-AI can help you recover these lost conversions instantly.
              </p>

              <a href={BOOKING_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-neon mt-6 inline-flex items-center gap-2">
                Recover my revenue <Sparkles className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  last,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
  last?: boolean;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={last ? "" : "mb-8"}>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </label>
        <span className="font-display text-lg text-neon">{display}</span>
      </div>
      <div className="relative">
        <div className="h-2 rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[oklch(0.82_0.20_195)] to-[oklch(0.72_0.22_320)] shadow-[0_0_18px_oklch(0.82_0.20_195/0.5)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[oklch(0.82_0.20_195)]
            [&::-webkit-slider-thumb]:shadow-[0_0_16px_oklch(0.82_0.20_195/0.9)]
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:bg-[oklch(0.82_0.20_195)]"
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/60">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

/* ---------------------------- Smart Integrations --------------------------- */

const INTEGRATION_CHIPS = [
  { icon: Workflow, label: "CRM" },
  { icon: MousePointerClick, label: "Web Actions" },
  { icon: MessageCircle, label: "WhatsApp & SMS" },
  { icon: Calendar, label: "Calendars" },
  { icon: Zap, label: "Zapier / Make" },
  { icon: BadgeCheck, label: "APIs & Webhooks" },
];

export function IntegrationsSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="Smart Integrations"
        title={
          <>
            Seamless integration. <span className="text-neon">Continuous growth.</span>
          </>
        }
        subtitle="VYAt-AI acts as an intelligent automation layer, triggering calls directly from your CRMs, web actions, and messaging apps — no engineering team required."
      />

      <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-3">
        {INTEGRATION_CHIPS.map((c) => (
          <div
            key={c.label}
            className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground"
          >
            <c.icon className="h-4 w-4 text-neon" />
            {c.label}
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------- Showcase / Use Cases -------------------------- */

export function ShowcaseGrid() {
  const fetchShowcase = useServerFn(listShowcase);
  const { data: rawItems, isLoading } = useQuery({
    queryKey: ["showcase"],
    queryFn: () => fetchShowcase(),
    staleTime: 30_000,
  });

  const items: ShowcaseItem[] =
    rawItems && rawItems.length > 0
      ? (rawItems as ShowcaseItem[])
      : isLoading
        ? []
        : DEFAULT_SHOWCASE;

  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-8">
      <SectionHeader
        eyebrow="Omnichannel Use-Cases"
        title={
          <>
            One AI voice, <span className="text-neon-2">every trigger.</span>
          </>
        }
        subtitle="See how VYAt-AI plugs into the tools you already use to start conversations at the perfect moment."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/5" />
            ))
          : items.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="glass-panel group overflow-hidden rounded-2xl"
            >
              <div className="scanlines relative aspect-video w-full overflow-hidden bg-gradient-to-br from-[oklch(0.22_0.05_265)] to-[oklch(0.14_0.03_265)]">
                {item.media_url ? (
                  item.media_type === "video" ? (
                    <video
                      src={item.media_url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.media_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="anim-pulse-glow grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.85_0.18_195)] to-[oklch(0.55_0.2_320)] text-black">
                      <Sparkles className="h-8 w-8" />
                    </div>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.article>
          ))}
      </div>
    </section>
  );
}

/* --------------------------------- Pricing -------------------------------- */

interface Tier {
  name: string;
  subtitle: string;
  priceUsd: string;
  priceInr: string;
  cadence?: string;
  features: string[];
  highlighted?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Starter",
    subtitle: "For small teams beginning automation.",
    priceUsd: "$93.51",
    priceInr: "₹8,299",
    cadence: "/mo",
    features: [
      "1,000 AI Minutes",
      "Basic Voice Models",
      "Email Support",
      "Standard Integration",
    ],
  },
  {
    name: "Professional",
    subtitle: "For growing businesses scaling up.",
    priceUsd: "$259.77",
    priceInr: "₹24,999",
    cadence: "/mo",
    highlighted: true,
    features: [
      "5,000 AI Minutes",
      "Premium Voices",
      "24/7 Priority Support",
      "Multi-Language Support",
    ],
  },
  {
    name: "Enterprise",
    subtitle: "Custom solutions for large scale.",
    priceUsd: "Custom",
    priceInr: "Custom",
    features: [
      "Special CRM",
      "Voice Cloning",
      "Complete Automation integrations",
      "Custom Engineering",
    ],
  },
];


export function PricingSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeader
        eyebrow="Pricing Tiers"
        title={
          <>
            Simple. Scalable.{" "}
            <span className="text-neon">Transparent.</span>
          </>
        }
        subtitle="Start where you are, scale when you're ready. No hidden fees — ever."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {TIERS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`relative flex flex-col rounded-2xl p-7 ${
              t.highlighted
                ? "neon-border bg-gradient-to-b from-[oklch(0.22_0.05_265)] to-[oklch(0.16_0.03_265)] shadow-[0_0_60px_oklch(0.82_0.20_195/0.25)]"
                : "glass-panel"
            }`}
          >
            {t.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[oklch(0.82_0.20_195)] to-[oklch(0.72_0.22_320)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-black">
                Most Popular
              </div>
            )}
            <h3 className="font-display text-2xl">{t.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
            <div className="mt-6">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl">{t.priceUsd}</span>
                {t.cadence && (
                  <span className="text-sm text-muted-foreground">{t.cadence}</span>
                )}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t.priceInr === "Custom" ? "Tailored INR pricing" : (
                  <>≈ <span className="text-foreground/90">{t.priceInr}</span>{t.cadence}</>
                )}
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex items-center text-[oklch(0.78_0.18_150)]">
                    <CheckCheck className="h-4 w-4" />
                  </span>
                  <span className="text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href={BOOKING_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  t.highlighted
                    ? "btn-neon block w-full text-center"
                    : "block w-full rounded-lg border border-white/10 bg-white/5 py-3 text-center text-sm font-medium text-foreground transition hover:border-[oklch(0.82_0.20_195)] hover:bg-white/10"
                }
              >
                Get Started
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center text-center">
        <p className="text-sm text-muted-foreground">
          Not sure which tier fits? Talk to us in 60 seconds.
        </p>
        <a
          href={BOOKING_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-neon mt-4 inline-flex items-center gap-2 px-7 py-3.5 text-base"
        >
          Book a Live Demo <Sparkles className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

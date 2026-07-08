/**
 * 3D-ish animated robot placeholder built with layered CSS/SVG orbs & rings.
 * Zero external deps; renders behind the hero content.
 */
export function RobotScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Backdrop grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.82 0.2 195 / 0.35) 1px, transparent 1px), linear-gradient(90deg, oklch(0.82 0.2 195 / 0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Rotating rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [perspective:800px]">
        <div className="anim-ring-spin relative h-[520px] w-[520px] max-w-[90vw] max-h-[90vw] [transform-style:preserve-3d]">
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <div
              key={deg}
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: "oklch(0.82 0.20 195 / 0.35)",
                transform: `rotateX(${deg}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Central orb "robot core" */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 anim-orb-float">
        <div
          className="anim-pulse-glow relative flex h-52 w-52 items-center justify-center rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, oklch(0.95 0.05 195), oklch(0.55 0.18 260) 55%, oklch(0.20 0.05 265) 100%)",
          }}
        >
          {/* Robot face plate */}
          <div className="absolute inset-8 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm">
            <div className="flex h-full items-center justify-around px-6">
              <span className="h-3 w-3 rounded-full bg-[oklch(0.85_0.18_195)] shadow-[0_0_16px_oklch(0.85_0.18_195)]" />
              <span className="h-3 w-3 rounded-full bg-[oklch(0.85_0.18_195)] shadow-[0_0_16px_oklch(0.85_0.18_195)]" />
            </div>
            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-[oklch(0.72_0.22_320)] shadow-[0_0_10px_oklch(0.72_0.22_320)]" />
          </div>
        </div>
      </div>

      {/* Floating particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="anim-orb-float absolute h-1.5 w-1.5 rounded-full"
          style={{
            top: `${(i * 53) % 100}%`,
            left: `${(i * 37) % 100}%`,
            background:
              i % 2 === 0 ? "oklch(0.85 0.18 195)" : "oklch(0.72 0.22 320)",
            boxShadow:
              i % 2 === 0
                ? "0 0 12px oklch(0.85 0.18 195)"
                : "0 0 12px oklch(0.72 0.22 320)",
            animationDelay: `${(i % 6) * 0.6}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

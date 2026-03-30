interface HeroSectionProps {
  serverCount: number;
  onSubmitClick?: () => void;
}

export default function HeroSection({
  serverCount,
  onSubmitClick,
}: HeroSectionProps) {
  const scrollToServers = () => {
    document
      .getElementById("server-listing")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Top announcement banner */}
      <div
        className="w-full text-center py-2 px-4"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.55 0.22 50) 0%, oklch(0.62 0.24 60) 50%, oklch(0.55 0.22 50) 100%)",
          boxShadow: "0 2px 12px oklch(0.6 0.22 55 / 0.4)",
        }}
      >
        <p
          className="font-vt323 text-white"
          style={{ fontSize: "18px", letterSpacing: "0.5px" }}
        >
          🔥 Find the Best Minecraft Servers – Updated Daily!
        </p>
      </div>

      <section
        className="hero-grid relative overflow-hidden py-20 md:py-32"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.09 0.02 255), oklch(0.11 0.03 260))",
        }}
      >
        {/* Radial glow blobs */}
        <div
          className="pointer-events-none absolute left-1/4 top-1/4 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.85 0.15 200 / 0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="pointer-events-none absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.55 0.22 285 / 0.12) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 text-center">
          {/* SEO H1 */}
          <h1
            className="font-pixel neon-cyan mb-6 leading-relaxed"
            style={{ fontSize: "clamp(14px, 3vw, 26px)" }}
          >
            Best Minecraft Servers 2026
            <br />
            <span
              className="neon-magenta"
              style={{ fontSize: "clamp(18px, 4vw, 32px)" }}
            >
              MINE LISTER
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="font-vt323 text-muted-foreground mb-3"
            style={{ fontSize: "26px" }}
          >
            India&apos;s Most Popular Minecraft Server List
          </p>

          {/* Dynamic server count */}
          <p className="font-vt323 mb-8" style={{ fontSize: "22px" }}>
            <span className="text-muted-foreground">Explore </span>
            <span className="neon-gold font-bold">{serverCount}</span>
            <span className="text-muted-foreground"> Minecraft Servers</span>
          </p>

          {/* CTA button */}
          <button
            type="button"
            onClick={scrollToServers}
            className="font-pixel inline-block cursor-pointer border-2 border-primary px-8 py-4 text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-neon active:scale-95"
            style={{ fontSize: "10px" }}
            data-ocid="hero.primary_button"
          >
            ▶ BROWSE SERVERS
          </button>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: "✅", label: "New servers added daily" },
              { icon: "🚀", label: "Fast-growing server list" },
              { icon: "👥", label: "Active community" },
            ].map((item) => (
              <span
                key={item.label}
                className="font-vt323 flex items-center gap-1.5 px-4 py-1.5 rounded-full"
                style={{
                  fontSize: "15px",
                  color: "oklch(0.78 0.12 215)",
                  background: "oklch(0.14 0.04 255 / 0.8)",
                  border: "1px solid oklch(0.35 0.1 255 / 0.4)",
                }}
              >
                {item.icon} {item.label}
              </span>
            ))}
          </div>

          {/* Total Servers stat */}
          <div className="mt-8 flex justify-center">
            <div
              className="font-vt323 flex min-w-[140px] flex-col items-center rounded-lg px-6 py-3"
              style={{
                background: "oklch(0.13 0.03 200 / 0.6)",
                border: "1px solid oklch(0.85 0.15 200 / 0.4)",
                boxShadow: "0 0 12px oklch(0.85 0.15 200 / 0.15)",
              }}
              data-ocid="hero.panel"
            >
              <span style={{ fontSize: "28px", color: "oklch(0.85 0.15 200)" }}>
                {serverCount > 0 ? serverCount.toLocaleString("en-IN") : "–"}
              </span>
              <span style={{ fontSize: "14px", color: "oklch(0.65 0.08 200)" }}>
                🖥 Total Servers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section below hero */}
      <div
        className="w-full py-8 px-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.13 0.04 255 / 0.9), oklch(0.15 0.06 285 / 0.9))",
          borderTop: "1px solid oklch(0.35 0.1 255 / 0.3)",
          borderBottom: "1px solid oklch(0.35 0.1 255 / 0.3)",
        }}
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p
              className="font-pixel neon-cyan mb-1"
              style={{ fontSize: "clamp(8px, 1.5vw, 12px)" }}
            >
              Own a Minecraft Server?
            </p>
            <p
              className="font-vt323 text-muted-foreground"
              style={{ fontSize: "18px" }}
            >
              Add your server now and grow your player base!
            </p>
          </div>
          <button
            type="button"
            onClick={onSubmitClick}
            className="font-pixel flex-shrink-0 cursor-pointer border-2 px-6 py-3 transition-all duration-200 active:scale-95"
            style={{
              fontSize: "9px",
              color: "oklch(0.82 0.22 285)",
              borderColor: "oklch(0.55 0.22 285)",
              background: "oklch(0.55 0.22 285 / 0.12)",
              boxShadow: "0 0 12px oklch(0.55 0.22 285 / 0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.55 0.22 285 / 0.25)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 20px oklch(0.55 0.22 285 / 0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.55 0.22 285 / 0.12)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 12px oklch(0.55 0.22 285 / 0.3)";
            }}
            data-ocid="hero.secondary_button"
          >
            Submit Your Server →
          </button>
        </div>
      </div>
    </>
  );
}

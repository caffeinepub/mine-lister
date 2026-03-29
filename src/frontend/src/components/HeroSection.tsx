import type { ServerStats } from "../utils/serverStats";

interface HeroSectionProps {
  serverCount: number;
  stats: ServerStats;
}

export default function HeroSection({ serverCount, stats }: HeroSectionProps) {
  const scrollToServers = () => {
    document
      .getElementById("server-listing")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const allZero =
    stats.totalServers === 0 &&
    stats.totalPlayers === 0 &&
    stats.totalVotes === 0;

  const fmt = (n: number) => (allZero ? "–" : n.toLocaleString("en-IN"));

  return (
    <section
      className="hero-grid relative overflow-hidden py-24 md:py-36"
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
          Best Minecraft Servers (Cracked &amp; Premium)
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
        <p className="font-vt323 mb-10" style={{ fontSize: "22px" }}>
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

        {/* Overview Stats Bar */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          {/* Total Servers */}
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
              {fmt(stats.totalServers)}
            </span>
            <span style={{ fontSize: "14px", color: "oklch(0.65 0.08 200)" }}>
              🖥 Total Servers
            </span>
          </div>

          {/* Players Online */}
          <div
            className="font-vt323 flex min-w-[140px] flex-col items-center rounded-lg px-6 py-3"
            style={{
              background: "oklch(0.13 0.03 160 / 0.6)",
              border: "1px solid oklch(0.78 0.2 160 / 0.4)",
              boxShadow: "0 0 12px oklch(0.78 0.2 160 / 0.15)",
            }}
          >
            <span style={{ fontSize: "28px", color: "oklch(0.78 0.2 160)" }}>
              {fmt(stats.totalPlayers)}
            </span>
            <span style={{ fontSize: "14px", color: "oklch(0.60 0.1 160)" }}>
              👥 Players Online
            </span>
          </div>

          {/* Total Votes */}
          <div
            className="font-vt323 flex min-w-[140px] flex-col items-center rounded-lg px-6 py-3"
            style={{
              background: "oklch(0.13 0.03 80 / 0.6)",
              border: "1px solid oklch(0.82 0.15 80 / 0.4)",
              boxShadow: "0 0 12px oklch(0.82 0.15 80 / 0.15)",
            }}
          >
            <span style={{ fontSize: "28px", color: "oklch(0.82 0.15 80)" }}>
              {fmt(stats.totalVotes)}
            </span>
            <span style={{ fontSize: "14px", color: "oklch(0.65 0.08 80)" }}>
              ⭐ Total Votes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

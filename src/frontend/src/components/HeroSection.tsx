interface HeroSectionProps {
  serverCount: number;
}

export default function HeroSection({ serverCount }: HeroSectionProps) {
  const scrollToServers = () => {
    document
      .getElementById("server-listing")
      ?.scrollIntoView({ behavior: "smooth" });
  };

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
        {/* Main heading */}
        <h1
          className="font-pixel neon-cyan mb-6 leading-relaxed"
          style={{ fontSize: "clamp(14px, 3vw, 26px)" }}
        >
          WELCOME TO
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
      </div>
    </section>
  );
}

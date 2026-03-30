import { ArrowRight } from "lucide-react";
import type { ServerData } from "../utils/sheetsParser";

interface ServerCardProps {
  server: ServerData;
  index: number;
  rating?: number;
  onServerClick?: (server: ServerData) => void;
  onTagClick?: (tag: string) => void;
}

const TAG_COLORS: Record<string, string> = {
  New: "oklch(0.72 0.25 320)",
  Hardcore: "oklch(0.65 0.22 20)",
  PvP: "oklch(0.65 0.22 20)",
  Economy: "oklch(0.82 0.15 80)",
  Jobs: "oklch(0.82 0.15 80)",
  Skyblock: "oklch(0.75 0.18 200)",
  Factions: "oklch(0.65 0.22 20)",
  Creative: "oklch(0.72 0.2 140)",
  Building: "oklch(0.72 0.2 140)",
  Minigames: "oklch(0.75 0.2 290)",
  Fun: "oklch(0.75 0.2 290)",
  BedWars: "oklch(0.72 0.22 200)",
};

const BANNER_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.18 0.08 255) 0%, oklch(0.22 0.12 285) 50%, oklch(0.15 0.06 200) 100%)",
  "linear-gradient(135deg, oklch(0.15 0.09 285) 0%, oklch(0.20 0.10 320) 50%, oklch(0.18 0.07 255) 100%)",
  "linear-gradient(135deg, oklch(0.18 0.07 200) 0%, oklch(0.15 0.09 255) 50%, oklch(0.20 0.08 285) 100%)",
  "linear-gradient(135deg, oklch(0.16 0.08 320) 0%, oklch(0.18 0.10 255) 50%, oklch(0.22 0.09 200) 100%)",
  "linear-gradient(135deg, oklch(0.20 0.10 160) 0%, oklch(0.16 0.07 255) 50%, oklch(0.18 0.08 285) 100%)",
];

const LOGO_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.2 0.08 255), oklch(0.15 0.06 285))",
  "linear-gradient(135deg, oklch(0.15 0.06 285), oklch(0.2 0.08 200))",
  "linear-gradient(135deg, oklch(0.2 0.08 200), oklch(0.15 0.06 255))",
  "linear-gradient(135deg, oklch(0.18 0.07 320), oklch(0.18 0.07 255))",
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="font-vt323"
          style={{
            fontSize: "14px",
            color:
              star <= rating ? "oklch(0.82 0.15 80)" : "oklch(0.35 0.04 255)",
          }}
        >
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export default function ServerCard({
  server,
  index,
  rating = 0,
  onServerClick,
  onTagClick,
}: ServerCardProps) {
  const bannerGradient = BANNER_GRADIENTS[index % BANNER_GRADIENTS.length];
  const logoGradient = LOGO_GRADIENTS[index % LOGO_GRADIENTS.length];

  const isNew = index < 2;
  const isTrending = index >= 2 && index <= 4;

  return (
    <article
      className={`server-card group rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:scale-[1.02] ${
        server.featured ? "featured-border" : "border border-border"
      }`}
      style={{
        background: "oklch(0.12 0.025 255)",
        boxShadow: "0 2px 12px oklch(0 0 0 / 0.4)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = server.featured
          ? "0 0 20px oklch(0.85 0.15 200 / 0.3), 0 4px 24px oklch(0 0 0 / 0.5)"
          : "0 0 16px oklch(0.55 0.18 255 / 0.25), 0 4px 24px oklch(0 0 0 / 0.5)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 2px 12px oklch(0 0 0 / 0.4)";
      }}
      data-ocid={`server.item.${index + 1}`}
    >
      {/* Banner image */}
      <div
        className="relative w-full overflow-hidden flex-shrink-0"
        style={{ height: "120px" }}
      >
        {server.imageURL ? (
          <img
            src={server.imageURL}
            alt={`${server.name} banner`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: bannerGradient }}
            aria-hidden="true"
          >
            {/* Subtle noise texture overlay */}
            <div
              className="w-full h-full opacity-20"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />
          </div>
        )}

        {/* Badges overlaid on banner */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          {isNew && (
            <span
              className="font-pixel px-2 py-0.5 rounded text-white"
              style={{
                fontSize: "7px",
                background:
                  "linear-gradient(90deg, oklch(0.55 0.22 160), oklch(0.5 0.2 140))",
                boxShadow: "0 0 8px oklch(0.5 0.2 160 / 0.5)",
              }}
            >
              ✦ NEW
            </span>
          )}
          {isTrending && (
            <span
              className="font-pixel px-2 py-0.5 rounded text-white"
              style={{
                fontSize: "7px",
                background:
                  "linear-gradient(90deg, oklch(0.62 0.22 50), oklch(0.58 0.2 30))",
                boxShadow: "0 0 8px oklch(0.6 0.2 50 / 0.5)",
              }}
            >
              🔥 TRENDING
            </span>
          )}
          {server.featured && (
            <span
              className="font-pixel px-2 py-0.5 rounded"
              style={{
                fontSize: "7px",
                color: "oklch(0.82 0.15 80)",
                background: "oklch(0.82 0.15 80 / 0.15)",
                border: "1px solid oklch(0.82 0.15 80 / 0.5)",
                backdropFilter: "blur(4px)",
              }}
            >
              ★ FEATURED
            </span>
          )}
        </div>

        {/* Server type badge top-right */}
        <div className="absolute top-2 right-2">
          <span
            className="font-vt323 px-2 py-0 rounded border"
            style={{
              fontSize: "13px",
              backdropFilter: "blur(4px)",
              color:
                server.serverType === "Premium"
                  ? "oklch(0.85 0.15 200)"
                  : "oklch(0.7 0.22 285)",
              borderColor:
                server.serverType === "Premium"
                  ? "oklch(0.85 0.15 200 / 0.5)"
                  : "oklch(0.55 0.22 285 / 0.5)",
              background:
                server.serverType === "Premium"
                  ? "oklch(0.85 0.15 200 / 0.15)"
                  : "oklch(0.55 0.22 285 / 0.15)",
            }}
          >
            {server.serverType === "Premium" ? "⚡ PREMIUM" : "🔓 CRACKED"}
          </span>
        </div>
      </div>

      {/* Horizontal row: logo + info */}
      <div className="flex flex-row p-3 gap-3">
        {/* Logo square */}
        <div className="flex-shrink-0">
          <div
            className="rounded-lg overflow-hidden flex items-center justify-center"
            style={{ width: "76px", height: "76px", minWidth: "76px" }}
          >
            {server.imageURL ? (
              <img
                src={server.imageURL}
                alt={`${server.name} logo`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: logoGradient }}
                aria-label={`${server.name} server placeholder`}
              >
                <span
                  className="font-pixel text-foreground/40"
                  style={{ fontSize: "9px" }}
                >
                  {server.name.slice(0, 3).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Server name */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className={`font-pixel leading-relaxed ${
                server.featured ? "neon-cyan" : "text-foreground"
              }`}
              style={{ fontSize: "9px" }}
            >
              {server.name}
            </h3>
            {rating > 0 && <StarRating rating={rating} />}
          </div>

          {/* Description */}
          <p
            className="font-vt323 text-muted-foreground line-clamp-2 mb-2"
            style={{ fontSize: "15px", lineHeight: "1.3" }}
          >
            {server.description}
          </p>

          {/* Version + Gamemode */}
          <span
            className="font-vt323 text-muted-foreground"
            style={{ fontSize: "13px" }}
          >
            <span style={{ color: "oklch(0.75 0.18 215)" }}>
              v{server.version}
            </span>{" "}
            ·{" "}
            <span style={{ color: "oklch(0.72 0.18 285)" }}>
              {server.gamemode}
            </span>
          </span>
        </div>
      </div>

      {/* Tags row */}
      {server.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 px-3 pb-2">
          {server.tags.map((tag) =>
            onTagClick ? (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(tag)}
                className="font-vt323 px-2 py-0 rounded-full cursor-pointer transition-all duration-150 hover:brightness-125 hover:scale-105"
                style={{
                  fontSize: "12px",
                  color: TAG_COLORS[tag] ?? "oklch(0.72 0.03 240)",
                  background: "oklch(0.16 0.02 255)",
                  border: `1px solid ${TAG_COLORS[tag] ?? "oklch(0.72 0.03 240)"}/30`,
                }}
              >
                #{tag}
              </button>
            ) : (
              <span
                key={tag}
                className="font-vt323 px-2 py-0 rounded-full"
                style={{
                  fontSize: "12px",
                  color: TAG_COLORS[tag] ?? "oklch(0.72 0.03 240)",
                  background: "oklch(0.16 0.02 255)",
                  border: `1px solid ${TAG_COLORS[tag] ?? "oklch(0.72 0.03 240)"}/30`,
                }}
              >
                #{tag}
              </span>
            ),
          )}
        </div>
      )}

      {/* View Details button */}
      {onServerClick && (
        <div className="px-3 pb-3 mt-auto">
          <button
            type="button"
            onClick={() => onServerClick(server)}
            className="font-pixel w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all duration-200 hover:bg-primary/20 group-hover:border-primary/60"
            style={{
              fontSize: "8px",
              color: "oklch(0.80 0.20 255)",
              borderColor: "oklch(0.45 0.18 255 / 0.5)",
              background: "oklch(0.45 0.18 255 / 0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 12px oklch(0.65 0.22 255 / 0.4), 0 0 24px oklch(0.55 0.18 255 / 0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
            data-ocid={`server.secondary_button.${index + 1}`}
          >
            View Details
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </article>
  );
}

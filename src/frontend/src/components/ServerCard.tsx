import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { ServerData } from "../utils/sheetsParser";

interface ServerCardProps {
  server: ServerData;
  index: number;
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
};

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.2 0.08 255), oklch(0.15 0.06 285))",
  "linear-gradient(135deg, oklch(0.15 0.06 285), oklch(0.2 0.08 200))",
  "linear-gradient(135deg, oklch(0.2 0.08 200), oklch(0.15 0.06 255))",
  "linear-gradient(135deg, oklch(0.18 0.07 320), oklch(0.18 0.07 255))",
];

export default function ServerCard({
  server,
  index,
  onServerClick,
  onTagClick,
}: ServerCardProps) {
  const [copied, setCopied] = useState(false);

  const ipValue = server.ip?.trim() ?? "";
  const hasIP = ipValue.length > 0;

  const handleCopy = async () => {
    if (!hasIP) return;
    try {
      await navigator.clipboard.writeText(ipValue);
    } catch {
      const el = document.createElement("textarea");
      el.value = ipValue;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const placeholderBg =
    PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];

  return (
    <article
      className={`server-card rounded-lg overflow-hidden ${
        server.featured ? "featured-border" : "border border-border"
      }`}
      style={{ background: "oklch(0.12 0.025 255)" }}
      data-ocid={`server.item.${index + 1}`}
    >
      {/* Server image */}
      <div className="relative h-32 overflow-hidden">
        {server.imageURL ? (
          <img
            src={server.imageURL}
            alt={`${server.name} Minecraft server banner`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center"
            style={{ background: placeholderBg }}
            aria-label={`${server.name} server placeholder`}
          >
            <span
              className="font-pixel text-foreground/30"
              style={{ fontSize: "8px" }}
            >
              {server.name.slice(0, 3).toUpperCase()}
            </span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, oklch(0.12 0.025 255) 100%)",
          }}
        />
      </div>

      {/* Card content */}
      <div className="p-4">
        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-3">
          {server.featured && (
            <span
              className="font-pixel neon-gold text-xs px-2 py-1 border rounded"
              style={{
                fontSize: "7px",
                borderColor: "oklch(0.82 0.15 80 / 0.5)",
                background: "oklch(0.82 0.15 80 / 0.1)",
              }}
            >
              ★ FEATURED
            </span>
          )}
          <span
            className="font-vt323 text-sm px-2 py-0.5 rounded border"
            style={{
              fontSize: "14px",
              color:
                server.serverType === "Premium"
                  ? "oklch(0.85 0.15 200)"
                  : "oklch(0.7 0.22 285)",
              borderColor:
                server.serverType === "Premium"
                  ? "oklch(0.85 0.15 200 / 0.4)"
                  : "oklch(0.55 0.22 285 / 0.4)",
              background:
                server.serverType === "Premium"
                  ? "oklch(0.85 0.15 200 / 0.1)"
                  : "oklch(0.55 0.22 285 / 0.1)",
            }}
          >
            {server.serverType === "Premium" ? "⚡ PREMIUM" : "🔓 CRACKED"}
          </span>
        </div>

        {/* Server name - H3 for proper heading hierarchy */}
        <h3
          className={`font-pixel mb-2 leading-relaxed ${
            server.featured ? "neon-cyan" : "text-foreground"
          }`}
          style={{ fontSize: "9px" }}
        >
          {server.name}
        </h3>

        {/* Description */}
        <p
          className="font-vt323 text-muted-foreground mb-3 line-clamp-2"
          style={{ fontSize: "17px", lineHeight: "1.3" }}
        >
          {server.description}
        </p>

        {/* Tags */}
        {server.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {server.tags.map((tag) =>
              onTagClick ? (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick(tag)}
                  className="font-vt323 text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all duration-150 hover:brightness-125 hover:scale-105"
                  style={{
                    fontSize: "13px",
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
                  className="font-vt323 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    fontSize: "13px",
                    color: TAG_COLORS[tag] ?? "oklch(0.72 0.03 240)",
                    background: "oklch(0.16 0.02 255)",
                    border: `1px solid ${TAG_COLORS[tag] ?? "oklch(0.72 0.03 240)"}/30`,
                  }}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        )}

        {/* Server IP Section */}
        <div
          className="rounded-md px-3 py-2 mb-3"
          style={{
            background: "oklch(0.10 0.03 255)",
            border: "1px solid oklch(0.35 0.1 255 / 0.4)",
          }}
        >
          <p
            className="font-pixel mb-1"
            style={{ fontSize: "7px", color: "oklch(0.55 0.08 255)" }}
          >
            SERVER IP
          </p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              {hasIP ? (
                <>
                  <span
                    className="font-vt323 font-bold block truncate"
                    style={{ fontSize: "18px", color: "oklch(0.88 0.12 215)" }}
                  >
                    IP: {ipValue}
                  </span>
                  <span
                    className="font-vt323"
                    style={{ fontSize: "12px", color: "oklch(0.5 0.06 255)" }}
                  >
                    Click to copy
                  </span>
                </>
              ) : (
                <span
                  className="font-vt323"
                  style={{ fontSize: "16px", color: "oklch(0.45 0.04 255)" }}
                >
                  IP not available
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!hasIP}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                color: copied ? "oklch(0.78 0.2 160)" : "oklch(0.78 0.18 215)",
                border: `1px solid ${
                  copied
                    ? "oklch(0.6 0.2 160 / 0.5)"
                    : "oklch(0.5 0.15 215 / 0.5)"
                }`,
                background: copied
                  ? "oklch(0.6 0.2 160 / 0.08)"
                  : "oklch(0.5 0.15 215 / 0.08)",
              }}
              title={hasIP ? `Copy IP: ${ipValue}` : "No IP available"}
              data-ocid={`server.button.${index + 1}`}
              onMouseEnter={(e) => {
                if (!hasIP) return;
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 8px oklch(0.7 0.2 215 / 0.6), 0 0 16px oklch(0.6 0.18 215 / 0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span className="font-vt323" style={{ fontSize: "14px" }}>
                    Copied ✓
                  </span>
                </>
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Footer row: version + gamemode */}
        <div className="flex items-center justify-between mt-auto">
          <span
            className="font-vt323 text-muted-foreground"
            style={{ fontSize: "15px" }}
          >
            {server.version} · {server.gamemode}
          </span>
          {onServerClick && (
            <button
              type="button"
              onClick={() => onServerClick(server)}
              className="font-vt323 flex items-center gap-1 px-3 py-1 rounded border transition-all duration-200 hover:bg-primary/20"
              style={{
                fontSize: "14px",
                color: "oklch(0.75 0.18 255)",
                borderColor: "oklch(0.45 0.12 255 / 0.5)",
              }}
              data-ocid={`server.secondary_button.${index + 1}`}
            >
              <ExternalLink className="h-3 w-3" />
              View Details
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

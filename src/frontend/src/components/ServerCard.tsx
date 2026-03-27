import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { ServerData } from "../utils/sheetsParser";

interface ServerCardProps {
  server: ServerData;
  index: number;
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

export default function ServerCard({ server, index }: ServerCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(server.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = server.ip;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
            alt={`${server.name} banner`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center"
            style={{ background: placeholderBg }}
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

        {/* Server name */}
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
          <div className="flex flex-wrap gap-1 mb-4">
            {server.tags.map((tag) => (
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
            ))}
          </div>
        )}

        {/* Footer row: version + copy IP */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span
            className="font-vt323 text-muted-foreground"
            style={{ fontSize: "15px" }}
          >
            {server.version} · {server.gamemode}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="font-vt323 flex items-center gap-1 border border-primary/50 px-3 py-1 rounded text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 active:scale-95"
            style={{ fontSize: "15px" }}
            title={`Copy IP: ${server.ip}`}
            data-ocid={`server.button.${index + 1}`}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> {server.ip}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

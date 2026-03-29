import { ArrowLeft, Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import {
  type Comment,
  addComment,
  getApprovedComments,
} from "../utils/adminStore";
import type { ServerData } from "../utils/sheetsParser";

interface ServerDetailPageProps {
  server: ServerData;
  onBack: () => void;
  rating?: number;
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="font-vt323"
          style={{
            fontSize: "20px",
            color:
              star <= rating ? "oklch(0.82 0.15 80)" : "oklch(0.35 0.04 255)",
          }}
        >
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
      <span
        className="font-vt323 ml-1"
        style={{ fontSize: "14px", color: "oklch(0.55 0.08 255)" }}
      >
        {rating}/5
      </span>
    </div>
  );
}

export default function ServerDetailPage({
  server,
  onBack,
  rating = 0,
}: ServerDetailPageProps) {
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [commentError, setCommentError] = useState("");

  const ipValue = server.ip?.trim() ?? "";
  const hasIP = ipValue.length > 0;

  useEffect(() => {
    // Inject JSON-LD structured data for this server
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "server-detail-schema";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: server.name,
      applicationCategory: "GameApplication",
      operatingSystem: "Minecraft Java/Bedrock",
      description: server.description,
      keywords: server.tags.join(", "),
      offers: { "@type": "Offer", price: "0" },
    });
    document.head.appendChild(script);
    return () => {
      const existing = document.getElementById("server-detail-schema");
      if (existing) existing.remove();
    };
  }, [server]);

  useEffect(() => {
    setComments(getApprovedComments(server.name));
  }, [server.name]);

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

  const handleCategoryBack = () => {
    onBack();
    setTimeout(() => {
      document
        .getElementById("server-listing")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError("");
    if (!commentName.trim()) {
      setCommentError("Please enter your name.");
      return;
    }
    if (!commentMessage.trim()) {
      setCommentError("Please enter a message.");
      return;
    }
    addComment(server.name, commentName, commentMessage);
    setCommentName("");
    setCommentMessage("");
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 4000);
  };

  return (
    <article
      className="min-h-screen py-10"
      style={{
        background:
          "linear-gradient(to bottom, oklch(0.09 0.02 255), oklch(0.10 0.025 258))",
      }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="font-vt323 flex items-center gap-2 mb-8 transition-colors hover:text-primary"
          style={{ fontSize: "20px", color: "oklch(0.6 0.1 255)" }}
          data-ocid="server_detail.button"
        >
          <ArrowLeft className="h-4 w-4" />← Back to Server List
        </button>

        {/* Server image */}
        <div
          className="w-full h-48 rounded-lg overflow-hidden mb-8 border border-border"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.2 0.08 255), oklch(0.15 0.06 285))",
          }}
        >
          {server.imageURL ? (
            <img
              src={server.imageURL}
              alt={`${server.name} Minecraft server banner`}
              className="w-full h-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span
                className="font-pixel text-foreground/20"
                style={{ fontSize: "20px" }}
              >
                {server.name.slice(0, 4).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-3 mb-4">
          {server.featured && (
            <span
              className="font-pixel neon-gold px-3 py-1.5 border rounded"
              style={{
                fontSize: "8px",
                borderColor: "oklch(0.82 0.15 80 / 0.5)",
                background: "oklch(0.82 0.15 80 / 0.1)",
              }}
            >
              ★ FEATURED
            </span>
          )}
          <span
            className="font-vt323 px-3 py-1 rounded border"
            style={{
              fontSize: "16px",
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

        {/* Server name H1 */}
        <h1
          className="font-pixel neon-cyan mb-2 leading-relaxed"
          style={{ fontSize: "clamp(14px, 3vw, 22px)" }}
        >
          {server.name}
        </h1>

        {/* Rating */}
        {rating > 0 && (
          <div className="mb-4">
            <StarRating rating={rating} />
          </div>
        )}

        {/* Description */}
        {server.description && (
          <p
            className="font-vt323 text-muted-foreground mb-8"
            style={{ fontSize: "20px", lineHeight: "1.5" }}
          >
            {server.description}
          </p>
        )}

        {/* Server IP Section */}
        <div
          className="rounded-lg px-5 py-4 mb-8"
          style={{
            background: "oklch(0.10 0.03 255)",
            border: "1px solid oklch(0.35 0.1 255 / 0.4)",
          }}
        >
          <p
            className="font-pixel mb-2"
            style={{ fontSize: "8px", color: "oklch(0.55 0.08 255)" }}
          >
            SERVER IP — CLICK TO COPY
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              {hasIP ? (
                <span
                  className="font-vt323 font-bold block"
                  style={{ fontSize: "24px", color: "oklch(0.88 0.12 215)" }}
                >
                  {ipValue}
                </span>
              ) : (
                <span
                  className="font-vt323"
                  style={{ fontSize: "20px", color: "oklch(0.45 0.04 255)" }}
                >
                  IP not available
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!hasIP}
              className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200 active:scale-95 disabled:opacity-40"
              style={{
                color: copied ? "oklch(0.78 0.2 160)" : "oklch(0.78 0.18 215)",
                border: `1px solid ${copied ? "oklch(0.6 0.2 160 / 0.5)" : "oklch(0.5 0.15 215 / 0.5)"}`,
                background: copied
                  ? "oklch(0.6 0.2 160 / 0.08)"
                  : "oklch(0.5 0.15 215 / 0.08)",
                boxShadow: copied
                  ? "0 0 12px oklch(0.6 0.2 160 / 0.4)"
                  : "0 0 8px oklch(0.5 0.15 215 / 0.3)",
              }}
              data-ocid="server_detail.secondary_button"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="font-vt323" style={{ fontSize: "16px" }}>
                    Copied ✓
                  </span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="font-vt323" style={{ fontSize: "16px" }}>
                    Copy IP
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Details grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-5 rounded-lg border border-border"
          style={{ background: "oklch(0.12 0.025 255)" }}
        >
          <div>
            <p
              className="font-pixel mb-1"
              style={{ fontSize: "7px", color: "oklch(0.5 0.08 255)" }}
            >
              VERSION
            </p>
            <p
              className="font-vt323 text-foreground"
              style={{ fontSize: "18px" }}
            >
              {server.version || "Unknown"}
            </p>
          </div>
          <div>
            <p
              className="font-pixel mb-1"
              style={{ fontSize: "7px", color: "oklch(0.5 0.08 255)" }}
            >
              GAMEMODE
            </p>
            <p
              className="font-vt323 text-foreground"
              style={{ fontSize: "18px" }}
            >
              {server.gamemode || "Unknown"}
            </p>
          </div>
          <div>
            <p
              className="font-pixel mb-1"
              style={{ fontSize: "7px", color: "oklch(0.5 0.08 255)" }}
            >
              TYPE
            </p>
            <p
              className="font-vt323"
              style={{
                fontSize: "18px",
                color:
                  server.serverType === "Premium"
                    ? "oklch(0.85 0.15 200)"
                    : "oklch(0.7 0.22 285)",
              }}
            >
              {server.serverType}
            </p>
          </div>
          {server.tags.length > 0 && (
            <div className="col-span-2 md:col-span-3">
              <p
                className="font-pixel mb-2"
                style={{ fontSize: "7px", color: "oklch(0.5 0.08 255)" }}
              >
                TAGS
              </p>
              <div className="flex flex-wrap gap-2">
                {server.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-vt323 px-3 py-0.5 rounded-full"
                    style={{
                      fontSize: "15px",
                      color: TAG_COLORS[tag] ?? "oklch(0.72 0.03 240)",
                      background: "oklch(0.16 0.02 255)",
                      border: `1px solid ${TAG_COLORS[tag] ?? "oklch(0.72 0.03 240)"}/30`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category link */}
        <div className="text-center mb-12">
          <button
            type="button"
            onClick={handleCategoryBack}
            className="font-vt323 transition-colors hover:text-primary"
            style={{ fontSize: "18px", color: "oklch(0.65 0.15 255)" }}
            data-ocid="server_detail.link"
          >
            Browse all {server.gamemode} servers →
          </button>
        </div>

        {/* ─── Comment Section ─── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2
              className="font-pixel neon-cyan"
              style={{ fontSize: "10px", letterSpacing: "2px" }}
            >
              PLAYER COMMENTS
            </h2>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.85 0.15 200 / 0.2)" }}
            />
          </div>

          {/* Submit comment form */}
          <form
            onSubmit={handleCommentSubmit}
            className="rounded-lg p-5 mb-6 border border-border"
            style={{ background: "oklch(0.12 0.025 255)" }}
            data-ocid="comment.panel"
          >
            <p
              className="font-pixel mb-4"
              style={{ fontSize: "8px", color: "oklch(0.65 0.1 255)" }}
            >
              LEAVE A COMMENT
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="font-vt323 w-full rounded px-3 py-2 border border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                style={{ fontSize: "16px" }}
                maxLength={60}
                data-ocid="comment.input"
              />
              <textarea
                placeholder="Write your comment..."
                value={commentMessage}
                onChange={(e) => setCommentMessage(e.target.value)}
                rows={3}
                className="font-vt323 w-full rounded px-3 py-2 border border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                style={{ fontSize: "16px" }}
                maxLength={500}
                data-ocid="comment.textarea"
              />
              {commentError && (
                <p
                  className="font-vt323"
                  style={{ fontSize: "14px", color: "oklch(0.65 0.22 20)" }}
                  data-ocid="comment.error_state"
                >
                  {commentError}
                </p>
              )}
              {commentSubmitted && (
                <p
                  className="font-vt323"
                  style={{ fontSize: "15px", color: "oklch(0.78 0.2 160)" }}
                  data-ocid="comment.success_state"
                >
                  ✓ Comment submitted for review!
                </p>
              )}
              <button
                type="submit"
                className="font-pixel self-start border-2 border-primary px-5 py-2 text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground active:scale-95"
                style={{ fontSize: "8px" }}
                data-ocid="comment.submit_button"
              >
                SUBMIT
              </button>
            </div>
          </form>

          {/* Approved comments list */}
          {comments.length === 0 ? (
            <p
              className="font-vt323 text-center text-muted-foreground"
              style={{ fontSize: "18px" }}
              data-ocid="comment.empty_state"
            >
              No comments yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {comments.map((c, i) => (
                <div
                  key={c.id}
                  className="rounded-lg px-5 py-3 border border-border"
                  style={{ background: "oklch(0.11 0.02 255)" }}
                  data-ocid={`comment.item.${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="font-pixel neon-cyan"
                      style={{ fontSize: "8px" }}
                    >
                      {c.authorName}
                    </span>
                    <span
                      className="font-vt323"
                      style={{ fontSize: "12px", color: "oklch(0.4 0.05 255)" }}
                    >
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p
                    className="font-vt323 text-muted-foreground"
                    style={{ fontSize: "16px", lineHeight: "1.4" }}
                  >
                    {c.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </article>
  );
}

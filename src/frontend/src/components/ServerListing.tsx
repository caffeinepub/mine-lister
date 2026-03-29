import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search, ServerCrash, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { ServerData } from "../utils/sheetsParser";
import ServerCard from "./ServerCard";

interface ServerListingProps {
  servers: ServerData[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onServerClick?: (server: ServerData) => void;
}

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

const CATEGORY_PILLS = [
  { label: "Survival", id: "survival" },
  { label: "SMP", id: "smp" },
  { label: "Skyblock", id: "skyblock" },
  { label: "Factions", id: "factions" },
  { label: "PvP", id: "pvp" },
  { label: "Minigames", id: "minigames" },
  { label: "BedWars", id: "bedwars" },
  { label: "Prison", id: "prison" },
  { label: "Lifesteal", id: "lifesteal" },
];

function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <div className="skeleton h-32" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="skeleton h-8 w-32 rounded mt-4" />
      </div>
    </div>
  );
}

export default function ServerListing({
  servers,
  loading,
  error,
  onRetry,
  onServerClick,
}: ServerListingProps) {
  const [search, setSearch] = useState("");
  const [filterVersion, setFilterVersion] = useState("all");
  const [filterGamemode, setFilterGamemode] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [filterTag, setFilterTag] = useState("");

  const versions = useMemo(() => {
    const set = new Set(servers.map((s) => s.version).filter(Boolean));
    return Array.from(set).sort();
  }, [servers]);

  const gamemodes = useMemo(() => {
    const set = new Set(servers.map((s) => s.gamemode).filter(Boolean));
    return Array.from(set).sort();
  }, [servers]);

  const filtered = useMemo(() => {
    return servers.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (filterVersion !== "all" && s.version !== filterVersion) return false;
      if (
        filterGamemode !== "all" &&
        !s.gamemode.toLowerCase().includes(filterGamemode.toLowerCase())
      )
        return false;
      if (filterType !== "all" && s.serverType !== filterType) return false;
      if (featuredOnly && !s.featured) return false;
      if (
        filterTag &&
        !s.tags.some((t) => t.toLowerCase() === filterTag.toLowerCase())
      )
        return false;
      return true;
    });
  }, [
    servers,
    search,
    filterVersion,
    filterGamemode,
    filterType,
    featuredOnly,
    filterTag,
  ]);

  const handleCategoryClick = (label: string) => {
    setFilterGamemode((prev) =>
      prev.toLowerCase() === label.toLowerCase() ? "all" : label,
    );
  };

  const handleTagClick = (tag: string) => {
    setFilterTag((prev) =>
      prev.toLowerCase() === tag.toLowerCase() ? "" : tag,
    );
  };

  return (
    <section id="server-listing" className="py-16">
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <h2
          id="top-servers"
          className="font-pixel neon-gold text-center mb-6"
          style={{ fontSize: "clamp(10px, 2vw, 16px)" }}
        >
          Top Minecraft Servers
        </h2>

        {/* Category quick-link pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORY_PILLS.map((pill) => {
            const isActive =
              filterGamemode.toLowerCase() === pill.label.toLowerCase();
            return (
              <span key={pill.id} id={pill.id}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(pill.label)}
                  className="font-vt323 px-4 py-1.5 rounded-full border transition-all duration-200"
                  style={{
                    fontSize: "17px",
                    color: isActive
                      ? "oklch(0.18 0.025 255)"
                      : "oklch(0.75 0.12 255)",
                    background: isActive
                      ? "oklch(0.72 0.22 285)"
                      : "oklch(0.15 0.04 255 / 0.5)",
                    borderColor: isActive
                      ? "oklch(0.72 0.22 285)"
                      : "oklch(0.35 0.08 255 / 0.5)",
                    boxShadow: isActive
                      ? "0 0 12px oklch(0.72 0.22 285 / 0.5)"
                      : "none",
                  }}
                  data-ocid="server.tab"
                >
                  {pill.label}
                </button>
              </span>
            );
          })}
        </div>

        {/* Filter controls */}
        <div
          className="flex flex-wrap items-center gap-3 mb-4 p-4 rounded-lg border border-border"
          style={{ background: "oklch(0.12 0.025 255)" }}
          data-ocid="server.panel"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search servers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 font-vt323 bg-muted/30 border-border text-foreground placeholder:text-muted-foreground"
              style={{ fontSize: "18px" }}
              data-ocid="server.search_input"
            />
          </div>

          {/* Version filter */}
          <Select value={filterVersion} onValueChange={setFilterVersion}>
            <SelectTrigger
              className="w-36 font-vt323 bg-muted/30 border-border text-foreground"
              style={{ fontSize: "17px" }}
              data-ocid="server.select"
            >
              <SelectValue placeholder="Version" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                className="font-vt323"
                style={{ fontSize: "17px" }}
              >
                All Versions
              </SelectItem>
              {versions.map((v) => (
                <SelectItem
                  key={v}
                  value={v}
                  className="font-vt323"
                  style={{ fontSize: "17px" }}
                >
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Gamemode filter */}
          <Select value={filterGamemode} onValueChange={setFilterGamemode}>
            <SelectTrigger
              className="w-36 font-vt323 bg-muted/30 border-border text-foreground"
              style={{ fontSize: "17px" }}
              data-ocid="server.select"
            >
              <SelectValue placeholder="Gamemode" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                className="font-vt323"
                style={{ fontSize: "17px" }}
              >
                All Gamemodes
              </SelectItem>
              {gamemodes.map((g) => (
                <SelectItem
                  key={g}
                  value={g}
                  className="font-vt323"
                  style={{ fontSize: "17px" }}
                >
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type filter */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger
              className="w-36 font-vt323 bg-muted/30 border-border text-foreground"
              style={{ fontSize: "17px" }}
              data-ocid="server.select"
            >
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                className="font-vt323"
                style={{ fontSize: "17px" }}
              >
                All Types
              </SelectItem>
              <SelectItem
                value="Premium"
                className="font-vt323"
                style={{ fontSize: "17px" }}
              >
                Premium
              </SelectItem>
              <SelectItem
                value="Cracked"
                className="font-vt323"
                style={{ fontSize: "17px" }}
              >
                Cracked
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Featured toggle */}
          <label
            className="flex items-center gap-2 cursor-pointer font-vt323"
            style={{ fontSize: "18px" }}
          >
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="sr-only"
              data-ocid="server.checkbox"
            />
            <span
              className="w-5 h-5 border-2 flex items-center justify-center rounded transition-all"
              style={{
                borderColor: featuredOnly
                  ? "oklch(0.82 0.15 80)"
                  : "oklch(0.35 0.05 255)",
                background: featuredOnly
                  ? "oklch(0.82 0.15 80 / 0.2)"
                  : "transparent",
              }}
            >
              {featuredOnly && (
                <span className="neon-gold" style={{ fontSize: "12px" }}>
                  ★
                </span>
              )}
            </span>
            <span className="text-muted-foreground hover:text-foreground transition-colors">
              Featured only
            </span>
          </label>
        </div>

        {/* Active tag filter indicator */}
        {filterTag && (
          <div className="flex items-center gap-2 mb-6">
            <span
              className="font-vt323"
              style={{ fontSize: "16px", color: "oklch(0.55 0.08 255)" }}
            >
              Filtering by:
            </span>
            <button
              type="button"
              onClick={() => setFilterTag("")}
              className="font-vt323 flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-200 hover:brightness-110"
              style={{
                fontSize: "15px",
                color: "oklch(0.82 0.22 285)",
                borderColor: "oklch(0.55 0.22 285 / 0.6)",
                background: "oklch(0.55 0.22 285 / 0.12)",
                boxShadow: "0 0 8px oklch(0.55 0.22 285 / 0.25)",
              }}
              data-ocid="server.toggle"
            >
              #{filterTag}
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="server.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <SkeletonCard key={k} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            className="text-center py-16 rounded-lg border border-border"
            style={{ background: "oklch(0.12 0.025 255)" }}
            data-ocid="server.error_state"
          >
            <ServerCrash className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p
              className="font-vt323 text-destructive mb-4"
              style={{ fontSize: "20px" }}
            >
              Failed to load servers: {error}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="font-vt323 flex items-center gap-2 mx-auto border border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-primary-foreground transition-all"
              style={{ fontSize: "18px" }}
              data-ocid="server.button"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          </div>
        )}

        {/* Server grid */}
        {!loading && !error && (
          <>
            {/* SEO intro paragraph */}
            <p
              className="font-vt323 text-muted-foreground text-center mb-8 max-w-3xl mx-auto"
              style={{ fontSize: "18px" }}
            >
              This website lists the best Minecraft servers including cracked
              and premium servers. Players can join servers for BedWars,
              Survival, Skyblock, PvP and more. Browse our list and find your
              perfect server today.
            </p>

            {filtered.length === 0 ? (
              <div
                className="text-center py-16 rounded-lg border border-border"
                data-ocid="server.empty_state"
              >
                <p
                  className="font-vt323 text-muted-foreground"
                  style={{ fontSize: "22px" }}
                >
                  No servers available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((server, i) => (
                  <ServerCard
                    key={`${server.ip}-${i}`}
                    server={server}
                    index={i}
                    onServerClick={onServerClick}
                    onTagClick={handleTagClick}
                  />
                ))}
              </div>
            )}
            <p
              className="font-vt323 text-muted-foreground text-center mt-6"
              style={{ fontSize: "16px" }}
            >
              Showing {filtered.length} of {servers.length} servers
            </p>

            {/* SEO anchor sections for categories */}
            <div className="mt-16 space-y-8">
              <section id="cracked-servers" className="scroll-mt-20">
                <h2
                  className="font-pixel neon-cyan mb-3"
                  style={{ fontSize: "clamp(9px, 1.8vw, 14px)" }}
                >
                  Cracked Minecraft Servers
                </h2>
                <p
                  className="font-vt323 text-muted-foreground mb-3"
                  style={{ fontSize: "17px" }}
                >
                  Free-to-play cracked Minecraft servers compatible with
                  TLauncher and non-premium accounts. No paid account needed!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilterType("Cracked");
                    document
                      .getElementById("top-servers")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="font-vt323 px-4 py-1 rounded border transition-all duration-200 hover:bg-primary/20"
                  style={{
                    fontSize: "16px",
                    color: "oklch(0.75 0.12 255)",
                    borderColor: "oklch(0.35 0.08 255 / 0.5)",
                  }}
                  data-ocid="server.link"
                >
                  View All Cracked Servers →
                </button>
              </section>

              <section id="premium-servers" className="scroll-mt-20">
                <h2
                  className="font-pixel neon-cyan mb-3"
                  style={{ fontSize: "clamp(9px, 1.8vw, 14px)" }}
                >
                  Premium Minecraft Servers
                </h2>
                <p
                  className="font-vt323 text-muted-foreground mb-3"
                  style={{ fontSize: "17px" }}
                >
                  Official premium Minecraft servers for players with a paid
                  Mojang/Microsoft account. Enjoy exclusive features and
                  dedicated communities.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilterType("Premium");
                    document
                      .getElementById("top-servers")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="font-vt323 px-4 py-1 rounded border transition-all duration-200 hover:bg-primary/20"
                  style={{
                    fontSize: "16px",
                    color: "oklch(0.75 0.12 255)",
                    borderColor: "oklch(0.35 0.08 255 / 0.5)",
                  }}
                  data-ocid="server.link"
                >
                  View All Premium Servers →
                </button>
              </section>

              <section id="recently-added" className="scroll-mt-20">
                <h2
                  className="font-pixel neon-cyan mb-3"
                  style={{ fontSize: "clamp(9px, 1.8vw, 14px)" }}
                >
                  Recently Added Servers
                </h2>
                <p
                  className="font-vt323 text-muted-foreground mb-3"
                  style={{ fontSize: "17px" }}
                >
                  The newest Minecraft servers added to MINE Lister. Be the
                  first to join and build your community!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilterType("all");
                    setSearch("");
                    document
                      .getElementById("top-servers")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="font-vt323 px-4 py-1 rounded border transition-all duration-200 hover:bg-primary/20"
                  style={{
                    fontSize: "16px",
                    color: "oklch(0.75 0.12 255)",
                    borderColor: "oklch(0.35 0.08 255 / 0.5)",
                  }}
                  data-ocid="server.link"
                >
                  Browse All Servers →
                </button>
              </section>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

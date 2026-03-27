interface SEOContentProps {
  onCategoryClick?: () => void;
}

export default function SEOContent({ onCategoryClick }: SEOContentProps) {
  return (
    <section
      className="py-16 border-t border-border"
      style={{ background: "oklch(0.10 0.02 255)" }}
      aria-label="Minecraft Server Guide"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2
          className="font-pixel neon-cyan text-center mb-12"
          style={{ fontSize: "clamp(10px, 2vw, 16px)" }}
        >
          Find the Best Minecraft Servers to Play in 2026
        </h2>

        <div
          className="space-y-10 font-vt323"
          style={{ fontSize: "19px", lineHeight: "1.6" }}
        >
          <div>
            <p className="text-muted-foreground">
              Welcome to MINE Lister — India's most comprehensive Minecraft
              server list for 2026. Whether you're a seasoned veteran looking
              for intense PvP combat, a builder searching for the perfect
              creative world, or a newcomer who just wants a friendly survival
              experience, you'll find the right server here. We list both
              premium and cracked Minecraft servers so every player, regardless
              of their account type, can join the fun. All servers on our list
              are verified, moderated, and updated regularly to ensure the best
              experience.
            </p>
          </div>

          <div>
            <h3
              className="font-pixel neon-gold mb-4"
              style={{ fontSize: "clamp(9px, 1.5vw, 12px)" }}
            >
              Survival Minecraft Servers
            </h3>
            <p className="text-muted-foreground">
              Survival servers are the heart of Minecraft. You spawn in a fresh
              world, gather resources, build a base, and survive against mobs
              and sometimes other players. Indian survival servers on MINE
              Lister often feature custom economies, land claiming, player
              shops, and active communities speaking Hindi, Tamil, Bengali, and
              other regional languages. Whether you prefer pure vanilla survival
              or a feature-rich SMP experience, our list has exactly what you
              need. Browse the best survival servers and start your adventure
              today.
            </p>
            <button
              type="button"
              onClick={onCategoryClick}
              className="font-vt323 mt-3 inline-block transition-colors hover:text-primary"
              style={{ fontSize: "17px", color: "oklch(0.65 0.15 255)" }}
            >
              → Browse Survival Servers
            </button>
          </div>

          <div>
            <h3
              className="font-pixel neon-gold mb-4"
              style={{ fontSize: "clamp(9px, 1.5vw, 12px)" }}
            >
              Skyblock Servers
            </h3>
            <p className="text-muted-foreground">
              Skyblock is one of the most popular Minecraft gamemodes in India.
              You start on a tiny island floating in the void with limited
              resources and must expand, build, and complete challenges to
              progress. MINE Lister features the top Indian Skyblock servers
              with custom islands, unique challenges, leaderboards, and
              competitive seasons. Many of these servers are free to play on
              cracked accounts, making them accessible to all Minecraft players
              in India. Join a thriving Skyblock community and build your empire
              in the sky.
            </p>
            <button
              type="button"
              onClick={onCategoryClick}
              className="font-vt323 mt-3 inline-block transition-colors hover:text-primary"
              style={{ fontSize: "17px", color: "oklch(0.65 0.15 255)" }}
            >
              → Browse Skyblock Servers
            </button>
          </div>

          <div>
            <h3
              className="font-pixel neon-gold mb-4"
              style={{ fontSize: "clamp(9px, 1.5vw, 12px)" }}
            >
              Factions PvP Servers
            </h3>
            <p className="text-muted-foreground">
              Factions servers are for players who thrive on competition,
              strategy, and combat. Create or join a faction, raid enemy bases,
              claim territory, and battle for dominance on the leaderboards.
              Indian Factions servers often feature custom enchantments,
              powerful gear progression, and weekly events. MINE Lister lists
              the most active and well-maintained Factions servers for Indian
              players, with both premium and cracked server options available.
              If you love PvP and strategy, Factions is the gamemode for you.
            </p>
            <button
              type="button"
              onClick={onCategoryClick}
              className="font-vt323 mt-3 inline-block transition-colors hover:text-primary"
              style={{ fontSize: "17px", color: "oklch(0.65 0.15 255)" }}
            >
              → Browse Factions Servers
            </button>
          </div>

          <div>
            <h3
              className="font-pixel neon-gold mb-4"
              style={{ fontSize: "clamp(9px, 1.5vw, 12px)" }}
            >
              Cracked vs Premium Servers
            </h3>
            <p className="text-muted-foreground">
              One of the most common questions among Indian Minecraft players is
              the difference between cracked and premium servers. Premium
              servers require an official Mojang/Microsoft account to join,
              ensuring a secure and verified player base. Cracked servers, on
              the other hand, allow players with non-premium (pirated) copies of
              Minecraft to join using any username. Both types have active
              communities in India. MINE Lister clearly labels every server so
              you know which type it is before you try to connect. We list the
              best of both so every player can find their perfect home server.
            </p>
          </div>

          <div>
            <h3
              className="font-pixel neon-gold mb-4"
              style={{ fontSize: "clamp(9px, 1.5vw, 12px)" }}
            >
              How to Join a Minecraft Server
            </h3>
            <p className="text-muted-foreground">
              Joining a Minecraft server is simple. First, open Minecraft Java
              Edition and click on "Multiplayer" from the main menu. Then click
              "Add Server" and paste the server IP address you copied from MINE
              Lister. Give the server a name you'll recognize, then click
              "Done." The server will appear in your list — click it and then
              "Join Server" to connect. For Bedrock Edition (Windows 10/11,
              mobile, console), go to the "Servers" tab in the main menu and add
              the server IP and port. Most Indian servers listed on MINE Lister
              support Minecraft versions 1.8 through 1.20.4, but always check
              the server's listed version before joining. If you encounter
              connection issues, ensure your Minecraft version matches the
              server, and try disabling your VPN if active.
            </p>
          </div>

          <div
            className="rounded-lg p-5 border border-border"
            style={{ background: "oklch(0.12 0.025 255)" }}
          >
            <p className="text-muted-foreground">
              <span style={{ color: "oklch(0.82 0.15 80)" }}>★ Pro Tip:</span>{" "}
              Use the filters at the top of the server list to find exactly what
              you're looking for. You can filter by gamemode (Survival,
              Skyblock, Factions, PvP, SMP, Minigames), server type (Premium or
              Cracked), and Minecraft version. Featured servers are highlighted
              and placed at the top — these are verified, highly-rated servers
              we recommend for the best experience. Want to list your own
              Minecraft server? Click the{" "}
              <strong style={{ color: "oklch(0.75 0.18 255)" }}>Submit</strong>{" "}
              button in the navigation bar and fill out the form. Listing your
              server on MINE Lister is completely free!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

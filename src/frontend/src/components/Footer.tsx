import { Pickaxe } from "lucide-react";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer
      className="border-t border-border mt-8"
      style={{ background: "oklch(0.12 0.025 255)" }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Left: Logo + disclaimer */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Pickaxe className="h-5 w-5 text-primary" />
              <span
                className="font-pixel neon-cyan"
                style={{ fontSize: "10px" }}
              >
                MINE LISTER
              </span>
            </div>
            <p
              className="font-vt323 text-muted-foreground mb-3"
              style={{ fontSize: "15px", lineHeight: "1.5" }}
            >
              Minecraft® is a trademark of Mojang Studios / Microsoft. This site
              is not affiliated or endorsed by Mojang or Microsoft.
            </p>
            <p
              className="font-vt323"
              style={{ fontSize: "15px", color: "oklch(0.82 0.15 80)" }}
            >
              ★ Featured servers are paid placements.
              <br />
              <a
                href="mailto:zodiacmc11@gmail.com"
                className="underline hover:text-primary transition-colors"
              >
                Contact us to add yours.
              </a>
            </p>
          </div>

          {/* Browse by Gamemode */}
          <div>
            <h3
              className="font-pixel text-foreground mb-4"
              style={{ fontSize: "9px" }}
            >
              BROWSE BY GAMEMODE
            </h3>
            <nav
              className="flex flex-col gap-2"
              aria-label="Gamemode navigation"
            >
              {[
                { label: "Survival Servers", href: "#survival" },
                { label: "Skyblock Servers", href: "#skyblock" },
                { label: "PvP Servers", href: "#pvp" },
                { label: "Factions Servers", href: "#factions" },
                { label: "SMP Servers", href: "#smp" },
                { label: "Minigames Servers", href: "#minigames" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-vt323 text-muted-foreground hover:text-primary transition-colors"
                  style={{ fontSize: "16px" }}
                  data-ocid="footer.link"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Center: Links */}
          <div>
            <h3
              className="font-pixel text-foreground mb-4"
              style={{ fontSize: "9px" }}
            >
              LINKS
            </h3>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {[
                { label: "Contact", href: "mailto:zodiacmc11@gmail.com" },
                { label: "Terms of Service", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "FAQ", href: "#" },
                { label: "Submit a Server", href: "#submit-server" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-vt323 text-muted-foreground hover:text-primary transition-colors"
                  style={{ fontSize: "18px" }}
                  data-ocid="footer.link"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right: Contact */}
          <div>
            <h3
              className="font-pixel text-foreground mb-4"
              style={{ fontSize: "9px" }}
            >
              CONTACT
            </h3>
            <p
              className="font-vt323 text-muted-foreground mb-2"
              style={{ fontSize: "17px" }}
            >
              For server listings, featured placements, or general inquiries:
            </p>
            <a
              href="mailto:zodiacmc11@gmail.com"
              className="font-vt323 text-primary hover:text-primary/80 transition-colors underline"
              style={{ fontSize: "18px" }}
              data-ocid="footer.link"
            >
              zodiacmc11@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-10 pt-6 text-center">
          <p
            className="font-vt323 text-muted-foreground"
            style={{ fontSize: "15px" }}
          >
            © {year} MINE Lister. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

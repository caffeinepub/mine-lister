import { Pickaxe } from "lucide-react";

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border"
      style={{
        background: "oklch(0.12 0.025 255 / 0.92)",
        backdropFilter: "blur(12px)",
      }}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2" data-ocid="nav.link">
          <Pickaxe className="h-5 w-5 text-primary" />
          <span
            className="font-pixel text-xs neon-cyan tracking-wider"
            style={{ fontSize: "11px" }}
          >
            MINE LISTER
          </span>
        </a>

        {/* Nav links */}
        <div className="flex items-center gap-6 font-vt323 text-lg">
          <a
            href="#server-listing"
            className="text-muted-foreground hover:text-primary transition-colors"
            data-ocid="nav.link"
          >
            Servers
          </a>
          <a
            href="#submit-server"
            className="text-muted-foreground hover:text-primary transition-colors"
            data-ocid="nav.link"
          >
            Submit
          </a>
          <a
            href="mailto:zodiacmc11@gmail.com"
            className="border border-primary/50 text-primary px-3 py-1 rounded hover:bg-primary hover:text-primary-foreground transition-all"
            data-ocid="nav.link"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}

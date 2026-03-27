import { Pickaxe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  onSubmitClick: () => void;
  onMyServersClick: () => void;
  currentUser: string | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Navbar({
  onSubmitClick,
  onMyServersClick,
  currentUser,
  onLoginClick,
  onLogout,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border"
      style={{
        background: "oklch(0.12 0.025 255 / 0.92)",
        backdropFilter: "blur(12px)",
      }}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2" data-ocid="nav.link">
          <Pickaxe className="h-5 w-5 text-primary" />
          <span
            className="font-pixel text-xs neon-cyan tracking-wider"
            style={{ fontSize: "11px" }}
          >
            MINE LISTER
          </span>
        </a>

        <div className="flex items-center gap-3 font-vt323 text-lg flex-wrap justify-end">
          <a
            href="#server-listing"
            className="text-muted-foreground hover:text-primary transition-colors"
            data-ocid="nav.link"
          >
            Servers
          </a>

          <button
            type="button"
            onClick={onSubmitClick}
            className="text-muted-foreground hover:text-primary transition-colors"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "inherit",
            }}
            data-ocid="nav.button"
          >
            Submit
          </button>

          {currentUser ? (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                style={{
                  background: "none",
                  border: "1px solid oklch(0.45 0.18 260 / 0.5)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontFamily: "'VT323', monospace",
                  fontSize: "18px",
                  color: "oklch(0.8 0.18 200)",
                  padding: "2px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: dropdownOpen
                    ? "0 0 12px oklch(0.55 0.2 260 / 0.3)"
                    : "none",
                  transition: "box-shadow 0.2s",
                }}
                data-ocid="nav.toggle"
              >
                <span style={{ color: "oklch(0.75 0.18 200)" }}>
                  {currentUser}
                </span>
                <span style={{ fontSize: "12px", opacity: 0.7 }}>▼</span>
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    background: "oklch(0.12 0.025 255)",
                    border: "1px solid oklch(0.45 0.18 260 / 0.5)",
                    borderRadius: "10px",
                    minWidth: "160px",
                    boxShadow:
                      "0 0 24px oklch(0.55 0.22 260 / 0.25), 0 8px 24px oklch(0 0 0 / 0.5)",
                    overflow: "hidden",
                    zIndex: 100,
                  }}
                  data-ocid="nav.dropdown_menu"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onMyServersClick();
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "12px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'VT323', monospace",
                      fontSize: "18px",
                      color: "oklch(0.75 0.12 260)",
                      textAlign: "left",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "oklch(0.16 0.04 260)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "oklch(0.9 0.18 200)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "none";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "oklch(0.75 0.12 260)";
                    }}
                    data-ocid="nav.link"
                  >
                    ⚙ My Servers
                  </button>
                  <div
                    style={{
                      height: "1px",
                      background: "oklch(0.25 0.06 260 / 0.4)",
                      margin: "0 12px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "12px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'VT323', monospace",
                      fontSize: "18px",
                      color: "oklch(0.65 0.18 15)",
                      textAlign: "left",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "oklch(0.16 0.04 260)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "none";
                    }}
                    data-ocid="nav.button"
                  >
                    ✕ Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.45 0.2 245 / 0.25), oklch(0.4 0.22 285 / 0.25))",
                border: "1px solid oklch(0.55 0.2 260 / 0.6)",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "'VT323', monospace",
                fontSize: "18px",
                color: "oklch(0.8 0.2 260)",
                padding: "3px 14px",
                boxShadow: "0 0 10px oklch(0.55 0.2 260 / 0.2)",
                transition: "all 0.2s",
              }}
              data-ocid="nav.button"
            >
              Login / Signup
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

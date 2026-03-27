import { Lock, X } from "lucide-react";
import { useState } from "react";
import type { ServerData } from "../utils/sheetsParser";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyALZ7A88VlP-xK146Wmo-zayGUShSCv60Mn_wDoe0/dev";

const GAMEMODES = [
  "Survival",
  "Skyblock",
  "Factions",
  "Prison",
  "PvP",
  "Lifesteal",
  "SMP",
  "Minigames",
];

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<ServerData>;
  currentUser: string | null;
  onLoginClick: () => void;
}

const cardStyle: React.CSSProperties = {
  background: "oklch(0.12 0.025 255)",
  border: "1px solid oklch(0.4 0.15 260 / 0.4)",
  borderRadius: "12px",
  padding: "20px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "oklch(0.7 0.15 260)",
  marginBottom: "8px",
  fontFamily: "'Press Start 2P', cursive",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "oklch(0.10 0.02 255)",
  color: "#fff",
  border: "1px solid oklch(0.3 0.1 260 / 0.5)",
  borderRadius: "8px",
  padding: "10px 14px",
  fontSize: "15px",
  outline: "none",
  fontFamily: "'VT323', monospace",
  boxSizing: "border-box",
};

function parseInitialGamemodes(gamemode?: string): string[] {
  if (!gamemode) return [];
  return gamemode
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
}

export default function UserSubmission({
  open,
  onClose,
  initialData,
  currentUser,
  onLoginClick,
}: Props) {
  const [selectedGamemodes, setSelectedGamemodes] = useState<string[]>(() =>
    parseInitialGamemodes(initialData?.gamemode),
  );
  const [versionError, setVersionError] = useState("");
  const [gamemodeError, setGamemodeError] = useState("");

  if (!open) return null;

  const toggleGamemode = (gm: string) => {
    setGamemodeError("");
    setSelectedGamemodes((prev) =>
      prev.includes(gm) ? prev.filter((g) => g !== gm) : [...prev, gm],
    );
  };

  const removeGamemode = (gm: string) => {
    setSelectedGamemodes((prev) => prev.filter((g) => g !== gm));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const versionInput = form.elements.namedItem("version") as HTMLInputElement;
    let valid = true;

    if (!versionInput.value.trim()) {
      setVersionError("Version cannot be empty");
      valid = false;
    } else {
      setVersionError("");
    }

    if (selectedGamemodes.length === 0) {
      setGamemodeError("Please select at least one gamemode");
      valid = false;
    } else {
      setGamemodeError("");
    }

    if (!valid) {
      e.preventDefault();
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: modal backdrop close
    <div
      onClick={onClose}
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "oklch(0 0 0 / 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "768px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "oklch(0.09 0.02 255)",
          border: "1px solid oklch(0.4 0.15 260 / 0.5)",
          borderRadius: "16px",
          padding: "32px 24px",
          position: "relative",
          boxShadow: "0 0 60px oklch(0.55 0.22 260 / 0.25)",
        }}
        data-ocid="submit.modal"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "oklch(0.15 0.03 260)",
            border: "1px solid oklch(0.35 0.1 260 / 0.5)",
            borderRadius: "8px",
            padding: "6px",
            cursor: "pointer",
            color: "oklch(0.7 0.1 260)",
            display: "flex",
            alignItems: "center",
          }}
          data-ocid="submit.close_button"
        >
          <X size={18} />
        </button>

        {!currentUser ? (
          /* Login Required Gate */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
              gap: "18px",
              textAlign: "center",
            }}
            data-ocid="submit.login_required"
          >
            <Lock
              size={48}
              style={{
                color: "oklch(0.55 0.2 260)",
                filter: "drop-shadow(0 0 12px oklch(0.55 0.2 260 / 0.5))",
              }}
            />
            <h2
              className="font-pixel neon-cyan"
              style={{
                fontSize: "clamp(10px, 2.5vw, 16px)",
                letterSpacing: "0.06em",
              }}
            >
              LOGIN REQUIRED
            </h2>
            <p
              className="font-vt323"
              style={{
                color: "oklch(0.6 0.1 260)",
                fontSize: "20px",
                maxWidth: "340px",
                lineHeight: 1.4,
              }}
            >
              Please login or create an account to submit your server.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onLoginClick();
              }}
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.22 245), oklch(0.5 0.25 285))",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "12px 32px",
                fontSize: "11px",
                fontFamily: "'Press Start 2P', cursive",
                cursor: "pointer",
                boxShadow: "0 0 20px oklch(0.55 0.22 245 / 0.5)",
                marginTop: "8px",
              }}
              data-ocid="submit.primary_button"
            >
              Login / Signup
            </button>
          </div>
        ) : (
          /* Full Form */
          <>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h2
                className="font-pixel neon-cyan"
                style={{
                  fontSize: "clamp(10px, 2vw, 16px)",
                  marginBottom: "12px",
                }}
              >
                SUBMIT YOUR SERVER
              </h2>
              <p
                className="font-vt323"
                style={{ color: "oklch(0.65 0.1 240)", fontSize: "18px" }}
              >
                Servers are reviewed within 24–48 hours.
              </p>
            </div>

            <form
              key={JSON.stringify(initialData)}
              id="submit-server-form"
              method="POST"
              action={APPS_SCRIPT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="user" value={currentUser} />
              <input
                type="hidden"
                name="gamemode"
                value={selectedGamemodes.join(", ")}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div style={cardStyle}>
                  <label htmlFor="serverName" style={labelStyle}>
                    Server Name{" "}
                    <span style={{ color: "oklch(0.72 0.25 320)" }}>*</span>
                  </label>
                  <input
                    id="serverName"
                    name="serverName"
                    type="text"
                    required
                    placeholder="e.g. Indiacraft SMP"
                    defaultValue={initialData?.name ?? ""}
                    style={inputStyle}
                    data-ocid="submit.input"
                  />
                </div>
                <div style={cardStyle}>
                  <label htmlFor="serverIP" style={labelStyle}>
                    Server IP{" "}
                    <span style={{ color: "oklch(0.72 0.25 320)" }}>*</span>
                  </label>
                  <input
                    id="serverIP"
                    name="serverIP"
                    type="text"
                    required
                    placeholder="e.g. play.indiacraft.in"
                    defaultValue={initialData?.ip ?? ""}
                    style={inputStyle}
                    data-ocid="submit.input"
                  />
                </div>

                {/* Version — free text input */}
                <div style={cardStyle}>
                  <label htmlFor="version" style={labelStyle}>
                    Version{" "}
                    <span style={{ color: "oklch(0.72 0.25 320)" }}>*</span>
                  </label>
                  <input
                    id="version"
                    name="version"
                    type="text"
                    placeholder="e.g. 1.20, 1.20.4, 1.8-1.20"
                    defaultValue={initialData?.version ?? ""}
                    onChange={() => setVersionError("")}
                    style={{
                      ...inputStyle,
                      borderColor: versionError
                        ? "oklch(0.65 0.25 15)"
                        : undefined,
                    }}
                    data-ocid="submit.input"
                  />
                  {versionError && (
                    <p
                      style={{
                        color: "oklch(0.7 0.22 15)",
                        fontSize: "13px",
                        marginTop: "6px",
                        fontFamily: "'VT323', monospace",
                      }}
                      data-ocid="submit.error_state"
                    >
                      {versionError}
                    </p>
                  )}
                </div>

                <div style={cardStyle}>
                  <label htmlFor="serverType" style={labelStyle}>
                    Server Type{" "}
                    <span style={{ color: "oklch(0.72 0.25 320)" }}>*</span>
                  </label>
                  <select
                    id="serverType"
                    name="serverType"
                    required
                    defaultValue={initialData?.serverType ?? ""}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    data-ocid="submit.select"
                  >
                    <option value="" disabled>
                      Select type...
                    </option>
                    <option value="Premium">Premium</option>
                    <option value="Cracked">Cracked</option>
                  </select>
                </div>
                <div style={cardStyle}>
                  <label htmlFor="imageURL" style={labelStyle}>
                    Image URL{" "}
                    <span
                      style={{
                        color: "oklch(0.5 0.08 260)",
                        fontSize: "9px",
                        textTransform: "none",
                      }}
                    >
                      (optional)
                    </span>
                  </label>
                  <input
                    id="imageURL"
                    name="imageURL"
                    type="text"
                    placeholder="https://..."
                    defaultValue={initialData?.imageURL ?? ""}
                    style={inputStyle}
                    data-ocid="submit.input"
                  />
                </div>
              </div>

              {/* Gamemode multi-select */}
              <div style={{ ...cardStyle, marginBottom: "16px" }}>
                <p style={labelStyle}>
                  Gamemode{" "}
                  <span style={{ color: "oklch(0.72 0.25 320)" }}>*</span>
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  {GAMEMODES.map((gm) => {
                    const active = selectedGamemodes.includes(gm);
                    return (
                      <button
                        key={gm}
                        type="button"
                        onClick={() => toggleGamemode(gm)}
                        className={
                          active ? "gm-chip gm-chip--active" : "gm-chip"
                        }
                        aria-pressed={active}
                        data-ocid="submit.toggle"
                      >
                        {active && (
                          <span style={{ marginRight: "4px" }}>✓</span>
                        )}
                        {gm}
                      </button>
                    );
                  })}
                </div>

                {/* Selected tags */}
                {selectedGamemodes.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "4px",
                    }}
                  >
                    {selectedGamemodes.map((gm) => (
                      <span key={gm} className="gm-tag">
                        {gm}
                        <button
                          type="button"
                          onClick={() => removeGamemode(gm)}
                          aria-label={`Remove ${gm}`}
                          className="gm-tag__remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {gamemodeError && (
                  <p
                    style={{
                      color: "oklch(0.7 0.22 15)",
                      fontSize: "13px",
                      marginTop: "6px",
                      fontFamily: "'VT323', monospace",
                    }}
                    data-ocid="submit.error_state"
                  >
                    {gamemodeError}
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div style={cardStyle}>
                  <label htmlFor="description" style={labelStyle}>
                    Description{" "}
                    <span
                      style={{
                        color: "oklch(0.5 0.08 260)",
                        fontSize: "9px",
                        textTransform: "none",
                      }}
                    >
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Tell players about your server..."
                    rows={4}
                    defaultValue={initialData?.description ?? ""}
                    style={{ ...inputStyle, resize: "vertical" }}
                    data-ocid="submit.textarea"
                  />
                </div>
                <div style={cardStyle}>
                  <label htmlFor="tags" style={labelStyle}>
                    Tags{" "}
                    <span
                      style={{
                        color: "oklch(0.5 0.08 260)",
                        fontSize: "9px",
                        textTransform: "none",
                      }}
                    >
                      (optional)
                    </span>
                  </label>
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    placeholder="e.g. Economy, PvP, Custom Enchants"
                    defaultValue={initialData?.tags?.join(", ") ?? ""}
                    style={inputStyle}
                    data-ocid="submit.input"
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: "28px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  type="submit"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.22 245), oklch(0.5 0.25 285))",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "14px 48px",
                    fontSize: "13px",
                    fontFamily: "'Press Start 2P', cursive",
                    cursor: "pointer",
                    boxShadow:
                      "0 0 20px oklch(0.55 0.22 245 / 0.5), 0 0 40px oklch(0.5 0.25 285 / 0.3)",
                    width: "100%",
                    maxWidth: "360px",
                  }}
                  data-ocid="submit.submit_button"
                >
                  Submit Server
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <style>{`
        #submit-server-form input::placeholder,
        #submit-server-form textarea::placeholder { color: oklch(0.45 0.06 260); }
        #submit-server-form select option { background: oklch(0.12 0.025 255); color: #fff; }
        #submit-server-form input:focus,
        #submit-server-form select:focus,
        #submit-server-form textarea:focus {
          border-color: oklch(0.7 0.2 260) !important;
          box-shadow: 0 0 0 2px oklch(0.7 0.2 260 / 0.2);
        }
        #submit-server-form button[type="submit"]:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
          transition: all 0.15s;
        }

        .gm-chip {
          padding: 7px 14px;
          border-radius: 20px;
          border: 1px solid oklch(0.35 0.1 260 / 0.6);
          background: oklch(0.13 0.03 260);
          color: oklch(0.6 0.1 260);
          font-family: 'VT323', monospace;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.18s ease;
          user-select: none;
        }
        .gm-chip:hover {
          border-color: oklch(0.6 0.2 260 / 0.8);
          color: oklch(0.85 0.15 260);
          background: oklch(0.16 0.05 260);
          transform: scale(1.04);
        }
        .gm-chip--active {
          background: oklch(0.22 0.1 260);
          border-color: oklch(0.65 0.25 260);
          color: oklch(0.95 0.18 260);
          box-shadow: 0 0 10px oklch(0.6 0.25 260 / 0.45), inset 0 0 6px oklch(0.55 0.2 260 / 0.2);
          transform: scale(1.06);
        }
        .gm-chip--active:hover {
          box-shadow: 0 0 16px oklch(0.6 0.25 260 / 0.6);
        }

        .gm-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px 3px 12px;
          background: oklch(0.2 0.1 260 / 0.5);
          border: 1px solid oklch(0.55 0.2 260 / 0.5);
          border-radius: 14px;
          color: oklch(0.85 0.15 260);
          font-family: 'VT323', monospace;
          font-size: 14px;
          animation: tagPop 0.15s ease;
        }
        @keyframes tagPop {
          from { transform: scale(0.85); opacity: 0.5; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .gm-tag__remove {
          background: none;
          border: none;
          color: oklch(0.6 0.15 260);
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          padding: 0 2px;
          display: flex;
          align-items: center;
          transition: color 0.1s;
        }
        .gm-tag__remove:hover {
          color: oklch(0.8 0.25 15);
        }
      `}</style>
    </div>
  );
}

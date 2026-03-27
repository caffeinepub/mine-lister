import { useState } from "react";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzk_0uCDTVuwQ8O_VnllqGptBeOONrn_JMFXPet0vMhyg_xbm8rNvfuiyxBDyKa-P_a/exec";

const VERSIONS = [
  "1.8",
  "1.12.2",
  "1.16.5",
  "1.18.2",
  "1.19.4",
  "1.20.1",
  "1.20.4",
  "1.21",
];
const GAMEMODES = [
  "SMP",
  "Factions",
  "Skyblock",
  "PvP",
  "Creative",
  "Minigames",
  "Prison",
  "BedWars",
];
const SERVER_TYPES = ["Premium", "Cracked"];

interface Props {
  settings: Record<string, string>;
}

interface FieldErrors {
  serverName?: string;
  serverIP?: string;
  version?: string;
  gamemode?: string;
  serverType?: string;
}

const cardStyle: React.CSSProperties = {
  background: "oklch(0.12 0.025 255)",
  border: "1px solid oklch(0.4 0.15 260 / 0.4)",
  borderRadius: "12px",
  padding: "20px",
  transition: "border-color 0.2s, box-shadow 0.2s",
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

function FieldCard({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        ...cardStyle,
        borderColor: focused
          ? "oklch(0.7 0.2 260)"
          : error
            ? "oklch(0.65 0.25 10 / 0.7)"
            : "oklch(0.4 0.15 260 / 0.4)",
        boxShadow: focused
          ? "0 0 16px oklch(0.7 0.2 260 / 0.35), 0 0 4px oklch(0.55 0.22 285 / 0.2)"
          : error
            ? "0 0 10px oklch(0.65 0.25 10 / 0.2)"
            : "none",
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {children}
      {error && (
        <p
          style={{
            color: "oklch(0.72 0.25 20)",
            fontSize: "12px",
            marginTop: "6px",
            fontFamily: "'VT323', monospace",
          }}
        >
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

export default function UserSubmission({ settings }: Props) {
  const [serverName, setServerName] = useState("");
  const [serverIP, setServerIP] = useState("");
  const [version, setVersion] = useState("");
  const [gamemode, setGamemode] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [serverType, setServerType] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (settings.UserSubmissionEnabled !== "Yes") return null;

  function validate(): boolean {
    const newErrors: FieldErrors = {};
    if (!serverName.trim()) newErrors.serverName = "Server Name is required";
    if (!serverIP.trim()) newErrors.serverIP = "Server IP is required";
    if (!version) newErrors.version = "Please select a version";
    if (!gamemode) newErrors.gamemode = "Please select a gamemode";
    if (!serverType) newErrors.serverType = "Please select a server type";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError("");
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          serverName,
          serverIP,
          version,
          gamemode,
          description,
          imageURL,
          serverType,
          tags,
          userEmail: "guest@minelister.in",
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const Required = () => (
    <span style={{ color: "oklch(0.72 0.25 320)", marginLeft: "3px" }}>*</span>
  );

  if (submitted) {
    return (
      <section id="submit-server" className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <div
            data-ocid="submission.success_state"
            style={{
              background: "oklch(0.12 0.025 255)",
              border: "1px solid oklch(0.6 0.2 145 / 0.5)",
              borderRadius: "16px",
              padding: "48px 32px",
              textAlign: "center",
              boxShadow:
                "0 0 40px oklch(0.6 0.2 145 / 0.2), 0 0 80px oklch(0.6 0.2 145 / 0.1)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h3
              className="font-pixel neon-cyan"
              style={{ fontSize: "14px", marginBottom: "12px" }}
            >
              SUBMITTED!
            </h3>
            <p
              className="font-vt323"
              style={{ color: "oklch(0.8 0.1 145)", fontSize: "20px" }}
            >
              Your server has been submitted! We'll review it within 24–48
              hours.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="submit-server" className="py-16 border-t border-border">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="font-pixel neon-cyan"
            style={{ fontSize: "clamp(10px, 2vw, 16px)", marginBottom: "12px" }}
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

        <form onSubmit={handleSubmit} noValidate>
          {/* Grid: 2 cols desktop, 1 col mobile */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {/* Server Name */}
            <FieldCard error={errors.serverName}>
              <label htmlFor="serverName" style={labelStyle}>
                Server Name <Required />
              </label>
              <input
                id="serverName"
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="e.g. Indiacraft SMP"
                style={inputStyle}
                data-ocid="submission.server_name.input"
              />
            </FieldCard>

            {/* Server IP */}
            <FieldCard error={errors.serverIP}>
              <label htmlFor="serverIP" style={labelStyle}>
                Server IP <Required />
              </label>
              <input
                id="serverIP"
                type="text"
                value={serverIP}
                onChange={(e) => setServerIP(e.target.value)}
                placeholder="e.g. play.indiacraft.in"
                style={inputStyle}
                data-ocid="submission.server_ip.input"
              />
            </FieldCard>

            {/* Version */}
            <FieldCard error={errors.version}>
              <label htmlFor="version" style={labelStyle}>
                Version <Required />
              </label>
              <select
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                data-ocid="submission.version.select"
              >
                <option value="" disabled>
                  Select version...
                </option>
                {VERSIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </FieldCard>

            {/* Gamemode */}
            <FieldCard error={errors.gamemode}>
              <label htmlFor="gamemode" style={labelStyle}>
                Gamemode <Required />
              </label>
              <select
                id="gamemode"
                value={gamemode}
                onChange={(e) => setGamemode(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                data-ocid="submission.gamemode.select"
              >
                <option value="" disabled>
                  Select gamemode...
                </option>
                {GAMEMODES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </FieldCard>

            {/* Server Type */}
            <FieldCard error={errors.serverType}>
              <label htmlFor="serverType" style={labelStyle}>
                Server Type <Required />
              </label>
              <select
                id="serverType"
                value={serverType}
                onChange={(e) => setServerType(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                data-ocid="submission.server_type.select"
              >
                <option value="" disabled>
                  Select type...
                </option>
                {SERVER_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </FieldCard>

            {/* Image/Logo URL */}
            <FieldCard>
              <label htmlFor="imageURL" style={labelStyle}>
                Image / Logo URL
                <span
                  style={{
                    color: "oklch(0.5 0.08 260)",
                    marginLeft: "6px",
                    textTransform: "none",
                    fontSize: "10px",
                  }}
                >
                  (optional)
                </span>
              </label>
              <input
                id="imageURL"
                type="text"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                placeholder="https://..."
                style={inputStyle}
                data-ocid="submission.image_url.input"
              />
            </FieldCard>
          </div>

          {/* Full-width rows */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Description */}
            <FieldCard>
              <label htmlFor="description" style={labelStyle}>
                Description
                <span
                  style={{
                    color: "oklch(0.5 0.08 260)",
                    marginLeft: "6px",
                    textTransform: "none",
                    fontSize: "10px",
                  }}
                >
                  (optional)
                </span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell players about your server..."
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                data-ocid="submission.description.textarea"
              />
            </FieldCard>

            {/* Tags */}
            <FieldCard>
              <label htmlFor="tags" style={labelStyle}>
                Tags
                <span
                  style={{
                    color: "oklch(0.5 0.08 260)",
                    marginLeft: "6px",
                    textTransform: "none",
                    fontSize: "10px",
                  }}
                >
                  (optional)
                </span>
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Economy, PvP, Custom Enchants"
                style={inputStyle}
                data-ocid="submission.tags.input"
              />
            </FieldCard>
          </div>

          {/* Error message */}
          {submitError && (
            <div
              data-ocid="submission.error_state"
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: "oklch(0.18 0.05 15)",
                border: "1px solid oklch(0.65 0.25 10 / 0.5)",
                color: "oklch(0.8 0.2 20)",
                fontFamily: "'VT323', monospace",
                fontSize: "16px",
              }}
            >
              ⚠ {submitError}
            </div>
          )}

          {/* Submit button */}
          <div
            style={{
              marginTop: "28px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              data-ocid="submission.submit_button"
              style={{
                background: loading
                  ? "oklch(0.3 0.08 260)"
                  : "linear-gradient(135deg, oklch(0.55 0.22 245), oklch(0.5 0.25 285))",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "14px 48px",
                fontSize: "13px",
                fontFamily: "'Press Start 2P', cursive",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading
                  ? "none"
                  : "0 0 20px oklch(0.55 0.22 245 / 0.5), 0 0 40px oklch(0.5 0.25 285 / 0.3)",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                maxWidth: "360px",
                justifyContent: "center",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: "14px",
                      height: "14px",
                      border: "2px solid oklch(0.7 0.1 260 / 0.4)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  SUBMITTING...
                </>
              ) : (
                "SUBMIT SERVER"
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder, textarea::placeholder {
          color: oklch(0.45 0.06 260);
        }
        select option {
          background: oklch(0.12 0.025 255);
          color: #fff;
        }
        input:focus, select:focus, textarea:focus {
          border-color: oklch(0.7 0.2 260) !important;
          box-shadow: 0 0 0 2px oklch(0.7 0.2 260 / 0.2);
        }
      `}</style>
    </section>
  );
}

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyALZ7A88VlP-xK146Wmo-zayGUShSCv60Mn_wDoe0/dev";

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

interface Props {
  settings: Record<string, string>;
}

const sectionStyle: React.CSSProperties = {
  padding: "64px 0",
  borderTop: "1px solid oklch(0.3 0.1 260 / 0.4)",
};

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

export default function UserSubmission({ settings }: Props) {
  if (settings.UserSubmissionEnabled !== "Yes") return null;

  return (
    <section id="submit-server" style={sectionStyle}>
      <div style={{ maxWidth: "768px", margin: "0 auto", padding: "0 16px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
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

        {/* Native HTML form — method POST, action points to Apps Script */}
        <form
          method="POST"
          action={APPS_SCRIPT_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* 2-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {/* Server Name */}
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
                style={inputStyle}
              />
            </div>

            {/* Server IP */}
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
                style={inputStyle}
              />
            </div>

            {/* Version */}
            <div style={cardStyle}>
              <label htmlFor="version" style={labelStyle}>
                Version <span style={{ color: "oklch(0.72 0.25 320)" }}>*</span>
              </label>
              <select
                id="version"
                name="version"
                required
                defaultValue=""
                style={{ ...inputStyle, cursor: "pointer" }}
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
            </div>

            {/* Gamemode */}
            <div style={cardStyle}>
              <label htmlFor="gamemode" style={labelStyle}>
                Gamemode{" "}
                <span style={{ color: "oklch(0.72 0.25 320)" }}>*</span>
              </label>
              <select
                id="gamemode"
                name="gamemode"
                required
                defaultValue=""
                style={{ ...inputStyle, cursor: "pointer" }}
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
            </div>

            {/* Server Type */}
            <div style={cardStyle}>
              <label htmlFor="serverType" style={labelStyle}>
                Server Type{" "}
                <span style={{ color: "oklch(0.72 0.25 320)" }}>*</span>
              </label>
              <select
                id="serverType"
                name="serverType"
                required
                defaultValue=""
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="" disabled>
                  Select type...
                </option>
                <option value="Premium">Premium</option>
                <option value="Cracked">Cracked</option>
              </select>
            </div>

            {/* Image URL */}
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
                style={inputStyle}
              />
            </div>
          </div>

          {/* Full-width fields */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Description */}
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
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {/* Tags */}
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
                style={inputStyle}
              />
            </div>
          </div>

          {/* Submit */}
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
            >
              Submit Server
            </button>
          </div>
        </form>
      </div>

      <style>{`
        #submit-server input::placeholder,
        #submit-server textarea::placeholder {
          color: oklch(0.45 0.06 260);
        }
        #submit-server select option {
          background: oklch(0.12 0.025 255);
          color: #fff;
        }
        #submit-server input:focus,
        #submit-server select:focus,
        #submit-server textarea:focus {
          border-color: oklch(0.7 0.2 260) !important;
          box-shadow: 0 0 0 2px oklch(0.7 0.2 260 / 0.2);
        }
        #submit-server button[type="submit"]:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
          transition: all 0.15s;
        }
      `}</style>
    </section>
  );
}

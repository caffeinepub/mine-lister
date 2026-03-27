import { X } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onLogin: (
    username: string,
    password: string,
  ) => { success: boolean; error?: string };
  onSignup: (
    username: string,
    password: string,
  ) => { success: boolean; error?: string };
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 200,
  background: "oklch(0 0 0 / 0.82)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px",
};

const modalStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "420px",
  background: "oklch(0.09 0.02 255)",
  border: "1px solid oklch(0.45 0.18 260 / 0.6)",
  borderRadius: "16px",
  padding: "32px 28px",
  position: "relative",
  boxShadow:
    "0 0 60px oklch(0.55 0.22 260 / 0.3), 0 0 120px oklch(0.5 0.25 290 / 0.15)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "oklch(0.10 0.02 255)",
  color: "#fff",
  border: "1px solid oklch(0.3 0.1 260 / 0.5)",
  borderRadius: "8px",
  padding: "12px 14px",
  fontSize: "18px",
  outline: "none",
  fontFamily: "'VT323', monospace",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "9px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "oklch(0.7 0.15 260)",
  marginBottom: "8px",
  fontFamily: "'Press Start 2P', cursive",
};

export default function AuthModal({ open, onClose, onLogin, onSignup }: Props) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setError(null);
  };

  const switchTab = (t: "login" | "signup") => {
    setTab(t);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const fn = tab === "login" ? onLogin : onSignup;
    const result = fn(username, password);
    if (result.success) {
      resetForm();
      onClose();
    } else {
      setError(result.error ?? "Something went wrong");
    }
  };

  const handleOverlayClick = () => {
    resetForm();
    onClose();
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: modal backdrop
    <div onClick={handleOverlayClick} role="presentation" style={overlayStyle}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={modalStyle}
        data-ocid="auth.modal"
      >
        <button
          type="button"
          onClick={() => {
            resetForm();
            onClose();
          }}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "oklch(0.15 0.03 260)",
            border: "1px solid oklch(0.35 0.1 260 / 0.5)",
            borderRadius: "8px",
            padding: "6px",
            cursor: "pointer",
            color: "oklch(0.7 0.1 260)",
            display: "flex",
            alignItems: "center",
          }}
          data-ocid="auth.close_button"
        >
          <X size={16} />
        </button>

        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2
            className="font-pixel neon-cyan"
            style={{
              fontSize: "clamp(10px, 3vw, 14px)",
              letterSpacing: "0.06em",
            }}
          >
            MINE LISTER
          </h2>
          <p
            className="font-vt323"
            style={{
              color: "oklch(0.55 0.1 260)",
              fontSize: "16px",
              marginTop: "6px",
            }}
          >
            Your account, your servers
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            background: "oklch(0.12 0.025 255)",
            borderRadius: "10px",
            padding: "4px",
            marginBottom: "24px",
            border: "1px solid oklch(0.3 0.1 260 / 0.3)",
          }}
        >
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchTab(t)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "7px",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "9px",
                letterSpacing: "0.05em",
                transition: "all 0.2s",
                background:
                  tab === t
                    ? "linear-gradient(135deg, oklch(0.5 0.22 245), oklch(0.45 0.25 285))"
                    : "transparent",
                color: tab === t ? "#fff" : "oklch(0.5 0.1 260)",
                boxShadow:
                  tab === t ? "0 0 12px oklch(0.55 0.22 260 / 0.4)" : "none",
              }}
              data-ocid={`auth.${t}_tab`}
            >
              {t === "login" ? "LOGIN" : "SIGNUP"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="auth-username" style={labelStyle}>
              Username
            </label>
            <input
              id="auth-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={inputStyle}
              data-ocid="auth.input"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="auth-password" style={labelStyle}>
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete={
                tab === "signup" ? "new-password" : "current-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={inputStyle}
              data-ocid="auth.input"
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: "16px",
                padding: "10px 14px",
                background: "oklch(0.15 0.05 10 / 0.5)",
                border: "1px solid oklch(0.55 0.22 15 / 0.6)",
                borderRadius: "8px",
                color: "oklch(0.75 0.22 15)",
                fontFamily: "'VT323', monospace",
                fontSize: "16px",
              }}
              data-ocid="auth.error_state"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              background:
                "linear-gradient(135deg, oklch(0.55 0.22 245), oklch(0.5 0.25 285))",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "13px",
              fontSize: "11px",
              fontFamily: "'Press Start 2P', cursive",
              cursor: "pointer",
              boxShadow:
                "0 0 20px oklch(0.55 0.22 245 / 0.5), 0 0 40px oklch(0.5 0.25 285 / 0.3)",
              letterSpacing: "0.05em",
            }}
            data-ocid="auth.submit_button"
          >
            {tab === "login" ? "LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <style>{`
          #auth-username:focus, #auth-password:focus {
            border-color: oklch(0.7 0.2 260) !important;
            box-shadow: 0 0 0 2px oklch(0.7 0.2 260 / 0.2);
          }
          #auth-username::placeholder, #auth-password::placeholder {
            color: oklch(0.4 0.06 260);
          }
        `}</style>
      </div>
    </div>
  );
}

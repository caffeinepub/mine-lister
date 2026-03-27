import { useEffect, useState } from "react";
import type { ServerData } from "../utils/sheetsParser";
import { fetchServersFromAPI } from "../utils/sheetsParser";

interface Props {
  currentUser: string;
  onEditServer: (server: ServerData) => void;
  onBackToHome: () => void;
}

export default function MyServers({
  currentUser,
  onEditServer,
  onBackToHome,
}: Props) {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchServersFromAPI()
      .then((all) => {
        if (cancelled) return;
        const mine = all.filter(
          (s) =>
            s.submittedBy?.toLowerCase() === currentUser.toLowerCase() ||
            (s as unknown as Record<string, string>)[
              "Submitted By"
            ]?.toLowerCase() === currentUser.toLowerCase(),
        );
        setServers(mine);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const cardStyle: React.CSSProperties = {
    background: "oklch(0.12 0.025 255)",
    border: "1px solid oklch(0.4 0.15 260 / 0.4)",
    borderRadius: "14px",
    padding: "20px 24px",
    transition: "box-shadow 0.2s",
  };

  return (
    <section
      style={{
        minHeight: "60vh",
        padding: "40px 16px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
      data-ocid="myservers.section"
    >
      <div style={{ marginBottom: "32px" }}>
        <button
          type="button"
          onClick={onBackToHome}
          style={{
            background: "none",
            border: "1px solid oklch(0.4 0.12 260 / 0.5)",
            borderRadius: "8px",
            color: "oklch(0.65 0.15 260)",
            padding: "6px 16px",
            cursor: "pointer",
            fontFamily: "'VT323', monospace",
            fontSize: "17px",
            marginBottom: "20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
          data-ocid="myservers.button"
        >
          ← Back to Servers
        </button>

        <h1
          className="font-pixel neon-cyan"
          style={{
            fontSize: "clamp(10px, 2.5vw, 18px)",
            letterSpacing: "0.08em",
          }}
        >
          MY SERVERS
        </h1>
        <p
          className="font-vt323"
          style={{
            color: "oklch(0.55 0.08 260)",
            fontSize: "18px",
            marginTop: "8px",
          }}
        >
          Submitted by {currentUser}
        </p>
      </div>

      {loading && (
        <div
          style={{ textAlign: "center", padding: "60px 0" }}
          data-ocid="myservers.loading_state"
        >
          <p
            className="font-vt323"
            style={{ color: "oklch(0.6 0.15 260)", fontSize: "22px" }}
          >
            Loading your servers...
          </p>
        </div>
      )}

      {error && !loading && (
        <div
          style={{ textAlign: "center", padding: "40px 0" }}
          data-ocid="myservers.error_state"
        >
          <p
            className="font-vt323"
            style={{ color: "oklch(0.65 0.2 10)", fontSize: "20px" }}
          >
            {error}
          </p>
        </div>
      )}

      {!loading && !error && servers.length === 0 && (
        <div
          style={{
            ...cardStyle,
            textAlign: "center",
            padding: "56px 24px",
            border: "1px dashed oklch(0.35 0.1 260 / 0.5)",
          }}
          data-ocid="myservers.empty_state"
        >
          <p
            className="font-pixel"
            style={{
              color: "oklch(0.5 0.1 260)",
              fontSize: "10px",
              marginBottom: "14px",
            }}
          >
            NO SERVERS YET
          </p>
          <p
            className="font-vt323"
            style={{ color: "oklch(0.5 0.06 260)", fontSize: "18px" }}
          >
            You haven't submitted any servers. Click Submit in the navbar to add
            yours!
          </p>
        </div>
      )}

      {!loading && !error && servers.length > 0 && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          data-ocid="myservers.list"
        >
          {servers.map((server, idx) => (
            <div
              key={`${server.name}-${idx}`}
              style={cardStyle}
              className="myserver-card"
              data-ocid={`myservers.item.${idx + 1}`}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    {server.featured && (
                      <span
                        style={{
                          color: "oklch(0.82 0.2 85)",
                          fontSize: "16px",
                        }}
                      >
                        ★
                      </span>
                    )}
                    <h3
                      className="font-pixel neon-cyan"
                      style={{ fontSize: "11px" }}
                    >
                      {server.name}
                    </h3>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      className="font-vt323"
                      style={{
                        color: "oklch(0.55 0.08 260)",
                        fontSize: "14px",
                      }}
                    >
                      IP:
                    </span>
                    <span
                      className="font-vt323"
                      style={{
                        color: "oklch(0.8 0.12 200)",
                        fontSize: "17px",
                        fontWeight: "bold",
                      }}
                    >
                      {server.ip || "IP not available"}
                    </span>
                  </div>

                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    <span
                      style={{
                        background: "oklch(0.18 0.04 260)",
                        border: "1px solid oklch(0.35 0.12 260 / 0.5)",
                        borderRadius: "6px",
                        padding: "2px 10px",
                        fontSize: "13px",
                        fontFamily: "'VT323', monospace",
                        color: "oklch(0.7 0.12 260)",
                      }}
                    >
                      {server.version}
                    </span>
                    <span
                      style={{
                        background: "oklch(0.18 0.04 290)",
                        border: "1px solid oklch(0.35 0.12 290 / 0.5)",
                        borderRadius: "6px",
                        padding: "2px 10px",
                        fontSize: "13px",
                        fontFamily: "'VT323', monospace",
                        color: "oklch(0.7 0.12 290)",
                      }}
                    >
                      {server.gamemode}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "10px",
                  }}
                >
                  {server.approved?.toLowerCase() === "yes" ? (
                    <span
                      style={{
                        background: "oklch(0.18 0.08 145)",
                        border: "1px solid oklch(0.45 0.18 145 / 0.6)",
                        color: "oklch(0.75 0.2 145)",
                        borderRadius: "8px",
                        padding: "3px 12px",
                        fontFamily: "'VT323', monospace",
                        fontSize: "15px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ✓ Approved
                    </span>
                  ) : (
                    <span
                      style={{
                        background: "oklch(0.18 0.08 75)",
                        border: "1px solid oklch(0.5 0.18 75 / 0.6)",
                        color: "oklch(0.78 0.18 75)",
                        borderRadius: "8px",
                        padding: "3px 12px",
                        fontFamily: "'VT323', monospace",
                        fontSize: "15px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ⏳ Pending
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onEditServer(server)}
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.4 0.18 245), oklch(0.35 0.2 270))",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      padding: "6px 16px",
                      cursor: "pointer",
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: "9px",
                      boxShadow: "0 0 10px oklch(0.5 0.2 260 / 0.3)",
                    }}
                    data-ocid={`myservers.edit_button.${idx + 1}`}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .myserver-card:hover {
          box-shadow: 0 0 24px oklch(0.55 0.22 260 / 0.25);
        }
      `}</style>
    </section>
  );
}

import { useCallback, useEffect, useState } from "react";
import {
  type Announcement,
  type Comment,
  addAnnouncement,
  addCustomServer,
  adminLogin,
  adminLogout,
  approveComment,
  deleteAnnouncement,
  deleteComment,
  deleteCustomServer,
  getAnnouncements,
  getComments,
  getCustomServers,
  getHiddenServers,
  getRatings,
  isAdminLoggedIn,
  setRating,
  toggleHiddenServer,
  updateAnnouncement,
  updateCustomServer,
} from "../utils/adminStore";
import {
  SAMPLE_SERVERS,
  type ServerData,
  fetchServersFromAPI,
} from "../utils/sheetsParser";

type Tab = "servers" | "comments" | "announcements" | "spam";
type CommentFilter = "all" | "pending" | "approved";

// ─── Login Gate ──────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (adminLogin(username, password)) {
      onLogin();
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "oklch(0.09 0.02 255)" }}
    >
      <div
        className="rounded-xl p-8 border border-border w-full max-w-sm"
        style={{ background: "oklch(0.12 0.025 255)" }}
        data-ocid="admin.panel"
      >
        <h1
          className="font-pixel neon-cyan mb-1 text-center"
          style={{ fontSize: "11px", letterSpacing: "3px" }}
        >
          ⚙ ADMIN ACCESS
        </h1>
        <p
          className="font-vt323 text-muted-foreground text-center mb-6"
          style={{ fontSize: "16px" }}
        >
          MINE Lister Admin Panel
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="font-vt323 w-full rounded px-3 py-2 border border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            style={{ fontSize: "16px" }}
            autoComplete="username"
            data-ocid="admin.input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="font-vt323 w-full rounded px-3 py-2 border border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            style={{ fontSize: "16px" }}
            autoComplete="current-password"
            data-ocid="admin.input"
          />
          {error && (
            <p
              className="font-vt323"
              style={{ fontSize: "14px", color: "oklch(0.65 0.22 20)" }}
              data-ocid="admin.error_state"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            className="font-pixel border-2 border-primary px-4 py-2 text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground active:scale-95"
            style={{ fontSize: "9px" }}
            data-ocid="admin.submit_button"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Server Form ─────────────────────────────────────────────

const EMPTY_SERVER: ServerData = {
  name: "",
  ip: "",
  version: "",
  gamemode: "",
  description: "",
  imageURL: "",
  serverType: "Cracked",
  tags: [],
  featured: false,
  approved: "Yes",
};

function ServerForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ServerData;
  onSave: (s: ServerData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ServerData>({
    ...initial,
    tags: Array.isArray(initial.tags) ? initial.tags : [],
  });
  const [tagsRaw, setTagsRaw] = useState(
    Array.isArray(initial.tags) ? initial.tags.join(", ") : "",
  );

  const set = (k: keyof ServerData, v: unknown) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ ...form, tags });
  };

  return (
    <form
      onSubmit={handleSave}
      className="rounded-lg p-5 border border-border mb-4"
      style={{ background: "oklch(0.11 0.02 255)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(
          [
            ["name", "Server Name *"],
            ["ip", "Server IP"],
            ["version", "Version"],
            ["gamemode", "Gamemode"],
            ["imageURL", "Image URL"],
          ] as [keyof ServerData, string][]
        ).map(([k, label]) => (
          <div key={k}>
            <p
              className="font-pixel block mb-1"
              style={{ fontSize: "7px", color: "oklch(0.55 0.08 255)" }}
            >
              {label}
            </p>
            <input
              type="text"
              value={(form[k] as string) ?? ""}
              onChange={(e) => set(k, e.target.value)}
              required={k === "name"}
              className="font-vt323 w-full rounded px-2 py-1 border border-border bg-transparent text-foreground focus:outline-none focus:border-primary"
              style={{ fontSize: "15px" }}
            />
          </div>
        ))}
        <div>
          <p
            className="font-pixel block mb-1"
            style={{ fontSize: "7px", color: "oklch(0.55 0.08 255)" }}
          >
            Tags (comma-separated)
          </p>
          <input
            type="text"
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            placeholder="SMP, PvP, Survival"
            className="font-vt323 w-full rounded px-2 py-1 border border-border bg-transparent text-foreground focus:outline-none focus:border-primary"
            style={{ fontSize: "15px" }}
          />
        </div>
        <div>
          <p
            className="font-pixel block mb-1"
            style={{ fontSize: "7px", color: "oklch(0.55 0.08 255)" }}
          >
            Description
          </p>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            className="font-vt323 w-full rounded px-2 py-1 border border-border bg-transparent text-foreground focus:outline-none focus:border-primary resize-none"
            style={{ fontSize: "15px" }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <p
              className="font-pixel block mb-1"
              style={{ fontSize: "7px", color: "oklch(0.55 0.08 255)" }}
            >
              Server Type
            </p>
            <select
              value={form.serverType}
              onChange={(e) =>
                set("serverType", e.target.value as "Premium" | "Cracked")
              }
              className="font-vt323 w-full rounded px-2 py-1 border border-border bg-card text-foreground focus:outline-none"
              style={{ fontSize: "15px" }}
            >
              <option value="Cracked">Cracked</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="rounded"
            />
            <span
              className="font-vt323"
              style={{ fontSize: "15px", color: "oklch(0.82 0.15 80)" }}
            >
              Featured
            </span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="font-pixel border-2 border-primary px-4 py-1.5 text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
          style={{ fontSize: "8px" }}
          data-ocid="admin.save_button"
        >
          SAVE
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-pixel border border-border px-4 py-1.5 text-muted-foreground hover:text-foreground transition-all"
          style={{ fontSize: "8px" }}
          data-ocid="admin.cancel_button"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}

// ─── Servers Tab ─────────────────────────────────────────────

function ServersTab({
  apiServers,
}: {
  apiServers: ServerData[];
}) {
  const [customServers, setCustomServers] = useState<ServerData[]>(
    getCustomServers(),
  );
  const [hiddenServers, setHiddenServers] = useState<string[]>(
    getHiddenServers(),
  );
  const [ratings, setRatings] = useState<Record<string, number>>(getRatings());
  const [addingNew, setAddingNew] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerData | null>(null);

  const refresh = () => {
    setCustomServers(getCustomServers());
    setHiddenServers(getHiddenServers());
    setRatings(getRatings());
  };

  const allServers = [
    ...customServers.map((s) => ({ ...s, _custom: true })),
    ...apiServers.map((s) => ({ ...s, _custom: false })),
  ] as (ServerData & { _custom: boolean })[];

  const handleAddServer = (s: ServerData) => {
    addCustomServer(s);
    setAddingNew(false);
    refresh();
  };

  const handleEditSave = (s: ServerData) => {
    if (editingServer) {
      if (
        (editingServer as ServerData & { _custom: boolean })._custom ||
        customServers.find((c) => c.name === editingServer.name)
      ) {
        updateCustomServer(editingServer.name, s);
      }
    }
    setEditingServer(null);
    refresh();
  };

  const handleDelete = (name: string, isCustom: boolean) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    if (isCustom) deleteCustomServer(name);
    refresh();
  };

  const handleToggleVisibility = (name: string) => {
    toggleHiddenServer(name);
    refresh();
  };

  const handleSetRating = (name: string, r: number) => {
    setRating(name, r);
    refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-pixel neon-cyan" style={{ fontSize: "9px" }}>
          ALL SERVERS ({allServers.length})
        </p>
        <button
          type="button"
          onClick={() => {
            setAddingNew(true);
            setEditingServer(null);
          }}
          className="font-pixel border-2 border-primary px-3 py-1.5 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          style={{ fontSize: "8px" }}
          data-ocid="admin.primary_button"
        >
          + ADD SERVER
        </button>
      </div>

      {addingNew && (
        <ServerForm
          initial={EMPTY_SERVER}
          onSave={handleAddServer}
          onCancel={() => setAddingNew(false)}
        />
      )}

      {editingServer && (
        <ServerForm
          initial={editingServer}
          onSave={handleEditSave}
          onCancel={() => setEditingServer(null)}
        />
      )}

      <div className="overflow-x-auto">
        <table
          className="w-full text-left"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid oklch(0.2 0.03 255)" }}>
              {[
                "Name",
                "IP",
                "Version",
                "Type",
                "Rating",
                "Visibility",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="font-pixel pb-2 pr-4"
                  style={{
                    fontSize: "7px",
                    color: "oklch(0.55 0.08 255)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allServers.map((s, i) => {
              const isHidden = hiddenServers.includes(s.name);
              const rating = ratings[s.name] ?? 0;
              return (
                <tr
                  key={`${s.name}-${i}`}
                  style={{
                    background:
                      i % 2 === 0
                        ? "transparent"
                        : "oklch(0.115 0.02 255 / 0.5)",
                    borderBottom: "1px solid oklch(0.18 0.02 255 / 0.5)",
                    opacity: isHidden ? 0.5 : 1,
                  }}
                  data-ocid={`admin.row.${i + 1}`}
                >
                  <td className="py-2 pr-4">
                    <span className="font-vt323" style={{ fontSize: "15px" }}>
                      {s.name}
                    </span>
                    {s._custom && (
                      <span
                        className="ml-2 font-pixel px-1 rounded"
                        style={{
                          fontSize: "6px",
                          color: "oklch(0.78 0.2 160)",
                          border: "1px solid oklch(0.78 0.2 160 / 0.4)",
                          background: "oklch(0.78 0.2 160 / 0.08)",
                        }}
                      >
                        CUSTOM
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    <span
                      className="font-vt323 text-muted-foreground"
                      style={{ fontSize: "14px" }}
                    >
                      {s.ip || "—"}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    <span
                      className="font-vt323 text-muted-foreground"
                      style={{ fontSize: "14px" }}
                    >
                      {s.version || "—"}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    <span
                      className="font-vt323"
                      style={{
                        fontSize: "14px",
                        color:
                          s.serverType === "Premium"
                            ? "oklch(0.85 0.15 200)"
                            : "oklch(0.7 0.22 285)",
                      }}
                    >
                      {s.serverType}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    <select
                      value={rating}
                      onChange={(e) =>
                        handleSetRating(s.name, Number(e.target.value))
                      }
                      className="font-vt323 rounded px-1 border border-border bg-card text-foreground"
                      style={{ fontSize: "13px" }}
                    >
                      <option value={0}>None</option>
                      {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>
                          {"★".repeat(r)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(s.name)}
                      className="font-vt323 px-2 py-0.5 rounded border transition-all"
                      style={{
                        fontSize: "13px",
                        color: isHidden
                          ? "oklch(0.65 0.22 20)"
                          : "oklch(0.78 0.2 160)",
                        borderColor: isHidden
                          ? "oklch(0.65 0.22 20 / 0.4)"
                          : "oklch(0.78 0.2 160 / 0.4)",
                        background: isHidden
                          ? "oklch(0.65 0.22 20 / 0.08)"
                          : "oklch(0.78 0.2 160 / 0.08)",
                      }}
                      data-ocid={`admin.toggle.${i + 1}`}
                    >
                      {isHidden ? "Hidden" : "Visible"}
                    </button>
                  </td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingServer(s);
                          setAddingNew(false);
                        }}
                        className="font-vt323 px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground transition-all"
                        style={{ fontSize: "13px" }}
                        data-ocid={`admin.edit_button.${i + 1}`}
                      >
                        Edit
                      </button>
                      {s._custom && (
                        <button
                          type="button"
                          onClick={() => handleDelete(s.name, s._custom)}
                          className="font-vt323 px-2 py-0.5 rounded border transition-all"
                          style={{
                            fontSize: "13px",
                            color: "oklch(0.65 0.22 20)",
                            borderColor: "oklch(0.65 0.22 20 / 0.4)",
                            background: "oklch(0.65 0.22 20 / 0.06)",
                          }}
                          data-ocid={`admin.delete_button.${i + 1}`}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Comments Tab ─────────────────────────────────────────────

function CommentsTab({ isSpam }: { isSpam?: boolean }) {
  const [comments, setComments] = useState<Comment[]>(getComments());
  const [filter, setFilter] = useState<CommentFilter>("all");

  const refresh = () => setComments(getComments());

  const filtered = comments.filter((c) => {
    if (filter === "all" || isSpam) return true;
    return c.status === filter;
  });

  const pending = filtered.filter((c) => c.status === "pending");
  const approved = filtered.filter((c) => c.status === "approved");
  const displayed = isSpam ? filtered : [...pending, ...approved];

  const handleApprove = (id: string) => {
    approveComment(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteComment(id);
    refresh();
  };

  return (
    <div>
      {!isSpam && (
        <div className="flex items-center gap-2 mb-4">
          <p className="font-pixel neon-cyan" style={{ fontSize: "9px" }}>
            COMMENTS
          </p>
          <div className="flex gap-2 ml-auto">
            {(["all", "pending", "approved"] as CommentFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className="font-vt323 px-3 py-0.5 rounded border transition-all"
                style={{
                  fontSize: "14px",
                  color:
                    filter === f
                      ? "oklch(0.85 0.15 200)"
                      : "oklch(0.55 0.08 255)",
                  borderColor:
                    filter === f
                      ? "oklch(0.85 0.15 200 / 0.5)"
                      : "oklch(0.3 0.05 255 / 0.4)",
                  background:
                    filter === f ? "oklch(0.85 0.15 200 / 0.1)" : "transparent",
                }}
                data-ocid={"admin.tab"}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
      {isSpam && (
        <p className="font-pixel neon-cyan mb-4" style={{ fontSize: "9px" }}>
          SPAM MODERATION
        </p>
      )}

      {displayed.length === 0 ? (
        <p
          className="font-vt323 text-muted-foreground text-center py-8"
          style={{ fontSize: "18px" }}
          data-ocid="admin.empty_state"
        >
          No comments found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(0.2 0.03 255)" }}>
                {[
                  "Server",
                  "Author",
                  "Message",
                  "Status",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="font-pixel pb-2 pr-3 text-left"
                    style={{
                      fontSize: "7px",
                      color: "oklch(0.55 0.08 255)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((c, i) => (
                <tr
                  key={c.id}
                  style={{
                    background:
                      i % 2 === 0
                        ? "transparent"
                        : "oklch(0.115 0.02 255 / 0.5)",
                    borderBottom: "1px solid oklch(0.18 0.02 255 / 0.5)",
                  }}
                  data-ocid={`admin.row.${i + 1}`}
                >
                  <td className="py-2 pr-3">
                    <span className="font-vt323" style={{ fontSize: "14px" }}>
                      {c.serverName}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    <span
                      className="font-vt323 neon-cyan"
                      style={{ fontSize: "14px" }}
                    >
                      {c.authorName}
                    </span>
                  </td>
                  <td className="py-2 pr-3" style={{ maxWidth: "200px" }}>
                    <span
                      className="font-vt323 text-muted-foreground block truncate"
                      style={{ fontSize: "14px" }}
                    >
                      {c.message}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    <span
                      className="font-pixel px-2 py-0.5 rounded"
                      style={{
                        fontSize: "6px",
                        color:
                          c.status === "approved"
                            ? "oklch(0.78 0.2 160)"
                            : "oklch(0.82 0.15 80)",
                        border: `1px solid ${
                          c.status === "approved"
                            ? "oklch(0.78 0.2 160 / 0.4)"
                            : "oklch(0.82 0.15 80 / 0.4)"
                        }`,
                        background:
                          c.status === "approved"
                            ? "oklch(0.78 0.2 160 / 0.08)"
                            : "oklch(0.82 0.15 80 / 0.08)",
                      }}
                    >
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    <span
                      className="font-vt323 text-muted-foreground"
                      style={{ fontSize: "13px" }}
                    >
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      {c.status === "pending" && !isSpam && (
                        <button
                          type="button"
                          onClick={() => handleApprove(c.id)}
                          className="font-vt323 px-2 py-0.5 rounded border transition-all"
                          style={{
                            fontSize: "13px",
                            color: "oklch(0.78 0.2 160)",
                            borderColor: "oklch(0.78 0.2 160 / 0.4)",
                            background: "oklch(0.78 0.2 160 / 0.08)",
                          }}
                          data-ocid={`admin.confirm_button.${i + 1}`}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="font-vt323 px-2 py-0.5 rounded border transition-all"
                        style={{
                          fontSize: "13px",
                          color: "oklch(0.65 0.22 20)",
                          borderColor: "oklch(0.65 0.22 20 / 0.4)",
                          background: "oklch(0.65 0.22 20 / 0.06)",
                        }}
                        data-ocid={`admin.delete_button.${i + 1}`}
                      >
                        {isSpam ? "Remove" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Announcements Tab ───────────────────────────────────────

function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    getAnnouncements(),
  );
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const refresh = () => setAnnouncements(getAnnouncements());

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addAnnouncement(title, body);
    setTitle("");
    setBody("");
    setAdding(false);
    refresh();
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !title.trim()) return;
    updateAnnouncement(editing.id, title, body);
    setEditing(null);
    setTitle("");
    setBody("");
    refresh();
  };

  const startEdit = (ann: Announcement) => {
    setEditing(ann);
    setAdding(false);
    setTitle(ann.title);
    setBody(ann.body);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this announcement?")) return;
    deleteAnnouncement(id);
    refresh();
  };

  const isFormOpen = adding || !!editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-pixel neon-cyan" style={{ fontSize: "9px" }}>
          ANNOUNCEMENTS ({announcements.length})
        </p>
        <button
          type="button"
          onClick={() => {
            setAdding(true);
            setEditing(null);
            setTitle("");
            setBody("");
          }}
          className="font-pixel border-2 border-primary px-3 py-1.5 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          style={{ fontSize: "8px" }}
          data-ocid="admin.primary_button"
        >
          + NEW
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={editing ? handleEditSave : handleAdd}
          className="rounded-lg p-4 border border-border mb-4"
          style={{ background: "oklch(0.11 0.02 255)" }}
          data-ocid="admin.panel"
        >
          <div className="flex flex-col gap-3">
            <div>
              <p
                className="font-pixel block mb-1"
                style={{ fontSize: "7px", color: "oklch(0.55 0.08 255)" }}
              >
                Title *
              </p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="font-vt323 w-full rounded px-2 py-1 border border-border bg-transparent text-foreground focus:outline-none focus:border-primary"
                style={{ fontSize: "16px" }}
                data-ocid="admin.input"
              />
            </div>
            <div>
              <p
                className="font-pixel block mb-1"
                style={{ fontSize: "7px", color: "oklch(0.55 0.08 255)" }}
              >
                Body
              </p>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                className="font-vt323 w-full rounded px-2 py-1 border border-border bg-transparent text-foreground focus:outline-none focus:border-primary resize-none"
                style={{ fontSize: "16px" }}
                data-ocid="admin.textarea"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="font-pixel border-2 border-primary px-3 py-1.5 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                style={{ fontSize: "8px" }}
                data-ocid="admin.save_button"
              >
                {editing ? "UPDATE" : "PUBLISH"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setEditing(null);
                  setTitle("");
                  setBody("");
                }}
                className="font-pixel border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground transition-all"
                style={{ fontSize: "8px" }}
                data-ocid="admin.cancel_button"
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      )}

      {announcements.length === 0 ? (
        <p
          className="font-vt323 text-muted-foreground text-center py-8"
          style={{ fontSize: "18px" }}
          data-ocid="admin.empty_state"
        >
          No announcements yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {announcements.map((ann, i) => (
            <div
              key={ann.id}
              className="rounded-lg px-4 py-3 border border-border"
              style={{ background: "oklch(0.11 0.02 255)" }}
              data-ocid={`admin.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p
                    className="font-pixel neon-cyan"
                    style={{ fontSize: "8px" }}
                  >
                    {ann.title}
                  </p>
                  <p
                    className="font-vt323 text-muted-foreground mt-1 line-clamp-2"
                    style={{ fontSize: "15px" }}
                  >
                    {ann.body || "(no body)"}
                  </p>
                  <p
                    className="font-vt323 mt-1"
                    style={{ fontSize: "12px", color: "oklch(0.4 0.05 255)" }}
                  >
                    {new Date(ann.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(ann)}
                    className="font-vt323 px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground transition-all"
                    style={{ fontSize: "13px" }}
                    data-ocid={`admin.edit_button.${i + 1}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ann.id)}
                    className="font-vt323 px-2 py-0.5 rounded border transition-all"
                    style={{
                      fontSize: "13px",
                      color: "oklch(0.65 0.22 20)",
                      borderColor: "oklch(0.65 0.22 20 / 0.4)",
                      background: "oklch(0.65 0.22 20 / 0.06)",
                    }}
                    data-ocid={`admin.delete_button.${i + 1}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Dashboard ────────────────────────────────────

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const [tab, setTab] = useState<Tab>("servers");
  const [apiServers, setApiServers] = useState<ServerData[]>([]);

  const loadServers = useCallback(async () => {
    try {
      const servers = await fetchServersFromAPI();
      setApiServers(servers);
    } catch {
      setApiServers([...SAMPLE_SERVERS]);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) loadServers();
  }, [loggedIn, loadServers]);

  if (!loggedIn) {
    return <LoginForm onLogin={() => setLoggedIn(true)} />;
  }

  const handleLogout = () => {
    adminLogout();
    setLoggedIn(false);
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "servers", label: "Servers" },
    { id: "comments", label: "Comments" },
    { id: "announcements", label: "Announcements" },
    { id: "spam", label: "Spam" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.09 0.02 255)" }}
    >
      {/* Header */}
      <header
        className="border-b border-border px-6 py-4 flex items-center justify-between"
        style={{ background: "oklch(0.10 0.025 255)" }}
      >
        <div>
          <h1
            className="font-pixel neon-cyan"
            style={{ fontSize: "11px", letterSpacing: "2px" }}
          >
            ⚙ ADMIN DASHBOARD
          </h1>
          <p
            className="font-vt323 text-muted-foreground"
            style={{ fontSize: "14px" }}
          >
            MINE Lister
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="font-pixel border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all"
          style={{ fontSize: "7px" }}
          data-ocid="admin.secondary_button"
        >
          LOGOUT
        </button>
      </header>

      {/* Tab bar */}
      <div
        className="border-b border-border px-6 flex gap-0"
        style={{ background: "oklch(0.10 0.025 255)" }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="font-pixel px-4 py-3 border-b-2 transition-all"
            style={{
              fontSize: "8px",
              color:
                tab === t.id ? "oklch(0.85 0.15 200)" : "oklch(0.5 0.08 255)",
              borderBottomColor:
                tab === t.id ? "oklch(0.85 0.15 200)" : "transparent",
            }}
            data-ocid={"admin.tab"}
          >
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="p-6">
        <div
          className="rounded-xl p-6 border border-border"
          style={{ background: "oklch(0.12 0.025 255)" }}
        >
          {tab === "servers" && <ServersTab apiServers={apiServers} />}
          {tab === "comments" && <CommentsTab />}
          {tab === "announcements" && <AnnouncementsTab />}
          {tab === "spam" && <CommentsTab isSpam />}
        </div>
      </main>
    </div>
  );
}

import type { ServerData } from "./sheetsParser";

// ─── Types ───────────────────────────────────────────────────

export interface Comment {
  id: string;
  serverName: string;
  authorName: string;
  message: string;
  status: "pending" | "approved";
  createdAt: number;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: number;
}

// ─── Keys ────────────────────────────────────────────────────

const RATINGS_KEY = "minelister_ratings";
const COMMENTS_KEY = "minelister_comments";
const ANNOUNCEMENTS_KEY = "minelister_announcements";
const HIDDEN_KEY = "minelister_hidden_servers";
const CUSTOM_SERVERS_KEY = "minelister_custom_servers";
const ADMIN_SESSION_KEY = "minelister_admin_session";

// ─── Helpers ─────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Admin Session ───────────────────────────────────────────

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function adminLogin(username: string, password: string): boolean {
  if (username === "admin" && password === "minelister2024") {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    return true;
  }
  return false;
}

export function adminLogout(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

// ─── Ratings ─────────────────────────────────────────────────

export function getRatings(): Record<string, number> {
  return load<Record<string, number>>(RATINGS_KEY, {});
}

export function setRating(serverName: string, rating: number): void {
  const ratings = getRatings();
  if (rating === 0) {
    delete ratings[serverName];
  } else {
    ratings[serverName] = Math.min(5, Math.max(1, rating));
  }
  save(RATINGS_KEY, ratings);
}

export function getRating(serverName: string): number {
  return getRatings()[serverName] ?? 0;
}

// ─── Comments ────────────────────────────────────────────────

export function getComments(): Comment[] {
  return load<Comment[]>(COMMENTS_KEY, []);
}

export function addComment(
  serverName: string,
  authorName: string,
  message: string,
): Comment {
  const comments = getComments();
  const comment: Comment = {
    id: uid(),
    serverName,
    authorName: authorName.trim(),
    message: message.trim(),
    status: "pending",
    createdAt: Date.now(),
  };
  comments.push(comment);
  save(COMMENTS_KEY, comments);
  return comment;
}

export function approveComment(id: string): void {
  const comments = getComments().map((c) =>
    c.id === id ? { ...c, status: "approved" as const } : c,
  );
  save(COMMENTS_KEY, comments);
}

export function deleteComment(id: string): void {
  save(
    COMMENTS_KEY,
    getComments().filter((c) => c.id !== id),
  );
}

export function getApprovedComments(serverName: string): Comment[] {
  return getComments().filter(
    (c) => c.serverName === serverName && c.status === "approved",
  );
}

// ─── Announcements ───────────────────────────────────────────

export function getAnnouncements(): Announcement[] {
  return load<Announcement[]>(ANNOUNCEMENTS_KEY, []).sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}

export function addAnnouncement(title: string, body: string): Announcement {
  const ann: Announcement = { id: uid(), title, body, createdAt: Date.now() };
  const list = load<Announcement[]>(ANNOUNCEMENTS_KEY, []);
  list.unshift(ann);
  save(ANNOUNCEMENTS_KEY, list);
  return ann;
}

export function updateAnnouncement(
  id: string,
  title: string,
  body: string,
): void {
  const list = load<Announcement[]>(ANNOUNCEMENTS_KEY, []).map((a) =>
    a.id === id ? { ...a, title, body } : a,
  );
  save(ANNOUNCEMENTS_KEY, list);
}

export function deleteAnnouncement(id: string): void {
  save(
    ANNOUNCEMENTS_KEY,
    load<Announcement[]>(ANNOUNCEMENTS_KEY, []).filter((a) => a.id !== id),
  );
}

// ─── Hidden Servers ──────────────────────────────────────────

export function getHiddenServers(): string[] {
  return load<string[]>(HIDDEN_KEY, []);
}

export function toggleHiddenServer(serverName: string): void {
  const list = getHiddenServers();
  const idx = list.indexOf(serverName);
  if (idx === -1) {
    list.push(serverName);
  } else {
    list.splice(idx, 1);
  }
  save(HIDDEN_KEY, list);
}

export function isServerHidden(serverName: string): boolean {
  return getHiddenServers().includes(serverName);
}

// ─── Custom Servers ──────────────────────────────────────────

export function getCustomServers(): ServerData[] {
  return load<ServerData[]>(CUSTOM_SERVERS_KEY, []);
}

export function addCustomServer(server: ServerData): void {
  const list = getCustomServers();
  list.push(server);
  save(CUSTOM_SERVERS_KEY, list);
}

export function updateCustomServer(
  name: string,
  updated: Partial<ServerData>,
): void {
  const list = getCustomServers().map((s) =>
    s.name === name ? { ...s, ...updated } : s,
  );
  save(CUSTOM_SERVERS_KEY, list);
}

export function deleteCustomServer(name: string): void {
  save(
    CUSTOM_SERVERS_KEY,
    getCustomServers().filter((s) => s.name !== name),
  );
}

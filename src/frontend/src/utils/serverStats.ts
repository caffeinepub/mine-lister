import type { ServerData } from "./sheetsParser";

export interface ServerStats {
  totalServers: number;
  totalPlayers: number;
  totalVotes: number;
}

const STORAGE_KEY = "minelister_server_stats";

export function computeStats(servers: ServerData[]): ServerStats {
  return {
    totalServers: servers.length,
    totalPlayers: servers.reduce((sum, s) => sum + (s.players ?? 0), 0),
    totalVotes: servers.reduce((sum, s) => sum + (s.votes ?? 0), 0),
  };
}

export function saveStats(stats: ServerStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    /* ignore */
  }
}

export function loadStats(): ServerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ServerStats;
  } catch {
    /* ignore */
  }
  return { totalServers: 0, totalPlayers: 0, totalVotes: 0 };
}

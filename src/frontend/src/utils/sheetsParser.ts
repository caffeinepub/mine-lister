// ============================================================
// Google Sheets CSV Integration
// ============================================================
// HOW TO USE:
// 1. Open your Google Sheet
// 2. File > Share > Publish to web
// 3. Under "Link", select the sheet tab and "Comma-separated values (.csv)"
// 4. Click Publish and copy the URL
// 5. Replace PLACEHOLDER_SHEET_ID below with your actual Sheet ID
// 6. For the Settings tab: repeat, select the Settings tab, copy the gid from the URL
// ============================================================

// REPLACE THIS with your Google Sheets "Publish to web" CSV URL for the main servers sheet
export const SERVERS_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/PLACEHOLDER_SHEET_ID/pub?gid=0&single=true&output=csv";

// REPLACE THIS with your Settings sheet CSV URL (second tab / different gid)
export const SETTINGS_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/PLACEHOLDER_SHEET_ID/pub?gid=SETTINGS_GID&single=true&output=csv";

// REPLACE THIS with your Google Form embed URL
export const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/PLACEHOLDER_FORM_ID/viewform?embedded=true";

// REPLACE THIS with your Google Sheets editor URL (for the Admin Panel button)
export const ADMIN_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/PLACEHOLDER_SHEET_ID/edit";

export interface ServerData {
  name: string;
  ip: string;
  version: string;
  gamemode: string;
  description: string;
  imageURL: string;
  serverType: "Premium" | "Cracked";
  tags: string[];
  featured: boolean;
  approved?: string;
  submittedBy?: string;
  players?: number;
  votes?: number;
}

// Sample fallback data shown when the Google Sheet is not yet configured
export const SAMPLE_SERVERS: ServerData[] = [
  {
    name: "ZodiacMC",
    ip: "play.zodiacmc.in",
    version: "1.20.4",
    gamemode: "SMP",
    description:
      "India's best cracked and premium SMP server with economy, jobs, and 100+ active players. TLauncher compatible.",
    imageURL: "",
    serverType: "Premium",
    tags: ["New", "Economy", "Jobs"],
    featured: true,
    approved: "Yes",
    players: 112,
    votes: 312,
  },
  {
    name: "CraftIndia",
    ip: "play.craftindia.net",
    version: "1.19.4",
    gamemode: "Factions",
    description:
      "Epic cracked Minecraft Factions server for Indian players. PvP warfare with custom enchants. Join with TLauncher!",
    imageURL: "",
    serverType: "Cracked",
    tags: ["Factions", "PvP"],
    featured: true,
    approved: "Yes",
    players: 83,
    votes: 198,
  },
  {
    name: "BlockNation",
    ip: "play.blocknation.in",
    version: "1.20.1",
    gamemode: "Skyblock",
    description:
      "Top Skyblock server in India. Build your island with premium and cracked account support. Active 24/7.",
    imageURL: "",
    serverType: "Premium",
    tags: ["Skyblock"],
    featured: false,
    approved: "Yes",
    players: 57,
    votes: 145,
  },
  {
    name: "PvPLegends",
    ip: "pvp.legends.in",
    version: "1.8.9",
    gamemode: "PvP",
    description:
      "Hardcore PvP cracked Minecraft server. 1.8 PvP mechanics, kitmap, and ranked duels. TLauncher friendly.",
    imageURL: "",
    serverType: "Cracked",
    tags: ["PvP", "Hardcore"],
    featured: false,
    approved: "Yes",
    players: 61,
    votes: 230,
  },
  {
    name: "Indiacraft",
    ip: "play.indiacraft.gg",
    version: "1.20.4",
    gamemode: "Creative",
    description:
      "Premium creative Minecraft server with plot worlds and building competitions. Active Indian community.",
    imageURL: "",
    serverType: "Premium",
    tags: ["Creative", "Building"],
    featured: false,
    approved: "Yes",
    players: 38,
    votes: 176,
  },
  {
    name: "HindiCraft",
    ip: "play.hindicraft.in",
    version: "1.20.2",
    gamemode: "Minigames",
    description:
      "Fun Minecraft minigames server in Hindi! BedWars, Skywars, and more. Cracked account support.",
    imageURL: "",
    serverType: "Cracked",
    tags: ["Minigames", "Fun"],
    featured: false,
    approved: "Yes",
    players: 44,
    votes: 155,
  },
  {
    name: "BedWarsPro",
    ip: "play.bedwarspro.in",
    version: "1.20.4",
    gamemode: "BedWars",
    description:
      "India's #1 BedWars server. Compete in ranked BedWars matches with cracked and premium account support. TLauncher compatible.",
    imageURL: "",
    serverType: "Cracked",
    tags: ["BedWars", "Minigames", "PvP"],
    featured: true,
    approved: "Yes",
    players: 128,
    votes: 445,
  },
];

/**
 * Parse a CSV string into an array of row arrays, handling quoted fields.
 */
function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  const lines = csv.split(/\r?\n/).filter((l) => l.trim());
  for (const line of lines) {
    const row: string[] = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        row.push(field.trim());
        field = "";
      } else {
        field += ch;
      }
    }
    row.push(field.trim());
    rows.push(row);
  }
  return rows;
}

/**
 * Fetch and parse servers from the Google Sheets CSV.
 * Falls back to SAMPLE_SERVERS if the URL is a placeholder or fetch fails.
 * Expected columns: Name, IP, Version, Gamemode, Description, ImageURL, ServerType, Tags, Featured
 */
export async function fetchServers(): Promise<ServerData[]> {
  if (SERVERS_SHEET_URL.includes("PLACEHOLDER")) {
    return [...SAMPLE_SERVERS].sort(
      (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
    );
  }

  try {
    const res = await fetch(SERVERS_SHEET_URL);
    if (!res.ok) throw new Error("Failed to fetch");
    const csv = await res.text();
    const rows = parseCSV(csv);
    // First row is the header
    const data = rows.slice(1);
    const servers: ServerData[] = data
      .filter((row) => row.length >= 9 && row[0])
      .map((row) => ({
        name: row[0] ?? "",
        ip: row[1] ?? "",
        version: row[2] ?? "",
        gamemode: row[3] ?? "",
        description: row[4] ?? "",
        imageURL: row[5] ?? "",
        serverType:
          (row[6] as "Premium" | "Cracked") === "Cracked"
            ? "Cracked"
            : "Premium",
        tags: row[7]
          ? row[7]
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        featured: row[8]?.toLowerCase() === "yes",
        approved: row[9] ?? "",
        submittedBy: row[10] ?? "",
        players: 0,
        votes: 0,
      }));
    // Featured servers first
    return servers.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  } catch {
    // Return sample data as fallback
    return [...SAMPLE_SERVERS].sort(
      (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
    );
  }
}

/**
 * Fetch and parse settings from the Settings sheet CSV.
 * Expected columns: Key, Value
 * Returns an empty object if URL is placeholder or fetch fails.
 */
export async function fetchSettings(): Promise<Record<string, string>> {
  if (SETTINGS_SHEET_URL.includes("PLACEHOLDER")) {
    // Default: show submission section for demo purposes
    return { UserSubmissionEnabled: "Yes" };
  }

  try {
    const res = await fetch(SETTINGS_SHEET_URL);
    if (!res.ok) throw new Error("Failed to fetch settings");
    const csv = await res.text();
    const rows = parseCSV(csv);
    const settings: Record<string, string> = {};
    // Skip header row (Key, Value)
    for (const row of rows.slice(1)) {
      if (row[0] && row[1] !== undefined) {
        settings[row[0]] = row[1];
      }
    }
    return settings;
  } catch {
    return {};
  }
}

const SERVERS_API_URL =
  "https://script.google.com/macros/s/AKfycbzNs8NJl8kLfD_cIflBi0-1j-NOA1XzQW8aCxh7vc6eVrPWYtrzJ0dQeuanMXMunu_q/exec";

/**
 * Fetch servers from the Google Apps Script JSON API.
 * Only returns approved servers (Approved === "Yes").
 * Featured servers are sorted to the top.
 * Falls back to SAMPLE_SERVERS on error.
 *
 * Expected API field names (exact, with spaces):
 *   "Server Name", "Server IP", "Version", "Gamemode",
 *   "Server Type", "Featured", "Approved", "Description", "Tags", "ImageURL", "Submitted By"
 */
export async function fetchServersFromAPI(): Promise<ServerData[]> {
  try {
    const res = await fetch(SERVERS_API_URL);
    if (!res.ok) throw new Error("Failed to fetch servers from API");
    const json = await res.json();

    // Handle both array and { data: [...] } response shapes
    const raw: Record<string, string>[] = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];

    /**
     * Look up a field by trying each candidate key.
     * Returns the value of the first matching key (exact match first,
     * then case-insensitive), or "" if not found.
     */
    function getField(obj: Record<string, string>, ...keys: string[]): string {
      for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          return obj[key] ?? "";
        }
        const match = Object.keys(obj).find(
          (k) => k.toLowerCase() === key.toLowerCase(),
        );
        if (match !== undefined) return obj[match] ?? "";
      }
      return "";
    }

    const servers: ServerData[] = raw
      .filter((row) => getField(row, "Approved").toLowerCase() === "yes")
      .map((row) => {
        const tagsRaw = getField(row, "Tags");
        const ip = getField(row, "Server IP", "ServerIP", "IP");
        const playersRaw = getField(row, "Players Online", "Players", "Online");
        const votesRaw = getField(row, "Votes", "Vote Count", "VoteCount");
        return {
          name: getField(row, "Server Name", "ServerName", "Name"),
          ip,
          version: getField(row, "Version"),
          gamemode: getField(row, "Gamemode"),
          description: getField(row, "Description"),
          imageURL: getField(row, "ImageURL", "Image URL"),
          serverType:
            getField(row, "Server Type", "ServerType").toLowerCase() ===
            "cracked"
              ? "Cracked"
              : "Premium",
          tags: tagsRaw
            ? tagsRaw
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
          featured: getField(row, "Featured").toLowerCase() === "yes",
          approved: getField(row, "Approved"),
          submittedBy: getField(
            row,
            "Submitted By",
            "submittedBy",
            "SubmittedBy",
          ),
          players: playersRaw ? Number.parseInt(playersRaw, 10) || 0 : 0,
          votes: votesRaw ? Number.parseInt(votesRaw, 10) || 0 : 0,
        };
      });

    // Featured servers first
    return servers.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  } catch {
    return [...SAMPLE_SERVERS].sort(
      (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
    );
  }
}

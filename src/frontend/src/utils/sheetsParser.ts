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
}

// Sample fallback data shown when the Google Sheet is not yet configured
export const SAMPLE_SERVERS: ServerData[] = [
  {
    name: "ZodiacMC",
    ip: "play.zodiacmc.in",
    version: "1.20.4",
    gamemode: "SMP",
    description: "India's best survival server with economy and jobs!",
    imageURL: "",
    serverType: "Premium",
    tags: ["New", "Economy", "Jobs"],
    featured: true,
  },
  {
    name: "CraftIndia",
    ip: "play.craftindia.net",
    version: "1.19.4",
    gamemode: "Factions",
    description: "Epic factions warfare server for Indian players.",
    imageURL: "",
    serverType: "Cracked",
    tags: ["Factions", "PvP"],
    featured: true,
  },
  {
    name: "BlockNation",
    ip: "play.blocknation.in",
    version: "1.20.1",
    gamemode: "Skyblock",
    description: "Build your island high in the sky!",
    imageURL: "",
    serverType: "Premium",
    tags: ["Skyblock"],
    featured: false,
  },
  {
    name: "PvPLegends",
    ip: "pvp.legends.in",
    version: "1.8.9",
    gamemode: "PvP",
    description: "Hardcore PvP for the best players.",
    imageURL: "",
    serverType: "Cracked",
    tags: ["PvP", "Hardcore"],
    featured: false,
  },
  {
    name: "Indiacraft",
    ip: "play.indiacraft.gg",
    version: "1.20.4",
    gamemode: "Creative",
    description: "Creative building server with plot worlds.",
    imageURL: "",
    serverType: "Premium",
    tags: ["Creative", "Building"],
    featured: false,
  },
  {
    name: "HindiCraft",
    ip: "play.hindicraft.in",
    version: "1.20.2",
    gamemode: "Minigames",
    description: "Fun minigames in Hindi!",
    imageURL: "",
    serverType: "Cracked",
    tags: ["Minigames", "Fun"],
    featured: false,
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

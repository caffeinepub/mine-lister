import { ChevronDown, ExternalLink } from "lucide-react";
import { ADMIN_SHEET_URL } from "../utils/sheetsParser";

const ADMIN_ITEMS = [
  "📋 Add, edit, or delete servers by editing rows in the main sheet",
  "✅ Approve or reject user submissions by moving rows to the main sheet",
  '⭐ Mark a server as Featured by setting the Featured column to "Yes"',
  "🔒 Toggle user submissions on/off in the Settings tab (UserSubmissionEnabled = Yes/No)",
  "💰 Mark paid/premium placements using the Featured column",
  "🏷️ Add or remove tags by editing the Tags column (comma-separated)",
  "🖼️ Set a server image by pasting an image URL in the ImageURL column",
];

export default function AdminPanel() {
  return (
    <section id="admin-panel" className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <details
          className="admin-panel rounded-lg border border-primary/30 overflow-hidden"
          style={{
            background: "oklch(0.12 0.025 255)",
            boxShadow: "0 0 20px oklch(0.85 0.15 200 / 0.08)",
          }}
        >
          <summary
            className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted/20 transition-colors"
            data-ocid="admin.toggle"
          >
            <div className="flex items-center gap-3">
              <span
                className="font-pixel neon-cyan"
                style={{ fontSize: "9px" }}
              >
                ⚙ ADMIN PANEL
              </span>
              <span
                className="font-vt323 text-muted-foreground"
                style={{ fontSize: "17px" }}
              >
                — Manage via Google Sheets
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-primary transition-transform details-arrow" />
          </summary>

          <div className="p-5 border-t border-border">
            <p
              className="font-vt323 text-muted-foreground mb-4"
              style={{ fontSize: "18px" }}
            >
              All site management is done directly through Google Sheets — no
              code required.
            </p>

            <ul
              className="font-vt323 space-y-2 mb-6"
              style={{ fontSize: "17px" }}
            >
              {ADMIN_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">›</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div
              className="rounded-lg border border-primary/20 p-4 mb-6"
              style={{ background: "oklch(0.85 0.15 200 / 0.05)" }}
            >
              <p
                className="font-vt323 text-primary"
                style={{ fontSize: "17px" }}
              >
                <strong>Sheet structure:</strong> Column order must be: Name,
                IP, Version, Gamemode, Description, ImageURL, ServerType, Tags,
                Featured
              </p>
              <p
                className="font-vt323 text-muted-foreground mt-1"
                style={{ fontSize: "15px" }}
              >
                Settings tab columns: Key | Value — add a row:
                UserSubmissionEnabled | Yes
              </p>
            </div>

            <a
              href={ADMIN_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel inline-flex items-center gap-2 border-2 border-primary px-5 py-3 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150"
              style={{ fontSize: "8px" }}
              data-ocid="admin.primary_button"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              OPEN ADMIN SHEET
            </a>
          </div>
        </details>
      </div>
    </section>
  );
}

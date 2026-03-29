import { useEffect, useState } from "react";
import { type Announcement, getAnnouncements } from "../utils/adminStore";

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    setAnnouncements(getAnnouncements());
  }, []);

  if (announcements.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="font-pixel neon-cyan"
          style={{ fontSize: "9px", letterSpacing: "2px" }}
        >
          📢 ANNOUNCEMENTS
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "oklch(0.85 0.15 200 / 0.2)" }}
        />
      </div>
      <div className="flex flex-col gap-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="rounded-lg px-5 py-3 border"
            style={{
              background: "oklch(0.12 0.025 200 / 0.6)",
              borderColor: "oklch(0.85 0.15 200 / 0.25)",
              boxShadow: "0 0 10px oklch(0.85 0.15 200 / 0.06)",
            }}
          >
            <p
              className="font-pixel neon-cyan mb-1"
              style={{ fontSize: "8px" }}
            >
              {ann.title}
            </p>
            <p
              className="font-vt323 text-muted-foreground"
              style={{ fontSize: "16px", lineHeight: "1.4" }}
            >
              {ann.body}
            </p>
            <p
              className="font-vt323 mt-1"
              style={{ fontSize: "12px", color: "oklch(0.45 0.06 200)" }}
            >
              {new Date(ann.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

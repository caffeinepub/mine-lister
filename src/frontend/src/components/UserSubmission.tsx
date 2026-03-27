import { GOOGLE_FORM_URL } from "../utils/sheetsParser";

export default function UserSubmission() {
  return (
    <section id="submit-server" className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2
          className="font-pixel neon-cyan text-center mb-4"
          style={{ fontSize: "clamp(10px, 2vw, 16px)" }}
        >
          SUBMIT YOUR SERVER
        </h2>
        <p
          className="font-vt323 text-center text-muted-foreground mb-2"
          style={{ fontSize: "20px" }}
        >
          All submissions require admin approval before appearing publicly.
        </p>
        <p
          className="font-vt323 text-center text-muted-foreground mb-8"
          style={{ fontSize: "17px" }}
        >
          Fill in the form below. Servers are reviewed within 24–48 hours.
        </p>

        {/* Google Form iframe */}
        <div
          className="rounded-lg overflow-hidden border border-primary/30"
          style={{ boxShadow: "0 0 30px oklch(0.85 0.15 200 / 0.1)" }}
        >
          <iframe
            src={GOOGLE_FORM_URL}
            width="100%"
            height="800"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Submit Your Minecraft Server"
            className="w-full"
            style={{ background: "oklch(0.12 0.025 255)" }}
            data-ocid="submit.panel"
          >
            Loading…
          </iframe>
        </div>

        {/* Paytm future note */}
        <div
          className="mt-6 rounded-lg border border-neon-gold/20 p-4 text-center"
          style={{ background: "oklch(0.82 0.15 80 / 0.05)" }}
        >
          <p className="font-vt323 neon-gold" style={{ fontSize: "18px" }}>
            ⭐ Future: Paytm payment integration for featured server placement
          </p>
          <p
            className="font-vt323 text-muted-foreground mt-1"
            style={{ fontSize: "15px" }}
          >
            Want your server featured at the top with a glowing border? Paid
            placements coming soon!
          </p>
        </div>
      </div>
    </section>
  );
}

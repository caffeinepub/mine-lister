import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import ServerListing from "./components/ServerListing";
import UserSubmission from "./components/UserSubmission";
import { fetchServers, fetchSettings } from "./utils/sheetsParser";
import type { ServerData } from "./utils/sheetsParser";

export default function App() {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [serversData, settingsData] = await Promise.all([
        fetchServers(),
        fetchSettings(),
      ]);
      setServers(serversData);
      setSettings(settingsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, oklch(0.09 0.02 255), oklch(0.10 0.025 258))",
      }}
    >
      <Toaster richColors />
      <Navbar />
      <main>
        <HeroSection serverCount={servers.length} />
        <ServerListing
          servers={servers}
          loading={loading}
          error={error}
          onRetry={loadData}
        />
        <UserSubmission settings={settings} />
      </main>
      <Footer />
    </div>
  );
}

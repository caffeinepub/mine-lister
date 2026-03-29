import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import MyServers from "./components/MyServers";
import Navbar from "./components/Navbar";
import SEOContent from "./components/SEOContent";
import ServerDetailPage from "./components/ServerDetailPage";
import ServerListing from "./components/ServerListing";
import UserSubmission from "./components/UserSubmission";
import { useAuth } from "./hooks/useAuth";
import {
  type ServerStats,
  computeStats,
  loadStats,
  saveStats,
} from "./utils/serverStats";
import type { ServerData } from "./utils/sheetsParser";
import { fetchServersFromAPI } from "./utils/sheetsParser";

type Page = "home" | "my-servers";

function gtag(...args: unknown[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.gtag === "function") w.gtag(...args);
}

function setPageMeta(title: string, description?: string) {
  document.title = title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && description) metaDesc.setAttribute("content", description);
}

export default function App() {
  const { currentUser, login, signup, logout } = useAuth();
  const [servers, setServers] = useState<ServerData[]>([]);
  const [stats, setStats] = useState<ServerStats>(() => loadStats());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [page, setPage] = useState<Page>("home");
  const [editServer, setEditServer] = useState<ServerData | undefined>(
    undefined,
  );
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null);

  // Sync GA4 user_id whenever currentUser changes
  useEffect(() => {
    try {
      if (currentUser) {
        gtag("config", "G-BC637HD0SH", { user_id: currentUser });
      } else {
        gtag("config", "G-BC637HD0SH", { user_id: undefined });
      }
    } catch {
      /* ignore */
    }
  }, [currentUser]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const serversData = await fetchServersFromAPI();
      setServers(serversData);
      const computed = computeStats(serversData);
      setStats(computed);
      saveStats(computed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Track virtual pageviews on route/page changes
  useEffect(() => {
    let pageTitle: string;
    let pagePath: string;
    let pageDescription: string;

    if (selectedServer) {
      pageTitle = `${selectedServer.name} Minecraft Server | MINE Lister`;
      pagePath = `/server/${selectedServer.name.toLowerCase().replace(/\s+/g, "-")}`;
      pageDescription =
        selectedServer.description ||
        "Discover the best Minecraft servers including Survival, Skyblock, Factions, and more.";
    } else if (page === "my-servers") {
      pageTitle = "Manage Your Minecraft Servers | MINE Lister";
      pagePath = "/my-servers";
      pageDescription =
        "View and manage your Minecraft server listings on MINE Lister.";
    } else {
      pageTitle = "Best Minecraft Servers (Cracked & Premium) | MCServerHub";
      pagePath = "/";
      pageDescription =
        "Discover the best Minecraft servers including Survival, Skyblock, Factions, and more. List your server for free on MINE Lister.";
    }

    setPageMeta(pageTitle, pageDescription);

    // Send GA4 page_view event for every route change
    gtag("event", "page_view", {
      page_title: pageTitle,
      page_path: pagePath,
      page_location: window.location.origin + pagePath,
    });
  }, [page, selectedServer]);

  const handleServerClick = (server: ServerData) => {
    setSelectedServer(server);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditServer = (server: ServerData) => {
    setEditServer(server);
    setSubmitOpen(true);
    setPage("home");
  };

  const handleSubmitClose = () => {
    setSubmitOpen(false);
    setEditServer(undefined);
  };

  const handleMyServersClick = () => {
    if (!currentUser) {
      setAuthOpen(true);
      return;
    }
    setPage("my-servers");
    setSelectedServer(null);
  };

  const handleBackToHome = () => {
    setSelectedServer(null);
    setPage("home");
  };

  const handleSEOCategoryClick = () => {
    document
      .getElementById("server-listing")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, oklch(0.09 0.02 255), oklch(0.10 0.025 258))",
      }}
    >
      <Toaster richColors />
      <Navbar
        onSubmitClick={() => setSubmitOpen(true)}
        onMyServersClick={handleMyServersClick}
        currentUser={currentUser}
        onLoginClick={() => setAuthOpen(true)}
        onLogout={logout}
      />
      <main>
        {page === "home" && !selectedServer ? (
          <>
            <HeroSection serverCount={servers.length} stats={stats} />
            <ServerListing
              servers={servers}
              loading={loading}
              error={error}
              onRetry={loadData}
              onServerClick={handleServerClick}
            />
            <SEOContent onCategoryClick={handleSEOCategoryClick} />
          </>
        ) : page === "home" && selectedServer ? (
          <ServerDetailPage server={selectedServer} onBack={handleBackToHome} />
        ) : (
          currentUser && (
            <MyServers
              currentUser={currentUser}
              onEditServer={handleEditServer}
              onBackToHome={handleBackToHome}
            />
          )
        )}
      </main>
      <Footer />
      <UserSubmission
        open={submitOpen}
        onClose={handleSubmitClose}
        initialData={editServer}
        currentUser={currentUser}
        onLoginClick={() => {
          setSubmitOpen(false);
          setAuthOpen(true);
        }}
      />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={login}
        onSignup={signup}
      />
    </div>
  );
}

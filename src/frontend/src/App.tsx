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
import type { ServerData } from "./utils/sheetsParser";
import { fetchServersFromAPI } from "./utils/sheetsParser";

type Page = "home" | "my-servers";

function setPageMeta(title: string, description?: string) {
  document.title = title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && description) metaDesc.setAttribute("content", description);
}

export default function App() {
  const { currentUser, login, signup, logout } = useAuth();
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [page, setPage] = useState<Page>("home");
  const [editServer, setEditServer] = useState<ServerData | undefined>(
    undefined,
  );
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const serversData = await fetchServersFromAPI();
      setServers(serversData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (selectedServer) {
      setPageMeta(
        `${selectedServer.name} Minecraft Server | MINE Lister`,
        selectedServer.description ||
          "Discover the best Minecraft servers including Survival, Skyblock, Factions, and more.",
      );
    } else if (page === "my-servers") {
      setPageMeta(
        "Manage Your Minecraft Servers | MINE Lister",
        "View and manage your Minecraft server listings on MINE Lister.",
      );
    } else {
      setPageMeta(
        "Minecraft Server List 2026 | Find Best Cracked & Premium Servers | MINE Lister",
        "Discover the best Minecraft servers including Survival, Skyblock, Factions, and more. List your server for free on MINE Lister.",
      );
    }
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
            <HeroSection serverCount={servers.length} />
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

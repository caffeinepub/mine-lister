import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import MyServers from "./components/MyServers";
import Navbar from "./components/Navbar";
import ServerListing from "./components/ServerListing";
import UserSubmission from "./components/UserSubmission";
import { useAuth } from "./hooks/useAuth";
import { fetchServersFromAPI } from "./utils/sheetsParser";
import type { ServerData } from "./utils/sheetsParser";

type Page = "home" | "my-servers";

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
        {page === "home" ? (
          <>
            <HeroSection serverCount={servers.length} />
            <ServerListing
              servers={servers}
              loading={loading}
              error={error}
              onRetry={loadData}
            />
          </>
        ) : (
          currentUser && (
            <MyServers
              currentUser={currentUser}
              onEditServer={handleEditServer}
              onBackToHome={() => setPage("home")}
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

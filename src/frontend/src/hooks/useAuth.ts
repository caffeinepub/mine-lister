import { useCallback, useState } from "react";

const USERS_KEY = "mine_lister_users";
const CURRENT_USER_KEY = "currentUser";

interface StoredUser {
  username: string;
  password: string;
}

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

// Fire a GA4 event if gtag is available
function gtagEvent(eventName: string, params: Record<string, string>) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof w.gtag === "function") {
      w.gtag("event", eventName, params);
    }
  } catch {
    // silently ignore if gtag not loaded
  }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    localStorage.getItem(CURRENT_USER_KEY),
  );

  const login = useCallback(
    (
      username: string,
      password: string,
    ): { success: boolean; error?: string } => {
      if (!username.trim() || !password.trim()) {
        return { success: false, error: "Username and password are required" };
      }
      const users = getUsers();
      const found = users.find(
        (u) => u.username === username && u.password === password,
      );
      if (!found) {
        return { success: false, error: "Invalid username or password" };
      }
      localStorage.setItem(CURRENT_USER_KEY, username);
      setCurrentUser(username);
      // Set GA4 user ID and fire login event
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        if (typeof w.gtag === "function") {
          w.gtag("config", "G-BC637HD0SH", { user_id: username });
        }
      } catch {
        /* ignore */
      }
      gtagEvent("login", { method: "username", user_id: username });
      return { success: true };
    },
    [],
  );

  const signup = useCallback(
    (
      username: string,
      password: string,
    ): { success: boolean; error?: string } => {
      if (!username.trim() || !password.trim()) {
        return { success: false, error: "Username and password are required" };
      }
      const users = getUsers();
      if (users.find((u) => u.username === username)) {
        return { success: false, error: "Username already taken" };
      }
      users.push({ username, password });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(CURRENT_USER_KEY, username);
      setCurrentUser(username);
      // Set GA4 user ID and fire sign_up event
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        if (typeof w.gtag === "function") {
          w.gtag("config", "G-BC637HD0SH", { user_id: username });
        }
      } catch {
        /* ignore */
      }
      gtagEvent("sign_up", { method: "username", user_id: username });
      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    gtagEvent("logout", {
      user_id: localStorage.getItem(CURRENT_USER_KEY) ?? "",
    });
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    // Clear GA4 user ID on logout
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (typeof w.gtag === "function") {
        w.gtag("config", "G-BC637HD0SH", { user_id: undefined });
      }
    } catch {
      /* ignore */
    }
  }, []);

  return { currentUser, login, signup, logout };
}

export default useAuth;

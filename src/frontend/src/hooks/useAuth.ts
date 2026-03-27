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
      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
  }, []);

  return { currentUser, login, signup, logout };
}

export default useAuth;

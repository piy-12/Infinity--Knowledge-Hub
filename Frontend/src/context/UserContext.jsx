import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(localStorage.getItem("userAvatar") || null);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ===========================================================
  // 🧠 Fetch User Info from Backend (/auth/me)
  // ===========================================================
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.warn("⚠️ Token invalid or expired, clearing storage...");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);
        localStorage.setItem("user_id", data.id);

        // ✅ Save and sync role
        if (data.role) {
          setRole(data.role);
          localStorage.setItem("role", data.role);
        }

        // ✅ Handle avatar
        if (data.avatar_url) {
          const fullAvatarUrl = data.avatar_url.startsWith("http")
            ? data.avatar_url
            : `http://localhost:8000${data.avatar_url}`;
          setAvatar(fullAvatarUrl);
          localStorage.setItem("userAvatar", fullAvatarUrl);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // ===========================================================
  // 🌙 Toggle Theme
  // ===========================================================
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  // ===========================================================
  // 🖼️ Update Avatar
  // ===========================================================
  const updateAvatar = (newUrl) => {
    setAvatar(newUrl);
    localStorage.setItem("userAvatar", newUrl);
  };

  // ===========================================================
  // 🚪 Logout (clear everything)
  // ===========================================================
  const logout = () => {
    setUser(null);
    setAvatar(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userAvatar");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
  };

  // ===========================================================
  // ✅ Provide Context
  // ===========================================================
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        role,
        setRole,
        avatar,
        updateAvatar,
        isDarkMode,
        toggleTheme,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

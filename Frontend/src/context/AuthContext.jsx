import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { fetchCurrentUser, logout } from "@/api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [companyConfig, setCompanyConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserAndConfig = async () => {
      setLoading(true);
      try {
        let currentUser = user;

        if (!currentUser) {
          currentUser = await fetchCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem("user", JSON.stringify(currentUser));
          }
        }

        if (currentUser?.companyId) {
          const res = await axios.get(`/api/company/${currentUser.companyId}/config`);
          setCompanyConfig(res.data);
        }
      } catch (err) {
        console.error("AuthContext load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndConfig();
  }, []);

  const handleLogout = () => {
    logout(); // uses API logout
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, companyConfig, loading, logout: handleLogout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

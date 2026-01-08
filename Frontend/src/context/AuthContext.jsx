import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { fetchCurrentUser, logout } from "@/api/auth.api";
import { getCompanyConfig } from "@/api/company.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [companyConfig, setCompanyConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reactive trigger for company updates
  const [companyVersion, setCompanyVersion] = useState(0);
  const refreshCompanyData = () => setCompanyVersion((prev) => prev + 1);

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
          const config = await getCompanyConfig(currentUser.companyId);
          setCompanyConfig(config);
        }
      } catch (err) {
        console.error("AuthContext load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndConfig();
  }, [companyVersion]);

  const handleLogout = () => {
    logout(); // uses API logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, companyConfig, setCompanyConfig, loading, logout: handleLogout, companyVersion, refreshCompanyData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

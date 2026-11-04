import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchCurrentUser, logout } from "@/api/auth.api";
import { getCompanyConfig } from "@/api/company.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [companyConfig, setCompanyConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reactive trigger for company updates
  const [companyVersion, setCompanyVersion] = useState(0);
  const refreshCompanyData = () => setCompanyVersion((prev) => prev + 1);

  useEffect(() => {
    let cancelled = false;
    const isPublicRoute = ["/", "/login", "/signup"].includes(location.pathname);

    const loadUserAndConfig = async () => {
      setLoading(true);

      if (isPublicRoute) {
        setUser(null);
        setCompanyConfig(null);
        localStorage.removeItem("user");
        setLoading(false);
        return;
      }

      try {
        let currentUser = user;
        const isInitialUserLoad = !currentUser;

        if (!currentUser) {
          currentUser = await fetchCurrentUser();
          if (cancelled) return;
          setUser(currentUser);
          if (currentUser && isInitialUserLoad && import.meta.env.DEV) {
            console.info("Current user details loaded:", currentUser);
          }
        }

        if (currentUser?.companyId) {
          const config = await getCompanyConfig(currentUser.companyId);
          if (cancelled) return;
          setCompanyConfig(config);
        } else {
          setCompanyConfig(null);
        }
      } catch (err) {
        console.error("AuthContext load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadUserAndConfig();
    return () => {
      cancelled = true;
    };
  }, [companyVersion, location.pathname]);

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

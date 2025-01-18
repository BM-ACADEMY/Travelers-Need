import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create the UserContext
const UserContext = createContext();

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to load the user from sessionStorage
  const loadUser = () => {
    const token = sessionStorage.getItem("userData");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ name:decoded.username || "User" ,userId:decoded.id,email:decoded.email,role:decoded.role});
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // Listen to sessionStorage changes (e.g., in different tabs/windows)
  useEffect(() => {
    loadUser();

    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Logout function
  const logout = () => {
    sessionStorage.removeItem("userData");
    setUser(null);
  };

  // Login function
  const login = (token) => {
    sessionStorage.setItem("userData", token);
    loadUser();
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = () => useContext(UserContext);

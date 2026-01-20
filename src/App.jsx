import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Navbar from "./components/NavigationBar";
import Dashboard from "./components/Dashboard";

export default function App() {
  // ✅ logged-in state based on JWT
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [isExpanded, setIsExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ called AFTER successful backend login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // ✅ logout = remove JWT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setActiveIndex(0);
  };

  // ✅ safety check (token manually deleted, expired, etc.)
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setIsLoggedIn(false);
    }
  }, []);

  // 🔒 show login page if not authenticated
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // ✅ authenticated layout
  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        onLogout={handleLogout}
      />
      <Dashboard />
    </div>
  );
}

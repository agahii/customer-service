import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Settings from "./components/Settings";
import CustomerRegistration from "./components/CustomerRegistration";
import Login from "./components/Login"; // Import Login page
import "./App.css"; // Import global styles

const App = () => {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated when the app loads
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isAuthenticated");
    if (loggedInStatus === "true") {
      setIsAuthenticated(true); // Set user as authenticated if status is found in localStorage
    }
  }, []); // Only run once on component mount

  // Handle login by updating state and persisting in localStorage
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true"); // Persist login status in localStorage
  };

  // Handle logout by updating state and removing from localStorage
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated"); // Remove login status from localStorage
  };

  return (
    <Router>
      <div style={styles.pageContainer}>
        {/* If the user is authenticated, show Sidebar and Navbar */}
        {isAuthenticated ? (
          <>
            <Sidebar />
            <div style={styles.mainContent}>
              <Navbar onLogout={handleLogout} />
              {/* Routes for other pages */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/CustomerRegistration" element={<CustomerRegistration />} />
                {/* Other routes can go here */}
              </Routes>
            </div>
          </>
        ) : (
          // If not authenticated, show the Login page
          <Routes>
            {/* Login route */}
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            {/* If not authenticated, redirect to the Login page */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

// Global styles for the App
const styles = {
  pageContainer: {
    display: "flex", // Aligns the sidebar and content horizontally
    minHeight: "100vh", // Ensures the page takes full height
  },
  mainContent: {
    marginLeft: "250px", // To make space for the sidebar
    paddingTop: "70px", // To avoid navbar overlap
    padding: "20px",
    flexGrow: 1, // The content takes the remaining space
    // REMOVE backgroundColor here to avoid overriding
    // backgroundColor: "#2f2f2f", // Remove this line!
    color: "#e0e0e0", // Light text color
  },
};

export default App;

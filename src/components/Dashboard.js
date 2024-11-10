import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  return (
    <div style={styles.dashboardContainer}>
      <Navbar />
      <div style={styles.mainContent}>
        <Sidebar />
        <div style={styles.dashboardContent}>
          <h2>Welcome to the Dashboard!</h2>
          <p style={styles.description}>
            You have successfully logged in. This is your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: "flex", // Use flexbox to layout navbar, sidebar, and content
    flexDirection: "column", // Stack navbar on top
    backgroundColor: "#2f2f2f", // Dark background for the page
    minHeight: "100vh", // Full screen height
  },
  mainContent: {
    display: "flex", // Align sidebar and content side by side
    height: "100vh", // Full height for the content area
  },
  sidebarContainer: {
    position: "fixed",
    top: "70px", // Space for navbar
    left: 0,
    width: "250px",
    height: "100vh",
  },
  dashboardContent: {
    marginLeft: "250px", // Offset for the sidebar width
    marginTop: "70px", // Offset for navbar height
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#fff", // This should be white
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)", // Darker shadow
    maxWidth: "800px",
    width: "100%",
    textAlign: "center", // Center content text
},
  description: {
    fontSize: "18px",
    color: "#333", // Dark text color for the description (to contrast with the white background)
  },
};

export default Dashboard;

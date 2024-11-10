import React from "react";

const Settings = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.header}>Settings Page</h1>
        <p style={styles.text}>Here you can configure your settings!</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
    height: "100vh", // Full screen height
    backgroundColor: "#fff", // Set the full page background to white
  },
  content: {
    textAlign: "center",
    backgroundColor: "#fff", // Keep content background white
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Optional: subtle shadow for the content box
  },
  header: {
    color: "#333", // Dark text color for better contrast with white background
    fontSize: "28px",
  },
  text: {
    color: "#333", // Dark text color for better contrast with white background
    fontSize: "18px",
  },
};

export default Settings;

import React from "react";

const AppFooter = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2024 Your App Name. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#d3d3d3", // Light grey background
    textAlign: "center",
    position: "fixed", // Fix the footer at the bottom
    bottom: 0, // Keep it at the bottom of the viewport
    width: "100%", // Make it span the entire width of the viewport
    borderTop: "1px solid #bbb", // Light border for separation
    color: "#333", // Text color
    zIndex: 2, // Ensure it stays on top of other elements
    padding: "8px 0", // Adjusted padding to be slightly thicker than before
    lineHeight: "1.4", // Increased line-height for better spacing
  },
  text: {
    margin: "0", // Remove any default margin around text
    fontSize: "14px", // Adjusted font size to make it a bit more readable
  },
};

export default AppFooter;


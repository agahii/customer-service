import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <Link to="/" style={styles.link} activeStyle={styles.activeLink}>Home</Link>
      <Link to="/customerRegistration" style={styles.link} activeStyle={styles.activeLink}>Customer Registration</Link>
      <Link to="/settings" style={styles.link} activeStyle={styles.activeLink}>Settings</Link>
      {/* Add more links as needed */}
    </div>
  );
};

const styles = {
  sidebar: {
    position: "fixed",
    top: "60px", // Below the navbar
    left: 0,
    width: "250px",
    height: "100vh",
    backgroundColor: "#444", // Dark background
    paddingTop: "20px",
    paddingLeft: "20px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    paddingRight: "20px", // Padding on the right for some space
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "18px",
    marginBottom: "15px",
    transition: "color 0.3s",
  },
  linkHover: {
    color: "#f1f1f1", // Light hover color for links
  },
  activeLink: {
    color: "#66BB6A", // Change color for active link
    fontWeight: "bold", // Make active link bold
  },
};

export default Sidebar;

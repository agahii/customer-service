import React, { useState, useEffect } from "react";
import { Input, Dropdown, Button, Menu } from "antd";
import { MenuOutlined, SearchOutlined, LogoutOutlined } from "@ant-design/icons";

const Navbar = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Listen for window resizing and update `isMobile` state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Dropdown menu items
  const menu = (
    <Menu>
      <Menu.Item key="logout">
        <Button 
          type="text" 
          icon={<LogoutOutlined />} 
          onClick={onLogout} 
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContent}>
        {/* Centered search bar */}
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onPressEnter={handleSearch}
          style={styles.searchInput}
        />

        {/* Hamburger menu button on the right */}
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button 
            type="text" 
            icon={<MenuOutlined style={{ color: "white" }} />} 
            style={styles.hamburgerButton}
          />
        </Dropdown>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#1a1a1a", // Darker shade (almost charcoal)
    color: "#fff",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "center", // Center the nav content in the navbar
    zIndex: 1000,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  navContent: {
    display: "flex",
    justifyContent: "space-between", // Ensures search bar and hamburger are on opposite sides
    alignItems: "center",
    width: "100%",
    maxWidth: "1200px", // Limit the navbar content width
  },
  searchInput: {
    flex: 1, // Take available space
    maxWidth: "600px", // Limit max width
    margin: "0 auto", // Ensure it is centered
    backgroundColor: "#444", // Dark background for input field
    color: "#fff",
    borderRadius: "4px",
    padding: "10px",
  },
  hamburgerButton: {
    marginLeft: "auto", // Push it to the right side of the navbar
    color: "#fff", // Ensure the hamburger icon is white
  },
  logoutButton: {
    backgroundColor: "#4CAF50", // Green background for logout button
    color: "white", // White text color
    border: "none",
    padding: "10px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    textAlign: "center", // Center the text inside the button
    display: "flex", // Use flexbox for alignment
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
    marginTop: "5px", // Optional spacing between the logout button and menu
  },
};

export default Navbar;

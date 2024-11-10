import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { HomeOutlined, UserAddOutlined, SettingOutlined } from "@ant-design/icons";

const Sidebar = () => {
  const location = useLocation(); // To determine the current active link

  return (
    <div style={styles.sidebar}>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[location.pathname]} // Highlight the active link
        style={styles.menu}
      >
        <Menu.Item key="/" icon={<HomeOutlined />} style={styles.menuItem}>
          <Link to="/" style={styles.link}>Home</Link>
        </Menu.Item>
        <Menu.Item key="/customerRegistration" icon={<UserAddOutlined />} style={styles.menuItem}>
          <Link to="/customerRegistration" style={styles.link}>Customer Registration</Link>
        </Menu.Item>
        <Menu.Item key="/settings" icon={<SettingOutlined />} style={styles.menuItem}>
          <Link to="/settings" style={styles.link}>Settings</Link>
        </Menu.Item>
        {/* Add more links with icons as needed */}
      </Menu>
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
    backgroundColor: "#2f2f2f", // Dark background for sidebar
    display: "flex",
    flexDirection: "column",
    paddingTop: "20px",
    paddingLeft: "10px", // Reduced padding
    paddingRight: "10px", // Reduced padding to avoid box effect
  },
  menu: {
    width: "100%",
    border: "none", // Remove borders around the menu
    background: "none", // Remove background to make it fit with sidebar color
  },
  menuItem: {
    fontSize: "16px",
    marginBottom: "10px", // Adjust space between menu items
    border: "none", // No borders around menu items
    backgroundColor: "transparent", // Remove background box for each menu item
  },
  link: {
    color: "#fff",
    textDecoration: "none", // Remove underlines from links
    display: "flex",
    alignItems: "center", // Ensure icons and text are aligned properly
  },
};

export default Sidebar;

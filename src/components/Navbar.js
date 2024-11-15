import React, { useState, useEffect } from "react";
import { Input, Dropdown, Button, Menu } from "antd";
import { MenuOutlined, SearchOutlined, LogoutOutlined } from "@ant-design/icons";

const Navbar = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  const menu = (
    <Menu>
      <Menu.Item key="logout">
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={onLogout}
          style={{ padding: "10px 15px", width: "100%" }}
        >
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        zIndex: 1000,
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onPressEnter={handleSearch}
          style={{
            width: "50%",
            maxWidth: "600px",
            backgroundColor: "#444",
            color: "#fff",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
      </div>

      <Dropdown overlay={menu} trigger={["click"]}>
        <Button
          type="text"
          icon={<MenuOutlined style={{ color: "white" }} />}
          style={{
            position: "absolute",
            right: "20px",
            color: "white",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "20px",
          }}
        />
      </Dropdown>
    </nav>
  );
};

export default Navbar;

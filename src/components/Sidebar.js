import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { HomeOutlined, TeamOutlined, SettingOutlined, ShopOutlined } from "@ant-design/icons";

const Sidebar = () => {
  const location = useLocation();

  return (
    <Menu
      mode="inline"
      theme="dark"
      selectedKeys={[location.pathname]}
      style={{
        height: "100vh",
        backgroundColor: "#2f2f2f",
        border: "none",
        color: "#fff",
      }}
    >
      <Menu.Item key="/" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="/TenantRegistration" icon={<TeamOutlined />}>
        <Link to="/TenantRegistration">Tenant Registration</Link>
      </Menu.Item>
      <Menu.Item key="/EmployeeRegistration" icon={<TeamOutlined />}>
        <Link to="/EmployeeRegistration">Employee Registration</Link>
      </Menu.Item>
      <Menu.Item key="/IndustryRegistration" icon={<ShopOutlined />}>
        <Link to="/IndustryRegistration">Industry Registration</Link>
      </Menu.Item>
      <Menu.Item key="/CustomerRegistration" icon={<ShopOutlined />}> {/* New Menu Item */}
        <Link to="/CustomerRegistration">Customer Registration</Link>
      </Menu.Item>
      <Menu.Item key="/settings" icon={<SettingOutlined />}>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar;

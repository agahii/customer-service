import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { HomeOutlined, UserAddOutlined, SettingOutlined } from "@ant-design/icons";

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
      <Menu.Item key="/TenantRegistration" icon={<UserAddOutlined />}>
        <Link to="/TenantRegistration">Tenant Registration</Link>
      </Menu.Item>
      <Menu.Item key="/EmployeeRegistration" icon={<UserAddOutlined />}>
        <Link to="/EmployeeRegistration">Employee Registration</Link>
      </Menu.Item>
      <Menu.Item key="/settings" icon={<SettingOutlined />}>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { ConfigProvider, Layout } from "antd";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Settings from "./components/Settings";
import TenantRegistration from "./components/TenantRegistration";
import EmployeeRegistration from "./components/EmployeeRegistration";
import Login from "./components/Login";
import AppFooter from "./components/AppFooter";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";



const { Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ConfigProvider theme={{ token: { colorTextPlaceholder: "#ffffff" } }}>
      <Router>
        <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f0f0" }}>
          {/* Navbar stays fixed on top */}
          <Navbar onLogout={handleLogout} />

          {/* Main Layout */}
          <Layout style={{ marginTop: 64 }}>
            {/* Sidebar */}
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={setCollapsed}
              width={250}
              breakpoint="lg"
              style={{
                backgroundColor: "#2f2f2f",
                position: "fixed",
                top: 64, // Sidebar starts right below the navbar
                bottom: 0, // Sidebar ends at the bottom of the viewport
                zIndex: 1,
              }}
            >
              <Sidebar />
            </Sider>

            {/* Content Area */}
            <Layout
              style={{
                marginLeft: collapsed ? 80 : 250,
                transition: "margin-left 0.2s ease",
                display: "flex",
                flexDirection: "column",
                minHeight: "calc(100vh - 64px)",
              }}
            >
              <Content
                style={{
                  padding: "20px",
                  color: "#333",
                  flex: 1,
                }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/TenantRegistration" element={<TenantRegistration />} />
                  <Route path="/EmployeeRegistration" element={<EmployeeRegistration />} />
                </Routes>
              </Content>

              {/* Footer */}
              <AppFooter />
            </Layout>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;

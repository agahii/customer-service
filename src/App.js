// src/App.js

import React, { useState, useEffect } from "react";
import { ConfigProvider, Layout } from "antd";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Settings from "./components/Settings";
import EmployeeRegistration from "./components/EmployeeRegistration";
import IndustryRegistration from "./components/IndustryRegistration";
import CustomerRegistration from "./components/CustomerRegistration";
import Questionnaire from "./components/Questionnaire"; // Import the Questionnaire component
import Login from "./components/Login";
import Signup from "./components/Signup"; // Import the Signup component
import AppFooter from "./components/AppFooter";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { API } from "./utills/services";

const { Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    delete API.defaults.headers.common["Authorization"];
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <ConfigProvider theme={{ token: { colorTextPlaceholder: "#ffffff" } }}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={{ token: { colorTextPlaceholder: "#ffffff" } }}>
      <Router>
        <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f0f0" }}>
          <Navbar onLogout={handleLogout} />

          <Layout style={{ marginTop: 64 }}>
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={setCollapsed}
              width={250}
              breakpoint="lg"
              style={{
                backgroundColor: "#2f2f2f",
                position: "fixed",
                top: 64,
                bottom: 0,
                zIndex: 1,
              }}
            >
              <Sidebar />
            </Sider>

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
                  <Route path="/EmployeeRegistration" element={<EmployeeRegistration />} />
                  <Route path="/IndustryRegistration" element={<IndustryRegistration />} />
                  <Route path="/CustomerRegistration" element={<CustomerRegistration />} />
                  <Route path="/Questionnaire" element={<Questionnaire />} />
                  {/* Add more protected routes here */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Content>

              <AppFooter />
            </Layout>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;

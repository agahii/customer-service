import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Settings from "./components/Settings";
import CustomerRegistration from "./components/CustomerRegistration";
import Login from "./components/Login";
import "antd/dist/reset.css"; // Reset for Ant Design version 5.0

const { Sider, Content, Header } = Layout;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isAuthenticated");
    if (loggedInStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <Router>
      <Layout style={{ minHeight: "100vh", backgroundColor: "#1f1f1f" }}>
        {isAuthenticated ? (
          <>
            <Sider
              width={250}
              style={{
                backgroundColor: "#2f2f2f",
                color: "#ffffff",
              }}
            >
              <Sidebar />
            </Sider>
            <Layout>
              <Header
                style={{
                  backgroundColor: "#3a3a3a",
                  padding: "0 20px",
                  color: "#ffffff",
                }}
              >
                <Navbar onLogout={handleLogout} />
              </Header>
              <Content
                style={{
                  margin: "20px",
                  padding: "20px",
                  backgroundColor: "#2f2f2f",
                  color: "#e0e0e0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/CustomerRegistration" element={<CustomerRegistration />} />
                </Routes>
              </Content>
            </Layout>
          </>
        ) : (
          <Content style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Routes>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Content>
        )}
      </Layout>
    </Router>
  );
};

export default App;

import React from "react";
import { ConfigProvider, Layout } from "antd";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Settings from "./components/Settings";
import TenantRegistration from "./components/TenantRegistration";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const { Sider, Content } = Layout;

const App = () => {
  return (
    <ConfigProvider theme={{ token: { colorTextPlaceholder: "#ffffff" } }}>
      <Router>
        <Layout style={{ minHeight: "100vh", backgroundColor: "#1f1f1f" }}>
          <Sider width={250} style={{ backgroundColor: "#2f2f2f", position: "fixed", height: "100vh", zIndex: 1000 }}>
            <Sidebar />
          </Sider>
          <Layout style={{ marginLeft: 250, marginTop: 64 }}>
            <Navbar /> {/* Navbar fixed at the top */}
            <Content style={{ padding: "20px", color: "#e0e0e0", minHeight: "calc(100vh - 64px)" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/TenantRegistration" element={<TenantRegistration />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;

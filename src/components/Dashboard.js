import React from "react";
import { Layout, Typography } from "antd";
import Navbar from "./Navbar";
import Sidebar from "Sidebar";


const { Sider, Content } = Layout;
const { Title, Text } = Typography;


const Dashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{ backgroundColor: "#2f2f2f", color: "#ffffff" }}>
        <Sidebar />
      </Sider>
      <Layout>
        <Navbar />
        <Content style={{
          backgroundColor: "#1f1f1f",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px"
        }}>
          <div style={{
            backgroundColor: "#3a3a3a",
            padding: "40px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            maxWidth: "800px",
            width: "100%",
            textAlign: "center"
          }}>
            <Title level={2} style={{ color: "#ffffff" }}>Welcome to the Dashboard!</Title>
            <Text style={{ color: "#e0e0e0", fontSize: "18px" }}>
              You have successfully logged in. This is your dashboard.
            </Text>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Card,
  Row,
  Col,
  Typography,
  message,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "../store/reducers/Login/LoginSlice";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const HomePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [ticketStats, setTicketStats] = useState({
    unassigned: 0,
    pending: 0,
    resolved: 0,
  });
  const [clients, setClients] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailAddress = useSelector((state) => state.login.email);
  const accountType = useSelector((state) => state.login.accountType);
  const imageUrl = useSelector((state) => state.login.imageURL);
  const name = useSelector((state) => state.login.fullName);
// console.log(useSelector((state)=>state.login.name) +"")
  const token = localStorage.getItem("authToken");
 // const emailAddress=localStorage.getItem("email");
  //const email=localStorage.getItem("email");

  useEffect(() => {
    if (!token) {
        navigate('/');
      } else {
        
        fetchData();
      }
  }, [token, navigate]);

  //dispatch(setUser(email));

  const fetchData = async () => {
    try {
      const [ticketRes, clientRes] = await Promise.all([
        axios.get("/api/tickets/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/clients", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setTicketStats(ticketRes.data);
      setClients(clientRes.data);
    } catch (error) {
      message.error("Failed to fetch data");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(logout());
    axios.defaults.headers.common["Authorization"] = "";
    navigate("/login");
  };

  const menuItems = [
    { key: "home", label: "HomePage" },
    { key: "industry", label: "Industries" },
    
    { key: "customer", label: "Customer" },
    { key: "reports", label: "Reports" },
  ];

  //   const filteredMenu = user?.role === 'admin' ? menuItems : menuItems.filter(item => item.key !== 'reports');
  const filteredMenu =
    accountType == 1
      ? menuItems
      : menuItems.filter((item) => item.key !== "reports");

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
    
      <Layout>
       
        <Content
          style={{ margin: "20px", background: "#fff", padding: "20px" }}
        >
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card title="Unassigned Tickets">{ticketStats.unassigned}
                
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Pending Tickets">{ticketStats.pending}</Card>
            </Col>
            <Col span={8}>
              <Card title="Resolved Tickets">{ticketStats.resolved}</Card>
            </Col>
          </Row>
          <Title level={3} style={{ marginTop: 20 }}>
            Registered Clients
          </Title>
          <Row gutter={[16, 16]}>
            {clients.map((client) => (
              <Col key={client.id} span={6}>
                <Card cover={<img alt={client.name} src={client.image} />}>
                  <Card.Meta title={client.name} description={client.email} />
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    </Layout>
  );


  
};

export default HomePage;

import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  //const [collapsed, setCollapsed] = useState(false);
  const accountType = useSelector((state) => state.login.accountType); // Get user role
  const navigate = useNavigate();
  // const menuItems = [
  //   { key: 'home', label: 'Home', icon: <HomeOutlined />, path: '/' },
  //   { key: 'industries', label: 'Industries', icon: <AppstoreOutlined />, path: '/industries' },
  // ];

  const menuItems = [
    { key: "home", label: "HomePage", icon: <HomeOutlined />, path: "/" },
    {
      key: "industry",
      label: "Industries",
      icon: <AppstoreOutlined />,
      path: "/industries",
    },
    {
      key: "customer",
      label: "OldIndustries",
      icon: <AppstoreOutlined />,
      path: "/IndustryRegisteration",
    },
    {
      key: "reports",
      label: "Reports",
      icon: <AppstoreOutlined />,
      path: "/industries",
    },
  ];

  //   const filteredMenu = user?.role === 'admin' ? menuItems : menuItems.filter(item => item.key !== 'reports');
  const filteredMenu =
    accountType == 1
      ? menuItems
      : menuItems.filter((item) => item.key !== "reports");

  // Restrict menu items based on user role
  // if (userRole !== 'admin') {
  //   menuItems.pop(); // Remove Industries for non-admin users
  // }

  return (
    // <Sider
    //   breakpoint="lg"
    //   collapsedWidth="80"
    //   style={{
    //     background: 'linear-gradient(180deg, rgba(165,29,45,1) 0%, rgba(100,10,20,1) 100%)',
    //     minHeight: '100vh',
    //   }}
    // >
    //   <div className="logo" style={{ color: '#fff', textAlign: 'center', padding: '20px', fontSize: '18px' }}>
    //     My App
    //   </div>
    //   <Menu theme="dark" mode="inline" defaultSelectedKeys={['home']}>
    //     {menuItems.map((item) => (
    //       <Menu.Item key={item.key} icon={item.icon}>
    //         <Link to={item.path}>{item.label}</Link>
    //       </Menu.Item>
    //     ))}
    //   </Menu>
    // </Sider>

    <Sider collapsible collapsed={collapsed} width={250} onCollapse={() => collapsed} 
      //collapsible
      //collapsed={collapsed}
      //onCollapse={() => setCollapsed(!collapsed)}
    >
      {/* <Menu theme="dark" mode="inline"  defaultSelectedKeys={["home"]} style={{color:'grey'}}> */}
      <Menu theme="dark" mode="inline"  style={{color:'grey'}}>
        {filteredMenu.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
            
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default Sidebar;

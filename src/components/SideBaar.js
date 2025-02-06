import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
  MessageOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {

  const accountType = useSelector((state) => state.login.accountType); // Get user role
 


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
      label: "Customer",
      icon: <UserOutlined />,
      path: "/customer",
    },
    {
      key: "questionnaire",
      label: "Questions",
      icon: <QuestionCircleOutlined />,
      path: "/question",
    },

    {
      key: "answer",
      label: "Answer",
      icon: <MessageOutlined />,
      path: "/answer",
    },
    {
      key: "reports",
      label: "Reports",
      icon: <AppstoreOutlined />,
      path: "/industries",
    },
  ];

  
  const filteredMenu =
    accountType == 1
      ? menuItems
      : menuItems.filter((item) => item.key !== "reports");

 

  return (
    <Sider collapsible collapsed={collapsed} width={250} onCollapse={() => collapsed} >
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

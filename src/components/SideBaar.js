import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Sider } = Layout;

const Sidebar = () => {
  const userRole = useSelector((state) => state.login.accountType); // Get user role

  const menuItems = [
    { key: 'home', label: 'Home', icon: <HomeOutlined />, path: '/' },
    { key: 'industries', label: 'Industries', icon: <AppstoreOutlined />, path: '/industries' },
  ];

  // Restrict menu items based on user role
  if (userRole !== 'admin') {
    menuItems.pop(); // Remove Industries for non-admin users
  }

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="80"
      style={{
        background: 'linear-gradient(180deg, rgba(165,29,45,1) 0%, rgba(100,10,20,1) 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="logo" style={{ color: '#fff', textAlign: 'center', padding: '20px', fontSize: '18px' }}>
        My App
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['home']}>
        {menuItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default Sidebar;

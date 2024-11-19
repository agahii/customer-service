import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleSidebar}
        style={{
          background: '#001529',
          transition: 'width 0.2s',
        }}
      >
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>Home</Menu.Item>
          <Menu.Item key="2" icon={<SettingOutlined />}>Settings</Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>Tenant Registration</Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{
          background: '#001529',
          color: '#fff',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          Navbar Content Here
        </Header>
        
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          background: '#fff',
          transition: 'width 0.2s',
        }}>
          Main Content Here
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

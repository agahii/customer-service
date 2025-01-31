import React from 'react';
import { Layout, Avatar, Dropdown, Menu, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/reducers/Login/LoginSlice';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const HeaderBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.login.email);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <span>{user?.name}</span>
      </Menu.Item>
      <Menu.Item key="2">
        <span>{user?.email}</span>
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between' }}>
      <h2 style={{ color: 'rgb(165, 29, 45)' }}>Dashboard</h2>
      <Dropdown overlay={menu} placement="bottomRight">
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} />
          <span style={{ marginLeft: 8 }}>{user?.name}</span>
        </div>
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;

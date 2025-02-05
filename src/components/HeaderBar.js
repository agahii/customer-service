import React,{useState} from 'react';
import { Layout, Avatar, Dropdown, Menu,Button } from 'antd';
import { UserOutlined, LogoutOutlined,MenuFoldOutlined,
  MenuUnfoldOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../store/reducers/Login/LoginSlice";
import { useNavigate,Outlet } from 'react-router-dom';
import Sidebar from './SideBaar';
//import Sidebar from './Sidebar';

const { Header, Sider, Content } = Layout;

const HeaderBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const emailAddress = useSelector((state) => state.login.email);
    // const accountType = useSelector((state) => state.login.accountType);
    // const imageUrl = useSelector((state) => state.login.imageURL);
    // const name = useSelector((state) => state.login.fullName);

    const emailAddress= localStorage.getItem("email")||null
    // token: localStorage.getItem("authToken") || null,
    const accountType= localStorage.getItem("accountType")||6
    const imageURL= localStorage.getItem("imageURL")||null
    const name= localStorage.getItem("fullName")||null

const [collapsed, setCollapsed] = useState(false);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">{name}</Menu.Item>
      <Menu.Item key="2">{emailAddress}</Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar with collapsible functionality */}
      <Sider collapsible collapsed={collapsed} width={250}>
        <Sidebar collapsed={collapsed} />
      </Sider>

      <Layout>
        {/* Header Bar Component */}
        <Header style={{
            backgroundColor: "rgb(165, 29, 45)",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} style={{ color: 'white' }} />
          <h2 style={{ color: 'wheat' }}>Dashboard {name}</h2>
          <Dropdown overlay={menu} style={{ color: 'wheat' }} placement="bottomRight">
          
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ marginLeft: 8 ,color: 'wheat'}}>{emailAddress}</span>
            </div>
          </Dropdown>
        </Header>

        {/* Main Content Area - Displays HomePage or IndustriesPage */}
        <Content style={{ padding: '20px' }}>
          <Outlet />  {/* <== This is the key! It renders the nested route content */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HeaderBar;

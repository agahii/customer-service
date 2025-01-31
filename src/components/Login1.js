// src/components/LoginPage.js
import React, { useState,useEffect } from 'react';
import { Input, Button, Form, Layout, Typography, message } from 'antd';
import { useDispatch } from 'react-redux';
import { login } from '../store/reducers/Login/LoginSlice';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { API } from "../utills/services";
import { Link,useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Set the Authorization header for future requests
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Dispatch token to Redux
      dispatch(login(token));

      // Navigate to the home page after successful login
      navigate("/"); // Change '/home' to your actual route for the homepage
    }
  }, [dispatch, navigate]);

  const handleLogin = async () => {
    try {
      const response = await API.post('/Account/Login', { email, password }); // Replace with your actual login endpoint
      const { responseCode, message: apiMessage, data } = response.data;
      
      
    switch (responseCode) {
        case 1000:
            // Dispatch token to Redux and save to localStorage
            const { token } = data;
            if (token) {
               
                // Save the token to localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('email',data.email);
                localStorage.setItem('fullName',data.fullName);
                localStorage.setItem('accountType',data.accountType);
                localStorage.setItem('imageURL',data.ImageURL);

    
                // Set the Authorization header for future requests
                API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
                // Dispatch token to Redux
                
                dispatch(login(data,token));
    //console.log(dispatch(login(data,token)));
                // Navigate to the home page after successful login
                navigate("/"); // Change '/home' to your actual route for the homepage
              }
            break;
    case 2000:
         message.warning(apiMessage || "You need to confirm your email.");
    break;
        default:
            break;
    }
      

    } catch (error) {
      // Check if the error is from the server response
      if (error.response) {
        const errorMessage = error.response.data.message || 'An unexpected error occurred. Please try again later.';
        message.error(errorMessage);
      } else {
        // If there is no response from the server (e.g., network error)
        message.error('Network error. Please try again later.');
      }
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ backgroundColor: 'rgb(165, 29, 45)', padding: '0 20px' }}>
        <img src="logo.png" alt="Logo" style={{ width: 100, height: 'auto' }} />
      </Header>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          <img src="\gcc.jpg" alt="Logo" style={{ width: 100, height: 'auto', marginBottom: '20px' }} />
          <Typography.Title level={3}>Login</Typography.Title>
          <Form>
            <Form.Item>
              <Input
                placeholder="Email"
                prefix={<UserOutlined />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Input.Password
                placeholder="Password"
                prefix={<LockOutlined />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                block
                onClick={handleLogin}
                style={{ backgroundColor: 'rgb(165, 29, 45)' }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          {/* Register Link */}
          <Typography.Text>
            New user? <Link to="/signup" style={{ color: 'rgb(165, 29, 45)' }}>Register here</Link>
          </Typography.Text>
        </div>
      </Content>
    </Layout>
  );
};
 

export default LoginPage;

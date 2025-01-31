import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login1";
import HomePage from "./components/Home1";
import SignInPage from "./components/Signup1";

import Sidebar from "./components/SideBaar";
import HeaderBar from "./components/HeaderBar";
import IndustriesPage from "./components/Industries";
import { Layout } from 'antd';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignInPage />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <Layout style={{ minHeight: "100vh" }}>
                <Sidebar />
                <Layout>
                  <HeaderBar />
                  <HomePage />
                </Layout>
              </Layout>
            }
          />
          <Route
            path="/industries"
            element={
              <Layout style={{ minHeight: "100vh" }}>
                <Sidebar />
                <Layout>
                  <HeaderBar />
                  <IndustriesPage />
                </Layout>
              </Layout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
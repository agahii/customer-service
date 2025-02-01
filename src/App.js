import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login1";
import HomePage from "./components/Home1";
import SignInPage from "./components/Signup1";

import Sidebar from "./components/SideBaar";
import HeaderBar from "./components/HeaderBar";
import IndustriesPage from "./components/IndustryPage";

import IndustryRegistration from "./components/IndustryRegistration";
import { Layout } from "antd";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route for Login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignInPage />} />

        {/* Protected Routes Wrapped inside HeaderBar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<HeaderBar />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            
            <Route path="/IndustryRegistration" element={<IndustryRegistration />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
export default App;

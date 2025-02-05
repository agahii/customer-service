import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login1";
import HomePage from "./components/Home1";
import SignInPage from "./components/Signup1";

import Sidebar from "./components/SideBaar";
import HeaderBar from "./components/HeaderBar";
import IndustriesPage from "./components/IndustryPage";

import IndustryRegistration from "./components/IndustryRegistration";
import CustomerPage from "./components/customer";
import CustomerRegistration from "./components/CustomerRegistration";
import Questionnaire from "./components/Questionnaire";
import Answer from "./components/Answer";


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
            
            <Route path="/customer" element={<CustomerPage />} />
            {/* <Route path="/customer1" element={<CustomerRegistration />} /> */}
            <Route path="/question" element={<Questionnaire />} />
            <Route path="/answer" element={<Answer />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
export default App;

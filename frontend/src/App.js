import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login";  
import MatrixLogin from "./MatrixLogin"; 
import Register from "./Register";
import MemberProfile from "./MemberProfile";
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MatrixLogin />} />
        <Route path="/profile" element={<MemberProfile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

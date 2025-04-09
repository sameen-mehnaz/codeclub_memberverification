import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import "./index.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uniqueId] = useState(uuidv4().split('-')[0]); // Static once generated
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const registrationData = {
      username,
      email,
      password,
      role: "member", // Or "admin" if needed
    };

    try {
      const response = await axios.post("http://localhost:4000/auth/register", registrationData, {
        withCredentials: true // ✅ Sends cookies/session info
      });

      if (response.status === 201) {
        console.log("Registration successful:", response.data);
        alert("User registered successfully!");
        navigate("/"); // Redirect to login or homepage
      } else {
        alert(response.data.message || "Registration failed");
        console.error("Registration error:", response.data);
      }
    } catch (error) {
      alert("Something went wrong during registration");
      console.error("Axios error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="register-input"
        />
        <div className="unique-id-display">
          <label>Your Unique ID: {uniqueId}</label>
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
      <p>Already have an account? <a href="/">Login</a></p>
    </div>
  );
};

export default Register;

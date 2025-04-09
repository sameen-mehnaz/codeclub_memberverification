import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import axios from 'axios';

const Login = () => {
  // State for username and password
  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Characters for the matrix effect
    const characters = '01';
    
    // Font size and columns
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    // Array to store the y position of each drop
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }
    
    // Draw the matrix effect
    const draw = () => {
      // Set a semi-transparent background to create trail effect
      ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set color and font for characters
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Draw character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        // Move drop down
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    };
    
    // Animation loop
    const interval = setInterval(draw, 50);
    
    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const newColumns = canvas.width / fontSize;
      
      // Reset drops array for new width
      drops.length = 0;
      for (let i = 0; i < newColumns; i++) {
        drops[i] = 1;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle login logic
  const handleLogin = async (role) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
        username: enteredUsername,
        password: enteredPassword,
        role: role,  // Passing the role (Admin or Member)
      });

      console.log('Login successful:', response.data);
      // Handle successful login here (e.g., redirect, set user state)
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="matrix-container">
      <canvas ref={canvasRef} className="matrix-background"></canvas>
      
      <div className="logo-container">
        <div className="matrix-logo"></div>
      </div>
      
      <div className="login-container">
        <h2 className="login-title">Log in</h2>
        <div className="login-buttons">
          {/* Admin Login */}
          <button 
            className="login-button admin-login" 
            onClick={() => handleLogin('admin')}  // Pass 'admin' role
          >
            Admin Login
          </button>

          {/* Member Login */}
          <button 
            className="login-button member-login" 
            onClick={() => handleLogin('member')}  // Pass 'member' role
          >
            Member Login
          </button>
        </div>

        {/* Input fields for username and password */}
        <div className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={enteredUsername}
            onChange={(e) => setEnteredUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

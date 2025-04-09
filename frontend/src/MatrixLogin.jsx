import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const MatrixLogin = () => {
  const canvasRef = useRef(null);
  const [currentView, setCurrentView] = useState('main');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const characters = '01';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const char = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(char, i * fontSize, y * fontSize);
        drops[i] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleAuth = async (type, isRegister) => {
    if (!username || !password || (isRegister && !email)) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const endpoint = isRegister ? 'register' : 'login';
      const data = { username, password, email, role: type.toLowerCase() };

      // Log the data being sent to the backend
      console.log("Login data:", data);

      const response = await fetch(`http://localhost:4000/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // Ensures credentials (cookies) are sent along with the request
      });

      // Log the response from the backend
      const responseData = await response.json();
      console.log("Login response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Authentication failed');
      }

      alert(`${type} ${isRegister ? 'registration' : 'login'} successful!`);

      setUsername('');
      setPassword('');
      setEmail('');

      navigate(type === 'Admin' ? '/admin-dashboard' : '/member-profile');
    } catch (error) {
      console.error('Auth Error:', error);
      alert(error.message);
    }
  };

  const renderForm = (type, isRegister) => (
    <div className="login-form-container">
      <h2 className="login-title">{isRegister ? `${type} Register` : `${type} Login`}</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleAuth(type, isRegister);
      }}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {isRegister && (
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        )}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <p className="toggle-link" onClick={() => setCurrentView(isRegister ? type : `${type} register`)} >
        {isRegister ? 'Back to Login' : `New here? Register as ${type}!`}
      </p>
      <p className="back-link" onClick={() => setCurrentView('main')}>Back to Main</p>
    </div>
  );

  return (
    <div className="matrix-container">
      <canvas ref={canvasRef} className="matrix-background"></canvas>
      <div className="glass-effect">
        <div className="mainlogo">
          <img src="/img.png" alt="Logo" className="matrix-logo" />
        </div>
      </div>
      {currentView === 'main' ? (
        <div className="login-container">
          <h2 className="login-title">Log in</h2>
          <button onClick={() => setCurrentView('Admin')}>Admin Login</button>
          <button onClick={() => setCurrentView('Member')}>Member Login</button>
        </div>
      ) : (
        ['Admin', 'Member'].includes(currentView) ? renderForm(currentView, false) : renderForm(currentView.replace(' register', ''), true)
      )}
    </div>
  );
};

export default MatrixLogin;

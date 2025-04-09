import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberProfile from './MemberProfile';
import AdminDashboard from './AdminDashboard';
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
    const columns = canvas.width / fontSize;
    const drops = Array.from({ length: columns }, () => 1);

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

  const handleRegistration = (type) => {
    if (username && password && email) {
      // Simulate registration
      alert(`${type} registration successful!`);
      
      // Reset form fields
      setUsername('');
      setPassword('');
      setEmail('');

      // Navigate based on registration type
      if (type === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/member-profile');
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleLogin = (type) => {
    if (username && password) {
      // Simulate login
      alert(`${type} login successful!`);

      // Navigate based on login type
      if (type === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/member-profile');
      }

      // Reset form fields
      setUsername('');
      setPassword('');
    } else {
      alert('Please enter username and password');
    }
  };

  const renderForm = (type) => {
    const isRegister = type.includes('register');
    const isAdmin = type.includes('Admin');

    return (
      <div className="login-form-container">
        <h2 className="login-title">
          {isRegister 
            ? `${isAdmin ? 'Admin' : 'Member'} Register` 
            : `${isAdmin ? 'Admin' : 'Member'} Login`}
        </h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          isRegister 
            ? handleRegistration(isAdmin ? 'Admin' : 'Member')
            : handleLogin(isAdmin ? 'Admin' : 'Member');
        }}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          {isRegister && (
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          )}
          <button type="submit">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p 
          className="toggle-link" 
          onClick={() => {
            if (type === 'register') setCurrentView('Member');
            else if (type === 'Admin register') setCurrentView('Admin');
            else setCurrentView(type === 'Member' ? 'register' : 'Admin register');
          }}
        >
          {isRegister 
            ? 'Back to Login' 
            : `New here? Register as ${isAdmin ? 'Admin' : 'Member'}!`}
        </p>
        <p className="back-link" onClick={() => setCurrentView('main')}>
          Back to Main
        </p>
      </div>
    );
  };

  return (
    <div className="matrix-container">
      <canvas ref={canvasRef} className="matrix-background"></canvas>
      {currentView === 'main' && (
        <div className="login-container">
          <h2 className="login-title">Log in</h2>
          <button onClick={() => setCurrentView('Admin')}>Admin Login</button>
          <button onClick={() => setCurrentView('Member')}>Member Login</button>
        </div>
      )}
      {currentView === 'Member' && renderForm('Member')}
      {currentView === 'Admin' && renderForm('Admin')}
      {currentView === 'register' && renderForm('register')}
      {currentView === 'Admin register' && renderForm('Admin register')}
    </div>
  );
};

export default MatrixLogin;


// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import MemberProfile from './MemberProfile';
// import AdminDashboard from './AdminDashboard';
// import './index.css';

// const MatrixLogin = () => {
//   const canvasRef = useRef(null);
//   const [currentView, setCurrentView] = useState('main'); 
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [Mail, setMail] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     const characters = '01';
//     const fontSize = 14;
//     const columns = canvas.width / fontSize;
//     const drops = Array.from({ length: columns }, () => 1);

//     const draw = () => {
//       ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       ctx.fillStyle = '#0F0';
//       ctx.font = `${fontSize}px monospace`;

//       drops.forEach((y, i) => {
//         const char = characters.charAt(Math.floor(Math.random() * characters.length));
//         ctx.fillText(char, i * fontSize, y * fontSize);
//         drops[i] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
//       });
//     };

//     const interval = setInterval(draw, 50);
//     window.addEventListener('resize', () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     });
//     return () => clearInterval(interval);
//   }, []);

//   const handleMemberRegister = (e) => {
//     e.preventDefault();
//     // Simulating registration logic
//     if (username && password && Mail) {
//       alert("Member registrsation successful!");
//       setTimeout(() => {
//         setCurrentView('MemberProfile');
//         {currentView === "MemberProfile" && <MemberProfile/>}
//         // Reset form fields
//         setUsername('');
//         setPassword('');
//         setMail('');
//       }, 2000);
//     }
//   };

//   const handleAdminRegister = (e) => {
//     e.preventDefault();
    
//     if (username && password && Mail) {
//       alert("Admin registrsation successful!");
//       setTimeout(() => {
//         setCurrentView('AdminDashboard');
//         {currentView === "AdminDashboard" && <AdminDashboard/>}
//         // Reset form fields
//         setUsername('');
//         setPassword('');
//         setMail('');
//       }, 2000);
//     }
//   };

//   const renderMemberRegistrationSuccessView = () => (
//     <div className="registration-success-container">
//       <h2>Registration Successful!</h2>
//       <p>Your member account has been created.</p>
//       <p>Redirecting to Member Login...</p>
//     </div>
//   );

//   const renderAdminRegistrationSuccessView = () => (
//     <div className="registration-success-container">
//       <h2>Registration Successful!</h2>
//       <p>Your admin account has been created.</p>
//       <p>Redirecting to Admin Login...</p>
//     </div>
//   );

//   const renderForm = (type) => (
//     <div className="login-form-container">
//       <h2 className="login-title">{type === 'register' ? `${type === 'Admin' ? 'Admin' : 'Member'} Register` : `${type} Log in`}</h2>
//       <form onSubmit={(e) => {
//         if (type === 'Admin register') handleAdminRegister(e);
//         else if (type === 'register') handleMemberRegister(e);
//       }}>
//         <input 
//           type="text" 
//           placeholder="Username" 
//           value={username} 
//           onChange={(e) => setUsername(e.target.value)} 
//           required
//         />
//         <input 
//           type="password" 
//           placeholder="Password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//           required
//         />
//         <input 
//           type="email" 
//           placeholder="Mail" 
//           value={Mail} 
//           onChange={(e) => setMail(e.target.value)} 
//           required
//         />
       
//         <button type="submit">
//           {type === 'register' || type === 'Admin register' ? 'Register' : 'Login'}
//         </button>
//       </form>
//       <p className="toggle-link" onClick={() => setCurrentView(type === 'register' ? 'Member' : (type === 'Admin register' ? 'Admin' : 'register'))}>
//         {type === 'register' || type === 'Admin register' ? 'Back to Login' : `New here? Register as ${type}!`}
//       </p>
//       <p className="back-link" onClick={() => setCurrentView('main')}>Back to Main</p>
//     </div>
//   );

//   return (
//     <div className="matrix-container">
//       <canvas ref={canvasRef} className="matrix-background"></canvas>
//       {currentView === 'main' && (
//         <div className="login-container">
//           <h2 className="login-title">Log in</h2>
//           <button onClick={() => setCurrentView('Admin')}>Admin Login</button>
//           <button onClick={() => setCurrentView('Member')}>Member Login</button>
//         </div>
//       )}
//       {currentView === 'Member' && renderForm('MemberProfile')}
//       {currentView === 'Admin' && renderForm('AdminDashboard')}
//       {currentView === 'memberRegistrationSuccess' && renderMemberRegistrationSuccessView()}
//       {currentView === 'adminRegistrationSuccess' && renderAdminRegistrationSuccessView()}
//     </div>
//   );
// };

// export default MatrixLogin;

// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './index.css';

// const MatrixLogin = () => {
//   const canvasRef = useRef(null);
//   const [currentView, setCurrentView] = useState('main'); 
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [Mail, setMail] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     const characters = '01';
//     const fontSize = 14;
//     const columns = canvas.width / fontSize;
//     const drops = Array.from({ length: columns }, () => 1);

//     const draw = () => {
//       ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       ctx.fillStyle = '#0F0';
//       ctx.font = `${fontSize}px monospace`;

//       drops.forEach((y, i) => {
//         const char = characters.charAt(Math.floor(Math.random() * characters.length));
//         ctx.fillText(char, i * fontSize, y * fontSize);
//         drops[i] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
//       });
//     };

//     const interval = setInterval(draw, 50);
//     window.addEventListener('resize', () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     });
//     return () => clearInterval(interval);
//   }, []);

//   const handleSubmit = async (e, type) => {
//     e.preventDefault();
//   };

//   const renderForm = (type) => (
//     <div className="login-form-container">
//       <h2 className="login-title">{type === 'register' ? 'Register' : `${type} Log in`}</h2>
//       <form onSubmit={(e) => handleSubmit(e, type)}>
//         <input 
//           type="text" 
//           placeholder="Username" 
//           value={username} 
//           onChange={(e) => setUsername(e.target.value)} 
//         />
//         <input 
//           type="password" 
//           placeholder="Password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//         />
//         {(type === 'Admin' || type === 'register') && (
//           <input 
//             type="email" 
//             placeholder="Mail" 
//             value={Mail} 
//             onChange={(e) => setMail(e.target.value)} 
//           />
//         )}
       
//         <button 
//           type="submit"
//           onClick={(e) => {
//             e.preventDefault();
//             if (type === 'Admin') navigate('/admin-dashboard');
//             else if (type === 'Member') navigate('/profile');
//           }}
//         >
//           {type === 'register' ? 'Register' : 'Login'}
//         </button>
//       </form>
//       <p className="toggle-link" onClick={() => setCurrentView(type === 'register' ? `${type === 'Admin' ? 'Admin' : 'Member'}` : 'register')}>
//         {type === 'register' ? 'Back to Login' : `New here? Register as ${type}!`}
//       </p>
//       <p className="back-link" onClick={() => setCurrentView('main')}>Back to Main</p>
//     </div>
//   );

//   return (
//     <div className="matrix-container">
//       <canvas ref={canvasRef} className="matrix-background"></canvas>
//       {currentView === 'main' && (
//         <div className="login-container">
//           <h2 className="login-title">Log in</h2>
//           <button onClick={() => setCurrentView('Admin')}>Admin Login</button>
//           <button onClick={() => setCurrentView('Member')}>Member Login</button>
//         </div>
//       )}
//       {currentView === 'Member' && renderForm('Member')}
//       {currentView === 'Admin' && renderForm('Admin')}
//       {currentView === 'register' && renderForm('register')}
//     </div>
//   );
// };

// export default MatrixLogin;

// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './index.css';

// const MatrixLogin = () => {
//   const canvasRef = useRef(null);
//   const [currentView, setCurrentView] = useState('main'); 
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [Mail, setMail] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     const characters = '01';
//     const fontSize = 14;
//     const columns = canvas.width / fontSize;
//     const drops = Array.from({ length: columns }, () => 1);

//     const draw = () => {
//       ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       ctx.fillStyle = '#0F0';
//       ctx.font = `${fontSize}px monospace`;

//       drops.forEach((y, i) => {
//         const char = characters.charAt(Math.floor(Math.random() * characters.length));
//         ctx.fillText(char, i * fontSize, y * fontSize);
//         drops[i] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
//       });
//     };

//     const interval = setInterval(draw, 50);
//     window.addEventListener('resize', () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     });
//     return () => clearInterval(interval);
//   }, []);

//   const handleSubmit = async (e, type) => {
//     e.preventDefault();
//     navigate('/profile');
//     const endpoint = type === 'register' ? '/api/register' : '/api/login';
//     const payload = { 
//       username, 
//       password, 
//       Mail: (type === 'Admin' || type === 'register') ? Mail : undefined 
//     };
    
//     try {
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       const data = await response.json();
//       console.log(data.message);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const renderForm = (type) => (
//     <div className="login-form-container">
//       <h2 className="login-title">{type === 'register' ? 'Register' : `${type} Log in`}</h2>
//       <form onSubmit={(e) => handleSubmit(e, type)}>
//         <input 
//           type="text" 
//           placeholder="Username" 
//           value={username} 
//           onChange={(e) => setUsername(e.target.value)} 
//         />
//         <input 
//           type="password" 
//           placeholder="Password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//         />
//         {(type === 'Admin' || type === 'register') && (
//           <input 
//             type="email" 
//             placeholder="Mail" 
//             value={Mail} 
//             onChange={(e) => setMail(e.target.value)} 
//           />
//         )}
//         <button 
//           type="submit" 
//           onClick={(e) => {
//             e.preventDefault(); 
//             window.location.href = '/profile'; 
//           }}
//         >
//           {type === 'register' ? 'Register' : 'Login'}
//         </button>
//       </form>
//       <p className="toggle-link" onClick={() => setCurrentView(type === 'register' ? `${type === 'Admin' ? 'Admin' : 'Member'}` : 'register')}>
//         {type === 'register' ? 'Back to Login' : `New here? Register as ${type}!`}
//       </p>
//       <p className="back-link" onClick={() => setCurrentView('main')}>Back to Main</p>
//     </div>
//   );

//   return (
//     <div className="matrix-container">
//       <canvas ref={canvasRef} className="matrix-background"></canvas>
//       {currentView === 'main' && (
//         <div className="login-container">
//           <h2 className="login-title">Log in</h2>
//           <button onClick={() => setCurrentView('Admin')}>Admin Login</button>
//           <button onClick={() => setCurrentView('Member')}>Member Login</button>
//         </div>
//       )}
//       {currentView === 'Member' && renderForm('Member')}
//       {currentView === 'Admin' && renderForm('Admin')}
//       {currentView === 'register' && renderForm('register')}
//     </div>
//   );
// };

// export default MatrixLogin;



// import React, { useEffect, useRef, useState } from 'react';
// import './index.css';

// const MatrixLogin = () => {
//   const canvasRef = useRef(null);
//   const [currentView, setCurrentView] = useState('main'); // 'main', 'memberLogin', 'adminLogin'
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [adminCode, setAdminCode] = useState('');

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
    
//     // Set canvas dimensions to match window
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
    
//     // Characters for the matrix effect
//     const characters = '01';
    
//     // Font size and columns
//     const fontSize = 14;
//     const columns = canvas.width / fontSize;
    
//     // Array to store the y position of each drop
//     const drops = [];
//     for (let i = 0; i < columns; i++) {
//       drops[i] = 1;
//     }
    
//     // Draw the matrix effect
//     const draw = () => {
//       // Set a semi-transparent background to create trail effect
//       ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
      
//       // Set color and font for characters
//       ctx.fillStyle = '#0F0';
//       ctx.font = `${fontSize}px monospace`;
      
//       // Draw characters
//       for (let i = 0; i < drops.length; i++) {
//         // Random character
//         const char = characters.charAt(Math.floor(Math.random() * characters.length));
        
//         // Draw character
//         ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
//         // Move drop down
//         if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
//           drops[i] = 0;
//         }
        
//         drops[i]++;
//       }
//     };
    
//     // Animation loop
//     const interval = setInterval(draw, 50);
    
//     // Resize handler
//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//       const newColumns = canvas.width / fontSize;
      
//       // Reset drops array for new width
//       drops.length = 0;
//       for (let i = 0; i < newColumns; i++) {
//         drops[i] = 1;
//       }
//     };
    
//     window.addEventListener('resize', handleResize);
    
//     return () => {
//       clearInterval(interval);
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   const handleMemberLogin = () => {
//     setCurrentView('memberLogin');
//   };

//   const handleAdminLogin = () => {
//     setCurrentView('adminLogin');
//   };

//   const handleBackToMain = () => {
//     setCurrentView('main');
//     // Reset form fields when going back to main view
//     setUsername('');
//     setPassword('');
//     setAdminCode('');
//   };

//   const handleMemberSubmit = (e) => {
//     e.preventDefault();
//     console.log('Member login attempt with:', { username, password });
//     // Add your member authentication logic here
//   };

//   const handleAdminSubmit = (e) => {
//     e.preventDefault();
//     console.log('Admin login attempt with:', { username, password, adminCode });
//     // Add your admin authentication logic here
//   };

//   // Render the main login options view
//   const renderMainView = () => (
//     <div className="login-container">
//       <h2 className="login-title">Log in</h2>
//       <div className="login-buttons">
//         <button 
//           className="login-button admin-login"
//           onClick={handleAdminLogin}
//         >
//           Admin Login
//         </button>
//         <button 
//           className="login-button member-login"
//           onClick={handleMemberLogin}
//         >
//           Member Login
//         </button>
//       </div>
//     </div>
//   );

//   // Render the member login form
//   const renderMemberLoginView = () => (
//     <div className="login-form-container">
//       <h2 className="login-title">Member Log in</h2>
      
//       <form onSubmit={handleMemberSubmit} className="login-form">
//         <input
//           type="text"
//           placeholder="Name"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="login-input"
//         />
        
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="login-input"
//         />
        
//         <button type="submit" className="login-submit-button">
//           Login
//         </button>
        
//         <p className="register-link">
//           Not a member? <a href="/Register">register!</a>
//         </p>
//       </form>
      
//       <div className="back-link">
//         <a href="#" onClick={handleBackToMain}>Back</a>
//       </div>
//     </div>
//   );

//   // Render the admin login form
//   const renderAdminLoginView = () => (
//     <div className="login-form-container admin-form-container">
//       <h2 className="login-title">Admin Log in</h2>
      
//       <form onSubmit={handleAdminSubmit} className="login-form">
//         <input
//           type="text"
//           placeholder="Administrator ID"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="login-input"
//         />
        
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="login-input"
//         />
        
//         <input
//           type="text"
//           placeholder="Admin Email address"
//           value={adminCode}
//           onChange={(e) => setAdminCode(e.target.value)}
//           className="login-input"
//         />
        
//         <button type="submit" className="login-submit-button admin-submit-button">
//           Admin Access
//         </button>

//         <p className="register-link">
//           Register as an admin? <a href="#">register!</a>
//         </p>

//       </form>
      
//       <div className="back-link">
//         <a href="#" onClick={handleBackToMain}>Back</a>
//       </div>
//     </div>
//   );

//   return (
//     <div className="matrix-container">
//       <canvas ref={canvasRef} className="matrix-background"></canvas>
      
//       <div className="logo-container">
//         <div className="matrix-logo"></div>
//       </div>
      
//       {currentView === 'main' && renderMainView()}
//       {currentView === 'memberLogin' && renderMemberLoginView()}
//       {currentView === 'adminLogin' && renderAdminLoginView()}
//     </div>
//   );
// };

// export default MatrixLogin;

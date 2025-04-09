import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './member.css';

const MemberProfile = () => {
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    status: '',
    uniqueId: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  // Fetch Member Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/member/profile", {
          method: "GET",
          credentials: "include" // Include cookies for authentication
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const profileData = await response.json();
        setUserProfile(profileData);
      } catch (err) {
        setError("Failed to load profile");
        console.error("Profile fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Matrix Animation Background Effect
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

  // Logout Function
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/member/logout", {
        method: "POST",
        credentials: "include" // Ensure cookies are sent
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Redirect to login page after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="matrix-container loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="matrix-container">
      <canvas ref={canvasRef} className="matrix-background"></canvas>
      <div className="member-profile-container">
        <div className="profile-header">
          <h1>Member Profile</h1>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="profile-details">
          <div className="profile-item">
            <label>Username:</label>
            <span>{userProfile.username}</span>
          </div>
          <div className="profile-item">
            <label>Email:</label>
            <span>{userProfile.email}</span>
          </div>
          <div className="profile-item">
            <label>Status:</label>
            <span>{userProfile.status}</span>
          </div>
          <div className="profile-item">
            <label>Unique ID:</label>
            <span>{userProfile.uniqueId}</span>
          </div>
        </div>

        {userProfile.uniqueId && (
          <div className="qr-code-section">
            <h3>Member Verification QR</h3>
            <QRCodeSVG value={userProfile.uniqueId} level="H" size={256} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;


// import React, { useState, useEffect, useRef } from 'react';
// import { QRCodeSVG } from 'qrcode.react';
// import './member.css';

// const MemberProfile = () => {
//   const [userProfile, setUserProfile] = useState({
//     username: '',
//     email: '',
//     status: '',
//     uniqueId: ''
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch("/api/member/profile", {
//           method: "GET",
//           credentials: "include" // Include cookies
//         });
  
//         if (!response.ok) {
//           throw new Error("Failed to fetch profile");
//         }
  
//         const profileData = await response.json();
//         setUserProfile(profileData);
//       } catch (err) {
//         setError("Failed to load profile");
//         console.error("Profile fetch error:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     fetchProfile();
//   }, []);
  

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     const resizeCanvas = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };

//     resizeCanvas();
//     window.addEventListener('resize', resizeCanvas);

//     const characters = '01';
//     const fontSize = 14;
//     const columns = Math.floor(canvas.width / fontSize);
//     const drops = new Array(columns).fill(1);

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

//     return () => {
//       clearInterval(interval);
//       window.removeEventListener('resize', resizeCanvas);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/';
//   };

//   if (isLoading) {
//     return (
//       <div className="matrix-container loading">
//         <div className="loading-spinner">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="matrix-container">
//       <canvas ref={canvasRef} className="matrix-background"></canvas>
//       <div className="member-profile-container">
//         <div className="profile-header">
//           <h1>Member Profile</h1>
//           <button className="logout-button" onClick={handleLogout}>Logout</button>
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <div className="profile-details">
//           <div className="profile-item">
//             <label>Username:</label>
//             <span>{userProfile.username}</span>
//           </div>
//           <div className="profile-item">
//             <label>Email:</label>
//             <span>{userProfile.email}</span>
//           </div>
//           <div className="profile-item">
//             <label>Status:</label>
//             <span>{userProfile.status}</span>
//           </div>
//           <div className="profile-item">
//             <label>Unique ID:</label>
//             <span>{userProfile.uniqueId}</span>
//           </div>
//         </div>

//         {userProfile.uniqueId && (
//           <div className="qr-code-section">
//             <h3>Member Verification QR</h3>
//             <QRCodeSVG value={userProfile.uniqueId} level="H" size={256} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MemberProfile;


// import React, { useState, useEffect } from 'react';
// import { QRCode } from 'qrcode.react';
// import { QRCodeSVG } from 'qrcode.react';
// import './member.css';

// const MemberProfile = () => {
//   const [userProfile, setUserProfile] = useState({
//     username: '',
//     email: '',
//     status: '',
//     uniqueId: '' // Add unique ID to profile state
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('/api/member/profile', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch profile');
//         }

//         const profileData = await response.json();
//         setUserProfile(profileData);
//         setIsLoading(false);
//       } catch (err) {
//         setError('Failed to load profile');
//         setIsLoading(false);
//         console.error('Profile fetch error:', err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/'; // Redirect to login page
//   };

//   if (isLoading) {
//     return (
//       <div className="matrix-container loading">
//         <div className="loading-spinner">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="matrix-container">
//       <div className="member-profile-container">
//         <div className="profile-header">
//           <h1>Member Profile</h1>
//           <button 
//             className="logout-button" 
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <div className="profile-details">
//           <div className="profile-item">
//             <label>Username:</label>
//             <span>{userProfile.username}</span>
//           </div>
//           <div className="profile-item">
//             <label>Email:</label>
//             <span>{userProfile.email}</span>
//           </div>
//           <div className="profile-item">
//             <label>Status:</label>
//             <span>{userProfile.status}</span>
//           </div>
//           <div className="profile-item">
//             <label>Unique ID:</label>
//             <span>{userProfile.uniqueId}</span>
//           </div>
//         </div>

//         {/* QR Code Generation */}
//         {userProfile.uniqueId && (
//           <div className="qr-code-section">
//             <h3>Member Verification QR</h3>
//             <QRCodeSVG 
//               value={userProfile.uniqueId} 
//               level="H" 
//               size={256}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MemberProfile;




// import React, { useState, useEffect } from 'react';
// import './member.css';

// const MemberProfile = () => {
//   const [userProfile, setUserProfile] = useState({
//     username: '',
//     email: '',
//     status: ''
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         // Fetch user profile
//         const response = await fetch('/api/member/profile', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch profile');
//         }

//         const profileData = await response.json();
//         setUserProfile(profileData);
//         setIsLoading(false);
//       } catch (err) {
//         setError('Failed to load profile');
//         setIsLoading(false);
//         console.error('Profile fetch error:', err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // Logout function
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/'; // Redirect to login page
//   };

//   if (isLoading) {
//     return (
//       <div className="matrix-container loading">
//         <div className="loading-spinner">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="matrix-container">
//       <div className="member-profile-container">
//         <div className="profile-header">
//           <h1>Member Profile</h1>
//           <button 
//             className="logout-button" 
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <div className="profile-details">
//           <div className="profile-item">
//             <label>Username:</label>
//             <span>{userProfile.username}</span>
//           </div>
//           <div className="profile-item">
//             <label>Email:</label>
//             <span>{userProfile.email}</span>
//           </div>
//           <div className="profile-item">
//             <label>Status:</label>
//             <span>{userProfile.status}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MemberProfile;
import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './admin.css';

const AdminDashboard = () => {
  <admin-header/>
  const [activeSection, setActiveSection] = useState('team');
  const [members, setMembers] = useState([]);
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    status: ''
  });
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Previous methods remain the same...

  const renderQRScanSection = () => (
    <div className="qr-scan-container">
      <h2>Scan Member QR</h2>
      {scanning ? (
        <div id="reader" style={{ width: '100%' }}></div>
      ) : (
        <button 
          onClick={() => {
            setScanning(true);
            initializeScanner();
          }}
          className="action-button scan-button"
        >
          Start Scanning
        </button>
      )}

      {scanResult && (
        <div className="scan-success">
          <h3>Member Validated</h3>
          <p>Name: {scanResult.username}</p>
          <p>Email: {scanResult.email}</p>
        </div>
      )}

      {validationError && (
        <div className="error-message">
          {validationError}
        </div>
      )}
    </div>
  );

  const initializeScanner = () => {
    const scanner = new Html5QrcodeScanner('reader', { 
      qrbox: 250,
      fps: 10 
    });

    scanner.render(onScanSuccess, onScanError);
  };

  const onScanSuccess = async (decodedText) => {
    try {
      const response = await fetch(`/api/admin/validate-member/${decodedText}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid member');
      }

      const memberData = await response.json();
      
      const addResponse = await fetch('/api/admin/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: memberData.username,
          email: memberData.email,
          role: 'Member'
        })
      });

      if (!addResponse.ok) {
        throw new Error('Failed to add member');
      }

      const newMember = await addResponse.json();
      setMembers([...members, newMember]);
      setScanResult(memberData);
      setValidationError(null);
      setScanning(false);
    } catch (error) {
      setScanResult(null);
      setValidationError(error.message);
      setScanning(false);
    }
  };

  const onScanError = (errorMessage) => {
    console.error(errorMessage);
    setValidationError('Scanning error');
  };

  // Rest of the component remains the same...
};

export default AdminDashboard;


// import React, { useState, useEffect } from 'react';
// import './admin.css';

// const AdminDashboard = () => {
//   const [activeSection, setActiveSection] = useState('team');
//   const [members, setMembers] = useState([]);
//   const [userProfile, setUserProfile] = useState({
//     username: '',
//     email: '',
//     status: ''
//   });
//   const [newMember, setNewMember] = useState({
//     name: '',
//     email: '',
//     role: ''
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch user profile and team members on component mount
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         // Fetch user profile
//         const profileResponse = await fetch('/api/admin/profile', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         const profileData = await profileResponse.json();
//         setUserProfile(profileData);

//         // Fetch team members
//         const membersResponse = await fetch('/api/admin/team-members', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         const membersData = await membersResponse.json();
//         setMembers(membersData);

//         setIsLoading(false);
//       } catch (err) {
//         setError('Failed to fetch dashboard data');
//         setIsLoading(false);
//         console.error('Dashboard fetch error:', err);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // Add new team member
//   const handleAddMember = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/admin/team-members', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(newMember)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add member');
//       }

//       const addedMember = await response.json();
//       setMembers([...members, addedMember]);
      
//       // Reset form
//       setNewMember({ name: '', email: '', role: '' });
//     } catch (err) {
//       setError('Failed to add team member');
//       console.error('Add member error:', err);
//     }
//   };

//   // Delete team member
//   const handleDeleteMember = async (memberId) => {
//     try {
//       const response = await fetch(`/api/admin/team-members/${memberId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete member');
//       }

//       // Remove member from local state
//       setMembers(members.filter(member => member.id !== memberId));
//     } catch (err) {
//       setError('Failed to delete team member');
//       console.error('Delete member error:', err);
//     }
//   };

//   // Render team section
//   const renderTeamSection = () => (
//     <div className="admin-section-container">
//       <h2 className="admin-section-title">Team Members</h2>
      
//       {/* Add Member Form */}
//       <form onSubmit={handleAddMember} className="add-member-form">
//         <input 
//           type="text" 
//           placeholder="Name" 
//           value={newMember.name}
//           onChange={(e) => setNewMember({...newMember, name: e.target.value})}
//           required 
//         />
//         <input 
//           type="email" 
//           placeholder="Email" 
//           value={newMember.email}
//           onChange={(e) => setNewMember({...newMember, email: e.target.value})}
//           required 
//         />
//         <input 
//           type="text" 
//           placeholder="Role" 
//           value={newMember.role}
//           onChange={(e) => setNewMember({...newMember, role: e.target.value})}
//           required 
//         />
//         <button type="submit" className="action-button add-button">Add Member</button>
//       </form>

//       {/* Member List */}
//       <div className="member-list">
//         {members.map((member) => (
//           <div key={member.id} className="member-item">
//             <div>
//               <strong>{member.name}</strong>
//               <p>{member.email}</p>
//               <p>{member.role}</p>
//             </div>
//             <div className="member-actions">
//               <button 
//                 className="action-button delete-button"
//                 onClick={() => handleDeleteMember(member.id)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Error Handling */}
//       {error && <div className="error-message">{error}</div>}
//     </div>
//   );

//   // Render profile section
//   const renderProfileSection = () => (
//     <>
//       <h2>Welcome Admin name</h2>
//       <div className="profile-details">
//         <p>Username: {'<name>'}</p>
//         <p>Email: {'<Email>'}</p>
//         <div className="password-row">
//           <p>Password: hidden</p>
//           <button className="action-button change-password-btn">Change Password</button>
//         </div>
//         <p>Status: Active</p>
//       </div>
//     </>
//   );

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="matrix-container loading">
//         <div className="loading-spinner">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="matrix-container">
//       <div className="admin-dashboard">
//         <nav className="admin-nav">
//           <div className="nav-logo">Logo</div>
//           <div className="nav-menu">
//             <div 
//               className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
//               onClick={() => setActiveSection('profile')}
//             >
//               Profile
//             </div>
//             <div 
//               className={`nav-item ${activeSection === 'team' ? 'active' : ''}`}
//               onClick={() => setActiveSection('team')}
//             >
//               Team
//             </div>
//           </div>
//           <div className="nav-user">{userProfile.username}</div>
//         </nav>
        
//         <div className="admin-content">
//           {activeSection === 'team' && renderTeamSection()}
//           {activeSection === 'profile' && renderProfileSection()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
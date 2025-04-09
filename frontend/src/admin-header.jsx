import React from 'react';
import './AdminHeader.css';

const AdminHeader = () => {
  return (
    <header className="admin-header">
      <div className="header-container">
        <div className="logo">Logo</div>
        <nav className="header-nav">
          <a href="/profile" className="nav-item active">Profile</a>
          <a href="/events" className="nav-item">Events</a>
          <a href="/team" className="nav-item">Team</a>
        </nav>
        <div className="admin-info">
          <span className="admin-name">Admin name</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;


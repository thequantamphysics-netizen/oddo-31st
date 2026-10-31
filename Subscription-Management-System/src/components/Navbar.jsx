import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Left Side: Brand Logo / Title */}
        <div className="navbar-left">
          <Link to="/" className="brand-logo" onClick={closeMenu}>
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Subscription Management System</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-toggle-btn" 
          onClick={toggleMenu} 
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Center: Navigation Menu */}
        <nav className={`navbar-center ${isMobileMenuOpen ? 'show-mobile' : ''}`}>
          <ul className="nav-menu">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/plans" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Plans
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/my-account" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                My Account
              </NavLink>
            </li>

            {/* Mobile Auth / Logout inside dropdown */}
            <li className="mobile-auth-wrapper">
              {isLoggedIn ? (
                <>
                  <div className="mobile-user-greeting">
                    <span>Signed in as:</span>
                    <strong>{user?.fullName || user?.email}</strong>
                  </div>
                  <Link to="/my-account" className="btn btn-outline-white" onClick={closeMenu}>
                    My Account
                  </Link>
                  <button type="button" onClick={handleLogout} className="btn btn-outline-orange">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-white" onClick={closeMenu}>
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-orange" onClick={closeMenu}>
                    Sign Up
                  </Link>
                </>
              )}
            </li>
          </ul>
        </nav>

        {/* Right Side: Auth Buttons (Desktop) */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <div className="logged-in-actions">
              <Link to="/my-account" className="user-profile-pill">
                <span className="user-avatar-circle">
                  {(user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
                </span>
                <span className="user-profile-name">
                  {user?.fullName || user?.email?.split('@')[0]}
                </span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-white btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-white">
                Login
              </Link>
              <Link to="/signup" className="btn btn-orange">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

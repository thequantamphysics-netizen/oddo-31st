import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('sms_auth_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to parse stored user from localStorage', err);
      localStorage.removeItem('sms_auth_user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Simulated Login function (ready for Odoo API connection)
  const login = (userData) => {
    const userPayload = {
      id: userData.id || 'usr_' + Date.now(),
      fullName: userData.fullName || userData.email.split('@')[0],
      email: userData.email,
      phone: userData.phone || '9876543210',
      token: userData.token || 'jwt_session_token_' + Math.random().toString(36).substring(2),
      activePlan: userData.activePlan || 'Standard Plan',
    };
    setUser(userPayload);
    localStorage.setItem('sms_auth_user', JSON.stringify(userPayload));
    return userPayload;
  };

  // Simulated Signup function
  const signup = (userData) => {
    const newUser = {
      id: 'usr_' + Date.now(),
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      token: 'jwt_session_token_' + Math.random().toString(36).substring(2),
      activePlan: null,
    };
    // Save to registered accounts list in localStorage for demo simulation
    try {
      const existing = JSON.parse(localStorage.getItem('sms_registered_users') || '[]');
      existing.push(newUser);
      localStorage.setItem('sms_registered_users', JSON.stringify(existing));
    } catch (e) {
      console.error('Error saving user registration', e);
    }
    return newUser;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('sms_auth_user');
  };

  const value = {
    user,
    isLoggedIn: Boolean(user),
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: 1, name: 'Customer User', email: 'customer@demo.com', password: 'password123', role: 'customer', phone: '9876543210' },
  { id: 2, name: 'Staff User', email: 'staff@demo.com', password: 'password123', role: 'staff', phone: '9876543211' },
  { id: 3, name: 'Admin User', email: 'admin@demo.com', password: 'password123', role: 'admin', phone: '9876543212' },
];

export function AuthProvider({ children }) {
  const stored = JSON.parse(localStorage.getItem('sms_user') || 'null');
  const [user, setUser] = useState(stored);
  const [role, setRole] = useState(stored?.role || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!stored);

  const login = (email, password) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const { password: _, ...safeUser } = found;
    localStorage.setItem('sms_user', JSON.stringify(safeUser));
    setUser(safeUser);
    setRole(safeUser.role);
    setIsLoggedIn(true);
    return safeUser;
  };

  const signup = (name, email, phone, password) => {
    const exists = DEMO_USERS.find(u => u.email === email);
    if (exists) throw new Error('Email already registered');
    const newUser = { id: Date.now(), name, email, phone, role: 'customer' };
    DEMO_USERS.push({ ...newUser, password });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('sms_user');
    setUser(null);
    setRole(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoggedIn, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

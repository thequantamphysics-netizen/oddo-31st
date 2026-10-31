import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEMO_USERS = {
  customer: {
    email: 'customer@demo.com',
    password: 'password123',
    role: 'customer',
    name: 'Demo Customer',
  },
  staff: {
    email: 'staff@demo.com',
    password: 'password123',
    role: 'staff',
    name: 'Operations Staff',
  },
  admin: {
    email: 'admin@demo.com',
    password: 'password123',
    role: 'admin',
    name: 'System Administrator',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('sms_auth_user');
      const storedRole = localStorage.getItem('sms_auth_role');
      if (storedUser && storedRole) {
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      }
    } catch (err) {
      console.error('Session retrieval error', err);
      localStorage.removeItem('sms_auth_user');
      localStorage.removeItem('sms_auth_role');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = email.trim().toLowerCase();

    // Match demo accounts
    const matched = Object.values(DEMO_USERS).find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (matched) {
      const sessionUser = {
        id: `usr_${matched.role}`,
        email: matched.email,
        name: matched.name,
        role: matched.role,
        token: `jwt_mock_${Date.now()}`,
      };
      setUser(sessionUser);
      setRole(matched.role);
      localStorage.setItem('sms_auth_user', JSON.stringify(sessionUser));
      localStorage.setItem('sms_auth_role', matched.role);
      setLoading(false);
      return { success: true, role: matched.role, user: sessionUser };
    }

    // Dynamic role deduction for new signups
    const assignedRole = normalizedEmail.includes('admin')
      ? 'admin'
      : normalizedEmail.includes('staff')
      ? 'staff'
      : 'customer';

    const sessionUser = {
      id: `usr_${Date.now()}`,
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      role: assignedRole,
      token: `jwt_mock_${Date.now()}`,
    };

    setUser(sessionUser);
    setRole(assignedRole);
    localStorage.setItem('sms_auth_user', JSON.stringify(sessionUser));
    localStorage.setItem('sms_auth_role', assignedRole);
    setLoading(false);
    return { success: true, role: assignedRole, user: sessionUser };
  };

  const signup = async (userData) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('sms_auth_user');
    localStorage.removeItem('sms_auth_role');
  };

  const value = {
    user,
    role,
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

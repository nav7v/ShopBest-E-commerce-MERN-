import React, { createContext, useMemo, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    const normalizedUser = {
      ...userData,
      userType: userData.userType || userData.role || 'user',
      role: userData.role || userData.userType || 'user',
    };

    setUser(normalizedUser);
    localStorage.setItem('userInfo', JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


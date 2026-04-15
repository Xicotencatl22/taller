import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const DEFAULT_ROLES = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    color: '#8B5CF6',
    permissions: [
      'Dashboard',
      'Citas',
      'Vehículos',
      'Servicios',
      'Productos',
      'Ventas',
      'Compras',
      'Cotizaciones',
      'Reportes',
      'Usuarios',
      'Roles',
    ],
  },
  {
    id: 'tecnico',
    name: 'Técnico',
    description: 'Acceso a servicios y mantenimiento',
    color: '#60A5FA',
    permissions: ['Citas', 'Vehículos', 'Servicios'],
  },
  {
    id: 'cliente',
    name: 'Cliente',
    description: 'Acceso al portal de clientes',
    color: '#34D399',
    permissions: ['Cotizaciones', 'Reportes'],
  },
];

const DEFAULT_USERS = [
  {
    id: crypto.randomUUID(),
    name: 'Administrador',
    email: 'admin@admin.com',
    password: 'admin123',
    role: 'Administrador',
    phone: '',
  }
];

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [users, setUsersState] = useState(DEFAULT_USERS);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false };
  };

  const register = ({ name, email, password, role }) => {
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'El correo ya está registrado' };
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role,
      phone: '',
    };

    setUsersState([...users, newUser]);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const saveRole = (role) => {
    setRoles(prev => {
      const exists = prev.some((r) => r.id === role.id);
      return exists ? prev.map(r => (r.id === role.id ? role : r)) : [...prev, role];
    });
    return { success: true };
  };

  const deleteRole = (roleId) => {
    setRoles(prev => prev.filter((r) => r.id !== roleId));
    return { success: true };
  };

  const saveUser = (user) => {
    setUsersState(prev => {
      const exists = prev.some((u) => u.id === user.id);
      if (exists) {
        return prev.map((u) => (u.id === user.id ? user : u));
      }
      return [...prev, { ...user, id: crypto.randomUUID() }];
    });
    return { success: true };
  };

  const deleteUser = (userId) => {
    setUsersState(prev => prev.filter((u) => u.id !== userId));
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        currentUser,
        login,
        register,
        logout,
        roles,
        saveRole,
        deleteRole,
        users,
        saveUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

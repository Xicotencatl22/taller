<<<<<<< HEAD
﻿/* eslint-disable react-refresh/only-export-components */
=======
>>>>>>> 556a59881b9f12314f827fd66d2d8b6d6abfcb2c
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

<<<<<<< HEAD
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
=======
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
>>>>>>> 556a59881b9f12314f827fd66d2d8b6d6abfcb2c

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [roles, setRoles] = useState(DEFAULT_ROLES);
<<<<<<< HEAD
  const [users, setUsers] = useState([]);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/roles`);
      if (!response.ok) throw new Error('No se pudo cargar roles');
      const data = await response.json();
      setRoles(data);
    } catch {
      setRoles(DEFAULT_ROLES);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/users`);
      if (!response.ok) throw new Error('No se pudo cargar usuarios');
      const data = await response.json();
      setUsers(data);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    const savedCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (savedCurrentUser) {
      setCurrentUser(savedCurrentUser);
      setIsAuthenticated(true);
=======
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
>>>>>>> 556a59881b9f12314f827fd66d2d8b6d6abfcb2c
    }

    const initialize = async () => {
      await Promise.all([fetchRoles(), fetchUsers()]);
      setLoading(false);
    };

<<<<<<< HEAD
    initialize();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Credenciales inválidas' };
      }
      setCurrentUser(data);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(data));
      return { success: true, user: data };
    } catch {
      return { success: false, error: 'No fue posible iniciar sesión' };
    }
  };

  const register = async ({ name, email, password, phone }) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'No fue posible registrarse' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'No fue posible registrarse' };
    }
=======
    setUsersState([...users, newUser]);
    return { success: true };
>>>>>>> 556a59881b9f12314f827fd66d2d8b6d6abfcb2c
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

<<<<<<< HEAD
  const saveRole = async (role) => {
    try {
      const method = role.id ? 'PUT' : 'POST';
      const url = role.id ? `${API_BASE}/api/roles/${role.id}` : `${API_BASE}/api/roles`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          color: role.color,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'No se pudo guardar el rol' };
      }
      await fetchRoles();
      return { success: true, role: data };
    } catch {
      return { success: false, error: 'No se pudo guardar el rol' };
    }
  };

  const deleteRole = async (roleId) => {
    try {
      const response = await fetch(`${API_BASE}/api/roles/${roleId}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'No se pudo eliminar el rol' };
      }
      await fetchRoles();
      return { success: true };
    } catch {
      return { success: false, error: 'No se pudo eliminar el rol' };
    }
  };

  const saveUser = async (user) => {
    try {
      const method = user.id ? 'PUT' : 'POST';
      const url = user.id ? `${API_BASE}/api/users/${user.id}` : `${API_BASE}/api/users`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          phone: user.phone || '',
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'No se pudo guardar el usuario' };
      }
      await fetchUsers();
      return { success: true, user: data };
    } catch {
      return { success: false, error: 'No se pudo guardar el usuario' };
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/api/users/${userId}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        return { success: false, error: data.error || 'No se pudo eliminar el usuario' };
      }
      await fetchUsers();
      return { success: true };
    } catch {
      return { success: false, error: 'No se pudo eliminar el usuario' };
    }
=======
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
>>>>>>> 556a59881b9f12314f827fd66d2d8b6d6abfcb2c
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
        users,
        saveRole,
        deleteRole,
        users,
        saveUser,
        deleteUser,
        fetchUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

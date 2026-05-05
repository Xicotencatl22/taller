import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchDashboardStats } from '../utils/api';

const PERMISSIONS = ['Dashboard', 'Citas', 'Vehículos', 'Servicios', 'Productos', 'Ventas', 'Compras', 'Cotizaciones', 'Reportes', 'Usuarios', 'Roles'];

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roles, users, saveRole, deleteRole, saveUser, deleteUser, fetchUsers } = useContext(AuthContext);

  const [tab, setTab] = useState(location.state?.tab || 'dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    if (location.state?.tab) {
      setTab(location.state.tab);
    }
  }, [location.state?.tab]);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const [stats, setStats] = useState({
    inventoryValue: 0,
    totalSales: 0,
    pendingAppointments: 0,
    totalVehicles: 0,
    chartData: []
  });

  useEffect(() => {
    if (tab === 'dashboard') {
      fetchDashboardStats().then(setStats).catch(console.error);
    }
  }, [tab]);

  // User modal and search
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('Cliente');
  const [userError, setUserError] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [userEmailError, setUserEmailError] = useState('');
  const [userPhoneError, setUserPhoneError] = useState('');
  const [userPasswordError, setUserPasswordError] = useState('');

  // Role modal and filters
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleColor, setRoleColor] = useState('#A78BFA');
  const [rolePermissions, setRolePermissions] = useState([]);
  const [roleError, setRoleError] = useState('');
  const [roleNameError, setRoleNameError] = useState('');
  const [roleDescriptionError, setRoleDescriptionError] = useState('');

  const PERMISSIONS = ['Dashboard', 'Citas', 'Vehículos', 'Servicios', 'Productos', 'Ventas', 'Compras', 'Cotizaciones', 'Reportes', 'Usuarios', 'Roles'];

  useEffect(() => {
    if (fetchUsers) {
      fetchUsers();
    }
  }, [fetchUsers]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateUserNameField = () => {
    const message = userName.trim() ? '' : 'El nombre completo es obligatorio.';
    setUserNameError(message);
    return !message;
  };

  const validateUserEmailField = () => {
    const message = userEmail
      ? emailRegex.test(userEmail) && userEmail.length < 64
        ? ''
        : 'Email inválido o demasiado largo.'
      : 'El correo electrónico es obligatorio.';
    setUserEmailError(message);
    return !message;
  };

  const validateUserPhoneField = () => {
    const phoneRegex = /^\d{10}$/;
    const message = userPhone ? (phoneRegex.test(userPhone) ? '' : 'El teléfono debe contener exactamente 10 dígitos numéricos') : '';
    setUserPhoneError(message);
    return !message;
  };

  const validateUserPasswordField = () => {
    const message = userPassword
      ? userPassword.length > 6 && /\d/.test(userPassword)
        ? ''
        : 'Contraseña debe tener más de 6 caracteres e incluir números.'
      : editingUserId
        ? ''
        : 'La contraseña es obligatoria.';
    setUserPasswordError(message);
    return !message;
  };

  const validateRoleNameField = () => {
    const message = roleName.trim() ? '' : 'El nombre del rol es obligatorio.';
    setRoleNameError(message);
    return !message;
  };

  const validateRoleDescriptionField = () => {
    const message = roleDescription.trim() ? '' : 'La descripción del rol es obligatoria.';
    setRoleDescriptionError(message);
    return !message;
  };

  const isUserFormComplete = () => {
    return userName.trim() &&
           userEmail.trim() &&
           userPassword.trim() &&
           userRole &&
           !userNameError &&
           !userEmailError &&
           !userPhoneError &&
           !userPasswordError;
  };

  const counts = useMemo(() => {
    const totalUsers = users.length;
    const adminCount = users.filter((u) => u.role === 'Administrador').length;
    const tecnicoCount = users.filter((u) => u.role === 'Técnico').length;
    const clientCount = users.filter((u) => u.role === 'Cliente').length;
    return { totalUsers, adminCount, tecnicoCount, clientCount };
  }, [users]);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setUserError('');

    const isNameValid = validateUserNameField();
    const isEmailValid = validateUserEmailField();
    const isPhoneValid = validateUserPhoneField();
    const isPasswordValid = validateUserPasswordField();

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !userRole) {
      setUserError('Corrige los errores de usuario antes de continuar.');
      return;
    }

    const existingEmailUser = users.find(
      (u) => u.email?.toLowerCase() === userEmail.trim().toLowerCase() && u.id !== editingUserId
    );
    if (existingEmailUser) {
      setUserEmailError('Ya existe un usuario con ese correo.');
      setUserError('Corrige los errores de usuario antes de continuar.');
      return;
    }

    const existingNameUser = users.find(
      (u) => u.name?.toLowerCase() === userName.trim().toLowerCase() && u.id !== editingUserId
    );
    if (existingNameUser) {
      setUserNameError('Ya existe un usuario con ese nombre.');
      setUserError('Corrige los errores de usuario antes de continuar.');
      return;
    }

    if (editingUserId) {
      const updatedFields = {
        id: editingUserId,
        name: userName,
        email: userEmail,
        role: userRole,
        phone: userPhone,
      };
      if (userPassword) {
        updatedFields.password = userPassword;
      }
      const result = await saveUser(updatedFields);
      if (!result.success) {
        setUserError(result.error || 'No se pudo actualizar el usuario.');
        return;
      }
      setEditingUserId(null);
    } else {
      const result = await saveUser({ name: userName, email: userEmail, password: userPassword, role: userRole, phone: userPhone });
      if (!result.success) {
        setUserError(result.error || 'No se pudo crear usuario.');
        return;
      }
    }

    setUserModalOpen(false);
    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setUserPassword('');
    setUserRole('Cliente');
  };

  const openUserModal = (user = null) => {
    if (user) {
      setEditingUserId(user.id);
      setUserName(user.name);
      setUserEmail(user.email);
      setUserPhone(user.phone || '');
      setUserPassword('');
      setUserRole(user.role);
    } else {
      setEditingUserId(null);
      setUserName('');
      setUserEmail('');
      setUserPhone('');
      setUserPassword('');
      setUserRole('Cliente');
    }
    setUserError('');
    setUserNameError('');
    setUserEmailError('');
    setUserPhoneError('');
    setUserPasswordError('');
    setUserModalOpen(true);
  };

  const closeUserModal = () => {
    setUserModalOpen(false);
    setEditingUserId(null);
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setRoleError('');

    const isNameValid = validateRoleNameField();
    const isDescriptionValid = validateRoleDescriptionField();

    if (!isNameValid || !isDescriptionValid) {
      setRoleError('Corrige los errores del rol antes de continuar.');
      return;
    }

    const roleData = {
      name: roleName,
      description: roleDescription,
      color: roleColor,
      permissions: rolePermissions,
    };

    if (editingRoleId) {
      roleData.id = editingRoleId;
    }

    const result = await saveRole(roleData);
    if (!result.success) {
      setRoleError(result.error || 'No se pudo guardar el rol.');
      return;
    }
    setEditingRoleId(null);
    setRoleModalOpen(false);
    setRoleName('');
    setRoleDescription('');
    setRoleColor('#A78BFA');
    setRolePermissions([]);
  };

  const openRoleModal = (role = null) => {
    if (role) {
      setEditingRoleId(role.id);
      setRoleName(role.name);
      setRoleDescription(role.description);
      setRoleColor(role.color || '#A78BFA');
      setRolePermissions(role.permissions || []);
    } else {
      setEditingRoleId(null);
      setRoleName('');
      setRoleDescription('');
      setRoleColor('#A78BFA');
      setRolePermissions([]);
    }
    setRoleError('');
    setRoleNameError('');
    setRoleDescriptionError('');
    setRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setRoleModalOpen(false);
    setEditingRoleId(null);
  };

  const onRoleCheckbox = (perm) => {
    setRolePermissions((prev) => (prev.includes(perm) ? prev.filter((r) => r !== perm) : [...prev, perm]));
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      const result = await deleteUser(id);
      if (!result.success) {
        alert(result.error || 'No se pudo eliminar el usuario.');
      }
    }
  };

  const handleDeleteRole = (id) => {
    if (window.confirm('¿Eliminar este rol?')) {
      deleteRole(id);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(u => {
    if (!u) return false;
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const role = (u.role || '').toLowerCase();
    const search = (userSearch || '').toLowerCase();
    return name.includes(search) || email.includes(search) || role.includes(search);
  });

  // Count stats for roles
  const roleStats = useMemo(() => {
    const totalRoles = roles.length;
    const adminRoles = roles.filter(r => r.permissions?.includes('Usuarios')).length;
    const usersWithRoles = users.filter(u => roles.some(r => r.name === u.role)).length;
    const totalPermissions = PERMISSIONS.length;
    return { totalRoles, adminRoles, usersWithRoles, totalPermissions };
  }, [roles, users, PERMISSIONS.length]);

  return (
    <div className="flex h-screen bg-gray-50 text-left overflow-hidden">

      {/* Sidebar */}
      {isSidebarVisible && (
        <aside className="w-64 bg-[#1e3a8a] text-white flex flex-col h-full shrink-0">
          <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            {/* Logo de carro (placeholder simple) */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677h3.351a.75.75 0 01.696.471z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">San Jorge</h1>
            <p className="text-[10px] text-blue-200 uppercase tracking-widest">Panel Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {/* Active Item */}
          <button onClick={() => setTab('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${tab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Dashboard
          </button>

          {/* Other Items */}
          {[
            { icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5', label: 'Citas', id: 'citas' },
            { icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677h3.351a.75.75 0 01.696.471z', label: 'Vehículos', id: 'vehiculos' },
            { icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75', label: 'Servicios', id: 'servicios' },
            { icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9', label: 'Productos', id: 'productos' },
            { icon: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z', label: 'Ventas', id: 'ventas' },
            { icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z', label: 'Compras', id: 'compras' },
            { icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', label: 'Cotizaciones', id: 'cotizaciones' },
            { icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', label: 'Reportes', id: 'reportes' },
            { icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', label: 'Usuarios', id: 'usuarios' },
            { icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', label: 'Roles', id: 'roles' },
          ].map((item, i) => (
            <button key={i} onClick={() => {
              if (['citas', 'productos', 'compras', 'cotizaciones', 'reportes', 'vehiculos', 'servicios', 'ventas'].includes(item.id)) {
                navigate(`/admin/${item.id}`);
              } else {
                setTab(item.id);
              }
            }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${tab === item.id ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-70">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-200 hover:bg-red-800/50 hover:text-white font-medium text-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">

        {/* Top Navbar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <button onClick={toggleSidebar} className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="text-sm text-gray-500 font-medium">
            domingo, 22 de marzo de 2026
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {tab === 'dashboard' && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h2>
                <p className="text-gray-500 text-sm">Análisis general del negocio</p>
              </div>

              {/* Tarjetas Superiores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Valor Inventario</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">${Number(stats.inventoryValue).toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Total en productos</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Ventas</span>
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">${Number(stats.totalSales).toLocaleString()}</div>
                  <div className="text-xs font-medium text-green-500">Total histórico registrado</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Citas Pendientes</span>
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingAppointments}</div>
                  <div className="text-xs text-gray-400">Por atender</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vehículos</span>
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677h3.351a.75.75 0 01.696.471z" /></svg>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalVehicles}</div>
                  <div className="text-xs text-gray-400">Registrados en total</div>
                </div>

              </div>

              <div className="flex flex-col lg:flex-row gap-6">

                {/* Gráfica */}
                <div className="flex-[2] bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Ventas por Mes (últimos 6 meses)</h3>
                  <div className="flex gap-2 mb-8">
                    <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium">Ventas</button>
                    <button className="text-gray-500 hover:bg-gray-50 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">Inventario</button>
                    <button className="text-gray-500 hover:bg-gray-50 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">Servicios</button>
                  </div>

                  {/* Fake Chart */}
                  <div className="h-64 flex items-end justify-between px-2 gap-4 relative">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-400 font-medium">
                      <span>800</span>
                      <span>600</span>
                      <span>400</span>
                      <span>200</span>
                      <span>0</span>
                    </div>
                    {/* Horizontal lines */}
                    <div className="absolute left-10 right-0 top-0 bottom-6 flex flex-col justify-between">
                      <div className="border-b border-gray-100 border-dashed w-full h-[1px]"></div>
                      <div className="border-b border-gray-100 border-dashed w-full h-[1px]"></div>
                      <div className="border-b border-gray-100 border-dashed w-full h-[1px]"></div>
                      <div className="border-b border-gray-100 border-dashed w-full h-[1px]"></div>
                      <div className="border-b border-gray-200 w-full h-[1px]"></div>
                    </div>

                    {/* Bars */}
                    <div className="ml-10 flex-1 flex items-end justify-between px-2 z-10 gap-2">
                      {stats.chartData.map((d, i) => (
                        <div key={i} className="w-full flex-col flex items-center gap-2">
                          <div 
                            className="w-full bg-[#3B82F6] rounded-t-lg transition-all duration-500" 
                            style={{ height: `${Math.min(90, (d.total / 2000) * 100)}%` }}
                          ></div>
                          <span className="text-xs text-gray-500 font-medium">{d.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resumen rápido */}
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Resumen rápido</h3>
                  <div className="flex flex-col gap-4">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-50">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{stats.pendingAppointments}</div>
                      <div className="text-xs font-medium text-gray-600">Citas pendientes</div>
                    </div>
                    <div className="bg-green-50/50 p-4 rounded-xl border border-green-50">
                      <div className="text-2xl font-bold text-green-600 mb-1">{stats.totalSales ? Math.round(stats.totalSales / 500) : 0}</div>
                      <div className="text-xs font-medium text-gray-600">Servicios realizados</div>
                    </div>
                    <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-50">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.totalVehicles}</div>
                      <div className="text-xs font-medium text-gray-600">Vehículos registrados</div>
                    </div>
                    <div className="bg-fuchsia-50/50 p-4 rounded-xl border border-fuchsia-50">
                      <div className="text-2xl font-bold text-fuchsia-600 mb-1">{stats.pendingAppointments}</div>
                      <div className="text-xs font-medium text-gray-600">Citas por atender</div>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {tab === 'usuarios' && (
            <div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">Gestión de Usuarios</h2>
                  <p className="text-gray-500 text-sm">Administra los usuarios y sus roles en el sistema</p>
                </div>
                <button onClick={() => openUserModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">+ Registrar Usuario</button>
              </div>

              {/* User Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900">{counts.totalUsers}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">Total usuarios</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-purple-600">{counts.adminCount}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">Administradores</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{counts.tecnicoCount}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">Técnicos</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-green-600">{counts.clientCount}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">Clientes</div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6 flex gap-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="flex-1 border border-gray-200 p-2.5 rounded-lg text-sm"
                />
                <select className="border border-gray-200 p-2.5 rounded-lg text-sm min-w-[150px]">
                  <option>Todos los roles</option>
                  {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>

              {/* Users Table */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Usuarios registrados</h3>
                {filteredUsers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay usuarios.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-gray-200">
                        <tr>
                          <th className="p-3 font-bold text-gray-700">NOMBRE</th>
                          <th className="p-3 font-bold text-gray-700">EMAIL</th>
                          <th className="p-3 font-bold text-gray-700">ROL</th>
                          <th className="p-3 font-bold text-gray-700">TELÉFONO</th>
                          <th className="p-3 font-bold text-gray-700">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3">{u.name}</td>
                            <td className="p-3">{u.email}</td>
                            <td className="p-3">
                              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">{u.role}</span>
                            </td>
                            <td className="p-3">{u.phone || '-'}</td>
                            <td className="p-3 flex gap-2">
                              <button onClick={() => openUserModal(u)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                              <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* User Modal */}
              {userModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">{editingUserId ? 'Editar usuario' : 'Registrar nuevo usuario'}</h3>
                      <button onClick={closeUserModal} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => {
                            setUserName(e.target.value);
                            if (userNameError) setUserNameError('');
                          }}
                          onBlur={validateUserNameField}
                          placeholder="Juan Pérez García"
                          className={`w-full p-2.5 rounded-lg text-sm ${userNameError ? 'border-red-500 border' : 'border border-gray-300'}`}
                        />
                        {userNameError && <p className="mt-2 text-sm text-red-600">{userNameError}</p>}
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                          Correo electrónico *
                        </label>
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => {
                            setUserEmail(e.target.value);
                            if (userEmailError) setUserEmailError('');
                          }}
                          onBlur={validateUserEmailField}
                          placeholder="juan@email.com"
                          className={`w-full p-2.5 rounded-lg text-sm ${userEmailError ? 'border-red-500 border' : 'border border-gray-300'}`}
                        />
                        {userEmailError && <p className="mt-2 text-sm text-red-600">{userEmailError}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Teléfono (opcional)</label>
                        <input
                          type="tel"
                          value={userPhone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setUserPhone(value);
                            if (userPhoneError) setUserPhoneError('');
                          }}
                          onBlur={validateUserPhoneField}
                          placeholder="8841397918"
                          maxLength={10}
                          className={`w-full p-2.5 rounded-lg text-sm ${userPhoneError ? 'border-red-500 border' : 'border border-gray-300'}`}
                        />
                        {userPhoneError && <p className="mt-2 text-sm text-red-600">{userPhoneError}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Contraseña *</label>
                        <input
                          type="password"
                          value={userPassword}
                          onChange={(e) => {
                            setUserPassword(e.target.value);
                            if (userPasswordError) setUserPasswordError('');
                          }}
                          onBlur={validateUserPasswordField}
                          placeholder="Mín. 6 caracteres con números"
                          className={`w-full p-2.5 rounded-lg text-sm ${userPasswordError ? 'border-red-500 border' : 'border border-gray-300'}`}
                        />
                        {userPasswordError && <p className="mt-2 text-sm text-red-600">{userPasswordError}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Seleccionar rol *</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {roles.map((r) => (
                            <label key={r.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                              <input type="radio" name="role" value={r.name} checked={userRole === r.name} onChange={(e) => setUserRole(e.target.value)} />
                              <span className="font-medium">{r.name}</span>
                              <span className="text-xs text-gray-500">{r.description}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {userError && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{userError}</p>}
                      <div className="flex gap-3 pt-4">
                        <button type="button" onClick={closeUserModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancelar</button>
                        <button
                          type="submit"
                          disabled={!isUserFormComplete()}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium ${isUserFormComplete() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                          {editingUserId ? 'Guardar cambios' : 'Registrar'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'roles' && (
            <div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">Gestión de Roles</h2>
                  <p className="text-gray-500 text-sm">Administra los roles y permisos del sistema</p>
                </div>
                <button onClick={() => openRoleModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">+ Crear nuevo rol</button>
              </div>

              {/* Role Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900">{roleStats.totalRoles}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">Total de roles</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-purple-600">{roleStats.adminRoles}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">Roles con acceso admin</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{roleStats.usersWithRoles}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">Usuarios asignados</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-green-600">{roleStats.totalPermissions}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">Permisos disponibles</div>
                </div>
              </div>

              {/* Roles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <div key={role.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100" style={{ backgroundColor: role.color ? role.color + '10' : undefined }}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: role.color || '#8B5CF6' }}>
                          {role.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{role.name}</h4>
                          <p className="text-xs text-gray-500">{role.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openRoleModal(role)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                        <button onClick={() => handleDeleteRole(role.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs font-bold text-gray-700 mb-2">Permisos asignados</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions && role.permissions.length > 0 ? (
                          role.permissions.map((perm) => (
                            <span key={perm} className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">✓ {perm}</span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 italic">Sin permisos asignados</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Role Modal */}
              {roleModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">{editingRoleId ? 'Editar rol' : 'Crear nuevo rol'}</h3>
                      <button onClick={closeRoleModal} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <form onSubmit={handleRoleSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Nombre del rol *</label>
                        <input
                          type="text"
                          value={roleName}
                          onChange={(e) => {
                            setRoleName(e.target.value);
                            if (roleNameError) setRoleNameError('');
                          }}
                          onBlur={validateRoleNameField}
                          placeholder="Ej: Gerente, Vendedor..."
                          className={`w-full p-2.5 rounded-lg text-sm ${roleNameError ? 'border-red-500 border' : 'border border-gray-300'}`}
                        />
                        {roleNameError && <p className="mt-2 text-sm text-red-600">{roleNameError}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Descripción *</label>
                        <textarea
                          value={roleDescription}
                          onChange={(e) => {
                            setRoleDescription(e.target.value);
                            if (roleDescriptionError) setRoleDescriptionError('');
                          }}
                          onBlur={validateRoleDescriptionField}
                          placeholder="Breve descripción del rol..."
                          className={`w-full p-2.5 rounded-lg text-sm ${roleDescriptionError ? 'border-red-500 border' : 'border border-gray-300'}`}
                          rows="2"
                        ></textarea>
                        {roleDescriptionError && <p className="mt-2 text-sm text-red-600">{roleDescriptionError}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Color</label>
                        <div className="flex gap-2">
                          {['#A78BFA', '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#FB923C'].map((c) => (
                            <button key={c} type="button" onClick={() => setRoleColor(c)} className={`w-8 h-8 rounded-lg border-2 ${roleColor === c ? 'border-gray-900' : 'border-gray-300'}`} style={{ backgroundColor: c }}></button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-3">Permisos</label>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {PERMISSIONS.map((perm) => (
                              <label key={perm} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={rolePermissions.includes(perm)} onChange={() => onRoleCheckbox(perm)} className="w-4 h-4 rounded" />
                                <span className="text-sm text-gray-700">■ {perm}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      {roleError && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{roleError}</p>}
                      <div className="flex gap-3 pt-4">
                        <button type="button" onClick={closeRoleModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancelar</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">{editingRoleId ? 'Guardar cambios' : 'Crear rol'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

export default AdminDashboard;

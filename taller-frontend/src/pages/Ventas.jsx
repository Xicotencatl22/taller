import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { fetchVentas, createVenta, fetchProductos, fetchUsers } from '../utils/api';

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const [nuevaVenta, setNuevaVenta] = useState({
    idUsuarios: '',
    idProductos: '',
    metodo_pago: '1', // 1: Efectivo, 2: Tarjeta, 3: Transferencia
    total: 0
  });

  const loadData = async () => {
    try {
      const [v, p, u] = await Promise.all([
        fetchVentas(),
        fetchProductos(),
        fetchUsers()
      ]);
      setVentas(v || []);
      setProductos(p || []);
      setUsuarios(u || []);
    } catch (err) {
      console.error('Error cargando ventas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalMensual = ventas.reduce((acc, v) => acc + Number(v.total), 0);
  const ventasHoy = ventas.filter(v => {
    const hoy = new Date().toLocaleDateString();
    const fechaVenta = new Date(v.fecha).toLocaleDateString();
    return hoy === fechaVenta;
  }).length;

  const ventasFiltradas = ventas.filter(v => 
    (v.cliente || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (v.producto_nombre || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      // Buscar el precio del producto seleccionado
      const prod = productos.find(p => p.idproductos === Number(nuevaVenta.idProductos));
      const payload = {
        ...nuevaVenta,
        idUsuarios: Number(nuevaVenta.idUsuarios),
        idProductos: Number(nuevaVenta.idProductos),
        metodo_pago: Number(nuevaVenta.metodo_pago),
        total: prod ? prod.precio_venta : 0
      };

      await createVenta(payload);
      await loadData();
      setShowModal(false);
      setNuevaVenta({ idUsuarios: '', idProductos: '', metodo_pago: '1', total: 0 });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const formatFecha = (f) => {
    if (!f) return '';
    return new Date(f).toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMetodoPago = (id) => {
    const metodos = { 1: 'Efectivo', 2: 'Tarjeta', 3: 'Transferencia' };
    return metodos[id] || 'Otro';
  };

  return (
    <AdminLayout activeTab="ventas">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 text-left">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Registro de Ventas</h2>
            <p className="text-gray-500 text-sm">Control de transacciones y productos vendidos</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#1a56db] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
          >
            <span className="text-xl leading-none">+</span> Nueva Venta
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-semibold text-gray-500 mb-1">Total Ventas (Mes)</p>
            <h3 className="text-2xl font-bold text-gray-900">${totalMensual.toLocaleString()}</h3>
            <span className="text-xs text-green-500 font-medium">+12.5% vs mes anterior</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-semibold text-gray-500 mb-1">Ventas Hoy</p>
            <h3 className="text-2xl font-bold text-gray-900">{ventasHoy}</h3>
            <span className="text-xs text-blue-500 font-medium">Transacciones registradas</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm font-semibold text-gray-500 mb-1">Ticket Promedio</p>
            <h3 className="text-2xl font-bold text-gray-900">
              ${ventas.length ? (totalMensual / ventas.length).toLocaleString() : 0}
            </h3>
            <span className="text-xs text-gray-400 font-medium">Basado en total histórico</span>
          </div>
        </div>

        {/* Filters and Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-left">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative w-full max-w-md">
              <input 
                type="text" 
                placeholder="Buscar por cliente o producto..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Método</th>
                  <th className="px-6 py-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Cargando ventas...</td></tr>
                ) : ventasFiltradas.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No hay ventas registradas.</td></tr>
                ) : (
                  ventasFiltradas.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{v.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{v.cliente}</div>
                        <div className="text-xs text-gray-500">{v.cliente_correo}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{v.producto_nombre}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatFecha(v.fecha)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          v.metodo_pago === 1 ? 'bg-green-50 text-green-600' : 
                          v.metodo_pago === 2 ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {getMetodoPago(v.metodo_pago)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">${v.total.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Nueva Venta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden text-left">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Registrar Venta</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={manejarEnvio} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cliente</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={nuevaVenta.idUsuarios}
                  onChange={e => setNuevaVenta({...nuevaVenta, idUsuarios: e.target.value})}
                >
                  <option value="">Seleccionar cliente</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Producto / Refacción</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={nuevaVenta.idProductos}
                  onChange={e => setNuevaVenta({...nuevaVenta, idProductos: e.target.value})}
                >
                  <option value="">Seleccionar producto</option>
                  {productos.map(p => (
                    <option key={p.idproductos} value={p.idproductos}>{p.nombre} (${p.precio_venta})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Método de Pago</label>
                <select 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={nuevaVenta.metodo_pago}
                  onChange={e => setNuevaVenta({...nuevaVenta, metodo_pago: e.target.value})}
                >
                  <option value="1">Efectivo</option>
                  <option value="2">Tarjeta de Crédito/Débito</option>
                  <option value="3">Transferencia Bancaria</option>
                </select>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl mt-4">
                <div className="flex justify-between items-center text-blue-900 font-bold">
                  <span>Total a cobrar</span>
                  <span className="text-xl">
                    ${productos.find(p => p.idproductos === Number(nuevaVenta.idProductos))?.precio_venta || 0}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#1a56db] hover:bg-blue-800 rounded-lg transition"
                >
                  Confirmar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
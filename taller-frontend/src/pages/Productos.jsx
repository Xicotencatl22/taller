import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { fetchProductos, createProducto, updateProducto, deleteProducto } from '../utils/api';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevo, setNuevo] = useState({
    id: null,
    nombre: '',
    categoria: '',
    precio_venta: '',
    precio_unitario: '',
    stock_minimo: '',
    stock_actual: 0,
    sku: '',
    ubicacion_almacen: '',
  });
  const [editando, setEditando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [soloBajoStock, setSoloBajoStock] = useState(false);

  const loadProductos = async () => {
    try {
      const data = await fetchProductos();
      setProductos(data || []);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const resetForm = () => setNuevo({
    id: null, nombre: '', categoria: '', precio_venta: '', precio_unitario: '',
    stock_minimo: '', stock_actual: 0, sku: '', ubicacion_almacen: '',
  });

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: nuevo.nombre,
        categoria: nuevo.categoria,
        precio_venta: Number(nuevo.precio_venta) || 0,
        precio_unitario: Number(nuevo.precio_unitario) || 0,
        stock_minimo: Number(nuevo.stock_minimo) || 0,
        stock_actual: editando ? Number(nuevo.stock_actual) || 0 : 0,
        sku: nuevo.sku || '',
        ubicacion_almacen: nuevo.ubicacion_almacen || '',
      };

      if (editando) {
        await updateProducto(nuevo.id, payload);
      } else {
        await createProducto(payload);
      }
      await loadProductos();
      setShowModal(false);
      resetForm();
      setEditando(false);
    } catch (err) {
      alert(`Error al guardar el producto: ${err.message}`);
    }
  };

  const prepararEdicion = (p) => {
    setNuevo({
      id: p.idproductos,
      nombre: p.nombre || '',
      categoria: p.categoria || '',
      precio_venta: p.precio_venta || '',
      precio_unitario: p.precio_unitario || '',
      stock_minimo: p.stock_minimo || '',
      stock_actual: p.stock_actual || 0,
      sku: p.sku || '',
      ubicacion_almacen: p.ubicacion_almacen || '',
    });
    setEditando(true);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;
    try {
      await deleteProducto(id);
      await loadProductos();
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  const handleAjustarStock = async (p) => {
    const newStock = window.prompt(`Ingresa el nuevo stock para ${p.nombre}:`, p.stock_actual);
    if (newStock !== null && !isNaN(newStock) && newStock.trim() !== '') {
      try {
        await updateProducto(p.idproductos, { ...p, stock_actual: Number(newStock) });
        await loadProductos();
      } catch (err) {
        alert(`Error al ajustar stock: ${err.message}`);
      }
    }
  };

  // Stats calculadas desde datos reales
  const totalStock = productos.reduce((acc, p) => acc + Number(p.stock_actual || 0), 0);
  const totalValue = productos.reduce((acc, p) => acc + (Number(p.stock_actual || 0) * Number(p.precio_venta || 0)), 0);
  const lowStockCount = productos.filter(p => Number(p.stock_actual || 0) < Number(p.stock_minimo || 0)).length;

  // Categorías únicas del backend
  const categoriasUnicas = [...new Set(productos.map(p => p.categoria).filter(Boolean))];
  const categoriasBotones = ['Todas', ...categoriasUnicas];

  const productosFiltrados = productos
    .filter(p => categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro)
    .filter(p => !soloBajoStock || Number(p.stock_actual || 0) < Number(p.stock_minimo || 0));

  return (
    <AdminLayout activeTab="productos">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Gestión de Productos</h2>
            <p className="text-gray-500 text-sm">Administra el inventario y control de stock</p>
          </div>
          <button
            type="button"
            onClick={() => { resetForm(); setEditando(false); setShowModal(true); }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + Agregar producto
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
            <span className="text-3xl font-medium text-blue-600">{productos.length}</span>
            <span className="text-xs text-gray-500 mt-1">Productos en catálogo</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
            <span className="text-3xl font-medium text-blue-600">{totalStock}</span>
            <span className="text-xs text-gray-500 mt-1">Unidades en stock</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-medium ${lowStockCount > 0 ? 'text-orange-600' : 'text-gray-900'}`}>{lowStockCount}</span>
              {lowStockCount > 0 && <span className="text-orange-500 text-sm font-bold">⚠️</span>}
            </div>
            <span className="text-xs text-gray-500 mt-1">Productos con bajo stock</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
            <span className="text-3xl font-medium text-blue-600">${totalValue.toLocaleString()}</span>
            <span className="text-xs text-gray-500 mt-1">Valor del inventario</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {categoriasBotones.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${categoriaFiltro === cat ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {cat === 'Todas' ? 'Todas las categorías' : cat}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 pr-4 text-sm text-gray-600 cursor-pointer whitespace-nowrap ml-4">
            <input type="checkbox" className="rounded" checked={soloBajoStock} onChange={(e) => setSoloBajoStock(e.target.checked)} />
            Solo mostrar bajo stock
          </label>
        </div>

        {/* Product Cards */}
        {loading ? (
          <div className="text-center text-gray-500 py-12">Cargando productos...</div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No hay productos registrados.</div>
        ) : (
          <div className="space-y-4">
            {productosFiltrados.map(p => {
              const stockActual = Number(p.stock_actual || 0);
              const stockMinimo = Number(p.stock_minimo || 0);
              const stockRatio = stockMinimo > 0 ? (stockActual / stockMinimo) * 100 : 100;
              const barWidth = Math.min(stockRatio, 100);
              const barColor = stockRatio < 100 ? 'bg-red-500' : 'bg-green-500';

              return (
                <div key={p.idproductos} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative">
                  {/* Acciones */}
                  <div className="absolute right-6 top-6 flex gap-1">
                    <button onClick={() => prepararEdicion(p)} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button onClick={() => handleEliminar(p.idproductos)} className="text-red-400 hover:text-red-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">📦</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{p.nombre}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        {p.categoria && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{p.categoria}</span>}
                        {p.sku && <span className="text-xs text-gray-500">SKU: {p.sku}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div>
                      <div className="text-[11px] text-gray-500 mb-1 font-medium">Stock actual</div>
                      <div className="text-2xl font-medium text-gray-900 leading-none">{stockActual}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-500 mb-1 font-medium">Stock mínimo</div>
                      <div className="text-sm text-gray-900 mt-1">{stockMinimo}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-500 mb-1 font-medium">Precio venta</div>
                      <div className="text-sm text-blue-600 font-bold mt-1">${p.precio_venta || 0}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-500 mb-1 font-medium">Precio unitario</div>
                      <div className="text-sm text-gray-900 mt-1">${p.precio_unitario || 0}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-500 mb-1 font-medium">Ubicación</div>
                      <div className="text-sm text-gray-900 mt-1">{p.ubicacion_almacen || '—'}</div>
                    </div>
                  </div>

                  <div className="mb-6 mx-1">
                    <div className="flex justify-between text-[11px] text-gray-500 mb-2 font-medium">
                      <span>Nivel de stock</span>
                      <span>{Math.round(stockRatio)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor}`} style={{ width: `${barWidth}%` }}></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm mt-2">
                    <div className="text-gray-500 w-full md:w-auto">
                      Valor en inventario: <strong className="text-gray-900 ml-1">${(stockActual * Number(p.precio_venta || 0)).toLocaleString()}</strong>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto justify-end">
                      <button
                        onClick={() => handleAjustarStock(p)}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-blue-700 w-full md:w-auto text-center"
                      >
                        Ajustar stock
                      </button>
                      <button className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-1.5 rounded-lg font-medium hover:bg-gray-100 w-full md:w-auto text-center">
                        Ver movimientos
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{editando ? 'Editar producto' : 'Agregar nuevo producto'}</h2>
              </div>
              <button type="button" onClick={() => { setShowModal(false); resetForm(); setEditando(false); }} className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6">
              <form id="productForm" onSubmit={manejarEnvio} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del producto <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required
                    value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} placeholder="Aceite sintético 5W-30" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Categoría <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required
                      value={nuevo.categoria} onChange={e => setNuevo({ ...nuevo, categoria: e.target.value })} placeholder="Lubricantes, Filtros..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">SKU <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required
                      value={nuevo.sku} onChange={e => setNuevo({ ...nuevo, sku: e.target.value })} placeholder="ACE-5W30-001" />
                  </div>
                </div>

                {editando && (
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock actual <span className="text-red-500">*</span></label>
                      <input type="number" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required
                        value={nuevo.stock_actual} onChange={e => setNuevo({ ...nuevo, stock_actual: e.target.value })} placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock mínimo</label>
                      <input type="number" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={nuevo.stock_minimo} onChange={e => setNuevo({ ...nuevo, stock_minimo: e.target.value })} placeholder="10" />
                    </div>
                  </div>
                )}
                {!editando && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock mínimo</label>
                    <input type="number" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={nuevo.stock_minimo} onChange={e => setNuevo({ ...nuevo, stock_minimo: e.target.value })} placeholder="10" />
                    <p className="text-xs text-gray-500 mt-2">El stock inicial se asigna en 0 automáticamente.</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Precio de venta (MXN) <span className="text-red-500">*</span></label>
                    <input type="number" step="0.01" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required
                      value={nuevo.precio_venta} onChange={e => setNuevo({ ...nuevo, precio_venta: e.target.value })} placeholder="250.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Precio unitario / costo (MXN)</label>
                    <input type="number" step="0.01" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={nuevo.precio_unitario} onChange={e => setNuevo({ ...nuevo, precio_unitario: e.target.value })} placeholder="180.00" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ubicación en almacén</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={nuevo.ubicacion_almacen} onChange={e => setNuevo({ ...nuevo, ubicacion_almacen: e.target.value })} placeholder="Estante A-3" />
                </div>
              </form>

              <div className="pt-6 mt-4 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); setEditando(false); }} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                  Cancelar
                </button>
                <button type="submit" form="productForm" className="px-6 py-2.5 text-sm font-bold text-white bg-[#1a56db] hover:bg-blue-800 rounded-lg transition-colors">
                  {editando ? 'Guardar cambios' : 'Agregar producto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
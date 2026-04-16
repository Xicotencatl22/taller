import React, { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';

export default function Productos() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Aceite Sintético 5W30", categoria: "Lubricantes", precio: 250, stock: 24, sku: "ACE-5W30-001", minStock: 10, costo: 180, proovedor: "Distribuidora ABC", ubicacion: "Estante A-3" },
    { id: 2, nombre: "Filtro de Aceite Universal", categoria: "Filtros", precio: 120, stock: 45, sku: "FIL-ACE-002", minStock: 15, costo: 85, proovedor: "Refacciones XYZ", ubicacion: "Estante B-1" },
    { id: 3, nombre: "Balatas Delanteras Mazda 3", categoria: "Frenos", precio: 850, stock: 4, sku: "BAL-FRE-003", minStock: 10, costo: 600, proovedor: "AutoPartes del Norte", ubicacion: "Estante C-2" }
  ]);

  const [nuevo, setNuevo] = useState({ id: null, nombre: '', categoria: '', precio: '', stock: 0, sku: '', minStock: '', costo: '', ubicacion: '' });
  const [editando, setEditando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [soloBajoStock, setSoloBajoStock] = useState(false);

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (editando) {
      setProductos(productos.map(p => p.id === nuevo.id ? nuevo : p));
      setEditando(false);
    } else {
      setProductos([...productos, {
        ...nuevo,
        id: Date.now(),
        stock: 0,
        sku: nuevo.sku || 'NVO-000',
        minStock: nuevo.minStock || 10,
        costo: nuevo.costo || nuevo.precio * 0.7,
        proovedor: 'Genérico',
        ubicacion: nuevo.ubicacion || 'Pendiente'
      }]);
    }
    setNuevo({ id: null, nombre: '', categoria: '', precio: '', stock: 0, sku: '', minStock: '', costo: '', ubicacion: '' });
    setShowModal(false);
  };

  const prepararEdicion = (p) => {
    setNuevo(p);
    setEditando(true);
    setShowModal(true);
  };

  const totalStock = productos.reduce((acc, p) => acc + Number(p.stock), 0);
  const totalValue = productos.reduce((acc, p) => acc + (Number(p.stock) * Number(p.precio)), 0);
  const lowStockCount = productos.filter(p => p.stock < p.minStock).length;

  return (
    <AdminLayout activeTab="productos">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Gestión de Productos</h2>
            <p className="text-gray-500 text-sm">Administra el inventario y control de stock</p>
          </div>
          <button type="button" onClick={() => { setShowModal(true); setEditando(false); setNuevo({ id: null, nombre: '', categoria: '', precio: '', stock: 0, sku: '', minStock: '', costo: '', ubicacion: '' }); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
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
            {['Todas', 'Lubricantes', 'Filtros', 'Frenos', 'Encendido', 'Líquidos', 'Autopartes'].map(cat => (
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
        <div className="space-y-4">
          {productos
            .filter(p => categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro)
            .filter(p => !soloBajoStock || p.stock < p.minStock)
            .map(p => {
            const stockRatio = (p.stock / p.minStock) * 100;
            const barWidth = Math.min(stockRatio, 100);
            const barColor = stockRatio < 100 ? 'bg-red-500' : 'bg-green-500';

            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative">
                <button onClick={() => prepararEdicion(p)} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </button>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                    📦
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{p.nombre}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{p.categoria}</span>
                      <span className="text-xs text-gray-500">SKU: {p.sku}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                  <div>
                    <div className="text-[11px] text-gray-500 mb-1 font-medium text-left">Stock actual</div>
                    <div className="text-2xl font-medium text-gray-900 leading-none">{p.stock}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 mb-1 font-medium text-left">Stock mínimo</div>
                    <div className="text-sm text-gray-900 mt-1">{p.minStock}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 mb-1 font-medium text-left">Costo unitario</div>
                    <div className="text-sm text-gray-900 mt-1">${p.costo}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 mb-1 font-medium text-left">Precio venta</div>
                    <div className="text-sm text-blue-600 font-bold mt-1">${p.precio}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 mb-1 font-medium text-left">Proveedor</div>
                    <div className="text-sm text-gray-900 mt-1">{p.proovedor}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 mb-1 font-medium text-left">Ubicación</div>
                    <div className="text-sm text-gray-900 mt-1">{p.ubicacion}</div>
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
                    Valor en inventario: <strong className="text-gray-900 ml-1">${(p.stock * p.precio).toLocaleString()}</strong>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button onClick={() => {
                      const newStock = window.prompt(`Ingresa el nuevo stock para ${p.nombre}:`, p.stock);
                      if (newStock !== null && !isNaN(newStock) && newStock.trim() !== '') {
                        setProductos(productos.map(prod => prod.id === p.id ? { ...prod, stock: Number(newStock) } : prod));
                      }
                    }} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-blue-700 w-full md:w-auto text-center">Ajustar stock</button>
                    <button className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-1.5 rounded-lg font-medium hover:bg-gray-100 w-full md:w-auto text-center">Ver movimientos</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6">
              <form id="productForm" onSubmit={manejarEnvio} className="space-y-5">
                {/* Row 1 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del producto <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required
                    value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} placeholder="Aceite sintético 5W-30" />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Categoría <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium" required
                      value={nuevo.categoria} onChange={e => setNuevo({ ...nuevo, categoria: e.target.value })}>
                      <option value="">Seleccionar categoría</option>
                      <option value="Lubricantes">Lubricantes</option>
                      <option value="Filtros">Filtros</option>
                      <option value="Frenos">Frenos</option>
                      <option value="Encendido">Encendido</option>
                      <option value="Líquidos">Líquidos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">SKU <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required
                      value={nuevo.sku} onChange={e => setNuevo({ ...nuevo, sku: e.target.value })} placeholder="ACE-5W30-001" />
                  </div>
                </div>

                {/* Row 3 */}
                {editando && (
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock <span className="text-red-500">*</span></label>
                      <input type="number" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required
                        value={nuevo.stock} onChange={e => setNuevo({ ...nuevo, stock: e.target.value })} placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock mínimo <span className="text-red-500">*</span></label>
                      <input type="number" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required
                        value={nuevo.minStock} onChange={e => setNuevo({ ...nuevo, minStock: e.target.value })} placeholder="10" />
                    </div>
                  </div>
                )}
                {!editando && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock mínimo <span className="text-red-500">*</span></label>
                    <input type="number" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required
                      value={nuevo.minStock} onChange={e => setNuevo({ ...nuevo, minStock: e.target.value })} placeholder="10" />
                  </div>
                )}

                {/* Row 4 */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Costo unitario (MXN) <span className="text-red-500">*</span></label>
                    <input type="number" step="0.01" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required
                      value={nuevo.costo} onChange={e => setNuevo({ ...nuevo, costo: e.target.value })} placeholder="180.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Precio de venta (MXN) <span className="text-red-500">*</span></label>
                    <input type="number" step="0.01" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required
                      value={nuevo.precio} onChange={e => setNuevo({ ...nuevo, precio: e.target.value })} placeholder="250.00" />
                  </div>
                </div>

                {/* Row 5 */}
                <div className="pb-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ubicación en almacén <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required
                    value={nuevo.ubicacion} onChange={e => setNuevo({ ...nuevo, ubicacion: e.target.value })} placeholder="Estante A-3" />
                </div>
              </form>

              {/* Footer integrated inside the body padding */}
              <div className="pt-6 mt-4 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
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
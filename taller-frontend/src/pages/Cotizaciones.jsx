import React, { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';

export default function Cotizaciones() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data based on screenshot
  const stats = {
    activas: 3,
    aceptadas: 1,
    pendientes: 1,
    valorTotal: 6150
  };

  const cotizaciones = [
    {
      id: 1,
      cliente: 'Roberto Sánchez',
      email: 'roberto@email.com',
      estado: 'Enviada', // Enviada, Aceptada, Pendiente
      servicio: 'Afinación integral',
      vehiculo: 'Mazda 3 2018',
      fecha: '15/3/2026',
      validaHasta: '29/3/2026',
      manoObra: 1200,
      refacciones: 1600,
      total: 2800,
      avatar: 'R'
    },
    {
      id: 2,
      cliente: 'Laura Fernández',
      email: 'laura@email.com',
      estado: 'Aceptada',
      servicio: 'Servicio de frenos plus',
      vehiculo: 'Ford Focus 2020',
      fecha: '14/3/2026',
      validaHasta: '28/3/2026',
      manoObra: 1000,
      refacciones: 1500,
      total: 2500,
      avatar: 'L'
    }
  ];

  const listaPrecios = [
    { id: 1, nombre: 'Cambio de aceite y filtro', manoObra: 450, refacciones: 400, total: 850 },
    { id: 2, nombre: 'Afinación básica', manoObra: 650, refacciones: 890, total: 1540 },
    { id: 3, nombre: 'Afinación integral', manoObra: 1200, refacciones: 1600, total: 2800 },
    { id: 4, nombre: 'Servicio de frenos básico', manoObra: 800, refacciones: 1000, total: 1800 },
    { id: 5, nombre: 'Servicio de frenos plus', manoObra: 1000, refacciones: 1500, total: 2500 }
  ];

  // Modal State
  const [newQuoteForm, setNewQuoteForm] = useState({
    cliente: '',
    email: '',
    vehiculo: '',
    servicios: [],
    manoObra: '',
    refacciones: '',
    validaHasta: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Enviada': return 'bg-blue-100 text-blue-700';
      case 'Aceptada': return 'bg-green-100 text-green-700';
      case 'Pendientes': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout activeTab="cotizaciones">
      <div className="p-8">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Cotizaciones</h1>
            <p className="text-gray-500">Administra las cotizaciones en el sistema</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva cotización
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.activas}</div>
            <div className="text-sm font-medium text-gray-500">Cotizaciones activas</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-green-500 mb-1">{stats.aceptadas}</div>
            <div className="text-sm font-medium text-gray-500">Aceptadas</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-orange-400 mb-1">{stats.pendientes}</div>
            <div className="text-sm font-medium text-gray-500">Pendientes</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">${stats.valorTotal}</div>
            <div className="text-sm font-medium text-gray-500">Valor total cotizado</div>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Cotizaciones recientes */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cotizaciones recientes</h2>
            <div className="space-y-6">
              {cotizaciones.map(cot => (
                <div key={cot.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  
                  {/* Card Header Profile */}
                  <div className="p-6 pb-4 flex justify-between items-start border-b border-gray-100">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                        {cot.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{cot.cliente}</h3>
                        <p className="text-sm text-gray-500">{cot.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-md text-xs font-bold ${getStatusColor(cot.estado)}`}>
                      {cot.estado}
                    </span>
                  </div>

                  {/* Card Details Grid */}
                  <div className="p-6 pb-2 grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                      <span className="text-gray-500">Servicio: </span>
                      <span className="font-medium text-gray-800">{cot.servicio}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Vehículo: </span>
                      <span className="font-medium text-gray-800">{cot.vehiculo}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      Fecha: {cot.fecha}
                    </div>
                    <div>
                      <span className="text-gray-500">Válida hasta: </span>
                      <span className="font-medium text-gray-800">{cot.validaHasta}</span>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-6 pt-2">
                    <div className="flex justify-between items-center text-sm py-2 text-gray-600">
                      <span>Mano de obra</span>
                      <span className="font-medium text-gray-900">${cot.manoObra}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-2 text-gray-600 border-b border-gray-100">
                      <span>Refacciones</span>
                      <span className="font-medium text-gray-900">${cot.refacciones}</span>
                    </div>
                    <div className="flex justify-between items-center py-4">
                      <span className="font-bold text-gray-900 text-lg">Total</span>
                      <span className="font-bold text-blue-600 text-lg">${cot.total}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 flex gap-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
                      Ver detalles
                    </button>
                    <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
                      Editar
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm font-semibold transition-colors">
                      Enviar por correo
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Lista de Precios */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-auto max-h-[85vh] sticky top-8">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Lista de precios</h2>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {listaPrecios.map(item => (
                  <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">{item.nombre}</h4>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Mano de obra</span>
                      <span>${item.manoObra}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Refacciones</span>
                      <span>${item.refacciones}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-blue-600 pt-1">
                      <span>Total</span>
                      <span>${item.total}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* Modal: Nueva Cotización */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Nueva cotización</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Información del cliente */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Información del cliente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nombre del cliente *</label>
                      <input type="text" placeholder="Juan Pérez García" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Correo electrónico *</label>
                      <input type="email" placeholder="juan@email.com" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Detalles del servicio */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Detalles del servicio</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Vehículo *</label>
                      <input type="text" placeholder="Toyota Corolla 2020" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Servicios *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                        {listaPrecios.map(s => {
                          const isSelected = newQuoteForm.servicios?.includes(s.id);
                          return (
                            <label key={s.id} className={`flex items-start gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                              <input 
                                type="checkbox" 
                                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                                checked={isSelected || false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setNewQuoteForm(prev => {
                                    const current = prev.servicios || [];
                                    const newServicios = checked ? [...current, s.id] : current.filter(id => id !== s.id);
                                    
                                    const selectedItems = listaPrecios.filter(item => newServicios.includes(item.id));
                                    const totalManoObra = selectedItems.reduce((acc, item) => acc + item.manoObra, 0);
                                    const totalRefacciones = selectedItems.reduce((acc, item) => acc + item.refacciones, 0);

                                    return {
                                      ...prev,
                                      servicios: newServicios,
                                      manoObra: totalManoObra || '',
                                      refacciones: totalRefacciones || ''
                                    };
                                  });
                                }}
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800 leading-tight">{s.nombre}</span>
                                <span className="text-xs text-gray-500 mt-1">${s.total}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mano de obra (MXN) *</label>
                        <input type="number" placeholder="450" value={newQuoteForm.manoObra} onChange={(e) => setNewQuoteForm({...newQuoteForm, manoObra: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Partes y refacciones (MXN) *</label>
                        <input type="number" placeholder="400" value={newQuoteForm.refacciones} onChange={(e) => setNewQuoteForm({...newQuoteForm, refacciones: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Válida hasta *</label>
                      <input type="date" className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Resumen de cotización */}
                <div className="bg-[#f0f7ff] rounded-xl p-5 border border-[#e0f0ff]">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-3">
                    <span className="text-blue-600 font-extrabold text-lg">$</span> Resumen de la cotización
                  </h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-blue-900">
                      <span>Mano de obra</span>
                      <span className="font-semibold">${newQuoteForm.manoObra || '0'} MXN</span>
                    </div>
                    <div className="flex justify-between text-xs text-blue-900">
                      <span>Partes y consumibles</span>
                      <span className="font-semibold">${newQuoteForm.refacciones || '0'} MXN</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-3 border-t border-blue-200/60">
                    <span className="font-bold text-blue-900">Total estimado</span>
                    <span className="font-bold text-blue-700 text-lg">${(Number(newQuoteForm.manoObra) + Number(newQuoteForm.refacciones)) || '0'} MXN</span>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm shadow-purple-200">
                  Crear cotización
                </button>
              </div>

            </div>
          </div>
        )}
        
      </div>
    </AdminLayout>
  );
}

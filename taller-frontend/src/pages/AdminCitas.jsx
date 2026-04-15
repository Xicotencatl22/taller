import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';

const fechasDisponibles = [
  { diaSemana: 'MIÉ', dia: '25', mes: 'Mar' },
  { diaSemana: 'JUE', dia: '26', mes: 'Mar' },
  { diaSemana: 'VIE', dia: '27', mes: 'Mar' },
  { diaSemana: 'SÁB', dia: '28', mes: 'Mar' },
  { diaSemana: 'LUN', dia: '30', mes: 'Mar' },
  { diaSemana: 'MAR', dia: '31', mes: 'Mar' },
  { diaSemana: 'MIÉ', dia: '1', mes: 'Abr' },
  { diaSemana: 'JUE', dia: '2', mes: 'Abr' },
];

const horasDisponibles = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

export default function AdminCitas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  // Appointments state
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const mockCitas = [
      {
        id: 1,
        cliente: 'María González',
        email: 'maria@email.com',
        telefono: '123-456-7890',
        vehiculo: 'Toyota Corolla 2020',
        servicio: 'Afinación básica',
        fecha: '19/3/2026',
        hora: '10:00 AM',
        costo: 1540,
        estado: 'Confirmada',
        avatar: 'M'
      },
      {
        id: 2,
        cliente: 'Pedro Martínez',
        email: 'pedro@email.com',
        telefono: '123-456-7891',
        vehiculo: 'Honda Civic 2019',
        servicio: 'Cambio de aceite y filtro',
        fecha: '20/3/2026',
        hora: '2:00 PM',
        costo: 850,
        estado: 'Pendiente',
        avatar: 'P'
      },
      {
        id: 3,
        cliente: 'Ana López',
        email: 'ana@email.com',
        telefono: '123-456-7892',
        vehiculo: 'Nissan Sentra 2021',
        servicio: 'Servicio de frenos básico',
        fecha: '21/3/2026',
        hora: '9:00 AM',
        costo: 1800,
        estado: 'Confirmada',
        avatar: 'A'
      }
    ];
    setCitas(mockCitas);
  }, []);

  // Modal State
  const [selectedFecha, setSelectedFecha] = useState(null);
  const [selectedHora, setSelectedHora] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    marca: '',
    modelo: '',
    ano: '',
    placa: '',
    servicio: '',
    notas: ''
  });

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'Confirmada': return 'bg-[#d1fae5] text-[#065f46]';
      case 'Pendiente': return 'bg-[#fef3c7] text-[#92400e]';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const nextStep = () => setModalStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setModalStep(prev => Math.max(prev - 1, 1));
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalStep(1), 300); // Reset after animation
  };

  return (
    <AdminLayout activeTab="citas">
      <div className="p-8">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Citas</h1>
            <p className="text-gray-500">Administra las citas programadas y su estado</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva cita
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 shadow-sm">
          <div className="flex-1 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 absolute left-3 top-2.5 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input 
              type="text" 
              placeholder="Buscar por cliente o vehículo..." 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div className="md:w-64 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 absolute left-3 top-2.5 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            <select className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
              <option>Todos los estados</option>
              <option>Confirmada</option>
              <option>Pendiente</option>
              <option>Cancelada</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute right-3 top-3 text-gray-500 pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
          <div className="md:w-64">
            <input 
              type="date" 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>

        {/* Appointment List */}
        <div className="space-y-4">
          {citas.map(cita => (
            <div key={cita.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
              {/* Badge */}
              <div className="absolute top-6 right-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getBadgeColor(cita.estado)}`}>
                  {cita.estado}
                </span>
              </div>

              {/* Top row: Profile */}
              <div className="flex gap-4 items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                  {cita.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{cita.cliente}</h3>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    {cita.email} <span className="text-gray-300">•</span> {cita.telefono}
                  </div>
                </div>
              </div>

              {/* Grid block */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <div className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Vehículo</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677h3.351a.75.75 0 01.696.471z" /></svg>
                    {cita.vehiculo}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Servicio</div>
                  <div className="text-sm font-medium text-gray-800">{cita.servicio}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Fecha y hora</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                    {cita.fecha} <span className="mx-1 text-gray-300">|</span> 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {cita.hora}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Costo estimado</div>
                  <div className="text-sm font-bold text-blue-600">${cita.costo}</div>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex justify-between items-center relative z-10">
                <div className="flex gap-2">
                  <button onClick={() => window.alert(`Detalles de la Cita:\n\nCliente: ${cita.cliente}\nCorreo: ${cita.email}\nTeléfono: ${cita.telefono}\n\nVehículo: ${cita.vehiculo}\nServicio: ${cita.servicio}\n\nFecha Programada: ${cita.fecha} a las ${cita.hora}\nCosto Estimado: $${cita.costo}\nEstado: ${cita.estado}`)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Ver detalles</button>
                  <button className="bg-[#10b981] hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Confirmar</button>
                  <button className="bg-[#f59e0b] hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Reagendar</button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Editar</button>
                </div>
                <button className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors">
                  Cancelar cita
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Moda: Nueva Cita (Multi-step) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh]">
            
            {/* Modal Header & Stepper */}
            <div className="px-6 py-6 border-b border-gray-100 relative">
              <button onClick={handleCloseModal} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <h2 className="text-xl font-bold text-gray-900 mb-6">Agendar nueva cita</h2>
              
              <div className="flex justify-center items-center max-w-xl mx-auto">
                {/* Step 1 */}
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${modalStep > 1 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                    {modalStep > 1 ? '✓' : '1'}
                  </div>
                  <span className={`text-sm font-semibold ${modalStep > 1 ? 'text-green-500' : 'text-blue-600'}`}>Fecha y hora</span>
                </div>
                <div className={`flex-1 h-px mx-4 ${modalStep >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                
                {/* Step 2 */}
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${modalStep > 2 ? 'bg-green-500 text-white' : modalStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {modalStep > 2 ? '✓' : '2'}
                  </div>
                  <span className={`text-sm font-semibold ${modalStep > 2 ? 'text-green-500' : modalStep === 2 ? 'text-blue-600' : 'text-gray-400'}`}>Información</span>
                </div>
                <div className={`flex-1 h-px mx-4 ${modalStep >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                
                {/* Step 3 */}
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${modalStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                  <span className={`text-sm font-semibold ${modalStep === 3 ? 'text-blue-600' : 'text-gray-400'}`}>Confirmar</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 relative">
              
              {/* --- STEP 1: Fecha y hora --- */}
              {modalStep === 1 && (
                <div className="flex flex-col md:flex-row gap-8 h-full">
                  <div className="flex-1 border-r border-gray-100 pr-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Fecha disponible</h3>
                    <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                      {fechasDisponibles.map((f, i) => (
                        <button 
                          key={i}
                          type="button"
                          onClick={() => setSelectedFecha(f)}
                          className={`p-4 rounded-xl border text-center transition-all ${selectedFecha?.dia === f.dia ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
                        >
                          <div className={`text-xs font-bold mb-1 ${selectedFecha?.dia === f.dia ? 'text-blue-600' : 'text-gray-500'}`}>{f.diaSemana}</div>
                          <div className={`text-2xl font-black mb-1 ${selectedFecha?.dia === f.dia ? 'text-blue-700' : 'text-gray-900'}`}>{f.dia}</div>
                          <div className={`text-sm font-medium ${selectedFecha?.dia === f.dia ? 'text-blue-600' : 'text-gray-500'}`}>{f.mes}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 pl-2">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Hora disponible</h3>
                    <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                      {horasDisponibles.map((h, i) => (
                        <button 
                          key={i}
                          type="button"
                          onClick={() => setSelectedHora(h)}
                          className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${selectedHora === h ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 hover:border-blue-300 text-gray-600 bg-white'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --- STEP 2: Información --- */}
              {modalStep === 2 && (
                <div className="max-w-3xl mx-auto space-y-6">
                  
                  {/* Info Cliente */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Información del cliente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                          Nombre completo *
                        </label>
                        <input type="text" placeholder="Juan Pérez García" value={formData.nombre} onChange={e=>setFormData({...formData, nombre: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.21-3.91-6.805-6.805l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                          Teléfono *
                        </label>
                        <input type="tel" placeholder="123-456-7890" value={formData.telefono} onChange={e=>setFormData({...formData, telefono: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                        Correo electrónico (opcional)
                      </label>
                      <input type="email" placeholder="juan@email.com" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  {/* Info Vehículo */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Información del vehículo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Marca *</label>
                        <input type="text" placeholder="Toyota, Honda, Nissan..." value={formData.marca} onChange={e=>setFormData({...formData, marca: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Modelo</label>
                        <input type="text" placeholder="Corolla, Civic..." value={formData.modelo} onChange={e=>setFormData({...formData, modelo: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Año</label>
                        <input type="number" placeholder="2020" value={formData.ano} onChange={e=>setFormData({...formData, ano: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Placa</label>
                        <input type="text" placeholder="ABC-123-XYZ" value={formData.placa} onChange={e=>setFormData({...formData, placa: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Servicio solicitado *</label>
                      <select value={formData.servicio} onChange={e=>setFormData({...formData, servicio: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="">Seleccionar servicio</option>
                        <option value="Afinación básica">Afinación básica</option>
                        <option value="Servicio de frenos plus">Servicio de frenos plus</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notas adicionales</label>
                      <textarea value={formData.notas} onChange={e=>setFormData({...formData, notas: e.target.value})} placeholder="Observaciones sobre el vehículo o el servicio..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows="3"></textarea>
                    </div>
                  </div>

                </div>
              )}

              {/* --- STEP 3: Confirmar --- */}
              {modalStep === 3 && (
                <div className="max-w-2xl mx-auto flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-50 text-[#10b981] rounded-full flex items-center justify-center mb-4 ring-8 ring-green-50/50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Confirmar cita</h3>

                  <div className="w-full bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-inner">
                    
                    <div className="pb-4 mb-4 border-b border-gray-200">
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Fecha y hora</div>
                      <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {selectedFecha ? `${selectedFecha.diaSemana.toLowerCase()}., ${selectedFecha.dia} de ${selectedFecha.mes.toLowerCase()} de 2026 - ${selectedHora}` : 'Fecha no seleccionada'}
                      </div>
                    </div>

                    <div className="pb-4 mb-4 border-b border-gray-200">
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Cliente</div>
                      <div className="text-sm font-semibold text-gray-900 flex flex-col">
                        <span>{formData.nombre || 'No especificado'}</span>
                        {formData.telefono && <span className="text-gray-500 font-medium">{formData.telefono}</span>}
                        {formData.email && <span className="text-gray-500 font-medium">{formData.email}</span>}
                      </div>
                    </div>

                    <div className="pb-4 mb-4 border-b border-gray-200">
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Vehículo</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formData.marca || 'Marca no especificada'} {formData.modelo} {formData.ano}
                        {formData.placa && <div className="text-gray-500 font-medium mt-0.5">Placa: {formData.placa}</div>}
                      </div>
                    </div>

                    <div className="pb-4 mb-4 border-b border-gray-200">
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Servicio</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formData.servicio || 'No especificado'}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Notas</div>
                      <div className="text-sm font-medium text-gray-700 bg-white p-3 rounded border border-gray-200 italic">
                        {formData.notas || 'Sin notas adicionales.'}
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex justify-end items-center gap-3">
              {modalStep > 1 && (
                <button onClick={prevStep} className="mr-auto px-5 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                  Atrás
                </button>
              )}
              <button onClick={handleCloseModal} className="px-5 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              
              {modalStep < 3 ? (
                 <button 
                  onClick={nextStep} 
                  disabled={modalStep === 1 && (!selectedFecha || !selectedHora)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                    modalStep === 1 && (!selectedFecha || !selectedHora) 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#cbd5e1] text-gray-700 hover:bg-gray-300' // Using an active color resembling the screenshot's 'Continuar'
                  }`}
                 >
                   Continuar
                 </button>
              ) : (
                <button 
                  onClick={() => { alert('Cita guardada!'); handleCloseModal(); }}
                  className="px-6 py-2 rounded-lg text-sm font-bold bg-[#10b981] hover:bg-emerald-600 text-white transition-all shadow-sm"
                >
                  Confirmar cita
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}

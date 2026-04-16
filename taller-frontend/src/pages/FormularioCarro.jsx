import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

function FormularioCarro() {
  const location = useLocation();
  const navigate = useNavigate();


  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    servicios: location.state?.servicio ? [location.state?.servicio] : [],
    kilometraje: "",
    idmarca: "",
    idmodelo: "",
    idanio: "",
    idmotor: "",
  });

  const [marca, setMarca] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [anio, setAnio] = useState([]);
  const [motores, setMotores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [selectedFecha, setSelectedFecha] = useState(null);
  const [selectedHora, setSelectedHora] = useState(null);
  const [contactoForm, setContactoForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    notas: ""
  });

  const handleNextStep = () => setModalStep(prev => Math.min(prev + 1, 3));
  const handlePrevStep = () => setModalStep(prev => Math.max(prev - 1, 1));
  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalStep(1), 300);
  };

  const handleConfirmarCita = () => {
    const marcaObj = fallbackMarcas.find(m => m.idmarca === form.idmarca);
    const modeloObj = (fallbackModelos[form.idmarca] || []).find(m => m.idmodelo === form.idmodelo);
    const vehiculoText = `${marcaObj?.nombre || ''} ${modeloObj?.nombre || ''} ${form.idanio}`.trim();

    alert("¡Tu cita se ha confirmado exitosamente! Hemos notificado al administrador.");
    closeAndResetModal();
    navigate('/');
  };

  // Hardcoded data based on user request
  const fallbackMarcas = [
    { idmarca: "chevrolet", nombre: "Chevrolet" },
    { idmarca: "nissan", nombre: "Nissan" },
    { idmarca: "volkswagen", nombre: "Volkswagen" },
    { idmarca: "toyota", nombre: "Toyota" },
    { idmarca: "honda", nombre: "Honda" }
  ];

  const fallbackModelos = {
    chevrolet: [
      { idmodelo: "aveo", nombre: "Aveo" },
      { idmodelo: "spark", nombre: "Spark" },
      { idmodelo: "onix", nombre: "Onix" },
      { idmodelo: "tracker", nombre: "Tracker" }
    ],
    nissan: [
      { idmodelo: "versa", nombre: "Versa" },
      { idmodelo: "sentra", nombre: "Sentra" },
      { idmodelo: "march", nombre: "March" },
      { idmodelo: "kicks", nombre: "Kicks" }
    ],
    volkswagen: [
      { idmodelo: "jetta", nombre: "Jetta" },
      { idmodelo: "vento", nombre: "Vento" },
      { idmodelo: "gol", nombre: "Gol" },
      { idmodelo: "virtus", nombre: "Virtus" }
    ],
    toyota: [
      { idmodelo: "corolla", nombre: "Corolla" },
      { idmodelo: "yaris", nombre: "Yaris" },
      { idmodelo: "rav4", nombre: "RAV4" },
      { idmodelo: "camry", nombre: "Camry" }
    ],
    honda: [
      { idmodelo: "civic", nombre: "Civic" },
      { idmodelo: "city", nombre: "City" },
      { idmodelo: "crv", nombre: "CR-V" },
      { idmodelo: "accord", nombre: "Accord" }
    ]
  };

  const fallbackAnios = [
    { idanio: "2026", nombre: "2026" },
    { idanio: "2025", nombre: "2025" },
    { idanio: "2024", nombre: "2024" },
    { idanio: "2023", nombre: "2023" },
    { idanio: "2022", nombre: "2022" },
    { idanio: "2021", nombre: "2021" }
  ];

  const fallbackMotores = [
    { idmotor: "4cil-1.6", cilindrada: "4 Cilindros (1.6L)" },
    { idmotor: "4cil-2.0", cilindrada: "4 Cilindros (2.0L)" },
    { idmotor: "v6-3.5", cilindrada: "V6 (3.5L)" }
  ];

  // Cargar datos predefinidos
  useEffect(() => {
    setMarca(fallbackMarcas);
    setAnio(fallbackAnios);
    setMotores(fallbackMotores);
    setLoading(false);
  }, []);

  // Cargar modelos cuando cambia la marca
  useEffect(() => {
    if (!form.idmarca) {
      setModelos([]);
      return;
    }
    setModelos(fallbackModelos[form.idmarca] || []);
  }, [form.idmarca]);


  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  function handleExportarPDF() {
    window.print();
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Cargando formulario...</div>;
  }

  return (
    <div className="max-w-[1100px] mx-auto w-full px-4 text-left pb-16 pt-6">
      <button 
        onClick={() => navigate(-1)} 
        className="text-blue-600 font-semibold flex items-center gap-2 mb-6 hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver a servicios
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8 items-start">
        
        {/* Columna Izquierda: Formulario */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cotización</h1> 
          <p className="text-gray-500 mb-8 text-sm max-w-[400px]">
            Completa los datos del vehículo para generar el estimado del servicio seleccionado.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Servicios */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Servicios solicitados</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                {[
                  'Cambio de aceite y filtro',
                  'Afinación básica',
                  'Afinación integral',
                  'Servicio de frenos básico',
                  'Servicio de frenos plus'
                ].map((s, idx) => {
                  const isSelected = form.servicios?.includes(s);
                  return (
                    <label key={idx} className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50 bg-white'}`}>
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={isSelected || false}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setForm(prev => {
                            const current = prev.servicios || [];
                            const newServicios = checked ? [...current, s] : current.filter(item => item !== s);
                            return { ...prev, servicios: newServicios };
                          });
                        }}
                      />
                      <span className="text-sm font-medium text-gray-800">{s}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Año y Marca */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Año</label>
                <select
                  name="idanio"
                  value={form.idanio}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="">Selecciona un año</option>
                  {anio.map((year) => {
                    const id = year.idanio ?? year.id ?? year.value ?? year.nombre;
                    const label = year.nombre ?? id;
                    return <option key={id} value={id}>{label}</option>;
                  })}
                </select>
              </div> 
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Marca</label>
                <select
                  name="idmarca"
                  value={form.idmarca}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="">Selecciona una marca</option>
                  {marca.map((marc) => (
                    <option key={marc.idmarca} value={marc.idmarca}>{marc.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modelo y Motor */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Modelo</label>
                <select
                  name="idmodelo"
                  value={form.idmodelo}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white disabled:bg-gray-50"
                  required
                  disabled={!form.idmarca}
                >
                  <option value="">Selecciona un modelo</option>
                  {modelos.map((modelo) => (
                    <option key={modelo.idmodelo} value={modelo.idmodelo}>{modelo.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Motor</label>
                <select
                  name="idmotor"
                  value={form.idmotor}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="">Selecciona un motor</option>
                  {motores.map((motor) => {
                    const id = motor.idmotor ?? motor.id ?? motor.value;
                    const label = motor.cilindrada ?? id;
                    return <option key={id} value={id}>{label}</option>;
                  })}
                </select>
              </div>
            </div>

            {/* Kilometraje */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kilometraje</label>
              <div className="relative">
                <input
                  type="text"
                  name="kilometraje"
                  value={form.kilometraje}
                  onChange={handleChange}
                  placeholder="Ingresa el kilometraje aproximado"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white pr-10"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-6 print:hidden">
              <button type="button" onClick={handleExportarPDF} className="flex-1 bg-[#1A56DB] text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                Exportar en PDF
              </button>
              <button type="button" onClick={() => setIsModalOpen(true)} className="flex-1 bg-[#10b981] text-white font-semibold px-4 py-3 rounded-lg hover:bg-emerald-600 transition-colors shadow-sm">
                Agendar servicio
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-[0.7] bg-gray-200 text-gray-700 font-semibold px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Volver
              </button>
            </div>
          </form>
        </div>

        {/* Columna Derecha: Resumen y Cards */}
        <div className="flex flex-col gap-4">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">Resumen estimado</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Cliente</span>
            </div>
            <p className="text-gray-500 mb-8 text-sm">
              Vista previa para clientes antes de confirmar la cotización.
            </p>

            <div className="flex flex-col gap-4 text-sm text-gray-600 mb-10">
              <div className="flex justify-between items-start gap-4">
                <span>Servicios</span>
                <span className="font-semibold text-gray-900 text-right">
                  {form.servicios?.length > 0 ? form.servicios.join(', ') : 'Servicio General'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tiempo estimado</span>
                <span className="font-semibold text-gray-900">2 a 3 horas</span>
              </div>
              <div className="flex justify-between">
                <span>Refacciones</span>
                <span className="font-semibold text-gray-900 text-right">Incluidas</span>
              </div>
              <div className="flex justify-between">
                <span>Mano de obra</span>
                <span className="font-semibold text-gray-900">$650 MXN</span>
              </div>
              <div className="flex justify-between">
                <span>Partes y consumibles</span>
                <span className="font-semibold text-gray-900">$890 MXN</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-semibold">Total estimado</span>
                <span className="text-3xl font-light text-[#1A56DB]">$1540 MXN</span>
              </div>
              <p className="text-xs text-gray-400">
                El total puede ajustarse tras la revisión física del vehículo. El cliente puede consultar esta cotización y decidir si agenda la cita.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Mis citas</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                El cliente puede revisar próximas citas, fechas disponibles y estado de atención.
              </p>
            </div>
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Reportes del vehículo</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Acceso de solo lectura al historial y a lo realizado en cada visita al taller.
              </p>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Acceso seguro</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Login con correo y contraseña usando la autenticación principal de la plataforma.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Modal: Agendar Servicio */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh]">
            
            {/* Header del Modal */}
            <div className="px-6 py-6 border-b border-gray-100 relative shrink-0">
              <button onClick={closeAndResetModal} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <h2 className="text-xl font-bold text-gray-900 mb-1">Agendar servicio</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-lg">{form.servicios?.length > 0 ? form.servicios.join(', ') : 'Servicio seleccionado'}</p>
              
              {/* Stepper */}
              <div className="flex justify-center items-center max-w-xl mx-auto">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${modalStep > 1 ? 'bg-[#10b981] text-white' : 'bg-[#1A56DB] text-white'}`}>
                    {modalStep > 1 ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : '1'}
                  </div>
                  <span className={`text-sm font-semibold ${modalStep > 1 ? 'text-[#10b981]' : 'text-[#1A56DB]'}`}>Fecha y hora</span>
                </div>
                <div className={`flex-1 h-px mx-4 ${modalStep >= 2 ? 'bg-gray-300' : 'bg-gray-200'}`}></div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${modalStep > 2 ? 'bg-[#10b981] text-white' : modalStep === 2 ? 'bg-[#1A56DB] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {modalStep > 2 ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : '2'}
                  </div>
                  <span className={`text-sm font-semibold ${modalStep > 2 ? 'text-[#10b981]' : modalStep === 2 ? 'text-[#1A56DB]' : 'text-gray-400'}`}>Tus datos</span>
                </div>
                <div className={`flex-1 h-px mx-4 ${modalStep >= 3 ? 'bg-gray-300' : 'bg-gray-200'}`}></div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${modalStep === 3 ? 'bg-[#1A56DB] text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                  <span className={`text-sm font-semibold ${modalStep === 3 ? 'text-[#1A56DB]' : 'text-gray-400'}`}>Confirmar</span>
                </div>
              </div>
            </div>

            {/* Cuerpo del Modal */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              
              {/* Paso 1 */}
              {modalStep === 1 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-6">Selecciona fecha y hora disponible</h3>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-[1.2]">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Fecha disponible</h4>
                      <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {fechasDisponibles.map((f, i) => (
                          <button 
                            key={i}
                            type="button"
                            onClick={() => setSelectedFecha(f)}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${selectedFecha?.dia === f.dia ? 'border-[#1A56DB] bg-blue-50/20' : 'border-gray-100/80 hover:border-gray-300 bg-white'}`}
                          >
                            <div className="text-xs font-bold mb-1 text-gray-500">{f.diaSemana}</div>
                            <div className="text-2xl font-black mb-1 text-gray-900">{f.dia}</div>
                            <div className="text-sm font-medium text-gray-500">{f.mes}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-[1.2]">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Hora disponible</h4>
                      <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {horasDisponibles.map((h, i) => (
                          <button 
                            key={i}
                            type="button"
                            onClick={() => setSelectedHora(h)}
                            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 transition-all ${selectedHora === h ? 'border-[#1A56DB] bg-blue-50/20 font-bold text-gray-900' : 'border-gray-100 hover:border-gray-300 text-gray-600 bg-white'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 2 */}
              {modalStep === 2 && (
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-base font-bold text-gray-900 mb-6">Información de contacto</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Nombre completo *
                      </label>
                      <input type="text" value={contactoForm.nombre} onChange={e=>setContactoForm({...contactoForm, nombre: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#1A56DB] outline-none" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        Teléfono *
                      </label>
                      <input type="tel" value={contactoForm.telefono} onChange={e=>setContactoForm({...contactoForm, telefono: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#1A56DB] outline-none" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Correo electrónico (opcional)
                      </label>
                      <input type="email" value={contactoForm.correo} onChange={e=>setContactoForm({...contactoForm, correo: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#1A56DB] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notas adicionales (opcional)</label>
                      <textarea value={contactoForm.notas} onChange={e=>setContactoForm({...contactoForm, notas: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#1A56DB] outline-none" rows="3"></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 3 */}
              {modalStep === 3 && (
                <div className="max-w-2xl mx-auto flex flex-col items-center pb-4">
                  <div className="w-16 h-16 bg-[#10b981]/10 text-[#10b981] rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Confirma tu cita</h3>
                  <p className="text-sm text-gray-500 mb-8">Revisa que toda la información sea correcta</p>

                  <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden text-left mb-6 shadow-sm">
                    
                    <div className="p-5 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-500 mb-2">Servicios</div>
                      <div className="text-base font-semibold text-gray-900">
                        {form.servicios?.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {form.servicios.map((s, idx) => <li key={idx}>{s}</li>)}
                          </ul>
                        ) : 'Servicio General'}
                      </div>
                      <div className="text-sm text-blue-600 mt-3">Costo estimado: $1540 MXN</div>
                    </div>

                    <div className="p-5 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-500 mb-2">Fecha y hora</div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                           <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                           {selectedFecha ? `${selectedFecha.diaSemana.toLowerCase()}., ${selectedFecha.dia} de ${selectedFecha.mes.toLowerCase()} de 2026` : 'Fecha no seleccionada'}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                           <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           {selectedHora || 'Hora no seleccionada'}
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="text-sm font-medium text-gray-500 mb-2">Datos de contacto</div>
                      <div className="text-sm font-medium text-gray-800 flex flex-col gap-1">
                        <span>{contactoForm.nombre}</span>
                        <span>{contactoForm.telefono}</span>
                        <span>{contactoForm.correo}</span>
                      </div>
                      {contactoForm.notas && (
                        <div className="mt-4">
                          <div className="text-sm font-medium text-gray-500 mb-1">Notas:</div>
                          <p className="text-sm text-gray-800">{contactoForm.notas}</p>
                        </div>
                      )}
                    </div>

                  </div>

                  <div className="w-full bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-sm text-gray-600">
                    <strong className="text-gray-800">Importante:</strong> Recibirás una confirmación por teléfono antes de tu cita. El costo final puede variar después de la revisión física del vehículo.
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end items-center gap-4 bg-white shrink-0">
              {modalStep > 1 && (
                <button onClick={handlePrevStep} className="mr-auto px-5 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                  Atrás
                </button>
              )}
              <button onClick={closeAndResetModal} className="px-5 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                Cancelar
              </button>
              
              {modalStep < 3 ? (
                 <button 
                  onClick={handleNextStep} 
                  disabled={(modalStep === 1 && (!selectedFecha || !selectedHora)) || (modalStep === 2 && (!contactoForm.nombre || !contactoForm.telefono))}
                  className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                    (modalStep === 1 && (!selectedFecha || !selectedHora)) || (modalStep === 2 && (!contactoForm.nombre || !contactoForm.telefono))
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#1A56DB] text-white hover:bg-blue-700'
                  }`}
                 >
                   Continuar
                 </button>
              ) : (
                <button 
                  onClick={handleConfirmarCita}
                  className="px-8 py-2.5 rounded-lg text-sm font-bold bg-[#10b981] hover:bg-emerald-600 text-white transition-all shadow-sm"
                >
                  Confirmar cita
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default FormularioCarro;


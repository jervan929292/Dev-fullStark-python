'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const SERVICES = [
  { id: 'domain', name: 'Registro de Dominio (.com / .net)', price: 15, category: 'Infraestructura', icon: '🌐', description: 'Dominio personalizado por 1 año con gestión DNS avanzada.' },
  { id: 'vps', name: 'Servidor VPS Optimizado (2 vCPU / 4GB RAM)', price: 20, category: 'Infraestructura', icon: '⚡', description: 'Servidor virtual privado de alto rendimiento para despliegues rápidos.' },
  { id: 'hosting', name: 'Alojamiento Web NVMe (Anual)', price: 60, category: 'Infraestructura', icon: '💻', description: 'Hosting ultrarrápido con discos de estado sólido NVMe y SSL gratis.' },
  { id: 'wordpress', name: 'Desarrollo & Optimización WordPress Pro', price: 150, category: 'Desarrollo', icon: '🚀', description: 'Sitio web corporativo optimizado para SEO y velocidad de carga extrema.' },
  { id: 'migration', name: 'Migración Completa de Servidor / Web', price: 45, category: 'Soporte', icon: '🔄', description: 'Traslado seguro de bases de datos y archivos sin pérdida de tiempo de actividad.' },
  { id: 'ssl', name: 'Certificado SSL Wildcard Avanzado', price: 30, category: 'Seguridad', icon: '🔒', description: 'Protección total de datos para dominios y subdominios ilimitados.' },
  { id: 'database', name: 'Base de datos Supabase / PostgreSQL Pro', price: 35, category: 'Backend', icon: '🗄️', description: 'Estructuración relacional optimizada con respaldos diarios automáticos.' }
];

export default function DashboardLoaderPro() {
  const [client, setClient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const storedClient = localStorage.getItem('fullstar_client');
    if (storedClient) {
      try {
        setClient(JSON.parse(storedClient));
      } catch (e) {
        console.error("Error al leer la sesión del cliente", e);
      }
    }
  }, []);

  const filteredServices = SERVICES.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedServices.reduce((acc, id) => {
    const s = SERVICES.find(item => item.id === id);
    return acc + (s ? s.price : 0);
  }, 0);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || selectedServices.length === 0) return;

    setLoading(true);
    setMensaje('');

    try {
      const namesSelected = selectedServices
        .map(id => SERVICES.find(s => s.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      const { error } = await supabase.from('orders').insert([
        {
          client_id: client.id,
          project_type: `Infraestructura: ${namesSelected}`,
          descripcion: description,
          presupuesto_estimado: totalPrice,
          estado: 'Pendiente'
        }
      ]);

      if (error) {
        setMensaje('Error al registrar la orden: ' + error.message);
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setMensaje('Error crítico al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fullstar_client');
    window.location.href = '/';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Cabecera amplia y fluida */}
      <div className="text-center space-y-3">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          // Fullstar Infrastructure & Cyber Ecosystem
        </motion.div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
          Centro de Control & Cotizador
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Configura y selecciona la infraestructura tecnológica de alto rendimiento para tus desarrollos de manera cómoda y fluida.
        </p>
      </div>

      <AnimatePresence>
        {mensaje && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-slate-900/90 border border-cyan-500/40 text-cyan-300 rounded-2xl text-center text-sm shadow-inner font-mono max-w-2xl mx-auto"
          >
            {mensaje}
          </motion.div>
        )}
      </AnimatePresence>

      {client && !submitted ? (
        <motion.form 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          onSubmit={handleCreateOrder} 
          className="space-y-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl"
        >
          {/* Tarjeta de sesión clara y limpia */}
          <div className="p-5 bg-slate-950/80 rounded-2xl border border-cyan-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-mono tracking-wider">CLIENTE AUTENTICADO:</p>
              <p className="font-extrabold text-cyan-300 text-lg uppercase tracking-wide">{client.nombre}</p>
              <p className="text-xs text-slate-400 font-mono">Doc: {client.cedula} | Tel: {client.telefono}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-rose-400 hover:text-rose-300 font-mono bg-rose-950/30 px-4 py-2 rounded-xl border border-rose-500/30 transition-all cursor-pointer shadow-sm"
            >
              Cerrar Sesión ✕
            </button>
          </div>

          {/* Buscador de servicios */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400">
              Buscar Infraestructura, Servidores o Dominios:
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 text-lg">🔍</span>
              <input 
                type="text"
                placeholder="Escribe para buscar servicios (Ej. VPS, Dominio, Base de datos...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Cuadrícula amplia y holgada de servicios */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400">
              Selecciona los Módulos de Infraestructura:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[460px] overflow-y-auto pr-1">
              {filteredServices.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleService(service.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      isSelected 
                        ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/50' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3.5">
                        <span className="text-3xl p-2.5 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">{service.icon}</span>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{service.name}</h3>
                          <span className="text-xs text-cyan-400 font-mono tracking-wide">{service.category}</span>
                        </div>
                      </div>
                      <span className="text-cyan-300 font-mono font-extrabold text-lg sm:text-xl">${service.price}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{service.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Campo de especificaciones técnicas */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400">
              Especificaciones Técnicas del Proyecto:
            </label>
            <textarea 
              rows={3}
              required
              placeholder="Describe requerimientos especiales, accesos o notas adicionales..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm sm:text-base resize-none"
            />
          </div>

          {/* Resumen de costos y botón */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <span className="text-xs text-slate-400 block uppercase font-mono tracking-wider">Inversión Total Estimada:</span>
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">${totalPrice} <span className="text-xs text-slate-500 font-normal">USD</span></span>
            </div>

            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={selectedServices.length === 0 || loading}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold tracking-wide transition-all text-sm sm:text-base ${
                selectedServices.length > 0 && !loading
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-600 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              {loading ? 'Guardando en Base de Datos...' : 'Lanzar Orden en Supabase 🚀'}
            </motion.button>
          </div>
        </motion.form>
      ) : submitted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 space-y-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto"
        >
          <div className="w-20 h-20 bg-cyan-500/20 border-2 border-cyan-400 rounded-full flex items-center justify-center mx-auto text-4xl shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-pulse">
            ✨
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">¡Orden Registrada con Éxito!</h2>
            <p className="text-slate-300 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              La infraestructura y los servicios seleccionados se han enlazado correctamente en tus tablas de Supabase.
            </p>
          </div>
          <button 
            onClick={() => { setSubmitted(false); setSelectedServices([]); setDescription(''); }}
            className="mt-4 px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-2xl text-sm font-mono transition-all shadow-lg cursor-pointer"
          >
            ← Configurar nueva orden
          </button>
        </motion.div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 font-mono text-sm">Cargando sesión del sistema...</p>
        </div>
      )}

    </div>
  );
}

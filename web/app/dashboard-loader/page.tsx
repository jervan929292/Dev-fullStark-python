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
        console.error("Error al leer la sesión", e);
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

      const { error } = await supabase.from('orders'].insert([
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Cabecera Principal */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <span className="inline-block px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-xs font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          // Fullstar Infrastructure & Cyber Ecosystem v2.5
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
          Centro de Control & Cotizador Pro
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto font-light">
          Arquitectura de alta disponibilidad. Selecciona los módulos tecnológicos requeridos y despliega tu orden directamente en Supabase.
        </p>
      </motion.div>

      <AnimatePresence>
        {mensaje && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-slate-900/90 border border-cyan-500/40 text-cyan-300 rounded-2xl text-center text-sm shadow-xl font-mono max-w-3xl mx-auto"
          >
            {mensaje}
          </motion.div>
        )}
      </AnimatePresence>

      {client && !submitted ? (
        <motion.form 
          initial={{ opacity: 0, scale: 0.99 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4 }}
          onSubmit={handleCreateOrder} 
          className="space-y-8 bg-slate-900/70 backdrop-blur-2xl border border-cyan-500/20 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          {/* Tarjeta de Sesión Activa */}
          <div className="p-6 bg-slate-950/90 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-inner">
            <div className="space-y-1">
              <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">// Sesión Verificada</span>
              <p className="text-xl font-black text-white uppercase tracking-wide">{client.nombre}</p>
              <p className="text-xs text-slate-400 font-mono">Documento: <span className="text-cyan-300">{client.cedula}</span> | Teléfono: <span className="text-cyan-300">{client.telefono}</span></p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-rose-400 hover:text-rose-300 font-mono bg-rose-950/40 px-5 py-2.5 rounded-xl border border-rose-500/30 transition-all cursor-pointer shadow-md hover:bg-rose-900/50"
            >
              Cerrar Sesión ✕
            </button>
          </div>

          {/* Buscador Dinámico */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400">
              Buscar Módulos de Infraestructura o Desarrollo:
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400 text-xl">🔍</span>
              <input 
                type="text"
                placeholder="Escribe para filtrar servicios (Ej. VPS, Dominio, Base de datos...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-base font-mono"
              />
            </div>
          </div>

          {/* Cuadrícula de Servicios Amplia y Ordenada (Sin solapamientos) */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400">
              Selecciona los Servicios Requeridos:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredServices.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleService(service.id)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-4 relative overflow-hidden ${
                      isSelected 
                        ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] ring-2 ring-cyan-500/50' 
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3.5">
                        <span className="text-4xl p-3 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner flex items-center justify-center">
                          {service.icon}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-white leading-snug">{service.name}</h3>
                          <span className="text-xs text-cyan-400 font-mono tracking-wide">{service.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 leading-relaxed">{service.description}</p>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-500 uppercase">Tarifa Estándar</span>
                      <span className="text-cyan-300 font-mono font-black text-xl">${service.price} <span className="text-xs text-slate-400 font-normal">USD</span></span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-bl-xl font-mono uppercase tracking-widest shadow-md">
                        Seleccionado ✓
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400">
              Especificaciones Técnicas y Notas del Proyecto:
            </label>
            <textarea 
              rows={4}
              required
              placeholder="Describe accesos, requerimientos de arquitectura, plazos o notas adicionales..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-base resize-none font-mono"
            />
          </div>

          {/* Resumen Final y Botón de Acción */}
          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1">
              <span className="text-xs text-slate-400 block uppercase font-mono tracking-widest">Inversión Total Estimada:</span>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono">${totalPrice}</span>
                <span className="text-sm font-mono text-slate-400">USD / Pago Único</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={selectedServices.length === 0 || loading}
              className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black tracking-wider transition-all text-base uppercase shadow-2xl ${
                selectedServices.length > 0 && !loading
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 text-white shadow-[0_0_40px_rgba(6,182,212,0.5)] cursor-pointer hover:opacity-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              {loading ? 'Sincronizando con Supabase...' : 'Lanzar Orden en el Ecosistema 🚀'}
            </motion.button>
          </div>
        </motion.form>
      ) : submitted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 space-y-6 bg-slate-900/80 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-10 shadow-2xl max-w-2xl mx-auto"
        >
          <div className="w-24 h-24 bg-cyan-500/20 border-2 border-cyan-400 rounded-full flex items-center justify-center mx-auto text-5xl shadow-[0_0_40px_rgba(6,182,212,0.4)] animate-pulse">
            ✨
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white">¡Orden Registrada con Éxito!</h2>
            <p className="text-slate-300 text-base leading-relaxed max-w-md mx-auto">
              La infraestructura y los servicios seleccionados se han enlazado de forma relacional en Supabase. El equipo técnico procederá con el despliegue.
            </p>
          </div>
          <button 
            onClick={() => { setSubmitted(false); setSelectedServices([]); setDescription(''); }}
            className="mt-6 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded-2xl text-sm font-mono transition-all shadow-xl cursor-pointer"
          >
            ← Configurar nueva orden
          </button>
        </motion.div>
      ) : (
        <div className="text-center py-28 space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          <p className="text-slate-400 font-mono text-sm tracking-wider">Cargando perfil de sesión...</p>
        </div>
      )}

    </div>
  );
}

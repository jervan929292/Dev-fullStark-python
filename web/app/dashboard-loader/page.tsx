'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Catálogo de servicios tecnológicos con precios reales estimados
const SERVICES = [
  { id: 'domain', name: 'Registro de Dominio (.com / .net)', price: 15, category: 'Infraestructura', icon: '🌐' },
  { id: 'vps', name: 'Servidor VPS Optimizado (2 vCPU / 4GB RAM)', price: 20, category: 'Infraestructura', icon: '⚡' },
  { id: 'hosting', name: 'Alojamiento Web NVMe (Anual)', price: 60, category: 'Infraestructura', icon: '💻' },
  { id: 'wordpress', name: 'Desarrollo & Optimización WordPress Pro', price: 150, category: 'Desarrollo', icon: '🚀' },
  { id: 'migration', name: 'Migración Completa de Servidor / Web', price: 45, category: 'Soporte', icon: '🔄' },
];

export default function DashboardLoaderPro() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Filtrar servicios en tiempo real
  const filteredServices = SERVICES.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) return;

    setLoading(true);
    setErrorMsg('');

    try {
      // Nombres de los servicios seleccionados
      const namesSelected = selectedServices
        .map(id => SERVICES.find(s => s.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      // Inserción en la tabla 'orders' de Supabase
      const { error } = await supabase.from('orders').insert([
        {
          project_type: `Integración: ${namesSelected}`,
          descripcion: description,
          presupuesto_estimado: totalPrice,
          estado: 'Pendiente'
        }
      ]);

      if (error) {
        setErrorMsg('Error al guardar la orden: ' + error.message);
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg('Ocurrió un error inesperado al conectar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden flex flex-col items-center justify-center p-4 md:p-8">
      
      {/* Fondo inmersivo cyberpunk */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none filter blur-[2px]"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-cyan-950/40 pointer-events-none" />

      {/* Contenedor Principal */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-3xl w-full bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] p-6 md:p-10"
      >
        
        {/* Cabecera */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-block px-4 py-1 mb-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest"
          >
            // Fullstar Ecosystem & Integrations
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
            Centro de Configuración y Precios
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Selecciona la infraestructura y los servicios técnicos requeridos para tu proyecto.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/80 border border-red-500/50 text-red-300 rounded-xl text-center text-sm">
            {errorMsg}
          </div>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Buscador de Servicios */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
                Buscar Servicios, Dominios o Infraestructura:
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">🔍</span>
                <input 
                  type="text"
                  placeholder="Ej. VPS, Dominio, WordPress, Migración..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* Lista Interactiva de Servicios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {filteredServices.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleService(service.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{service.name}</h3>
                        <span className="text-xs text-slate-400 font-mono">{service.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-cyan-400 font-mono font-bold">${service.price}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Campo de Descripción */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
                Descripción detallada del requerimiento:
              </label>
              <textarea 
                rows={3}
                required
                placeholder="Describe los detalles técnicos, accesos o especificaciones que necesitas..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              />
            </div>

            {/* Resumen de Costos y Acción */}
            <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block uppercase font-mono">Inversión Estimada:</span>
                <span className="text-3xl font-extrabold text-cyan-400 font-mono">${totalPrice} <span className="text-xs text-slate-500 font-normal">USD</span></span>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={selectedServices.length === 0 || loading}
                className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold tracking-wide transition-all ${
                  selectedServices.length > 0 && !loading
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Procesando...' : 'Lanzar Integración 🚀'}
              </motion.button>
            </div>

          </form>
        ) : (
          /* Confirmación Exitosa */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-4"
          >
            <div className="w-16 h-16 bg-cyan-500/20 border border-cyan-500 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
              ✨
            </div>
            <h2 className="text-2xl font-bold text-white">¡Configuración Procesada con Éxito!</h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Tus servicios seleccionados y requerimientos han sido registrados correctamente en Supabase.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <button 
                onClick={() => { setSubmitted(false); setSelectedServices([]); setDescription(''); }}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-xl text-sm font-mono transition-all"
              >
                ← Configurar otro requerimiento
              </button>
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}

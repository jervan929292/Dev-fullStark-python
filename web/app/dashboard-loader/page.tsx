'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const SERVICES = [
  { id: 'domain', name: 'Registro de Dominio Global (.com / .net / .io)', price: 15, category: 'Infraestructura', icon: '🌐', description: 'Dominio personalizado por 1 año con gestión DNS avanzada y propagación ultra-rápida.' },
  { id: 'vps', name: 'Servidor VPS Cloud Optimizado (4 vCPU / 8GB RAM)', price: 35, category: 'Infraestructura', icon: '⚡', description: 'Servidor virtual privado de alto rendimiento con almacenamiento NVMe dedicado.' },
  { id: 'hosting', name: 'Alojamiento Web NVMe Escalable (Anual)', price: 60, category: 'Infraestructura', icon: '💻', description: 'Hosting web de alta disponibilidad con discos SSD NVMe y certificados SSL automáticos.' },
  { id: 'fullstack', name: 'Desarrollo de App Fullstack (Next.js / Node)', price: 350, category: 'Desarrollo', icon: '🚀', description: 'Ecosistema web moderno completo optimizado para SEO, SSR y rendimiento extremo.' },
  { id: 'mobile', name: 'Desarrollo App Móvil (React Native / Expo)', price: 400, category: 'Desarrollo', icon: '📱', description: 'Aplicación multiplataforma nativa para iOS y Android con sincronización en tiempo real.' },
  { id: 'migration', name: 'Migración Completa de Servidores & DB', price: 45, category: 'Soporte', icon: '🔄', description: 'Traslado seguro de bases de datos y archivos sin pérdida de tiempo de actividad.' },
  { id: 'ssl', name: 'Certificado SSL Wildcard & Firewall Avanzado', price: 30, category: 'Seguridad', icon: '🔒', description: 'Protección criptográfica total para dominios y subdominios ilimitados.' },
  { id: 'database', name: 'Arquitectura Backend Supabase / PostgreSQL Pro', price: 50, category: 'Backend', icon: '🗄️', description: 'Estructuración relacional avanzada con políticas RLS y respaldos diarios.' },
  { id: 'ai', name: 'Integración de Agentes IA & LLM APIs', price: 120, category: 'Inteligencia Artificial', icon: '🤖', description: 'Conexión de modelos avanzados de lenguaje y flujos automatizados de asistencia.' }
];

export default function DashboardLoaderPro() {
  const [client, setClient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
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
        console.error("Error al leer sesión", e);
      }
    }
  }, []);

  const categories = ['Todos', 'Infraestructura', 'Desarrollo', 'Soporte', 'Seguridad', 'Backend', 'Inteligencia Artificial'];

  const filteredServices = SERVICES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          project_type: `Módulos: ${namesSelected}`,
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
      setMensaje('Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fullstar_client');
    window.location.href = '/';
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 space-y-16">
      
      {/* Cabecera elegante y amplia estilo editorial moderno */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <span className="text-xs uppercase tracking-[0.3em] font-mono text-cyan-400 bg-cyan-950/40 px-4 py-1.5 rounded-full border border-cyan-800/50">
          Infraestructura & Ecosistema Web3
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white font-sans">
          Construye infraestructura <span className="font-normal italic text-cyan-300">describiéndola.</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
          Selecciona los módulos tecnológicos que requieres, configura los parámetros y despliega soluciones escalables sincronizadas al instante.
        </p>
      </motion.div>

      <AnimatePresence>
        {mensaje && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-slate-900 border border-slate-800 text-cyan-300 rounded-xl text-center text-sm font-mono max-w-2xl mx-auto shadow-lg"
          >
            {mensaje}
          </motion.div>
        )}
      </AnimatePresence>

      {client && !submitted ? (
        <motion.form 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          onSubmit={handleCreateOrder} 
          className="space-y-12"
        >
          {/* Tarjeta de sesión limpia y minimalista */}
          <div className="p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Cliente Conectado</span>
              <p className="text-lg font-medium text-white tracking-wide">{client.nombre}</p>
              <p className="text-xs text-slate-400 font-mono">Doc: {client.cedula} &bull; Tel: {client.telefono}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-mono text-rose-400 hover:text-rose-300 bg-rose-950/20 px-4 py-2 rounded-lg border border-rose-900/40 transition-all cursor-pointer"
            >
              Cerrar Sesión &times;
            </button>
          </div>

          {/* Buscador y Filtros limpios */}
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="w-full lg:w-1/2 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">🔍</span>
                <input 
                  type="text"
                  placeholder="Buscar módulos de servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all text-sm font-mono"
                />
              </div>

              <div className="w-full lg:w-auto flex overflow-x-auto gap-2 pb-2 lg:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer border ${
                      selectedCategory === cat
                        ? 'bg-white text-slate-950 border-white font-medium shadow-md'
                        : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cuadrícula amplia y elegante de servicios (Tipo Landing Page Pro) */}
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <h3 className="text-xs uppercase font-mono tracking-widest text-slate-400">Selecciona los componentes ({filteredServices.length})</h3>
              <span className="text-xs font-mono text-cyan-400">{selectedServices.length} seleccionados</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <motion.div
                    key={service.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleService(service.id)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-6 relative ${
                      isSelected 
                        ? 'bg-slate-900/90 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500' 
                        : 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-3xl p-3 bg-slate-950 rounded-xl border border-slate-800/80 inline-block">{service.icon}</span>
                        <span className="text-lg font-mono font-light text-cyan-300">${service.price} <span className="text-xs text-slate-500">USD</span></span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-500">{service.category}</span>
                        <h4 className="text-base font-medium text-white leading-snug">{service.name}</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-light">{service.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                      <span className={isSelected ? "text-cyan-400 font-medium" : "text-slate-500"}>
                        {isSelected ? 'Módulo Activo ✓' : 'Añadir módulo +'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Especificaciones técnicas con diseño limpio */}
          <div className="space-y-3 pt-4">
            <label className="block text-xs uppercase font-mono tracking-widest text-slate-400">
              Especificaciones y Notas del Proyecto
            </label>
            <textarea 
              rows={4}
              required
              placeholder="Describe requerimientos especiales, accesos o notas adicionales..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm font-mono resize-none"
            />
          </div>

          {/* Resumen final y botón de ejecución estilo Apple/Web3 */}
          <div className="pt-8 border-t border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left space-y-1">
              <span className="text-xs uppercase font-mono text-slate-500 tracking-wider">Inversión Total Estimada</span>
              <div className="text-4xl sm:text-5xl font-light text-white font-mono">
                ${totalPrice} <span className="text-sm text-cyan-400 font-normal">USD</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={selectedServices.length === 0 || loading}
              className={`w-full lg:w-auto px-10 py-4 rounded-full font-medium tracking-wide transition-all text-sm uppercase font-mono ${
                selectedServices.length > 0 && !loading
                  ? 'bg-white text-slate-950 hover:bg-cyan-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer'
                  : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
              }`}
            >
              {loading ? 'Procesando...' : 'Lanzar Orden en Supabase 🚀'}
            </motion.button>
          </div>
        </motion.form>
      ) : submitted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 space-y-6 max-w-xl mx-auto bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md"
        >
          <div className="w-16 h-16 bg-white text-slate-950 font-bold rounded-full flex items-center justify-center mx-auto text-2xl shadow-xl">
            ✓
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-white">Orden Registrada Exitosamente</h2>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Los servicios seleccionados se han vinculado correctamente en Supabase. El equipo técnico iniciará la configuración.
            </p>
          </div>
          <button 
            onClick={() => { setSubmitted(false); setSelectedServices([]); setDescription(''); }}
            className="mt-4 px-8 py-3 bg-slate-900 text-cyan-400 border border-slate-800 rounded-full text-xs font-mono transition-all hover:bg-slate-800 cursor-pointer"
          >
            ← Configurar nueva orden
          </button>
        </motion.div>
      ) : (
        <div className="text-center py-28 space-y-4">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-mono text-xs">Cargando perfil...</p>
        </div>
      )}

    </div>
  );
}

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
    <div className="w-full flex-1 flex flex-col px-6 sm:px-12 lg:px-24 py-10 space-y-12">
      
      {/* Cabecera fluida sin cajas envolventes */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 max-w-4xl"
      >
        <span className="text-xs uppercase tracking-[0.25em] font-mono text-cyan-400">
          // INFRAESTRUCTURA & ECOSYSTEM WEB3
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
          Centro de Control <span className="text-cyan-400">&</span> Cotizador Pro
        </h1>
        <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
          Selecciona los módulos tecnológicos que requieres, configura los parámetros y despliega soluciones sincronizadas al instante con Supabase.
        </p>
      </motion.div>

      <AnimatePresence>
        {mensaje && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-cyan-950/80 border border-cyan-500 text-cyan-200 rounded-xl text-sm font-mono"
          >
            {mensaje}
          </motion.div>
        )}
      </AnimatePresence>

      {client && !submitted ? (
        <motion.form 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          onSubmit={handleCreateOrder} 
          className="space-y-12 w-full"
        >
          {/* Barra de Sesión Activa (De lado a lado, sin caja flotante chica) */}
          <div className="py-6 border-y border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">Cliente Conectado</span>
              <p className="text-xl font-bold text-white tracking-wide">{client.nombre}</p>
              <p className="text-xs text-slate-400 font-mono">Doc: <span className="text-white">{client.cedula}</span> &bull; Tel: <span className="text-white">{client.telefono}</span></p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-mono text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-900 px-5 py-2.5 rounded-lg border border-rose-800 transition-all cursor-pointer"
            >
              Cerrar Sesión ✕
            </button>
          </div>

          {/* Buscador y Filtros a ancho completo */}
          <div className="space-y-6">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 text-lg">🔍</span>
              <input 
                type="text"
                placeholder="Buscar módulos de servicios (Ej. VPS, Dominio, Base de datos)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base font-mono"
              />
            </div>

            <div className="flex overflow-x-auto gap-2 pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                      : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cuadrícula expandida a todo el ancho */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <h3 className="text-xs uppercase font-mono tracking-widest text-slate-400">Componentes disponibles ({filteredServices.length})</h3>
              <span className="text-xs font-mono text-cyan-400 font-bold">{selectedServices.length} seleccionados</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {filteredServices.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleService(service.id)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-6 ${
                      isSelected 
                        ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-500 shadow-lg' 
                        : 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-3xl p-3 bg-slate-950 rounded-xl border border-slate-800">{service.icon}</span>
                        <span className="text-lg font-mono font-bold text-cyan-300">${service.price} <span className="text-xs text-slate-500 font-normal">USD</span></span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">{service.category}</span>
                        <h4 className="text-base font-bold text-white leading-snug">{service.name}</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">{service.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                      <span className={isSelected ? "text-cyan-400 font-bold uppercase tracking-wider" : "text-slate-500"}>
                        {isSelected ? '✓ Módulo Activo' : '+ Añadir módulo'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Especificaciones técnicas a ancho completo */}
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
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base font-mono resize-none"
            />
          </div>

          {/* Resumen Final y Botón de Acción Abajo */}
          <div className="pt-8 border-t border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6 w-full pb-10">
            <div className="text-center lg:text-left space-y-1">
              <span className="text-xs uppercase font-mono text-slate-500 tracking-wider">Inversión Total Estimada</span>
              <div className="text-4xl sm:text-6xl font-extrabold text-cyan-400 font-mono">
                ${totalPrice} <span className="text-sm text-slate-400 font-normal">USD</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={selectedServices.length === 0 || loading}
              className={`w-full lg:w-auto px-12 py-5 rounded-2xl font-bold tracking-wide transition-all text-sm uppercase font-mono ${
                selectedServices.length > 0 && !loading
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer shadow-[0_0_30px_rgba(6,182,212,0.4)]'
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
          className="text-center py-24 space-y-6 max-w-xl mx-auto"
        >
          <div className="w-20 h-20 bg-cyan-500 text-slate-950 font-black rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg">
            ✓
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Orden Registrada Exitosamente</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Los servicios seleccionados se han vinculado correctamente en Supabase. El equipo técnico iniciará la configuración.
            </p>
          </div>
          <button 
            onClick={() => { setSubmitted(false); setSelectedServices([]); setDescription(''); }}
            className="mt-6 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-xl text-xs font-mono transition-all cursor-pointer"
          >
            ← Configurar nueva orden
          </button>
        </motion.div>
      ) : (
        <div className="text-center py-32 space-y-4">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-mono text-xs">Cargando perfil...</p>
        </div>
      )}

    </div>
  );
}

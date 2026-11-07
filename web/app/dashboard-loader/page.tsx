'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const SERVICES = [
  { id: 'domain', name: 'Registro de Dominio Global (.com / .net / .io)', price: 16.05, category: 'Infraestructura', icon: '🌐', description: 'Dominio personalizado con gestión DNS avanzada y propagación ultra-rápida.' },
  { id: 'vps', name: 'Servidor VPS Cloud Optimizado (4 vCPU / 8GB RAM)', price: 37.45, category: 'Infraestructura', icon: '⚡', description: 'Servidor virtual privado de alto rendimiento con almacenamiento NVMe dedicado.' },
  { id: 'hosting', name: 'Alojamiento Web NVMe Escalable', price: 64.20, category: 'Infraestructura', icon: '💻', description: 'Hosting web de alta disponibilidad con discos SSD NVMe y certificados SSL automáticos.' },
  { id: 'fullstack', name: 'Desarrollo de App Fullstack (Next.js / Node)', price: 374.50, category: 'Desarrollo', icon: '🚀', description: 'Ecosistema web moderno completo optimizado para SEO, SSR y rendimiento extremo.' },
  { id: 'mobile', name: 'Desarrollo App Móvil (React Native / Expo)', price: 428.00, category: 'Desarrollo', icon: '📱', description: 'Aplicación multiplataforma nativa para iOS y Android con sincronización en tiempo real.' },
  { id: 'migration', name: 'Migración Completa de Servidores & DB', price: 48.15, category: 'Soporte', icon: '🔄', description: 'Traslado seguro de bases de datos y archivos sin pérdida de tiempo de actividad.' },
  { id: 'ssl', name: 'Certificado SSL Wildcard & Firewall Avanzado', price: 32.10, category: 'Seguridad', icon: '🔒', description: 'Protección criptográfica total para dominios y subdominios ilimitados.' },
  { id: 'database', name: 'Arquitectura Backend Supabase / PostgreSQL Pro', price: 53.50, category: 'Backend', icon: '🗄️', description: 'Estructuración relacional avanzada con políticas RLS y respaldos diarios.' },
  { id: 'ai', name: 'Integración de Agentes IA & LLM APIs', price: 128.40, category: 'Inteligencia Artificial', icon: '🤖', description: 'Conexión de modelos avanzados de lenguaje y flujos automatizados de asistencia.' }
];

export default function DashboardLoaderPro() {
  const [client, setClient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [billingCycle, setBillingCycle] = useState<number>(1);
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

  const baseMonthlyPrice = selectedServices.reduce((acc, id) => {
    const s = SERVICES.find(item => item.id === id);
    return acc + (s ? s.price : 0);
  }, 0);

  const discountMultiplier = billingCycle === 12 ? 0.8 : billingCycle === 6 ? 0.9 : billingCycle === 3 ? 0.95 : 1;
  const totalPrice = Math.round(baseMonthlyPrice * billingCycle * discountMultiplier);

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

      const cycleName = billingCycle === 12 ? '1 Año' : `${billingCycle} Meses`;

      const { error } = await supabase.from('orders').insert([
        {
          client_id: client.id,
          project_type: `Módulos: ${namesSelected} (${cycleName})`,
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
    <div className="relative w-full flex-1 flex flex-col px-4 sm:px-8 lg:px-16 py-10 space-y-10 bg-slate-950 text-slate-100 overflow-hidden text-xs sm:text-sm">
      
      {/* Fondo inmersivo con imagen tecnológica */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none filter blur-[2px]"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1920&auto=format&fit=crop')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-cyan-950/50 pointer-events-none" />

      {/* Cabecera Principal con Logotipo Neón Integrado */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 space-y-4 max-w-3xl"
      >
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            <span className="text-2xl font-black text-cyan-300 font-mono">⚡</span>
            <div className="absolute inset-0 rounded-2xl border border-cyan-400 animate-ping opacity-25 pointer-events-none"></div>
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400 font-bold block">FULLSTAR.DEV</span>
            <span className="text-[10px] font-mono text-slate-400 tracking-widest">// SECURE CLOUD CORE</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 font-mono uppercase tracking-[0.2em] text-[10px] shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            // INFRAESTRUCTURA & ECOSYSTEM WEB3
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Centro de Control <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">&</span> Cotizador Pro
          </h1>
          <p className="text-slate-300 font-light leading-relaxed max-w-xl text-xs sm:text-sm">
            Selecciona los módulos tecnológicos, define el plazo de contratación y despliega soluciones sincronizadas en tiempo real con Supabase.
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {mensaje && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative z-10 p-3 bg-slate-900/90 border border-cyan-500/50 text-cyan-300 rounded-xl font-mono backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] text-xs"
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
          className="relative z-10 space-y-10 w-full"
        >
          {/* Barra de Sesión Activa */}
          <div className="py-5 px-6 bg-slate-900/80 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Cliente Conectado
              </span>
              <p className="text-base font-black text-white tracking-wide uppercase">{client.nombre}</p>
              <p className="text-[11px] text-slate-300 font-mono">Doc: <span className="text-cyan-300">{client.cedula}</span> &bull; Tel: <span className="text-cyan-300">{client.telefono}</span></p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-[11px] font-mono text-rose-400 hover:text-white bg-rose-950/60 hover:bg-rose-900 px-4 py-2 rounded-xl border border-rose-800/80 transition-all cursor-pointer shadow-md"
            >
              Cerrar Sesión ✕
            </button>
          </div>

          {/* Selector de Ciclo de Facturación */}
          <div className="space-y-3">
            <label className="block text-[11px] uppercase font-mono tracking-widest text-cyan-400">
              Plazo de Contratación / Ciclo de Facturación:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { months: 1, label: '1 Mes', desc: 'Tarifa estándar' },
                { months: 3, label: '3 Meses', desc: '5% Descuento' },
                { months: 6, label: '6 Meses', desc: '10% Descuento' },
                { months: 12, label: '1 Año', desc: '20% Descuento' }
              ].map(cycle => (
                <button
                  key={cycle.months}
                  type="button"
                  onClick={() => setBillingCycle(cycle.months)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-center gap-1 ${
                    billingCycle === cycle.months
                      ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-white text-xs">{cycle.label}</span>
                  <span className="text-[10px] font-mono text-cyan-300">{cycle.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Buscador y Filtros */}
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-cyan-400 text-sm">🔍</span>
              <input 
                type="text"
                placeholder="Buscar módulos de servicios (Ej. VPS, Dominio, Base de datos)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all text-xs sm:text-sm font-mono shadow-inner"
              />
            </div>

            <div className="flex overflow-x-auto gap-2 pb-1 custom-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:text-white hover:border-cyan-500/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cuadrícula de Módulos */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <h3 className="text-[11px] uppercase font-mono tracking-widest text-cyan-400">Componentes disponibles ({filteredServices.length})</h3>
              <span className="text-[11px] font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">{selectedServices.length} seleccionados</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {filteredServices.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleService(service.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-4 backdrop-blur-2xl shadow-lg relative overflow-hidden ${
                      isSelected 
                        ? 'bg-slate-900/95 border-cyan-400 ring-1 ring-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.25)]' 
                        : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-2xl p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 shadow-inner inline-block">{service.icon}</span>
                        <span className="text-sm font-mono font-black text-cyan-300">${service.price.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">USD/mes</span></span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400 font-bold">{service.category}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">{service.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-light">{service.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className={isSelected ? "text-cyan-300 font-black uppercase tracking-wider text-[10px]" : "text-slate-400 text-[10px]"}>
                        {isSelected ? '✓ Módulo Activo' : '+ Añadir módulo'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="space-y-2 pt-2">
            <label className="block text-[11px] uppercase font-mono tracking-widest text-cyan-400">
              Especificaciones y Notas del Proyecto
            </label>
            <textarea 
              rows={3}
              required
              placeholder="Describe requerimientos especiales, accesos o notas adicionales..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all text-xs sm:text-sm font-mono resize-none shadow-inner"
            />
          </div>

          {/* Resumen Final y Botón de Acción */}
          <div className="pt-6 border-t border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6 w-full pb-8 bg-slate-900/80 backdrop-blur-2xl p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
            <div className="text-center lg:text-left space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Inversión Total Protegida ({billingCycle === 12 ? '1 Año' : `${billingCycle} Meses`})</span>
              <div className="text-3xl sm:text-5xl font-black text-cyan-400 font-mono">
                ${totalPrice} <span className="text-xs text-slate-300 font-normal">USD Total</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={selectedServices.length === 0 || loading}
              className={`w-full lg:w-auto px-8 py-4 rounded-xl font-black tracking-wider transition-all text-xs uppercase font-mono shadow-xl ${
                selectedServices.length > 0 && !loading
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 text-white cursor-pointer shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:opacity-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {loading ? 'Procesando Sincronización...' : 'Lanzar Orden en Supabase 🚀'}
            </motion.button>
          </div>
        </motion.form>
      ) : submitted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center py-20 space-y-5 max-w-lg mx-auto bg-slate-900/90 backdrop-blur-3xl border border-cyan-500/40 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)]"
        >
          <div className="w-16 h-16 bg-cyan-500 text-slate-950 font-black rounded-full flex items-center justify-center mx-auto text-2xl shadow-[0_0_25px_rgba(6,182,212,0.5)] animate-pulse">
            ✓
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-white">Orden Registrada Exitosamente</h2>
            <p className="text-slate-300 text-xs leading-relaxed font-light">
              Los servicios seleccionados se han vinculado correctamente en Supabase. El equipo técnico iniciará la configuración.
            </p>
          </div>
          <button 
            onClick={() => { setSubmitted(false); setSelectedServices([]); setDescription(''); }}
            className="mt-4 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-mono transition-all cursor-pointer shadow-lg"
          >
            ← Configurar nueva orden
          </button>
        </motion.div>
      ) : (
        <div className="relative z-10 text-center py-28 space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          <p className="text-slate-400 font-mono text-[11px] tracking-wider">Cargando perfil del sistema...</p>
        </div>
      )}

    </div>
  );
}

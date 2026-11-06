'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL || '',
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);
// Catálogo completo de servicios tecnológicos y de infraestructura
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
// Estados de Registro / Identificación del Cliente
const [cedula, setCedula] = useState('');
const [telefono, setTelefono] = useState('');
const [nombre, setNombre] = useState('');
const [isRegistered, setIsRegistered] = useState(false);
const [client, setClient] = useState<any>(null);
// Estados del panel interactivo de servicios y cotización
const [searchTerm, setSearchTerm] = useState('');
const [selectedServices, setSelectedServices] = useState<string[]>([]);
const [description, setDescription] = useState('');
const [loading, setLoading] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [mensaje, setMensaje] = useState('');
// Autenticar o registrar cliente en Supabase verificando la cédula
const handleLoginOrRegister = async (e: React.FormEvent) => {
e.preventDefault();
setMensaje('');
try {
const { data: existingClient, error: fetchError } = await supabase
.from('clients')
.select('*')
.eq('cedula', cedula)
.maybeSingle();
if (fetchError) {
setMensaje('Error en consulta: ' + fetchError.message);
return;
}
if (existingClient) {
setClient(existingClient);
setIsRegistered(true);
setMensaje('¡Sesión restaurada con éxito en el ecosistema Fullstar!');
} else {
const { data: newClient, error: insertError } = await supabase
.from('clients')
.insert([{ cedula, telefono, nombre: nombre || 'Cliente FULLSTAR' }])
.select()
.single();
if (insertError) {
setMensaje('Error al registrar cliente: ' + insertError.message);
} else {
setClient(newClient);
setIsRegistered(true);
setMensaje('¡Nuevo cliente registrado y vinculado correctamente!');
}
}
} catch (err: any) {
setMensaje('Error de conexión con la base de datos.');
}
};
// Filtrado de servicios en tiempo real desde el buscador
const filteredServices = SERVICES.filter(s =>
s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
s.description.toLowerCase().includes(searchTerm.toLowerCase())
);
// Alternar selección de servicios de infraestructura
const toggleService = (id: string) => {
setSelectedServices(prev =>
prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
);
};
// Cálculo del costo total estimado
const totalPrice = selectedServices.reduce((acc, id) => {
const s = SERVICES.find(item => item.id === id);
return acc + (s ? s.price : 0);
}, 0);
// Crear la orden relacional vinculada al client_id en Supabase
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
project_type: Infraestructura: ${namesSelected},
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
return (
<div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden flex flex-col items-center justify-center p-4 md:p-8">
{/* Fondo inmersivo con overlay cyberpunk */}
<div
className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none filter blur-[1px]"
style={{ backgroundImage: url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop') }}
/>
<div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/85 to-cyan-950/50 pointer-events-none" />
{/* Contenedor Principal */}
<motion.div
initial={{ opacity: 0, y: 40, scale: 0.98 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{ duration: 0.6, ease: "easeOut" }}
className="relative z-10 max-w-4xl w-full bg-slate-900/85 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.18)] p-6 md:p-12"
>
{/* Cabecera */}
<div className="text-center mb-8">
<motion.div
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ delay: 0.2 }}
className="inline-block px-4 py-1.5 mb-3 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.2)]"
>
// Fullstar Infrastructure & Cyber Ecosystem
</motion.div>
<h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
Centro de Control & Cotizador
</h1>
<p className="text-slate-400 text-sm md:text-base mt-2 max-w-xl mx-auto">
Plataforma interactiva de integración con Supabase, buscador de precios en tiempo real y flujos avanzados de desarrollo.
</p>
</div>
{/* Mensajes de Alerta */}
<AnimatePresence>
{mensaje && (
<motion.div
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0 }}
className="mb-6 p-4 bg-slate-950/90 border border-cyan-500/40 text-cyan-300 rounded-2xl text-center text-sm shadow-inner font-mono"
>
{mensaje}
</motion.div>
)}
</AnimatePresence>
{/* FASE 1: REGISTRO / AUTENTICACIÓN */}
{!isRegistered ? (
<motion.form
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.4 }}
onSubmit={handleLoginOrRegister}
className="space-y-5 max-w-xl mx-auto"
>
<div className="border-b border-slate-800 pb-3 flex items-center justify-between">
<h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></span>
1. Validación e Identificación de Cliente
</h2>
<span className="text-xs font-mono text-cyan-400/80">Seguro v2.4</span>
</div>
<div>
<label className="block text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">Cédula de Identidad / RIF</label>
<input
type="text"
required
placeholder="Ej. V12345678"
value={cedula}
onChange={(e) => setCedula(e.target.value)}
className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
/>
</div>
<div>
<label className="block text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">Teléfono Celular / WhatsApp</label>
<input
type="text"
required
placeholder="Ej. 04141234567"
value={telefono}
onChange={(e) => setTelefono(e.target.value)}
className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
/>
</div>
<div>
<label className="block text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">Nombre Completo o Razón Social</label>
<input
type="text"
required
placeholder="Tu Nombre o Empresa"
value={nombre}
onChange={(e) => setNombre(e.target.value)}
className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
/>
</div>
<motion.button
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
type="submit"
className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer mt-2"
>
Conectar al Ecosistema Fullstar 🚀
</motion.button>
</motion.form>
) : !submitted ? (
/* FASE 2: BUSCADOR Y SELECCIÓN /
<motion.form
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.4 }}
onSubmit={handleCreateOrder}
className="space-y-6"
>
{/ Tarjeta de Sesión Activa */}
<div className="p-4 bg-slate-950/90 rounded-2xl border border-cyan-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
<div>
<p className="text-xs text-slate-400 font-mono">Usuario Autenticado:</p>
<p className="font-bold text-cyan-300 text-lg">{client.nombre}</p>
<p className="text-xs text-slate-500 font-mono">Cédula: {client.cedula} | Tel: {client.telefono}</p>
</div>
<button
type="button"
onClick={() => setIsRegistered(false)}
className="text-xs text-cyan-400 hover:text-cyan-300 underline font-mono bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-500/30 transition-all"
>
Cambiar datos de sesión
</button>
</div>
{/* Buscador */}
<div>
<label className="block text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
Buscar Infraestructura, Servidores o Dominios:
</label>
<div className="relative">
<span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 text-lg">🔍</span>
<input
type="text"
placeholder="Escribe para buscar servicios (Ej. VPS, Dominio, Base de datos...)"
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
/>
</div>
</div>
{/* Cuadrícula de Servicios */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-72 overflow-y-auto pr-2">
{filteredServices.map((service) => {
const isSelected = selectedServices.includes(service.id);
return (
<motion.div
key={service.id}
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
onClick={() => toggleService(service.id)}
className={p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${ isSelected  ? 'bg-cyan-950/50 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.25)]'  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700' }}
>
<div className="flex items-center justify-between mb-2">
<div className="flex items-center space-x-3">
<span className="text-3xl">{service.icon}</span>
<div>
<h3 className="text-sm font-semibold text-white">{service.name}</h3>
<span className="text-[11px] text-cyan-400/90 font-mono">{service.category}</span>
</div>
</div>
<span className="text-cyan-300 font-mono font-bold text-lg">${service.price}</span>
</div>
<p className="text-xs text-slate-400 mt-1 leading-relaxed">{service.description}</p>
</motion.div>
);
})}
</div>
{/* Campo de Descripción */}
<div>
<label className="block text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
Especificaciones Técnicas del Proyecto:
</label>
<textarea
rows={3}
required
placeholder="Describe requerimientos especiales, accesos o notas adicionales..."
value={description}
onChange={(e) => setDescription(e.target.value)}
className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
/>
</div>
{/* Resumen de Costos */}
<div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
<div>
<span className="text-xs text-slate-400 block uppercase font-mono">Inversión Total Estimada:</span>
<span className="text-3xl md:text-4xl font-extrabold text-cyan-400 font-mono">${totalPrice} <span className="text-xs text-slate-500 font-normal">USD</span></span>
</div>
<motion.button
whileHover={{ scale: 1.04 }}
whileTap={{ scale: 0.96 }}
type="submit"
disabled={selectedServices.length === 0 || loading}
className={w-full md:w-auto px-8 py-4 rounded-2xl font-bold tracking-wide transition-all ${ selectedServices.length > 0 && !loading ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed' }}
>
{loading ? 'Guardando en Base de Datos...' : 'Lanzar Orden en Supabase 🚀'}
</motion.button>
</div>
</motion.form>
) : (
/* FASE 3: CONFIRMACIÓN */
<motion.div
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
className="text-center py-12 space-y-5"
>
<div className="w-20 h-20 bg-cyan-500/20 border-2 border-cyan-400 rounded-full flex items-center justify-center mx-auto text-4xl shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-pulse">
✨
</div>
<h2 className="text-2xl md:text-3xl font-bold text-white">¡Orden Registrada con Éxito!</h2>
<p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
La infraestructura y los servicios seleccionados se han enlazado de forma relacional en tus tablas de Supabase. El equipo técnico procederá con la activación.
</p>
<button
onClick={() => { setSubmitted(false); setSelectedServices([]); setDescription(''); }}
className="mt-6 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-2xl text-sm font-mono transition-all shadow-lg cursor-pointer"
>
← Configurar nueva orden
</button>
</motion.div>
)}
</motion.div>
</div>
);
  }

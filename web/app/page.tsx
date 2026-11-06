'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function Home() {
  const [cedula, setCedula] = useState('')
  const [telefono, setTelefono] = useState('')
  const [nombre, setNombre] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [client, setClient] = useState<any>(null)
  
  const [projectType, setProjectType] = useState('Desarrollo Web')
  const [descripcion, setDescripcion] = useState('')
  const [presupuesto, setPresupuesto] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleLoginOrRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje('')

    let { data: existingClient } = await supabase
      .from('clients')
      .select('*')
      .eq('cedula', cedula)
      .single()

    if (existingClient) {
      setClient(existingClient)
      setIsRegistered(true)
      setMensaje('¡Bienvenido de nuevo!')
    } else {
      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert([{ cedula, telefono, nombre: nombre || 'Cliente FULLSTAR' }])
        .select()
        .single()

      if (insertError) {
        setMensaje('Error al registrar: ' + insertError.message)
      } else {
        setClient(newClient)
        setIsRegistered(true)
        setMensaje('¡Registro exitoso!')
      }
    }
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!client) return

    const { error } = await supabase.from('orders').insert([
      {
        client_id: client.id,
        project_type: projectType,
        descripcion,
        presupuesto_estimado: parseFloat(presupuesto) || 0,
        estado: 'Pendiente'
      }
    ])

    if (error) {
      setMensaje('Error al crear orden: ' + error.message)
    } else {
      setMensaje('¡Orden de proyecto registrada con éxito!')
      setDescripcion('')
      setPresupuesto('')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        
        {/* Contenedor del Logo Optimizado */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 sm:w-40 sm:h-40 relative flex items-center justify-center bg-slate-950/50 rounded-2xl border border-slate-800 p-2 overflow-hidden shadow-inner">
            <img 
              src="/logo.png" 
              alt="FULLSTAR Logo" 
              className="max-h-full max-w-full object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]" 
            />
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-cyan-400 mb-2 text-center tracking-tight">FULLSTAR.dev</h1>
        <p className="text-slate-400 text-sm sm:text-base text-center mb-8">Sistema de Licitación y Cotización de Proyectos</p>

        {mensaje && (
          <div className="mb-6 p-4 bg-slate-800/80 border border-cyan-500/30 text-cyan-300 rounded-xl text-center text-sm shadow-md">
            {mensaje}
          </div>
        )}

        {!isRegistered ? (
          <form onSubmit={handleLoginOrRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Cédula de Identidad</label>
              <input
                type="text"
                required
                placeholder="Ej. V12345678"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Teléfono de Contacto</label>
              <input
                type="text"
                required
                placeholder="Ej. 04141234567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre Completo / Empresa</label>
              <input
                type="text"
                required
                placeholder="Tu Nombre o Negocio"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 font-bold text-white py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/40 text-base mt-2"
            >
              Ingresar / Registrarse
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">Cliente conectado:</p>
                <p className="font-bold text-base sm:text-lg text-cyan-300">{client.nombre}</p>
                <p className="text-xs text-slate-500">Cédula: {client.cedula}</p>
              </div>
              <button
                onClick={() => setIsRegistered(false)}
                className="text-xs text-slate-400 hover:text-white underline px-2 py-1"
              >
                Cambiar
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-5">
              <h2 className="text-lg sm:text-xl font-bold text-slate-200 border-b border-slate-800 pb-2">Cotizar Nuevo Proyecto</h2>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Tipo de Servicio</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm sm:text-base"
                >
                  <option value="Desarrollo Web">Desarrollo Web (Next.js / Fullstack)</option>
                  <option value="App Móvil">App Móvil (Capacitor / React Native)</option>
                  <option value="Sistema POS / Inventario">Sistema POS / Inventario (Vendex)</option>
                  <option value="Automatización / IT">Automatización y Soporte Técnico</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Descripción de los Requerimientos</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detalla los módulos o funciones que necesitas..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Presupuesto Estimado ($)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-white py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/40 text-base mt-2"
              >
                Enviar Orden de Proyecto
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}

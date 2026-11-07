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

    try {
      // Usamos maybeSingle para evitar que crashee si el cliente no existe
      let { data: existingClient, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('cedula', cedula)
        .maybeSingle()

      if (fetchError) {
        setMensaje('Error en consulta: ' + fetchError.message)
        return
      }

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
    } catch (err: any) {
      setMensaje('Error de conexión con la base de datos.')
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
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-3 sm:p-6 md:p-10">
      <div className="w-full max-w-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-full max-h-36 mb-4 flex justify-center items-center">
            <img 
              src="/logo.png" 
              alt="FULLSTAR Logo" 
              className="h-24 sm:h-32 w-auto object-contain drop-shadow-[0_0_25px_rgba(6,182,212,0.25)]" 
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wide">
            FULLSTAR.dev
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">
            Sistema de Licitación y Cotización de Proyectos
          </p>
        </div>

        {mensaje && (
          <div className="mb-6 p-4 bg-slate-950/80 border border-cyan-500/30 text-cyan-300 rounded-xl text-center text-sm shadow-inner">
            {mensaje}
          </div>
        )}

        {!isRegistered ? (
          <form onSubmit={handleLoginOrRegister} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Cédula de Identidad</label>
              <input
                type="text"
                required
                placeholder="Ej. V12345678"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Teléfono de Contacto</label>
              <input
                type="text"
                required
                placeholder="Ej. 04141234567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Nombre Completo / Empresa</label>
              <input
                type="text"
                required
                placeholder="Tu Nombre o Negocio"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 font-bold text-white py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/30 text-sm sm:text-base mt-2"
            >
              Ingresar / Registrarse
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">Cliente conectado:</p>
                <p className="font-bold text-base text-cyan-300">{client.nombre}</p>
                <p className="text-xs text-slate-500">Cédula: {client.cedula}</p>
              </div>
              <button
                onClick={() => setIsRegistered(false)}
                className="text-xs text-slate-400 hover:text-white underline px-2 py-1"
              >
                Cambiar
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 sm:space-y-5">
              <h2 className="text-base sm:text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">Cotizar Nuevo Proyecto</h2>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Tipo de Servicio</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base"
                >
                  <option value="Desarrollo Web">Desarrollo Web (Next.js / Fullstack)</option>
                  <option value="App Móvil">App Móvil (Capacitor / React Native)</option>
                  <option value="Sistema POS / Inventario">Sistema POS / Inventario (Vendex)</option>
                  <option value="Automatización / IT">Automatización y Soporte Técnico</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Descripción de los Requerimientos</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detalla los módulos o funciones que necesitas..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Presupuesto Estimado ($)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-white py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/30 text-sm sm:text-base mt-2"
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

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
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="FULLSTAR Logo" className="h-16 w-auto object-contain" />
        </div>
        <h1 className="text-3xl font-extrabold text-cyan-400 mb-2 text-center">FULLSTAR.dev</h1>
        <p className="text-slate-400 text-center mb-8">Sistema de Licitación y Cotización de Proyectos</p>

        {mensaje && (
          <div className="mb-6 p-4 bg-slate-800 border border-cyan-500/30 text-cyan-300 rounded-lg text-center text-sm">
            {mensaje}
          </div>
        )}

        {!isRegistered ? (
          <form onSubmit={handleLoginOrRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Cédula de Identidad</label>
              <input
                type="text"
                required
                placeholder="Ej. V12345678"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Teléfono de Contacto</label>
              <input
                type="text"
                required
                placeholder="Ej. 04141234567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nombre Completo / Empresa</label>
              <input
                type="text"
                required
                placeholder="Tu Nombre o Negocio"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 font-semibold text-white py-3 rounded-lg transition-colors shadow-lg"
            >
              Ingresar / Registrarse
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-400">Cliente conectado:</p>
                <p className="font-bold text-lg text-cyan-300">{client.nombre}</p>
                <p className="text-xs text-slate-500">Cédula: {client.cedula}</p>
              </div>
              <button
                onClick={() => setIsRegistered(false)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Cambiar
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-200">Cotizar Nuevo Proyecto</h2>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tipo de Servicio</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Desarrollo Web">Desarrollo Web (Next.js / Fullstack)</option>
                  <option value="App Móvil">App Móvil (Capacitor / React Native)</option>
                  <option value="Sistema POS / Inventario">Sistema POS / Inventario (Vendex)</option>
                  <option value="Automatización / IT">Automatización y Soporte Técnico</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Descripción de los Requerimientos</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detalla los módulos o funciones que necesitas..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Presupuesto Estimado ($)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 font-semibold text-white py-3 rounded-lg transition-colors shadow-lg"
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

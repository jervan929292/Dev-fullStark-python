'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function Home() {
  const router = useRouter()
  const [isLoginMode, setIsLoginMode] = useState(true)

  // Campos del formulario
  const [cedulaNum, setCedulaNum] = useState('')
  const [telefono, setTelefono] = useState('+58')
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Manejo estricto de la cédula: solo números después de V-
  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '')
    setCedulaNum(val)
  }

  // Manejo del nombre: convertir todo a mayúsculas automáticamente
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value.toUpperCase())
  }

  // Acción de Inicio de Sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje('')

    const cedulaCompleta = `V-${cedulaNum}`

    try {
      let { data: existingClient, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('cedula', cedulaCompleta)
        .maybeSingle()

      if (fetchError) {
        setMensaje('Error en consulta: ' + fetchError.message)
        return
      }

      if (existingClient) {
        // Validación opcional de contraseña si la tienes guardada
        localStorage.setItem('fullstar_client', JSON.stringify(existingClient))
        router.push('/dashboard-loader')
      } else {
        setMensaje('La cédula no está registrada. Por favor regístrese primero.')
      }
    } catch (err: any) {
      setMensaje('Error de conexión con la base de datos.')
    }
  }

  // Acción de Registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje('')

    const cedulaCompleta = `V-${cedulaNum}`

    try {
      let { data: existingClient } = await supabase
        .from('clients')
        .select('*')
        .eq('cedula', cedulaCompleta)
        .maybeSingle()

      if (existingClient) {
        setMensaje('Esta cédula ya se encuentra registrada. Inicie sesión.')
        return
      }

      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert([{ 
          cedula: cedulaCompleta, 
          telefono, 
          nombre: nombre || 'CLIENTE FULLSTAR',
          password // Asegúrate de tener esta columna en tu tabla si deseas guardar la clave
        }])
        .select()
        .single()

      if (insertError) {
        setMensaje('Error al registrar: ' + insertError.message)
      } else {
        localStorage.setItem('fullstar_client', JSON.stringify(newClient))
        router.push('/dashboard-loader')
      }
    } catch (err: any) {
      setMensaje('Error crítico al procesar el registro.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-3 sm:p-6 md:p-10">
      <div className="w-full max-w-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl">
        
        <div className="flex flex-col items-center text-center mb-6">
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

        {/* Pestañas para alternar entre Iniciar Sesión y Registrarse */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setIsLoginMode(true); setMensaje(''); }}
            className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
              isLoginMode 
                ? 'border-cyan-500 text-cyan-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginMode(false); setMensaje(''); }}
            className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
              !isLoginMode 
                ? 'border-cyan-500 text-cyan-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Registrarse
          </button>
        </div>

        {mensaje && (
          <div className="mb-6 p-4 bg-slate-950/80 border border-cyan-500/30 text-cyan-300 rounded-xl text-center text-sm shadow-inner font-mono">
            {mensaje}
          </div>
        )}

        {isLoginMode ? (
          /* FORMULARIO DE INICIO DE SESIÓN */
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Cédula de Identidad</label>
              <div className="flex bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-cyan-500 transition-all">
                <span className="bg-slate-900 px-4 py-3 text-slate-400 font-mono border-r border-slate-800 flex items-center">V-</span>
                <input
                  type="text"
                  required
                  placeholder="22600509"
                  value={cedulaNum}
                  onChange={handleCedulaChange}
                  className="w-full bg-transparent px-4 py-3 text-white placeholder-slate-600 focus:outline-none text-sm sm:text-base font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 font-bold text-white py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/30 text-sm sm:text-base mt-2 cursor-pointer"
            >
              Entrar al Dashboard 🚀
            </button>
          </form>
        ) : (
          /* FORMULARIO DE REGISTRO */
          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Cédula de Identidad</label>
              <div className="flex bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-cyan-500 transition-all">
                <span className="bg-slate-900 px-4 py-3 text-slate-400 font-mono border-r border-slate-800 flex items-center">V-</span>
                <input
                  type="text"
                  required
                  placeholder="22600509"
                  value={cedulaNum}
                  onChange={handleCedulaChange}
                  className="w-full bg-transparent px-4 py-3 text-white placeholder-slate-600 focus:outline-none text-sm sm:text-base font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Teléfono de Contacto (con código de país)</label>
              <input
                type="text"
                required
                placeholder="+584141234567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base font-mono"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Nombre Completo o Empresa</label>
              <input
                type="text"
                required
                placeholder="TU NOMBRE O NEGOCIO"
                value={nombre}
                onChange={handleNombreChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base uppercase"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-white py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/30 text-sm sm:text-base mt-2 cursor-pointer"
            >
              Registrarse y Acceder 🚀
            </button>
          </form>
        )}

      </div>
    </main>
  )
}

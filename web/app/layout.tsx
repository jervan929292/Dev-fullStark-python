import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FULLSTAR.dev - Ecosistema de Infraestructura",
  description: "Sistema de Licitación y Cotización de Proyectos Tecnológicos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
        
        {/* Cabecera expandida a todo el ancho sin cajas */}
        <header className="w-full py-5 px-6 sm:px-12 border-b border-slate-900 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">FULLSTAR.dev // Core</span>
          </div>
          <div className="text-xs font-mono text-slate-500 hidden sm:block">
            Secure Cloud Ecosystem v3.0
          </div>
        </header>

        {/* Contenido principal 100% libre, sin tarjetas envolventes */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        {/* Pie de página institucional de borde a borde */}
        <footer className="w-full py-6 px-6 text-center border-t border-slate-900 text-xs text-slate-500 font-mono bg-slate-950">
          &copy; 2026 FULLSTAR.dev. Todos los derechos reservados.
        </footer>

      </body>
    </html>
  );
}

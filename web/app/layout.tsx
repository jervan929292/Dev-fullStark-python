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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden relative">
        
        {/* Fondo cyberpunk global e inmersivo con efectos de luz */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/25 via-slate-950 to-slate-950 pointer-events-none z-0" />
        
        {/* Cabecera global estilizada */}
        <header className="relative z-20 w-full py-4 px-6 md:px-12 border-b border-slate-900/80 backdrop-blur-md bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.8)]"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">FULLSTAR.dev // Core</span>
          </div>
          <div className="text-xs font-mono text-slate-500 hidden sm:block">
            Secure Cloud Ecosystem v2.5
          </div>
        </header>

        {/* Contenido principal animado y centrado */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 w-full">
          {children}
        </main>

        {/* Pie de página institucional */}
        <footer className="relative z-20 w-full py-4 px-6 text-center border-t border-slate-900/80 text-xs text-slate-500 font-mono bg-slate-950/60">
          &copy; 2026 FULLSTAR.dev. Todos los derechos reservados.
        </footer>

      </body>
    </html>
  );
}

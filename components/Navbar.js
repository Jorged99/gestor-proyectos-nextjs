import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    // 'fixed top-0 left-0' ancla la barra al lado izquierdo
    <aside className="w-64 h-screen bg-slate-800 text-white shadow-xl flex flex-col justify-between fixed top-0 left-0 z-40">
      
      {/* PARTE SUPERIOR: Logo y Menú */}
      <div>
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-700 bg-slate-900">
          <Link href="/" className="font-bold text-2xl tracking-wider uppercase">
            Manager<span className="text-blue-400">-UDB</span>
          </Link>
        </div>

        {/* Menú de Navegación Vertical */}
        <nav className="mt-6 flex flex-col px-4 gap-2">
          <Link href="/" className="hover:bg-slate-700 px-4 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-3">
            <span>🏠</span> Inicio
          </Link>
          
          {user && (
            <Link href="/dashboard" className="bg-slate-700 border-l-4 border-blue-400 px-4 py-3 rounded-r-md text-sm font-medium transition-colors flex items-center gap-3">
              <span>📊</span> Proyectos
            </Link>
          )}
          
          <Link href="/about" className="hover:bg-slate-700 px-4 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-3">
            <span>ℹ️</span> Acerca de
          </Link>
        </nav>
      </div>

      {/* PARTE INFERIOR: Usuario y Sesión */}
      <div className="p-4 border-t border-slate-700 bg-slate-800">
        {user ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white flex-shrink-0">
                {user.name.charAt(0)}
              </div>
              <span className="text-slate-200 text-sm truncate font-medium">
                {user.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <Link href="/login" className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow">
            Iniciar Sesión
          </Link>
        )}
      </div>

    </aside>
  );
}
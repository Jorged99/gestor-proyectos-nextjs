import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-10 rounded-lg shadow-md max-w-md w-full border-t-4 border-blue-600">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Gestor de Proyectos</h1>
        <p className="text-gray-600 mb-8">
          Bienvenido. Administra tus proyectos y tareas de manera eficiente y centralizada.
        </p>
        
        <Link href="/login" className="inline-block w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded hover:bg-blue-700 transition-colors">
          Ir a Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
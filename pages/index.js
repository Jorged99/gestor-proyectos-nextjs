import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Tan pronto como la página carga, tomamos una decisión rápida:
    if (user) {
      // Si ya tiene sesión, va directo a sus proyectos
      router.push('/dashboard');
    } else {
      // Si no tiene sesión, va directo a loguearse
      router.push('/login');
    }
  }, [user, router]);

  // Mientras ocurre la redirección (toma una fracción de segundo), 
  // mostramos un fondo limpio para que no parpadee nada feo.
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse text-blue-600 font-semibold">
        Cargando sistema...
      </div>
    </div>
  );
}

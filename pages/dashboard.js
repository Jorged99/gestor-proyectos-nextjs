import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

// 1. Datos simulados de proyectos
const MOCK_PROJECTS = [
  { id: 1, title: "Rediseño Web", description: "Actualizar la interfaz principal" },
  { id: 2, title: "Migración a la Nube", description: "Mover bases de datos a AWS" }
];

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (user) {
      // 2. Cargamos los datos simulados en lugar de usar Axios
      setProjects(MOCK_PROJECTS);
    }
  }, [user]);

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-gray-800">
          Panel de {user.role === 'gerente' ? 'Gerencia' : 'Usuario'}
        </h1>
        <button onClick={logout} className="text-red-500 hover:text-red-700 font-semibold">
          Cerrar Sesión
        </button>
      </header>

      <main>
        {user.role === 'gerente' && (
          <button className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            + Nuevo Proyecto
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
              <p className="text-gray-600 mt-2">{project.description}</p>
              
              {user.role === 'gerente' ? (
                <div className="mt-4 flex gap-2">
                  <button className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">Editar</button>
                  <button className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded">Eliminar</button>
                </div>
              ) : (
                <div className="mt-4">
                  <button className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded">Ver Tareas</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
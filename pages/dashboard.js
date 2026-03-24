import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  // 1. ESTADOS PRINCIPALES
  const [proyectos, setProyectos] = useState([
    { id: 1, nombre: 'Rediseño Web', descripcion: 'Actualizar la interfaz principal', estado: 'Pendiente', asignadoA: null },
    { id: 2, nombre: 'Migración a la Nube', descripcion: 'Mover bases de datos a AWS', estado: 'En Progreso', asignadoA: 'Empleado' }
  ]);
  
  // Estados para el Modal del Gerente (Crear Proyecto)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({ nombre: '', descripcion: '' });

  // Estados para el Modal del Usuario (Actualizar Estado)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');

  // 2. PROTECCIÓN Y ROLES
  if (!user) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }
  const esGerente = user.role === 'gerente';

  // 3. FUNCIONES DEL GERENTE
  const handleCrearProyecto = (e) => {
    e.preventDefault();
    const proyectoCreado = {
      id: proyectos.length + 1,
      nombre: nuevoProyecto.nombre,
      descripcion: nuevoProyecto.descripcion,
      estado: 'Pendiente',
      asignadoA: null // Los proyectos nuevos nacen sin asignar
    };
    setProyectos([...proyectos, proyectoCreado]);
    setIsModalOpen(false);
    setNuevoProyecto({ nombre: '', descripcion: '' });
  };

  // 4. FUNCIONES DEL USUARIO
  const handleAsignarme = (id) => {
    // Buscamos el proyecto y le ponemos el nombre del usuario actual
    const proyectosActualizados = proyectos.map(p => 
      p.id === id ? { ...p, asignadoA: user.name } : p
    );
    setProyectos(proyectosActualizados);
  };

  const abrirModalEstado = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setNuevoEstado(proyecto.estado);
    setIsStatusModalOpen(true);
  };

  const handleActualizarEstado = (e) => {
    e.preventDefault();
    const proyectosActualizados = proyectos.map(p => 
      p.id === proyectoSeleccionado.id ? { ...p, estado: nuevoEstado } : p
    );
    setProyectos(proyectosActualizados);
    setIsStatusModalOpen(false);
    setProyectoSeleccionado(null);
  };

  // Función auxiliar para los colores de las etiquetas
  const colorEstado = (estado) => {
    if(estado === 'Completado') return 'bg-green-100 text-green-800';
    if(estado === 'En Progreso') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 relative">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Panel de {esGerente ? 'Gerencia' : 'Usuario'}
            </h1>
            <p className="text-gray-600 mt-1">
              Bienvenido, <span className="font-semibold">{user.name}</span>
            </p>
          </div>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Cerrar Sesión
          </button>
        </div>

        {/* BOTÓN GERENTE */}
        {esGerente && (
          <div className="mb-6">
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-blue-700 transition">
              + Nuevo Proyecto
            </button>
          </div>
        )}

        {/* LISTA DE PROYECTOS */}
        <div className="space-y-4">
          {proyectos.map((proyecto) => (
            <div key={proyecto.id} className="border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-sm transition bg-white">
              
              {/* Información del Proyecto */}
              <div>
                <h2 className="text-xl font-bold text-gray-800">{proyecto.nombre}</h2>
                <p className="text-gray-600 mb-2">{proyecto.descripcion}</p>
                
                <div className="flex gap-2 text-sm font-medium">
                  <span className={`px-3 py-1 rounded-full ${colorEstado(proyecto.estado)}`}>
                    Estado: {proyecto.estado}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    Asignado a: {proyecto.asignadoA ? proyecto.asignadoA : 'Sin asignar'}
                  </span>
                </div>
              </div>
              
              {/* Botones de Acción */}
              <div className="mt-4 sm:mt-0 flex gap-2">
                {esGerente ? (
                  <>
                    <button className="bg-gray-100 text-gray-700 border border-gray-300 font-medium px-4 py-1.5 rounded hover:bg-gray-200 transition">Editar</button>
                    <button className="bg-red-50 text-red-600 border border-red-200 font-medium px-4 py-1.5 rounded hover:bg-red-100 transition">Eliminar</button>
                  </>
                ) : (
                  <>
                    {/* Logica de botones para el Usuario */}
                    {!proyecto.asignadoA ? (
                      <button 
                        onClick={() => handleAsignarme(proyecto.id)}
                        className="bg-indigo-600 text-white font-medium px-4 py-1.5 rounded shadow hover:bg-indigo-700 transition"
                      >
                        Asignarme
                      </button>
                    ) : proyecto.asignadoA === user.name ? (
                      <button 
                        onClick={() => abrirModalEstado(proyecto)}
                        className="bg-green-500 text-white font-medium px-4 py-1.5 rounded shadow hover:bg-green-600 transition"
                      >
                        Actualizar Estado
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500 italic px-2 py-1">Asignado a otro</span>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL DEL GERENTE (Crear Proyecto) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Crear Nuevo Proyecto</h2>
            <form onSubmit={handleCrearProyecto}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Nombre del Proyecto</label>
                <input type="text" required className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500" value={nuevoProyecto.nombre} onChange={(e) => setNuevoProyecto({...nuevoProyecto, nombre: e.target.value})} />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Descripción</label>
                <textarea required className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500" rows="3" value={nuevoProyecto.descripcion} onChange={(e) => setNuevoProyecto({...nuevoProyecto, descripcion: e.target.value})}></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Guardar Proyecto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DEL USUARIO (Actualizar Estado) */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Actualizar Estado</h2>
            <p className="text-gray-600 mb-4 text-sm">Proyecto: <span className="font-semibold">{proyectoSeleccionado?.nombre}</span></p>
            
            <form onSubmit={handleActualizarEstado}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Nuevo Estado</label>
                <select 
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Completado">Completado</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsStatusModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  getProjects, createProject, updateProject, deleteProject,
  getTasks, createTask, updateTask, deleteTask,
  getUsers,
} from '../lib/api';

const ESTADOS = ['Pendiente', 'En Progreso', 'Completado'];

const colorEstado = (estado) => {
  if (estado === 'Completado') return 'bg-green-100 text-green-800';
  if (estado === 'En Progreso') return 'bg-blue-100 text-blue-800';
  return 'bg-yellow-100 text-yellow-800';
};

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const esGerente = user?.role === 'gerente';

  // --- Estado principal de datos ---
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // --- Estado del modal de proyectos ---
  const [projectModal, setProjectModal] = useState({ open: false, editing: null });
  const [projectForm, setProjectForm] = useState({ title: '', description: '', estado: 'Pendiente' });

  // --- Estado del modal de tareas (solo gerente) ---
  const [taskModal, setTaskModal] = useState({ open: false, editing: null });
  const [taskForm, setTaskForm] = useState({ title: '', projectId: '', assignedTo: '', status: 'Pendiente' });

  // --- Estado del modal de actualizar estado (solo usuario) ---
  const [statusModal, setStatusModal] = useState({ open: false, task: null });
  const [newStatus, setNewStatus] = useState('');

  // --- Carga de datos desde la API con axios ---
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, tRes, uRes] = await Promise.all([
        getProjects(),
        getTasks(),
        getUsers(),
      ]);
      setProjects(pRes.data);
      setTasks(tRes.data);
      setUsers(uRes.data);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  if (!user) return null;

  // --- Estadísticas para el progreso general ---
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.estado === 'Completado').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completado').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Tareas visibles según rol
  const myTasks = esGerente ? tasks : tasks.filter((t) => t.assignedTo === user.id);

  const getProjectName = (id) => projects.find((p) => p.id === id)?.title || 'Sin proyecto';
  const getUserName = (id) => {
    if (!id) return 'Sin asignar';
    return users.find((u) => u.id === id)?.name || 'Desconocido';
  };
  const getProjectTasks = (projectId) => tasks.filter((t) => t.projectId === projectId);

  // --- CRUD Proyectos ---
  const openCreateProject = () => {
    setProjectForm({ title: '', description: '', estado: 'Pendiente' });
    setProjectModal({ open: true, editing: null });
  };

  const openEditProject = (p) => {
    setProjectForm({ title: p.title, description: p.description, estado: p.estado });
    setProjectModal({ open: true, editing: p });
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      if (projectModal.editing) {
        await updateProject(projectModal.editing.id, projectForm);
      } else {
        await createProject(projectForm);
      }
      setProjectModal({ open: false, editing: null });
      fetchAll();
    } catch (err) {
      alert('Error al guardar proyecto');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('¿Eliminar este proyecto y todas sus tareas?')) return;
    try {
      await deleteProject(id);
      setSelectedProjectId(null);
      fetchAll();
    } catch (err) {
      alert('Error al eliminar proyecto');
    }
  };

  // --- CRUD Tareas ---
  const openCreateTask = (projectId) => {
    setTaskForm({ title: '', projectId: projectId || '', assignedTo: '', status: 'Pendiente' });
    setTaskModal({ open: true, editing: null });
  };

  const openEditTask = (task) => {
    setTaskForm({
      title: task.title,
      projectId: task.projectId,
      assignedTo: task.assignedTo || '',
      status: task.status,
    });
    setTaskModal({ open: true, editing: task });
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...taskForm,
        projectId: parseInt(taskForm.projectId),
        assignedTo: taskForm.assignedTo ? parseInt(taskForm.assignedTo) : null,
      };
      if (taskModal.editing) {
        await updateTask(taskModal.editing.id, payload);
      } else {
        await createTask(payload);
      }
      setTaskModal({ open: false, editing: null });
      fetchAll();
    } catch (err) {
      alert('Error al guardar tarea');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await deleteTask(id);
      fetchAll();
    } catch (err) {
      alert('Error al eliminar tarea');
    }
  };

  // --- Actualizar estado (usuario) ---
  const openStatusModal = (task) => {
    setStatusModal({ open: true, task });
    setNewStatus(task.status);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await updateTask(statusModal.task.id, { ...statusModal.task, status: newStatus });
      setStatusModal({ open: false, task: null });
      fetchAll();
    } catch (err) {
      alert('Error al actualizar estado');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800">Gestor de Proyectos</h1>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${esGerente ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
            {esGerente ? 'Gerente' : 'Usuario'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">
            Hola, <span className="font-semibold">{user.name}</span>
          </span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">

        {/* PROGRESO GENERAL */}
        <div className="bg-white rounded-lg shadow-sm border p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Progreso General</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="text-center bg-gray-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-800">{totalProjects}</p>
              <p className="text-xs text-gray-500 mt-1">Total Proyectos</p>
            </div>
            <div className="text-center bg-green-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-700">{completedProjects}</p>
              <p className="text-xs text-gray-500 mt-1">Proyectos Completados</p>
            </div>
            <div className="text-center bg-gray-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-800">{totalTasks}</p>
              <p className="text-xs text-gray-500 mt-1">Total Tareas</p>
            </div>
            <div className="text-center bg-blue-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-700">{completedTasks}</p>
              <p className="text-xs text-gray-500 mt-1">Tareas Completadas</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progreso de tareas</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-1 mb-6 bg-white border rounded-lg p-1 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded text-sm font-medium transition ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Proyectos
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded text-sm font-medium transition ${activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {esGerente ? 'Todas las Tareas' : 'Mis Tareas'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : (
          <>
            {/* TAB: PROYECTOS */}
            {activeTab === 'projects' && (
              <div>
                {esGerente && (
                  <div className="mb-4">
                    <button
                      onClick={openCreateProject}
                      className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition shadow-sm"
                    >
                      + Nuevo Proyecto
                    </button>
                  </div>
                )}

                {projects.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-white rounded-lg border">
                    No hay proyectos aún.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((p) => {
                      const projectTasks = getProjectTasks(p.id);
                      const doneCount = projectTasks.filter((t) => t.status === 'Completado').length;
                      const isExpanded = selectedProjectId === p.id;

                      return (
                        <div key={p.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                          <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-bold text-gray-800">{p.title}</h3>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorEstado(p.estado)}`}>
                                  {p.estado}
                                </span>
                              </div>
                              <p className="text-gray-500 text-sm mt-1">{p.description}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                Tareas: {doneCount}/{projectTasks.length} completadas
                              </p>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => setSelectedProjectId(isExpanded ? null : p.id)}
                                className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 border rounded hover:bg-gray-200 transition"
                              >
                                {isExpanded ? 'Ocultar tareas' : 'Ver tareas'}
                              </button>
                              {esGerente && (
                                <>
                                  <button
                                    onClick={() => openCreateTask(p.id)}
                                    className="text-sm px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded hover:bg-indigo-100 transition"
                                  >
                                    + Tarea
                                  </button>
                                  <button
                                    onClick={() => openEditProject(p)}
                                    className="text-sm px-3 py-1.5 bg-gray-50 text-gray-700 border rounded hover:bg-gray-100 transition"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProject(p.id)}
                                    className="text-sm px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition"
                                  >
                                    Eliminar
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Tareas del proyecto (expandible) */}
                          {isExpanded && (
                            <div className="border-t bg-gray-50 px-5 py-3">
                              {projectTasks.length === 0 ? (
                                <p className="text-sm text-gray-400 py-2">Este proyecto no tiene tareas aún.</p>
                              ) : (
                                <div className="space-y-2">
                                  {projectTasks.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between bg-white border rounded p-3 gap-2">
                                      <div>
                                        <p className="text-sm font-medium text-gray-800">{t.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                          Asignado a: {getUserName(t.assignedTo)}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${colorEstado(t.status)}`}>
                                          {t.status}
                                        </span>
                                        {esGerente ? (
                                          <>
                                            <button
                                              onClick={() => openEditTask(t)}
                                              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                                            >
                                              Editar
                                            </button>
                                            <button
                                              onClick={() => handleDeleteTask(t.id)}
                                              className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                                            >
                                              Eliminar
                                            </button>
                                          </>
                                        ) : (
                                          t.assignedTo === user.id && (
                                            <button
                                              onClick={() => openStatusModal(t)}
                                              className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                            >
                                              Actualizar
                                            </button>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: TAREAS */}
            {activeTab === 'tasks' && (
              <div>
                {esGerente && (
                  <div className="mb-4">
                    <button
                      onClick={() => openCreateTask(null)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700 transition shadow-sm"
                    >
                      + Nueva Tarea
                    </button>
                  </div>
                )}

                {myTasks.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-white rounded-lg border">
                    {esGerente ? 'No hay tareas registradas.' : 'No tienes tareas asignadas aún.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myTasks.map((t) => (
                      <div
                        key={t.id}
                        className="bg-white border rounded-lg p-4 flex items-center justify-between gap-3 shadow-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{t.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Proyecto: {getProjectName(t.projectId)} · Asignado a: {getUserName(t.assignedTo)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorEstado(t.status)}`}>
                            {t.status}
                          </span>
                          {esGerente ? (
                            <>
                              <button
                                onClick={() => openEditTask(t)}
                                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 border rounded hover:bg-gray-200 transition"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteTask(t.id)}
                                className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition"
                              >
                                Eliminar
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => openStatusModal(t)}
                              className="text-xs px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                              Actualizar Estado
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL: Crear / Editar Proyecto */}
      {projectModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {projectModal.editing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h2>
            <form onSubmit={handleSaveProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black"
                  rows="3"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black"
                  value={projectForm.estado}
                  onChange={(e) => setProjectForm({ ...projectForm, estado: e.target.value })}
                >
                  {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProjectModal({ open: false, editing: null })}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Crear / Editar Tarea (solo gerente) */}
      {taskModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {taskModal.editing ? 'Editar Tarea' : 'Nueva Tarea'}
            </h2>
            <form onSubmit={handleSaveTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto *</label>
                <select
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black"
                  value={taskForm.projectId}
                  onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                >
                  <option value="">Selecciona un proyecto</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Asignar a</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black"
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                >
                  <option value="">Sin asignar</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black"
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                >
                  {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTaskModal({ open: false, editing: null })}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Actualizar Estado de Tarea (solo usuario) */}
      {statusModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Actualizar Estado</h2>
            <p className="text-gray-500 text-sm mb-4">
              Tarea: <span className="font-semibold text-gray-700">{statusModal.task?.title}</span>
            </p>
            <form onSubmit={handleUpdateStatus}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Estado</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setStatusModal({ open: false, task: null })}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

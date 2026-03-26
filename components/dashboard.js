import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProjects, createProject, updateProject, deleteProject, getTasks, createTask, updateTask, deleteTask, getUsers } from '../lib/api';

// Importamos nuestros nuevos componentes visuales
import Navbar from '../components/Navbar';
import ProgressStats from '../components/ProgressStats';
import { ProjectModal, TaskModal, StatusModal } from '../components/Modals';

const colorEstado = (estado) => {
  if (estado === 'Completado') return 'bg-green-100 text-green-800';
  if (estado === 'En Progreso') return 'bg-blue-100 text-blue-800';
  return 'bg-yellow-100 text-yellow-800';
};

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const esGerente = user?.role === 'gerente';

  // --- Estados ---
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [projectModal, setProjectModal] = useState({ open: false, editing: null });
  const [projectForm, setProjectForm] = useState({ title: '', description: '', estado: 'Pendiente' });
  const [taskModal, setTaskModal] = useState({ open: false, editing: null });
  const [taskForm, setTaskForm] = useState({ title: '', projectId: '', assignedTo: '', status: 'Pendiente' });
  const [statusModal, setStatusModal] = useState({ open: false, task: null });
  const [newStatus, setNewStatus] = useState('');

  // --- API ---
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, tRes, uRes] = await Promise.all([getProjects(), getTasks(), getUsers()]);
      setProjects(pRes.data); setTasks(tRes.data); setUsers(uRes.data);
    } catch (err) { console.error('Error cargando datos:', err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchAll(); }, [user]);
  if (!user) return null;

  // --- Cálculos ---
  const completedProjects = projects.filter((p) => p.estado === 'Completado').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completado').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const myTasks = esGerente ? tasks : tasks.filter((t) => t.assignedTo === user.id);

  const getProjectName = (id) => projects.find((p) => p.id === id)?.title || 'Sin proyecto';
  const getUserName = (id) => id ? users.find((u) => u.id === id)?.name || 'Desconocido' : 'Sin asignar';
  const getProjectTasks = (projectId) => tasks.filter((t) => t.projectId === projectId);

  // --- Funciones CRUD ---
  // Proyectos
  const openCreateProject = () => { setProjectForm({ title: '', description: '', estado: 'Pendiente' }); setProjectModal({ open: true, editing: null }); };
  const openEditProject = (p) => { setProjectForm({ title: p.title, description: p.description, estado: p.estado }); setProjectModal({ open: true, editing: p }); };
  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      projectModal.editing ? await updateProject(projectModal.editing.id, projectForm) : await createProject(projectForm);
      setProjectModal({ open: false, editing: null }); fetchAll();
    } catch (err) { alert('Error al guardar proyecto'); }
  };
  const handleDeleteProject = async (id) => {
    if (!confirm('¿Eliminar este proyecto y sus tareas?')) return;
    try { await deleteProject(id); setSelectedProjectId(null); fetchAll(); } 
    catch (err) { alert('Error al eliminar proyecto'); }
  };

  // Tareas
  const openCreateTask = (projectId) => { setTaskForm({ title: '', projectId: projectId || '', assignedTo: '', status: 'Pendiente' }); setTaskModal({ open: true, editing: null }); };
  const openEditTask = (task) => { setTaskForm({ title: task.title, projectId: task.projectId, assignedTo: task.assignedTo || '', status: task.status }); setTaskModal({ open: true, editing: task }); };
  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...taskForm, projectId: parseInt(taskForm.projectId), assignedTo: taskForm.assignedTo ? parseInt(taskForm.assignedTo) : null };
      taskModal.editing ? await updateTask(taskModal.editing.id, payload) : await createTask(payload);
      setTaskModal({ open: false, editing: null }); fetchAll();
    } catch (err) { alert('Error al guardar tarea'); }
  };
  const handleDeleteTask = async (id) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try { await deleteTask(id); fetchAll(); } catch (err) { alert('Error al eliminar tarea'); }
  };

  // Estados
  const openStatusModal = (task) => { setStatusModal({ open: true, task }); setNewStatus(task.status); };
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try { await updateTask(statusModal.task.id, { ...statusModal.task, status: newStatus }); setStatusModal({ open: false, task: null }); fetchAll(); } 
    catch (err) { alert('Error al actualizar estado'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} esGerente={esGerente} logout={logout} />

      <div className="max-w-5xl mx-auto p-6">
        <ProgressStats totalProjects={projects.length} completedProjects={completedProjects} totalTasks={tasks.length} completedTasks={completedTasks} progress={progress} />

        {/* TABS MENU */}
        <div className="flex gap-1 mb-6 bg-white border rounded-lg p-1 shadow-sm w-fit">
          <button onClick={() => setActiveTab('projects')} className={`px-4 py-2 rounded text-sm font-medium transition ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Proyectos</button>
          <button onClick={() => setActiveTab('tasks')} className={`px-4 py-2 rounded text-sm font-medium transition ${activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{esGerente ? 'Todas las Tareas' : 'Mis Tareas'}</button>
        </div>

        {loading ? ( <div className="text-center py-12 text-gray-400">Cargando...</div> ) : (
          <>
            {/* VISTA DE PROYECTOS */}
            {activeTab === 'projects' && (
              <div>
                {esGerente && <div className="mb-4"><button onClick={openCreateProject} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition shadow-sm">+ Nuevo Proyecto</button></div>}
                
                {projects.length === 0 ? (<div className="text-center py-12 text-gray-400 bg-white rounded-lg border">No hay proyectos aún.</div>) : (
                  <div className="space-y-4">
                    {projects.map((p) => {
                      const projectTasks = getProjectTasks(p.id);
                      const isExpanded = selectedProjectId === p.id;
                      return (
                        <div key={p.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                          <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-bold text-gray-800">{p.title}</h3>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorEstado(p.estado)}`}>{p.estado}</span>
                              </div>
                              <p className="text-gray-500 text-sm mt-1">{p.description}</p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <button onClick={() => setSelectedProjectId(isExpanded ? null : p.id)} className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 border rounded hover:bg-gray-200 transition">{isExpanded ? 'Ocultar tareas' : 'Ver tareas'}</button>
                              {esGerente && (
                                <>
                                  <button onClick={() => openCreateTask(p.id)} className="text-sm px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded hover:bg-indigo-100">+ Tarea</button>
                                  <button onClick={() => openEditProject(p)} className="text-sm px-3 py-1.5 bg-gray-50 text-gray-700 border rounded hover:bg-gray-100">Editar</button>
                                  <button onClick={() => handleDeleteProject(p.id)} className="text-sm px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100">Eliminar</button>
                                </>
                              )}
                            </div>
                          </div>
                          {/* Tareas del Proyecto Expandido */}
                          {isExpanded && (
                            <div className="border-t bg-gray-50 px-5 py-3">
                              {projectTasks.map((t) => (
                                <div key={t.id} className="flex items-center justify-between bg-white border rounded p-3 gap-2 mb-2">
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">{t.title}</p>
                                    <p className="text-xs text-gray-400">Asignado a: {getUserName(t.assignedTo)}</p>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${colorEstado(t.status)}`}>{t.status}</span>
                                    {esGerente ? (
                                      <>
                                        <button onClick={() => openEditTask(t)} className="text-xs px-2 py-1 bg-gray-100 rounded">Editar</button>
                                        <button onClick={() => handleDeleteTask(t.id)} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded">Eliminar</button>
                                      </>
                                    ) : t.assignedTo === user.id && (
                                      <button onClick={() => openStatusModal(t)} className="text-xs px-2 py-1 bg-green-500 text-white rounded">Actualizar</button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* VISTA DE TAREAS */}
            {activeTab === 'tasks' && (
              <div>
                {esGerente && <div className="mb-4"><button onClick={() => openCreateTask(null)} className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700 shadow-sm">+ Nueva Tarea</button></div>}
                <div className="space-y-3">
                  {myTasks.map((t) => (
                    <div key={t.id} className="bg-white border rounded-lg p-4 flex justify-between items-center shadow-sm">
                      <div>
                        <p className="font-medium text-gray-800">{t.title}</p>
                        <p className="text-xs text-gray-400">Proyecto: {getProjectName(t.projectId)} · Asignado a: {getUserName(t.assignedTo)}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${colorEstado(t.status)}`}>{t.status}</span>
                        {esGerente ? (
                          <><button onClick={() => openEditTask(t)} className="text-xs px-3 py-1.5 bg-gray-100 rounded">Editar</button><button onClick={() => handleDeleteTask(t.id)} className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded">Eliminar</button></>
                        ) : (
                          <button onClick={() => openStatusModal(t)} className="text-xs px-3 py-1.5 bg-green-500 text-white rounded">Actualizar Estado</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* COMPONENTES DE MODALES INYECTADOS AQUÍ */}
      <ProjectModal isOpen={projectModal.open} isEditing={!!projectModal.editing} form={projectForm} setForm={setProjectForm} onClose={() => setProjectModal({ open: false, editing: null })} onSave={handleSaveProject} />
      <TaskModal isOpen={taskModal.open} isEditing={!!taskModal.editing} form={taskForm} setForm={setTaskForm} onClose={() => setTaskModal({ open: false, editing: null })} onSave={handleSaveTask} projects={projects} users={users} />
      <StatusModal isOpen={statusModal.open} task={statusModal.task} newStatus={newStatus} setNewStatus={setNewStatus} onClose={() => setStatusModal({ open: false, task: null })} onSave={handleUpdateStatus} />
    </div>
  );
}
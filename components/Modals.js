const ESTADOS = ['Pendiente', 'En Progreso', 'Completado'];

export function ProjectModal({ isOpen, isEditing, form, setForm, onClose, onSave }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
        <form onSubmit={onSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input type="text" required className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
              {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TaskModal({ isOpen, isEditing, form, setForm, onClose, onSave, projects, users }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{isEditing ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
        <form onSubmit={onSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input type="text" required className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto *</label>
            <select required className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
              <option value="">Selecciona un proyecto</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Asignar a</label>
            <select className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
              <option value="">Sin asignar</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function StatusModal({ isOpen, task, newStatus, setNewStatus, onClose, onSave }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Actualizar Estado</h2>
        <p className="text-gray-500 text-sm mb-4">Tarea: <span className="font-semibold text-gray-700">{task?.title}</span></p>
        <form onSubmit={onSave}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Estado</label>
            <select className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-black" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
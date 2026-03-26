export default function ProgressStats({ totalProjects, completedProjects, totalTasks, completedTasks, progress }) {
  return (
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
  );
}
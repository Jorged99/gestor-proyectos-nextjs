import { readDb, writeDb } from '../../../lib/db';

export default function handler(req, res) {
  const db = readDb();

  if (req.method === 'GET') {
    let tasks = db.tasks;
    const { projectId, assignedTo } = req.query;
    if (projectId) tasks = tasks.filter((t) => t.projectId === parseInt(projectId));
    if (assignedTo) tasks = tasks.filter((t) => t.assignedTo === parseInt(assignedTo));
    return res.status(200).json(tasks);
  }

  if (req.method === 'POST') {
    const { title, projectId, assignedTo, status } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({ message: 'Título y proyecto son requeridos' });
    }

    const newTask = {
      id: db.tasks.length > 0 ? Math.max(...db.tasks.map((t) => t.id)) + 1 : 1,
      title,
      projectId: parseInt(projectId),
      assignedTo: assignedTo ? parseInt(assignedTo) : null,
      status: status || 'Pendiente',
    };

    db.tasks.push(newTask);
    writeDb(db);
    return res.status(201).json(newTask);
  }

  return res.status(405).json({ message: 'Método no permitido' });
}

import { readDb, writeDb } from '../../../lib/db';

export default function handler(req, res) {
  const { id } = req.query;
  const numId = parseInt(id);
  const db = readDb();
  const index = db.projects.findIndex((p) => p.id === numId);

  if (index === -1) {
    return res.status(404).json({ message: 'Proyecto no encontrado' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.projects[index]);
  }

  if (req.method === 'PUT') {
    db.projects[index] = { ...db.projects[index], ...req.body, id: numId };
    writeDb(db);
    return res.status(200).json(db.projects[index]);
  }

  if (req.method === 'DELETE') {
    db.projects.splice(index, 1);
    // Eliminar también las tareas relacionadas
    db.tasks = db.tasks.filter((t) => t.projectId !== numId);
    writeDb(db);
    return res.status(200).json({ message: 'Proyecto eliminado' });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}

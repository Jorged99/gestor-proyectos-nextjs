import { readDb, writeDb } from '../../../lib/db';

export default function handler(req, res) {
  const { id } = req.query;
  const numId = parseInt(id);
  const db = readDb();
  const index = db.tasks.findIndex((t) => t.id === numId);

  if (index === -1) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(db.tasks[index]);
  }

  if (req.method === 'PUT') {
    db.tasks[index] = { ...db.tasks[index], ...req.body, id: numId };
    writeDb(db);
    return res.status(200).json(db.tasks[index]);
  }

  if (req.method === 'DELETE') {
    db.tasks.splice(index, 1);
    writeDb(db);
    return res.status(200).json({ message: 'Tarea eliminada' });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}

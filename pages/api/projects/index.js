import { readDb, writeDb } from '../../../lib/db';

export default function handler(req, res) {
  const db = readDb();

  if (req.method === 'GET') {
    return res.status(200).json(db.projects);
  }

  if (req.method === 'POST') {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'El título es requerido' });
    }

    const newProject = {
      id: db.projects.length > 0 ? Math.max(...db.projects.map((p) => p.id)) + 1 : 1,
      title,
      description: description || '',
      estado: 'Pendiente',
    };

    db.projects.push(newProject);
    writeDb(db);
    return res.status(201).json(newProject);
  }

  return res.status(405).json({ message: 'Método no permitido' });
}

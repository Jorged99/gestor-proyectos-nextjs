import { readDb } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const db = readDb();
  // Nunca exponer contraseñas
  const safeUsers = db.users.map(({ password, ...u }) => u);
  return res.status(200).json(safeUsers);
}

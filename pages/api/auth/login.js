import { readDb } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  const db = readDb();
  const found = db.users.find(
    (u) => u.email === email && u.password === password
  );

  if (!found) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const { password: _pass, ...safeUser } = found;
  return res.status(200).json(safeUser);
}

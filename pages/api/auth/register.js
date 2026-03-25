import { readDb, writeDb } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  if (password.length < 3) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 3 caracteres' });
  }

  const db = readDb();
  const exists = db.users.find((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ message: 'El correo ya está registrado' });
  }

  const newUser = {
    id: db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1,
    name,
    email,
    password,
    role: role === 'gerente' ? 'gerente' : 'usuario',
  };

  db.users.push(newUser);
  writeDb(db);

  const { password: _pass, ...safeUser } = newUser;
  return res.status(201).json(safeUser);
}

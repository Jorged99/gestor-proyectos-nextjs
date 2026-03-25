import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

function defaultDb() {
  return {
    users: [],
    projects: [],
    tasks: [],
  };
}

function normalizeDb(data) {
  const safe = data && typeof data === 'object' ? data : {};
  return {
    ...safe,
    users: Array.isArray(safe.users) ? safe.users : [],
    projects: Array.isArray(safe.projects) ? safe.projects : [],
    tasks: Array.isArray(safe.tasks) ? safe.tasks : [],
  };
}

export function readDb() {
  if (!fs.existsSync(dbPath)) {
    const initial = defaultDb();
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  const raw = fs.readFileSync(dbPath, 'utf-8');

  if (!raw.trim()) {
    const initial = defaultDb();
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  const parsed = JSON.parse(raw);
  return normalizeDb(parsed);
}

export function writeDb(data) {
  const normalized = normalizeDb(data);
  fs.writeFileSync(dbPath, JSON.stringify(normalized, null, 2), 'utf-8');
}

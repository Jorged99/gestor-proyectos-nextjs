import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export function readDb() {
  const raw = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(raw);
}

export function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

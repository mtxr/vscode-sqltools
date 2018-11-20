import fs, { writeFileSync } from 'fs';
import path from 'path';
import { getHome } from './get-home';

const filename = '.sqltools-setup';

const filepath = path.join(getHome(), filename);

export function read() {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  } catch (e) { /**/ }
  return {};
}

export function write(content = {}) {
  try {
    fs.writeFileSync(filepath, JSON.stringify(content));
  } catch(e) { /** */ }
}

export function get<T = any>(key: string, def: any = undefined): T {
  return read()[key] || def;
}

export function set(key: string, value: any = undefined) {
  return update({ [key]: value });
}

export function update(data: { [key: string]: any }) {
  const oldData = read();
  write({ ...oldData, data });
}

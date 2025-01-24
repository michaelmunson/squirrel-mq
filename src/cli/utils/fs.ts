import fs from 'fs';
import path from 'path';

export const findRootDir = (input: string): string => {
  if (input === '/') {
    console.error('No output directory found');
    process.exit(1);
  }
  const parsed = path.parse(input);
  const dir = path.resolve(parsed.dir);
  const files = fs.readdirSync(dir);
  if (files.includes('package.json')) {
    return dir;
  }
  return findRootDir(dir);
}

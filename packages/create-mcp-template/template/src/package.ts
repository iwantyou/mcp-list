import { fileURLToPath } from 'url';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));

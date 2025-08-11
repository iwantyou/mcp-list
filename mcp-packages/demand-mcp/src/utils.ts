import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const readFileFromPrompt = (filePath: string) => {
  return readFileSync(path.join(__dirname, 'prompts', filePath), 'utf-8');
};

export const writeFileToPrompt = (filePath: string, content: string) => {
  return writeFileSync(path.join(__dirname, 'prompts', filePath), content);
};

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import { createMcpServer } from './mcp.js';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

export async function main() {
  try {
    const server = await createServer({ name: packageJson.name, version: packageJson.version });
    await server.connect(new StdioServerTransport());
    console.error(`启动成功 <====> version: ${packageJson.version}`);
  } catch (error) {
    console.error('启动失败：', error);
    process.exit(1);
  }
}

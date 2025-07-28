import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
// import { createServer } from './server.js';
import { createMcpServer } from './mcpServer.js';
import { createLogger } from './logger.js';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const logger = createLogger('MCP_SERVER');
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

export async function main() {
  try {
    logger.info(`启动 MCP 服务器: ${packageJson.name} v${packageJson.version}`);

    const server = await createMcpServer({
      name: packageJson.name,
      version: packageJson.version,
      logger
    });

    await server.connect(new StdioServerTransport());

    logger.info(`MCP 服务器启动成功 - 版本: ${packageJson.version}`);
  } catch (error) {
    logger.error('MCP 服务器启动失败', error);
    process.exit(1);
  }
}

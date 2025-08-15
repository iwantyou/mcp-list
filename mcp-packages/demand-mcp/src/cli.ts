import { cac } from 'cac';
import { createStdioPipe, createServer } from './index.js';
import { printServerInfo } from './sseServer.js';
import { packageJson } from './package.js';
import { bindShortcuts } from './shortcuts.js';
import { clearScreen } from '@zh-mcp/utils';


const cli = cac(packageJson.name || 'cli').version(packageJson.version);

type SseOptions = {
  '--'?: string[];
  p?: number;
  port?: number;
  host?: string;
  ssePath?: string;
}

cli.command('sse').option('-p, --port <port>', 'port', {
  default: 9000,
}).option('--host <host>', 'host', {
  default: '0.0.0.0',
}).action(async (options: SseOptions) => {
  const server = await createServer({
    port: options.port,
    host: options.host,
    ssePath: options.ssePath,
  });
  await server.start();
  clearScreen();
  printServerInfo(server.httpServer.address(), server.config);
  bindShortcuts(server);


});

cli.command('stdio').action(async () => {
  await createStdioPipe();
});


cli.parse();

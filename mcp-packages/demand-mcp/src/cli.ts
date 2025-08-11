import { cac } from 'cac';
import { createStdioPipe, startSseServer } from './index.js';
import { packageJson } from './package.js';

const cli = cac(packageJson.name || 'cli').version(packageJson.version);

type SseOptions = {
  '--'?: string[];
  p?: number;
  port?: number;
  host?: string;
}

cli.command('sse').option('-p, --port <port>', 'port', {
  default: 9000,
}).option('--host <host>', 'host', {
  default: '0.0.0.0',
}).action(async (options: SseOptions) => {

  await startSseServer({
    port: options.port!,
    host: options.host!,
  });

});

cli.command('stdio').action(async () => {
  await createStdioPipe();
});


cli.parse();

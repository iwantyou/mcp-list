import { loadEnv } from './utils.js';
export interface InlineServerConfig {
    host?: string;
    port?: number;
    ssePath?: string;
}

export interface ResolvedServerConfig {
    host: string;
    port: number;
    ssePath: string;
}

export const resolveServerConfig = (config: InlineServerConfig): ResolvedServerConfig => {
  loadEnv();
  console.log('process.env.SSE_PATH', process.env.SSE_PATH);

  const { host, port } = config;
  return {
    host: host || '0.0.0.0',
    port: port || 3000,
    ssePath: config.ssePath || process.env.SSE_PATH || '/sse',
  };
};

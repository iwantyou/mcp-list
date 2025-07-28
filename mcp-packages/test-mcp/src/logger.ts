export const createLogger = (name: string, prefix: string = 'DU-MCP') => {
  return {
    info: (message: string) => console.error(`${prefix} [${name}] ${new Date().toISOString()}: ${message}`),
    error: (message: string, error?: any) => console.error(`${prefix} [${name}] ${new Date().toISOString()}: ${message}`, error || ''),
    warn: (message: string) => console.error(`${prefix} [${name}] ${new Date().toISOString()}: ${message}`),
  };
};

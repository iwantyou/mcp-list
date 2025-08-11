
const colorInfo = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  NC: '\x1b[0m',
};

export const createLogger = (name: string, prefix: string = 'DEMAND-MCP') => {
  return {
    info: (message: string) => console.error(`${colorInfo.GREEN}${prefix} [${name}] ${new Date().toLocaleDateString()}: ${message}${colorInfo.NC}`),
    error: (message: string, error?: any) => console.error(`${colorInfo.RED}${prefix} [${name}] ${new Date().toLocaleDateString()}: ${message} ${JSON.stringify(error) || ''}${colorInfo.NC}`),
    warn: (message: string) => console.error(`${colorInfo.YELLOW}${prefix} [${name}] ${new Date().toLocaleDateString()}: ${message}${colorInfo.NC}`),
  };
};

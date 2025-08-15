import readline from 'node:readline';

export const colorInfo = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  NC: '\x1b[0m',
  DIM: '\x1b[2m',
  BOLD: '\x1b[1m',
  CYAN: '\x1b[36m',
};

export const clearScreen = () => {
  const blank = '\n'.repeat(process.stdout.rows - 2);
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
};

export const createLogger = (
  name: string,
  prefix: string = process.env.LOGGER_NAME || ''
) => {
  const date = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const output = (type: 'info' | 'error' | 'warn' | 'success', message: string) => {
    const color = {
      info: colorInfo.CYAN,
      error: colorInfo.RED,
      warn: colorInfo.YELLOW,
      success: colorInfo.GREEN,
    }[type];
    const tag = `${color} ${prefix} [${name}] ${date.format(new Date())}`;
    return `${tag} ${colorInfo.BOLD}${message}${colorInfo.NC}`;
  };

  return {
    success: (message: string) =>
      console.log(output('success', message)),
    info: (message: string) =>
      console.error(output('info', message)),
    error: (message: string) =>
      console.error(output('error', message)),
    warn: (message: string) =>
      console.error(output('warn', message)),
    clear: () => {
      clearScreen();
    },
  };
};

import type { Server } from './sseServer.js';
import { printServerInfo } from './sseServer.js';
import { colorInfo } from '@zh-mcp/utils';

export type Shortcut = {
  key: string;
  description: string;
  action: (server: Server) => void;
}

export const shortcuts: Shortcut[] = [
  {
    key: 'r',
    description: '重新启动服务',
    action: async (server: Server) => {
      await server.restart();
    }
  },
  {
    key: 'p',
    description: '打印服务信息',
    action: (server: Server) => {
      printServerInfo(server.httpServer.address(), server.config);
    }
  },
  {
    key: 'q',
    description: '退出服务',
    action: async (server: Server) => {
      await server.close().finally(() => {
        process.exit(0);
      });
    }
  }
];

export const printShortcuts = () => {
  const shortcutsTip = ['shortcuts:'];
  for (const shortcut of shortcuts)
    shortcutsTip.push(`      ${shortcut.key} - ${shortcut.description}          `);

  console.log(`${colorInfo.CYAN} ${shortcutsTip.join('\n')}${colorInfo.NC}`);
};

export const bindShortcuts = (server: Server) => {
  console.log(`\n${colorInfo.CYAN} -> press h 打印更多快捷键服务信息${colorInfo.NC}\n`);
  // 开启rawmode模式，能够读取用户键盘输入的原始字节
  process.stdin.setRawMode(true);
  let hasBind = false;
  const onInput = async (input: string) => {
    if (hasBind)
      return;


    // rawmode 模式下 ctrl + c 和 ctrl + d 不会触发SIGINT事件，需要手动处理
    if (input === '\x03' || input === '\x04') {
      await server.close();
      process.exit(1);
    }

    if (input === 'h') {
      printShortcuts();
      return;
    }

    const shortcut = shortcuts.find(shortcut => shortcut.key === input);
    if (!shortcut)
      return;
    hasBind = true;
    await shortcut.action(server);
    hasBind = false;
  };
  // 执行resume以兼容老版本（默认标准输入为非流动模式）
  process.stdin.on('data', onInput).setEncoding('utf8').resume();

  server.httpServer.on('close', () => {
    process.stdin.setRawMode(false);
    process.stdin.off('data', onInput);
  });
};

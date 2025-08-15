import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import http from 'node:http';
import type {
  Server as HttpServer,
  IncomingMessage,
  ServerResponse,
} from 'node:http';
import type { AddressInfo } from 'node:net';
import assert from 'node:assert';
import { packageJson } from './package.js';
import { createMcpServer } from './mcpServer.js';
import { createLogger, clearScreen } from '@zh-mcp/utils';
import { bindShortcuts } from './shortcuts.js';
import type { Socket } from 'node:net';
import {
  resolveServerConfig,
  type ResolvedServerConfig,
  type InlineServerConfig,
} from './config.js';

export interface Server {
  config: ResolvedServerConfig;
  start: () => Promise<number>;
  restart: () => Promise<void>;
  close: () => Promise<void>;
  httpServer: HttpServer;
}


const logger = createLogger('SSE_SERVER');

const handleSseRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  config: ResolvedServerConfig,
  sessionMaps: Map<string, SSEServerTransport>
) => {
  if (req.method === 'POST') {
    const sessionId = new URL(req.url!, 'http://example.com').searchParams.get('sessionId');
    if (!sessionId) {
      res.statusCode = 400;
      res.end('sessionId 必须');
      return;
    }
    const transport = sessionMaps.get(sessionId);
    if (transport) {
      await transport.handlePostMessage(req, res);
    } else {
      res.statusCode = 400;
      res.end('transport 不存在');
      return;
    }
  } else if (req.method === 'GET') {
    const mcpServer = await createMcpServer({
      name: packageJson.name,
      version: packageJson.version,
      logger,
    });

    res.on('close', () => {
      logger.info(`SSE transport.sessionId: ${transport.sessionId} 连接关闭`);
      sessionMaps.delete(transport.sessionId);
    });

    const transport = new SSEServerTransport(config.ssePath, res);
    sessionMaps.set(transport.sessionId, transport);
    await mcpServer.connect(transport);
  }
};


export const createServer = async (options: InlineServerConfig) => {
  const socketsSet = new Set<Socket>();
  const sessionIdMap = new Map<string, SSEServerTransport>();

  const config = resolveServerConfig(options);
  const httpServer = createHttpServer(config);

  const server: Server = {
    config,
    httpServer,
    start: async () => {
      try {
        return new Promise(resolve => {
          // 对于clientError,也暂不考虑
          httpServer.on('error', err => {
            if ((err as any).code === 'EADDRINUSE') {
              logger.error(
                  `端口 ${config.port} 被占用，请检查是否已启动其他服务`
              );
            } else {logger.error(`服务启动失败: ${err.message} ${err.stack}`);}
            process.exit(1);
          });
          // 防止server被关闭时，socket 没有被关闭，占用资源
          httpServer.on('connection', socket => {
            socketsSet.add(socket);
            socket.on('close', () => {
              socketsSet.delete(socket);
            });
          });


          httpServer.on('request', async (req, res) => {
            const url = new URL(`http://example.com${req.url}`);
            if (url.pathname.startsWith(config.ssePath))
              await handleSseRequest(req, res, config, sessionIdMap);
          });

          httpServer.listen(config.port, config.host, () => {
            resolve(config.port);
          });

        });
      } catch (error: any) {
        logger.error(`服务启动失败: ${error.message} ${error.stack}`);
        process.exit(1);
      }
    },
    restart: async () => {
      try {
        await server.close();
        const newServer = await createServer(server.config);
        await newServer.start();
        clearScreen();
        await bindShortcuts(newServer);
        logger.info('服务重启成功');
      } catch (error: any) {
        logger.error(`服务重启失败: ${error.message}`);
        throw error;
      }
    },
    close: async () => {
      return new Promise(resolve => {
        // 立即销毁所有socket连接
        socketsSet.forEach(s => {
          s.destroy();
          s.unref(); // 确保socket不会阻止进程退出
        });

        if (httpServer.listening) {
          httpServer.close(() => {
            logger.info('服务已关闭');
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
  };

  return server;
};

function createHttpServer(config: ResolvedServerConfig): HttpServer {
  const server = http.createServer();

  return server;
}

export function printServerInfo(
  address: string | AddressInfo | null,
  config: ResolvedServerConfig
) {
  assert(address, '当前服务无法绑定端口');
  if (typeof address === 'string') {
    logger.success(`启动服务成功: http://${address}`);
  } else {
    const reslovePort = address.port;
    let resolveHost =
      address.family === 'IPv4' ? address.address : [address.address];
    if (resolveHost === '0.0.0.0' || resolveHost === '[::]')
      resolveHost = 'localhost';
    const successTip = '启动服务成功:  ';
    const logInfo = [
      successTip,
      ` http://${resolveHost}:${reslovePort}\n`,
      ` cursor config: `,
      JSON.stringify(
          {
            'custome-mcp': `http://${resolveHost}:${reslovePort}${config.ssePath}`,
          },
          null,
          2
      ),
    ].join('');
    logger.success(logInfo);
  }
}

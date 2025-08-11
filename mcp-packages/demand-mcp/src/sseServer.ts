import type { Implementation } from '@modelcontextprotocol/sdk/types.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import http from 'node:http';
import type { Server as HttpServer, IncomingMessage, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import assert from 'node:assert';
import { packageJson } from './package.js';
import { createMcpServer } from './mcpServer.js';
import { createLogger } from './logger.js';
import { loadEnv } from './utils.js';

loadEnv();

const SSE_PATH = process.env.SSE_PATH || '/sse';

const logger = createLogger('SSE_SERVER');

export type StartServerOptions = PortAndHostOptions & Implementation;

const handleSseRequest = async (req: IncomingMessage, res: ServerResponse, url: URL, sessionMaps: Map<string, SSEServerTransport>) => {
  if (req.method === 'POST') {
    const sessionId = url.searchParams.get('sessionId');
    if (!sessionId) {
      res.statusCode = 400;
      res.end('sessionId 必须');
      return;
    }
    const transport = sessionMaps.get(sessionId);
    if (transport) {await transport.handlePostMessage(req, res);} else {
      res.statusCode = 400;
      res.end('transport 不存在');
      return;
    }

  } else if (req.method === 'GET') {
    const mcpServer = await createMcpServer({
      name: packageJson.name,
      version: packageJson.version,
      logger
    });

    res.on('close', () => {
      logger.warn('sse 连接关闭');
      sessionMaps.delete(transport.sessionId);
    });

    const transport = new SSEServerTransport(SSE_PATH, res);
    sessionMaps.set(transport.sessionId, transport);
    await mcpServer.connect(transport);
  }
};


export const startSseServer = async (options: PortAndHostOptions) => {
  try {
    const server = await createHttpServer(options);

    const sessionIdMap = new Map<string, SSEServerTransport>();

    server.on('request', async (req, res) => {
      const url = new URL(`http://localhost${req.url}`);
      if (url.pathname.startsWith(SSE_PATH))
        await handleSseRequest(req, res, url, sessionIdMap);
    });

    printServerInfo(server.address());
    return server;

  } catch (error) {
    logger.error(`服务启动失败: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }


};


interface PortAndHostOptions {
  host?: string;
  port?: number;
}

function createHttpServer(options: PortAndHostOptions): Promise<HttpServer> {
  return new Promise((resolve, reject) => {
    const httpServer =  http.createServer();
    httpServer.on('error', err => {
      reject(err);
    });
    httpServer.listen(options.port || 3000, options.host || '0.0.0.0', () => {
      resolve(httpServer);
    });
  });
}


function printServerInfo(address: string | AddressInfo | null) {
  assert(address, '当前服务无法绑定端口');
  if (typeof address === 'string') {console.log(`启动服务成功: http://${address}`);} else {
    const reslovePort = address.port;
    let resolveHost = address.family === 'IPv4' ? address.address : [address.address];
    if (resolveHost === '0.0.0.0' || resolveHost === '[::]')
      resolveHost = 'localhost';
    const successTip = '启动服务成功:  ';
    const logInfo = [
      successTip,
      `http://${resolveHost}:${reslovePort}\n`,
      'cursor config: ',
      JSON.stringify({
        'custome-mcp': `http://${resolveHost}:${reslovePort}${SSE_PATH}`,
      }, null, 2),
    ].join('');
    logger.info(logInfo);
  }
}

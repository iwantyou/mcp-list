import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema  } from '@modelcontextprotocol/sdk/types.js';
import type { Implementation } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import http from 'node:http';
import type { Server as HttpServer, IncomingMessage, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import assert from 'node:assert';
import { packageJson } from './package.js';

import { tools } from './all-tools.js';

const colorInfo = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  NC: '\x1b[0m',
};


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
    const mcpServer = await createServer({
      name: packageJson.name,
      version: packageJson.version,
    });

    res.on('close', () => {
      console.log(`${colorInfo.YELLOW}sse 连接关闭${colorInfo.NC}`);
      sessionMaps.delete(transport.sessionId);
    });

    const transport = new SSEServerTransport('/sse', res);
    sessionMaps.set(transport.sessionId, transport);
    await mcpServer.connect(transport);
  }
};


export const startServer = async (options: PortAndHostOptions) => {
  try {
    const server = await createHttpServer(options);

    const sessionIdMap = new Map<string, SSEServerTransport>();

    server.on('request', async (req, res) => {
      const url = new URL(`http://localhost${req.url}`);
      if (url.pathname.startsWith('/sse'))
        await handleSseRequest(req, res, url, sessionIdMap);
    });

    printServerInfo(server.address());
    return server;

  } catch (error) {
    console.error(`${colorInfo.RED}服务启动失败: ${error instanceof Error ? error.message : error}${colorInfo.NC}`);
    process.exit(1);
  }


};

/**
 * 使用Server创建服务器
 * 注册工具 setRequestHandler
 */
export async function createServer({ name, version }: { name: string, version: string }) {
  const server = new Server({
    name,
    version,
  }, {
    capabilities: {
      tools: {}
    }
  });
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: tools.map(tool =>   {
        console.log('json:', zodToJsonSchema(tool.schema));

        return {
          name: tool.name,
          description: tool.description,
          inputSchema: zodToJsonSchema(tool.schema),
          annotations: {
            title: tool.annotations.title,
            readOnlyHint: true,
            destructiveHint: true,
            openWorldHint: true,
          },
        };
      })
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const { name: toolName, arguments: args } = request.params;
    console.log('调用工具:', toolName, 'with args:', args);

    const tool = tools.find(tool => tool.name === toolName);
    if (!tool) {
      console.log('工具不存在:', toolName);
      return Promise.resolve({
        content: [{ type: 'text', text: `Unknown tool: ${toolName}` }]
      });
    }

    try {
      const result = await tool.handle(tool.schema.parse(args));
      console.log('工具返回结果:', result);
      return result;
    } catch (error) {
      console.error('工具错误:', error);
      return {
        content: [{ type: 'text', text: `Error: ${error}` }]
      };
    }
  });

  return server;
}

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
      colorInfo.GREEN,
      successTip,
      `http://${resolveHost}:${reslovePort}\n`,
      'cursor config: ',
      JSON.stringify({
        'custome-mcp': `http://${resolveHost}:${reslovePort}/sse`,
      }, null, 2),
      colorInfo.NC
    ].join('');
    console.log(logInfo);
  }
}

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { tools } from './all-tools.js';
import { createLogger } from './logger.js';
/**
 * 高级Server创建服务器
 * 注册工具 setRequestHandler
 */
async function createMcpServer({ name, version, logger }: { name: string, version: string, logger: ReturnType<typeof createLogger> }) {
  logger.info(`创建 MCP 服务器: ${name} v${version}`);

  const server = new Server({
    name,
    version,
  }, {
    capabilities: {
      tools: {}
    }
  });

  // 注册工具列表处理器
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    logger.info('处理工具列表请求');

    return {
      tools: tools.map(tool => {
        logger.info(`注册工具: ${tool.name}`);

        return {
          name: tool.name,
          description: tool.description,
          inputSchema: zodToJsonSchema(tool.schema),
          annotations: {
            title: tool.annotations.title,
            readOnlyHint: tool.annotations.readOnlyHint || true,
            destructiveHint: tool.annotations.destructiveHint || false,
            openWorldHint: tool.annotations.openWorldHint || true,
          },
        };
      })
    };
  });

  // 注册工具调用处理器
  server.setRequestHandler(CallToolRequestSchema, async request => {
    const { name: toolName, arguments: args } = request.params;
    logger.info(`调用工具: ${toolName} 参数: ${JSON.stringify(args)}`);

    const tool = tools.find(tool => tool.name === toolName);
    if (!tool) {
      logger.warn(`工具不存在: ${toolName}`);
      return Promise.resolve({
        content: [{ type: 'text', text: `未知工具: ${toolName}` }]
      });
    }

    try {
      const parsedArgs = tool.schema.parse(args);
      const result = await tool.handle(parsedArgs);

      logger.info(`工具 ${toolName} 执行成功`);
      return result;
    } catch (error) {
      logger.error(`工具 ${toolName} 执行失败`, error);

      return {
        content: [{
          type: 'text',
          text: `工具执行失败: ${error instanceof Error ? error.message : String(error)}`
        }]
      };
    }
  });

  logger.info(`成功注册 ${tools.length} 个工具`);
  return server;
}

export { createMcpServer };

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { tools } from './all-tools.js';


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
    console.log('所有工具', tools.map(t => t.name));
    return {
      tools: tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: zodToJsonSchema(tool.schema),
      }))
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

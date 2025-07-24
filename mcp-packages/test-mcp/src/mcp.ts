import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

async function createMcpServer({ name, version }: { name: string, version: string }) {
  const server = new McpServer({
    name,
    version: '1.0.0',
  });

  server.tool('du_hello', {
    name: z.string().describe('The name to say hello to'),
  }, async args => {
    return {
      content: [{ type: 'text', text: `Hello, ${args.name}!` }]
    };
  });

  return server;
}

export { createMcpServer };

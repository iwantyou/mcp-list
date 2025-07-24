
import type { z } from 'zod';
import type { ImageContent, TextContent } from '@modelcontextprotocol/sdk/types.js';

type Schema = z.Schema

type ToolHandleResult = { content?: (ImageContent | TextContent)[] }

interface ToolDefinition<T extends Schema = Schema> {
    name: string;
    description: string;
    annotations: {
        title: string;
    }
    schema: T
    handle: (args: z.output<T>) => Promise<ToolHandleResult>;
}

function defineTool<T extends Schema>(tool: ToolDefinition<T>): ToolDefinition<T> {
  return tool;
}

export { defineTool };

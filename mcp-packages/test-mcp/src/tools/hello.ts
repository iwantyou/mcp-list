import { defineTool } from './tool.js';
import { z } from 'zod';

export const helloTool = defineTool({
  name: 'du_hello',
  description: 'A hello tool',
  annotations: {
    title: 'du_hello',
  },
  schema: z.object({
    name: z.string(),
  }),
  handle: async args => {
    return {
      content: [{ type: 'text', text: `Hello, 当前参数为 -> ${JSON.stringify(args.name)}!` }],
    };
  },
});

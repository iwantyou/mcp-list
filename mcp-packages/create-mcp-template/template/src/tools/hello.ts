import { defineTool } from './tool.js';
import { z } from 'zod';

export const helloTool = defineTool({
  name: 'say_hello',
  description: `向人说hello`,
  annotations: {
    title: 'du_hello',
  },
  schema: z.object({
    name: z.string().describe('名字'),
  }),
  handle: async ({ name }) => {
    return {
      content: [{ type: 'text', text: `Hello, 你真是个大聪明 ${name}!` }],
    };
  },
});

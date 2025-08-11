import { defineTool } from './tool.js';
import { z } from 'zod';
import { caseGenPrompt } from '../prompts/caseGen.js';

export const genCaseTool = defineTool({
  name: 'genCase',
  description: '根据需求内容生成测试用例',
  schema: z.object({
    content: z.string(),
  }),
  annotations: {
    title: 'genCase',
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false,
  },
  handle: async ({ content }) => {
    return {
      content: [
        {
          type: 'text',
          text: caseGenPrompt(content),
        },
      ],
    };
  },
});

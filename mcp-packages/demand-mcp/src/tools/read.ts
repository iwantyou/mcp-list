import { defineTool } from './tool.js';
import { z } from 'zod';
import { readContentPrompt } from '../prompts/readContent.js';

export const readTool = defineTool({
  name: 'read',
  description: '读取知乎需求链接,提取需求内容',
  schema: z.object({
    url: z.string(),
  }),
  annotations: {
    title: 'read',
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false,
  },
  handle: async ({ url }) => {
    const id = url.split('/').pop();
    if (!id) {
      return {
        content: [
          {
            type: 'text',
            text: '获取id失败',
          }
        ]
      };
    }
    const response = await fetch(`${process.env.ZHIHU_API_BASE_URL}/rfc/query?id=${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.ZHIHU_API_TOKEN}`,
        'accept': 'application/json',
      } });

    try {
      const responseData = await response.json();
      if (!responseData || responseData.code !== 0) {
        return {
          content: [
            {
              type: 'text',
              text: '获取数据失败: ' + (responseData?.message || '未知错误'),
            }
          ]
        };
      }
      const { wikiPage, url: wikiUrl } = responseData.data || {};

      // 构建分析内容,提取内容要素
      const analysisContent = [
        readContentPrompt(wikiPage, wikiUrl),
      ].join('\n');
      return  {
        content: [
          {
            type: 'text',
            text: analysisContent,
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: '分析失败: ' + (error as Error).message,
          }
        ]
      };
    }

  },
});

import { defineTool } from './tool.js';
import { z } from 'zod';

export const timeTool = defineTool({
  name: 'get-current-time',
  description: '获取当前时间和时区信息',
  annotations: {
    title: 'current_time',
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false,
  },
  schema: z.object({
    timezone: z.string().optional().describe('时区 (例如: Asia/Shanghai, UTC)'),
    format: z.enum(['full', 'date', 'time', 'timestamp']).optional().describe('输出格式'),
  }),
  handle: async ({ timezone = 'Asia/Shanghai', format = 'full' }) => {
    try {
      const now = new Date();
      const utcTime = new Date(now.toISOString());

      // 格式化时间
      const formatTime = (date: Date, tz: string, fmt: string) => {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: tz,
        };

        switch (fmt) {
          case 'date':
            options.year = 'numeric';
            options.month = 'long';
            options.day = 'numeric';
            break;
          case 'time':
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.second = '2-digit';
            break;
          case 'timestamp':
            return date.getTime().toString();
          default: // full
            options.year = 'numeric';
            options.month = 'long';
            options.day = 'numeric';
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.second = '2-digit';
            options.weekday = 'long';
        }

        return new Intl.DateTimeFormat('zh-CN', options).format(date);
      };

      const localTime = formatTime(now, timezone, format);
      const utcTimeStr = formatTime(utcTime, 'UTC', format);

      let result = `## 时间信息\n`;
      result += `- 本地时间 (${timezone}): ${localTime}\n`;
      result += `- UTC 时间: ${utcTimeStr}\n`;
      result += `- 时间戳: ${now.getTime()}\n`;
      result += `- ISO 格式: ${now.toISOString()}\n`;

      // 添加时区信息
      const timeZoneOffset = now.getTimezoneOffset();
      const offsetHours = Math.abs(Math.floor(timeZoneOffset / 60));
      const offsetMinutes = Math.abs(timeZoneOffset % 60);
      const offsetSign = timeZoneOffset <= 0 ? '+' : '-';

      result += `- 时区偏移: UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}\n`;

      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `获取时间信息时发生错误: ${error.message}`,
          },
        ],
      };
    }
  },
});

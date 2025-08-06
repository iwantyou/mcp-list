import { defineTool } from './tool.js';
import { z } from 'zod';
import fetch from 'node-fetch';

// 天气代码映射
const weatherCodeMap: Record<number, string> = {
  0: '晴天',
  1: '晴天',
  2: '多云',
  3: '多云',
  45: '雾',
  48: '雾凇',
  51: '小雨',
  53: '中雨',
  55: '大雨',
  61: '小雨',
  63: '中雨',
  65: '大雨',
  71: '小雪',
  73: '中雪',
  75: '大雪',
  77: '雪粒',
  80: '小雨',
  81: '中雨',
  82: '大雨',
  85: '小雪',
  86: '大雪',
  95: '雷阵雨',
  96: '雷阵雨',
  99: '强雷阵雨',
};

// 格式化天气数据
function formatWeatherData(data: any): string {
  try {
    const current = data.current_weather;
    const daily = data.daily;

    if (!current || !daily)
      return '天气数据格式错误';


    let result = `## 当前天气\n`;
    result += `- 温度: ${current.temperature}°C\n`;
    result += `- 风速: ${current.windspeed} km/h\n`;
    result += `- 风向: ${current.winddirection}°\n`;
    result += `- 天气: ${weatherCodeMap[current.weathercode] || '未知'}\n\n`;

    result += `## 未来7天预报\n`;
    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
      const date = new Date(daily.time[i]);
      const dayName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

      result += `### ${dayName} (${dateStr})\n`;
      result += `- 最高温度: ${daily.temperature_2m_max[i]}°C\n`;
      result += `- 最低温度: ${daily.temperature_2m_min[i]}°C\n`;
      result += `- 天气: ${weatherCodeMap[daily.weathercode[i]] || '未知'}\n\n`;
    }

    return result;
  } catch (error) {
    return `格式化天气数据时出错: ${error}`;
  }
}

export const worldWeatherTool = defineTool({
  name: 'get-world-weather',
  description: '获取全世界的天气预报，支持缓存和更好的错误处理',
  annotations: {
    title: 'world_weather',
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  schema: z.object({
    latitude: z.number().min(-90).max(90).describe('纬度'),
    longitude: z.number().min(-180).max(180).describe('经度'),
    random_string: z.string().optional().describe('随机字符串参数'),
  }),
  handle: async ({ latitude, longitude, random_string }) => {
    try {

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&forecast_days=7&hourly=temperature_2m,precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MCP-Weather-Tool/1.0',
        },
      });

      if (!response.ok)
        throw new Error(`HTTP错误! 状态: ${response.status} - ${response.statusText}`);


      const data = await response.json();

      return {
        content: [
          {
            type: 'text',
            text: formatWeatherData(data),
          },
        ],
      };
    } catch (error: any) {
      const errorMessage = error.message || '未知错误';
      return {
        content: [
          {
            type: 'text',
            text: `获取天气信息时发生错误: ${errorMessage}\n\n建议:\n1. 检查网络连接\n2. 验证坐标是否正确\n3. 稍后重试`,
          },
        ],
      };
    }
  }
});

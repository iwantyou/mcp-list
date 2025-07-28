import { helloTool } from './tools/hello.js';
import { worldWeatherTool } from './tools/world-weather.js';
import { timeTool } from './tools/time.js';
import { ToolDefinition } from './tools/tool.js';

export const tools: ToolDefinition<any>[] = [helloTool, worldWeatherTool, timeTool];

import { readTool } from './tools/read.js';
import { genCaseTool } from './tools/genCase.js';
import { ToolDefinition } from './tools/tool.js';

export const tools: ToolDefinition<any>[] = [readTool, genCaseTool];

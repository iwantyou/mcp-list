import { describe, it, expect } from 'vitest';
import { helloTool } from '../src/tools/hello.js';
import { timeTool } from '../src/tools/time.js';

describe('MCP Tools', () => {
  describe('Hello Tool', () => {
    it('should return greeting message', async () => {
      const result = await helloTool.handle({ name: 'Test' });
      expect(result.content).toBeDefined();
      expect(result.content?.[0].type).toBe('text');
      expect(result.content?.[0].text).toContain('Hello');
      expect(result.content?.[0].text).toContain('Test');
    });
  });

  describe('Time Tool', () => {
    it('should return time information', async () => {
      const result = await timeTool.handle({ timezone: 'Asia/Shanghai', format: 'full' });
      expect(result.content).toBeDefined();
      expect(result.content?.[0].type).toBe('text');
      expect(result.content?.[0].text).toContain('时间信息');
    });

    it('should handle different formats', async () => {
      const result = await timeTool.handle({ format: 'timestamp' });
      expect(result.content).toBeDefined();
      expect(result.content?.[0].text).toContain('时间戳');
    });
  });

  describe('Tool Definitions', () => {
    it('should have valid tool definitions', () => {
      expect(helloTool.name).toBe('say_hello');
      expect(helloTool.description).toContain('hello');
      expect(helloTool.schema).toBeDefined();

      expect(timeTool.name).toBe('get-current-time');
      expect(timeTool.description).toContain('时间');
      expect(timeTool.schema).toBeDefined();
    });
  });
});

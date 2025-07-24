import { describe, it, expect } from 'vitest';
import { tools } from '../src/all-tools.js';

describe('Tools', () => {
  it('should have test-tool defined', () => {
    expect(tools['test-tool']).toBeDefined();
    expect(tools['test-tool'].name).toBe('test-tool');
    expect(tools['test-tool'].description).toBe('A test tool');
  });

  it('should validate input schema', async () => {
    const tool = tools['test-tool'];
    const validArgs = { name: 'test' };
    const invalidArgs = { invalid: 'data' };

    // 应该通过验证
    expect(() => tool.inputSchema.parse(validArgs)).not.toThrow();

    // 应该抛出错误
    expect(() => tool.inputSchema.parse(invalidArgs)).toThrow();
  });

  it('should handle tool execution', async () => {
    const tool = tools['test-tool'];
    const args = { name: 'test' };

    const result = await tool.handler(args);

    expect(result).toHaveProperty('content');
    expect(result.content).toBeInstanceOf(Array);
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(result.content[0]).toHaveProperty('text');
    expect(result.content[0].text).toContain('Hello, 当前参数为');
  });
});

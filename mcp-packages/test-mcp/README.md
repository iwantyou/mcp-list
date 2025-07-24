# Test MCP Server

一个优化的MCP (Model Context Protocol) 服务器，使用ESM架构。

## 架构特点

### 目录结构
```
src/
├── index.ts      # 主服务器逻辑
├── cli.ts        # CLI入口点
└── tools.ts      # 工具定义和处理器
```

### 模块化设计
- **分离关注点**: CLI逻辑与服务器逻辑分离
- **工具模块化**: 每个工具都有独立的定义和处理器
- **类型安全**: 使用TypeScript和Zod进行类型验证
- **ESM优先**: 使用现代ESM模块系统

### 构建配置
- **ESM构建**: 使用ESNext模块和NodeNext解析
- **CJS兼容**: 同时支持CommonJS构建
- **类型声明**: 自动生成TypeScript声明文件
- **源码映射**: 支持调试和开发

## 使用方法

### 开发
```bash
# 安装依赖
pnpm install

# 开发模式运行
pnpm run dev

# 构建
pnpm run build
```

### 作为CLI工具
```bash
# 全局安装
npm install -g test-mcp

# 使用
test-mcp
```

### 作为库
```javascript
import { createServer } from 'test-mcp';

const server = await createServer();
// 使用服务器...
```

## 添加新工具

在 `src/tools.ts` 中添加新的工具定义：

```typescript
export const tools: Record<string, ToolDefinition> = {
    "my-tool": {
        name: "my-tool",
        description: "My custom tool",
        parameters: {
            type: "object",
            properties: {
                // 定义参数
            },
        },
        inputSchema: MyToolSchema,
        handler: async (args) => {
            // 实现工具逻辑
            return {
                content: [{ type: "text", text: "Result" }]
            };
        }
    }
};
```

## 技术栈

- **TypeScript**: 类型安全的JavaScript
- **ESM**: 现代模块系统
- **Zod**: 运行时类型验证
- **MCP SDK**: Model Context Protocol
- **Vitest**: 单元测试框架 
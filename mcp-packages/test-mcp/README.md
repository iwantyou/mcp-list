# DU MCP Server

一个优化的 MCP (Model Context Protocol) 服务器，提供多种实用工具。

## 功能特性

- 🚀 **高性能**: 优化的 ESM 架构
- 🛠️ **多工具支持**: 天气查询、时间工具、问候工具
- 📝 **详细日志**: 完整的错误处理和日志记录
- 🔄 **缓存机制**: 天气数据缓存，提高响应速度
- 🧪 **测试覆盖**: 完整的单元测试

## 可用工具

### 1. 天气查询工具 (`get-world-weather`)
获取全球任意位置的天气预报。

**参数:**
- `latitude`: 纬度 (-90 到 90)
- `longitude`: 经度 (-180 到 180)
- `random_string`: 随机字符串参数

**特性:**
- 支持缓存 (5分钟)
- 友好的中文天气描述
- 7天天气预报
- 错误处理和重试建议

### 2. 时间工具 (`get-current-time`)
获取当前时间和时区信息。

**参数:**
- `timezone`: 时区 (默认: Asia/Shanghai)
- `format`: 输出格式 (full/date/time/timestamp)

**特性:**
- 多时区支持
- 多种输出格式
- 详细的时区信息

### 3. 问候工具 (`say_hello`)
简单的问候工具。

**参数:**
- `name`: 姓名

## 安装和运行

### 安装依赖
```bash
pnpm install
```

### 构建项目
```bash
pnpm build
```

### 运行服务器
```bash
pnpm start
```

### 开发模式
```bash
pnpm dev
```

### 运行测试
```bash
pnpm test
```

## 开发

### 项目结构
```
src/
├── index.ts          # 主入口文件
├── mcpServer.ts      # MCP 服务器实现
├── all-tools.ts      # 工具集合
└── tools/
    ├── tool.ts       # 工具定义接口
    ├── hello.ts      # 问候工具
    ├── world-weather.ts  # 天气工具
    └── time.ts       # 时间工具
```

### 添加新工具

1. 在 `src/tools/` 目录下创建新的工具文件
2. 使用 `defineTool` 函数定义工具
3. 在 `src/all-tools.ts` 中导入并添加到工具列表

示例:
```typescript
import { defineTool } from './tool.js';
import { z } from 'zod';

export const myTool = defineTool({
  name: 'my-tool',
  description: '我的工具描述',
  annotations: {
    title: 'my_tool',
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false,
  },
  schema: z.object({
    // 定义参数
  }),
  handle: async (args) => {
    // 实现工具逻辑
    return {
      content: [{ type: 'text', text: '结果' }]
    };
  },
});
```

## 优化特性

### 1. 错误处理
- 完整的 try-catch 错误捕获
- 详细的错误信息和建议
- 优雅的错误恢复

### 2. 日志系统
- 结构化的日志输出
- 时间戳和日志级别
- 工具调用追踪

### 3. 缓存机制
- 天气数据内存缓存
- 可配置的缓存时间
- 缓存状态显示

### 4. 性能优化
- ESM 模块系统
- TypeScript 类型安全
- 异步处理

## 配置

### TypeScript 配置
项目使用严格的 TypeScript 配置，确保类型安全。

### 测试配置
使用 Vitest 进行单元测试，支持热重载。

## 许可证

ISC License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v0.0.1
- 初始版本
- 基础工具实现
- 错误处理和日志系统
- 缓存机制
- 测试覆盖 
# Demand MCP Server

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![MCP Version](https://img.shields.io/badge/MCP-1.16.0-blue.svg)](https://modelcontextprotocol.io/)

一个专业的知乎需求分析MCP服务器，专门用于读取和分析知乎RFC需求文档，并生成标准化的测试用例。

## 🚀 功能特性

### 📋 核心功能
- **需求文档读取**: 自动读取知乎RFC需求链接
- **智能需求分析**: 基于ISO/IEC/IEEE 29119标准进行需求分析
- **测试用例生成**: 自动生成结构化的测试用例
- **多格式输出**: 支持JSON、Markdown、XMind等多种输出格式

### 🛠️ 工具集
- **read**: 读取知乎需求链接并分析

### 🎯 分析能力
- **需求结构化分析**: 功能需求、性能需求、用户体验需求分类
- **测试风险评估**: 识别测试难点、风险点、依赖关系
- **测试策略制定**: 基于需求复杂度制定测试策略
- **优先级评估**: 紧急程度、重要程度、影响范围分析

## 📦 安装

### 环境要求
- Node.js >= 18.0.0
- npm 或 pnpm

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd mcp-packages/demand-mcp
```

2. **安装依赖**
```bash
pnpm install
```

3. **构建项目**
```bash
npm run build
```

## 🔧 使用方法

### 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 作为MCP客户端使用

在支持MCP的客户端（如Cursor）中配置：

```json
{
  "mcpServers": {
    "demand-mcp": {
      "command": "node",
      "args": ["/path/to/demand-mcp/cli.js"],
      "env": {}
    }
  }
}
```
或者使用sse

```json
{
  "mcpServers": {
    "demand-mcp": {
      "type": "sse",
      "url": "http://localhost:9000/sse",
    }
  }
}
```

## 📚 API 文档

### read 工具

读取知乎需求链接并生成分析报告。

**参数:**
- `url` (string): 知乎RFC需求链接

**示例:**
```javascript
// 读取需求链接
const result = await readTool.handle({
  url: "https://one.in.zhihu.com/new-one/rfcs/67986"
});
```

**返回格式:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "# 需求分析报告\n\n## 需求概述\n..."
    }
  ]
}
```

### time 工具

获取当前时间和时区信息。

**参数:**
- `timezone` (string, 可选): 时区，如 "Asia/Shanghai"
- `format` (string, 可选): 输出格式，支持 "full", "date", "time", "timestamp"

**示例:**
```javascript
// 获取完整时间信息
const result = await timeTool.handle({
  timezone: "Asia/Shanghai",
  format: "full"
});
```

## 🏗️ 项目结构

```
demand-mcp/
├── src/
│   ├── tools/           # MCP工具实现
│   │   ├── read.ts      # 需求读取工具
│   │   ├── time.ts      # 时间工具
│   │   └── tool.ts      # 工具基类
│   ├── prompts/         # 提示词模板
│   ├── mcpServer.ts     # MCP服务器实现
│   ├── cli.ts          # 命令行接口
│   └── index.ts        # 入口文件
├── dist/               # 构建输出
├── cli.js             # CLI入口
├── package.json       # 项目配置
└── README.md          # 项目文档
```

## 🔍 分析框架

### 需求分析流程

1. **文档内容解析**: 深入分析RFC文档的核心内容
2. **需求结构化分析**: 
   - 功能需求识别：核心功能、辅助功能、边界功能
   - 性能需求评估：响应时间、并发量、数据量要求
   - 用户体验需求：界面交互、操作流程、异常处理
3. **测试风险评估**: 识别测试难点、风险点、依赖关系
4. **测试策略制定**: 基于需求复杂度制定测试策略

### 输出格式

#### 需求分析报告
- 📋 需求概述
- 🎯 需求分类与测试重点
- ⚡ 测试优先级评估
- 🔧 技术可行性分析
- 🚨 测试风险识别
- 💡 测试策略建议
- 📈 测试指标与验收标准

#### 测试用例结构
- 测试模块
- 子模块
- 前置条件
- 测试步骤
- 预期结果
- 优先级 (1-4)

## 🧪 测试用例标准

### 优先级定义
- **优先级1**: 系统必须使用的功能、购买相关及生效性验证、实验分组、当前需求的核心改动点
- **优先级2**: 产品非核心模块必须使用的功能、核心功能的边界场景
- **优先级3**: 用户使用交互跳转、影响功能使用的UI、性能、异常场景、文案类检查
- **优先级4**: 非功能性的体验、不影响正常功能使用的UI、性能、异常场景

### 测试场景覆盖
- 正向测试
- 逆向测试
- 边界值测试
- 异常输入测试
- 实验分组测试

## 🚀 开发指南

### 添加新工具

1. 在 `src/tools/` 目录下创建新的工具文件
2. 使用 `defineTool` 函数定义工具
3. 在 `src/all-tools.ts` 中注册新工具
4. 更新文档

### 示例工具定义

```typescript
import { defineTool } from './tool.js';
import { z } from 'zod';

export const newTool = defineTool({
  name: 'new-tool',
  description: '新工具描述',
  schema: z.object({
    // 定义参数schema
  }),
  annotations: {
    title: 'New Tool',
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false,
  },
  handle: async ({ /* 参数 */ }) => {
    // 工具实现逻辑
    return {
      content: [
        {
          type: 'text',
          text: '工具执行结果',
        }
      ]
    };
  },
});
```

### 构建和测试

```bash
# 构建项目
npm run build

# 运行测试
npm test

# 代码检查
npm run lint

# 修复代码格式
npm run lint:fix
```

## 📄 许可证

本项目采用 ISC 许可证。详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📞 支持

如果您遇到问题或有建议，请：

1. 查看 [Issues](../../issues) 页面
2. 创建新的 Issue
3. 联系项目维护者

## 🔄 更新日志

### v0.0.1
- 初始版本发布
- 实现需求读取和分析功能
- 支持测试用例生成
- 添加时间工具

---

**注意**: 本项目仅供内部使用，请勿用于商业用途。 
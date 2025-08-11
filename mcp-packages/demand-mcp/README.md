# Demand MCP Server

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![MCP Version](https://img.shields.io/badge/MCP-1.16.0-blue.svg)](https://modelcontextprotocol.io/)

一个专业的知乎需求分析MCP服务器，专门用于读取和分析知乎RFC需求文档，并生成标准化的测试用例。

## 🚀 功能特性

### 📋 核心功能
- **需求文档读取**: 自动读取知乎RFC需求链接
- **智能需求分析**: 基于产品管理最佳实践进行需求分析
- **测试用例生成**: 自动生成结构化的测试用例
- **多格式输出**: 支持JSON、Markdown等多种输出格式

### 🛠️ 工具集
- **read**: 读取知乎需求链接并生成需求分析报告
- **genCase**: 根据需求内容生成标准化的测试用例

### 🎯 分析能力
- **需求结构化分析**: 功能需求、非功能需求、技术实现分析
- **风险评估**: 业务风险、技术风险、项目风险识别
- **实施建议**: 优先级建议、开发策略、测试重点
- **标准化输出**: 遵循产品管理和测试工程标准

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
npm install
# 或使用 pnpm
pnpm install
```

3. **构建项目**
```bash
npm run build
```

## 🔧 使用方法

### 环境配置

#### 设置环境变量

在项目根目录创建 `.env` 文件：

```bash
# 知乎API配置
ZHIHU_API_TOKEN=your_api_token_here
ZHIHU_API_BASE_URL=https://one.in.zhihu.com/api/v2

# 服务器配置
PORT=9000
HOST=localhost
```

### 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 作为MCP客户端使用

在支持MCP的客户端（如Cursor）中配置：

#### 方式一：直接启动

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

#### 方式二：SSE服务器模式

```json
{
  "mcpServers": {
    "demand-mcp": {
      "type": "sse",
      "url": "http://localhost:9000/sse"
    }
  }
}
```

### 直接使用CLI

```bash
# 读取需求链接
node cli.js read "https://one.in.zhihu.com/new-one/rfcs/67986"
```

## 📚 API 文档

### read 工具

读取知乎需求链接并生成需求分析报告。

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

**功能特性:**
- 自动解析RFC文档ID
- 调用知乎API获取文档内容
- 基于产品管理最佳实践进行需求分析
- 生成结构化的需求分析报告
- 支持多种输出格式

### genCase 工具

根据需求内容生成标准化的测试用例。

**参数:**
- `content` (string): 需求内容文本

**示例:**
```javascript
// 生成测试用例
const result = await genCaseTool.handle({
  content: "需求内容..."
});
```

**返回格式:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "json: [{\"测试模块\": \"...\", \"子模块\": \"...\", \"前置条件\": \"...\", \"测试步骤\": \"...\", \"预期结果\": \"...\", \"优先级\": \"1\"}, ...]"
    }
  ]
}
```

**功能特性:**
- 基于ISO/IEC/IEEE 29119标准生成测试用例
- 支持多种测试场景：正向、逆向、边界值、异常输入
- 自动标注测试优先级
- 输出标准化的JSON格式

## 🏗️ 项目结构

```
demand-mcp/
├── src/
│   ├── tools/           # MCP工具实现
│   │   ├── read.ts      # 需求读取工具
│   │   ├── genCase.ts   # 测试用例生成工具
│   │   └── tool.ts      # 工具基类
│   ├── prompts/         # 提示词模板
│   │   ├── readContent.ts # 需求分析提示词
│   │   └── caseGen.ts   # 测试用例生成提示词
│   ├── mcpServer.ts     # MCP服务器实现
│   ├── sseServer.ts     # SSE服务器实现
│   ├── cli.ts          # 命令行接口
│   ├── all-tools.ts    # 工具注册
│   ├── logger.ts       # 日志工具
│   ├── utils.ts        # 工具函数
│   ├── package.ts      # 包信息
│   ├── stido.ts        # 配置管理
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
   - 非功能需求分析：性能、安全、兼容性、可维护性
   - 用户需求分析：目标用户、使用场景、用户体验
   - 技术需求分析：技术栈、架构设计、集成需求
3. **风险评估**: 业务风险、技术风险、项目风险
4. **实施建议**: 优先级建议、开发策略、测试重点

### 输出格式

#### 需求分析报告
- 📋 需求概述
- 🎯 功能需求分析
- ⚡ 非功能需求
- 🔧 技术实现
- 🚨 风险评估
- 💡 实施建议

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

### 开发环境设置

1. **克隆项目并安装依赖**
```bash
git clone <repository-url>
cd mcp-packages/demand-mcp
pnpm install
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

3. **启动开发服务器**
```bash
pnpm run dev
```

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

## 🐛 故障排除

### 常见问题

1. **API调用失败**
   - 检查环境变量中的API Token是否正确
   - 确认网络连接正常
   - 查看日志获取详细错误信息

2. **SSE连接失败**
   - 确认服务器已启动并监听正确端口
   - 检查防火墙设置
   - 验证URL配置是否正确

3. **权限问题**
   - 确认用户有足够的权限访问知乎API
   - 检查Token是否过期

### 日志查看

```bash
# 查看实时日志
tail -f logs/demand-mcp.log

# 查看错误日志
grep ERROR logs/demand-mcp.log
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

### 代码规范

- 使用 TypeScript 进行开发
- 遵循 ESLint 规则
- 提交前运行测试确保代码质量
- 添加适当的注释和文档

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
- 支持SSE服务器模式
- 完善环境配置和文档

---

**注意**: 本项目仅供内部使用，请勿用于商业用途。 
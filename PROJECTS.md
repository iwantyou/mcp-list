# 项目概览

本文档提供了MCP Root项目中所有子项目的概览信息。

## 项目列表

### 1. MCP Root (根项目)
**位置**: `/`
**描述**: 整个MCP项目的根目录，管理所有子项目
**主要功能**:
- 统一的项目管理
- 构建和测试脚本
- 开发工具链配置

**相关文档**: [README.md](./README.md)

### 2. Create MCP Template
**位置**: `packages/create-mcp-template/`
**描述**: MCP服务器模板创建工具
**主要功能**:
- 快速创建新的MCP服务器项目
- 基于模板生成项目结构
- 自动配置和依赖安装
- 美观的命令行界面

**相关文档**: [packages/create-mcp-template/README.md](./packages/create-mcp-template/README.md)

### 3. Demand MCP
**位置**: `mcp-packages/demand-mcp/`
**描述**: 知乎需求分析MCP服务器
**主要功能**:
- 读取和分析知乎RFC需求文档
- 生成标准化的测试用例
- 智能需求分析报告
- 多格式输出支持

**相关文档**: [mcp-packages/demand-mcp/README.md](./mcp-packages/demand-mcp/README.md)

### 4. Utils
**位置**: `packages/utils/`
**描述**: 共享工具库
**主要功能**:
- 结构化日志系统
- 终端工具函数
- 颜色输出支持
- 通用开发工具

## 项目关系

```
MCP Root
├── mcp-packages/
│   └── demand-mcp (需求分析服务器)
└── packages/
    ├── create-mcp-template (模板创建工具)
    └── utils (共享工具库)
```

## 技术栈

### 共同技术栈
- **语言**: TypeScript
- **包管理**: pnpm
- **构建工具**: TypeScript Compiler
- **测试框架**: Vitest
- **代码检查**: ESLint

### 项目特定技术栈
- **create-mcp-template**: cac (CLI框架)
- **demand-mcp**: @modelcontextprotocol/sdk, node-fetch, zod
- **utils**: 纯工具函数库

## 开发工作流

1. **安装依赖**: `pnpm install`
2. **构建项目**: `pnpm build`
3. **代码检查**: `pnpm lint`
4. **运行测试**: `pnpm test`
5. **创建新项目**: `zmc <project-name>`

## 项目状态

| 项目                | 状态   | 版本   | 文档 |
| ------------------- | ------ | ------ | ---- |
| MCP Root            | ✅ 活跃 | v1.0.0 | ✅    |
| create-mcp-template | ✅ 活跃 | v0.0.1 | ✅    |
| demand-mcp          | ✅ 活跃 | v0.0.1 | ✅    |
| utils               | ✅ 活跃 | v1.0.0 | ✅    |

## 贡献指南

1. 选择要贡献的项目
2. 查看对应项目的README文档
3. 遵循项目的开发规范
4. 提交Issue或Pull Request

## 许可证

所有项目均使用 ISC License。 
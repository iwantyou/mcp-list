# MCP Root 项目

这是一个基于 Model Context Protocol (MCP) 的根项目，包含多个MCP服务器和工具，专为知乎内部需求分析和工作流程优化而设计。

## 项目结构

```
mcp-root/
├── mcp-packages/           # MCP服务器包目录
│   └── demand-mcp/         # 知乎需求分析MCP服务器
├── packages/               # 工具包目录
│   ├── create-mcp-template/  # MCP模板创建工具
│   └── utils/              # 通用工具库
├── package.json            # 根项目配置
├── pnpm-workspace.yaml     # pnpm工作区配置
├── tsconfig.base.json      # TypeScript基础配置
├── tsconfig.build.json     # TypeScript构建配置
├── eslint.config.mjs       # ESLint配置
└── PROJECTS.md             # 项目概览文档
```

## 功能特性

- 🚀 **模块化架构**: 使用pnpm工作区管理多个MCP包
- 🛠️ **开发工具**: 统一的构建、测试和代码检查
- 📦 **模板系统**: 快速创建新的MCP服务器
- 🔧 **类型安全**: 完整的TypeScript支持
- 📊 **需求分析**: 专业的知乎RFC需求分析工具
- 🧪 **测试用例生成**: 自动生成标准化测试用例
- 📝 **日志系统**: 结构化的日志输出和终端工具

## 子项目

### 1. create-mcp-template
MCP服务器模板创建工具，提供快速创建新MCP项目的功能。

**主要功能:**
- 基于模板创建新的MCP服务器项目
- 自动配置package.json和项目结构
- 支持自定义目录和覆盖选项
- 美观的命令行界面和进度提示

**使用方法:**
```bash
# 手动link
pnpm link:zmc

# 创建新项目
zmc my-mcp-server

# 指定目录
zmc my-mcp-server -d custom-directory

# 覆盖已存在文件
zmc my-mcp-server -o
```

**CLI命令:**
- `zmc <name>`: 创建新的MCP项目
- `zmc <name> -d <directory>`: 指定创建目录
- `zmc <name> -o`: 覆盖已存在的文件
- `zmc <name> -s false`: 显示详细安装信息

### 2. demand-mcp
专业的知乎需求分析MCP服务器，专门用于读取和分析知乎RFC需求文档，并生成标准化的测试用例。

**主要功能:**
- 📋 **需求文档读取**: 自动读取知乎RFC需求链接
- 🧠 **智能需求分析**: 基于产品管理最佳实践进行需求分析
- 🧪 **测试用例生成**: 自动生成结构化的测试用例
- 📊 **多格式输出**: 支持JSON、Markdown等多种输出格式

**核心工具:**
- `read`: 读取知乎需求链接并生成需求分析报告
- `genCase`: 根据需求内容生成标准化的测试用例

**使用方法:**
```bash
# 启动服务器
cd mcp-packages/demand-mcp
pnpm start

# 直接使用CLI
node cli.js read "https://one.in.zhihu.com/new-one/rfcs/67986"
```

### 3. utils
共享工具库，提供通用的开发工具。

**主要功能:**
- 📝 **日志系统**: 结构化的日志输出，支持颜色和格式化
- 🎨 **终端工具**: 屏幕清理、颜色输出等终端操作
- 🔧 **工具函数**: 通用的开发辅助函数

**导出内容:**
```typescript
import { createLogger, colorInfo, clearScreen } from '@zh-mcp/utils';
```

## 安装和开发

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 9.15.0

### 安装依赖
```bash
pnpm install
```

### 构建所有项目
```bash
pnpm build
```

### 代码检查
```bash
pnpm lint
pnpm lint:fix
```

### 运行测试
```bash
pnpm test
```

## 开发脚本

- `pnpm build`: 构建所有子项目
- `pnpm lint`: 代码检查
- `pnpm lint:fix`: 自动修复代码问题
- `pnpm dev:zmc`: 开发模式构建create-mcp-template
- `pnpm build:zmc`: 构建create-mcp-template
- `pnpm link:zmc`: 全局链接create-mcp-template工具
- `pnpm unlink:zmc`: 取消全局链接

## 技术栈

- **包管理**: pnpm + 工作区
- **语言**: TypeScript
- **构建工具**: TypeScript Compiler
- **测试框架**: Vitest
- **代码检查**: ESLint
- **MCP SDK**: @modelcontextprotocol/sdk
- **HTTP客户端**: node-fetch
- **数据验证**: Zod
- **命令行工具**: CAC

## 项目配置

### TypeScript配置
- 使用严格模式
- 支持ES模块
- 统一的编译配置
- 分离的构建配置

### ESLint配置
- TypeScript支持
- 导入规则
- 代码风格统一

### 环境变量配置
各MCP服务器支持通过`.env`文件配置环境变量：

```bash
# 知乎API配置 (demand-mcp)
ZHIHU_API_TOKEN=your_api_token_here
ZHIHU_API_BASE_URL=https://one.in.zhihu.com/api/v2

# 服务器配置
PORT=9000
HOST=localhost
```

## 使用场景

### 需求分析工作流
1. 使用`demand-mcp`读取知乎RFC需求链接
2. 自动生成需求分析报告
3. 基于需求内容生成标准化测试用例
4. 输出结构化的分析结果

### 开发工具链
1. 使用`create-mcp-template`快速创建新的MCP项目
2. 利用`utils`包提供的通用工具
3. 统一的构建和测试流程

## 项目状态

| 项目                | 状态   | 版本   | 描述           |
| ------------------- | ------ | ------ | -------------- |
| MCP Root            | ✅ 活跃 | v1.0.0 | 根项目         |
| create-mcp-template | ✅ 活跃 | v0.0.1 | 模板创建工具   |
| demand-mcp          | ✅ 活跃 | v0.0.1 | 需求分析服务器 |
| utils               | ✅ 活跃 | v1.0.0 | 共享工具库     |

## 许可证

ISC License

## 贡献

欢迎提交Issue和Pull Request！

### 贡献指南
1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 打开Pull Request

## 相关文档

- [项目概览](./PROJECTS.md) - 详细的项目信息和关系
- [create-mcp-template](./packages/create-mcp-template/README.md) - 模板创建工具文档
- [demand-mcp](./mcp-packages/demand-mcp/README.md) - 需求分析服务器文档

## 更新日志

### v1.0.0
- 初始版本
- 基础项目结构
- create-mcp-template工具
- demand-mcp需求分析服务器
- utils共享工具库
- 完整的开发工具链
- 美观的命令行界面 
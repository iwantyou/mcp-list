# MCP Root 项目

这是一个基于 Model Context Protocol (MCP) 的根项目，包含多个MCP服务器和工具。

## 项目结构

```
mcp-root/
├── mcp-packages/           # MCP包目录
│   ├── create-mcp-template/  # MCP模板创建工具
│   └── test-mcp/           # 测试MCP服务器
├── package.json            # 根项目配置
├── pnpm-workspace.yaml     # pnpm工作区配置
└── tsconfig.base.json      # TypeScript基础配置
```

## 功能特性

- 🚀 **模块化架构**: 使用pnpm工作区管理多个MCP包
- 🛠️ **开发工具**: 统一的构建、测试和代码检查
- 📦 **模板系统**: 快速创建新的MCP服务器
- 🔧 **类型安全**: 完整的TypeScript支持

## 子项目

### 1. create-mcp-template
MCP服务器模板创建工具，提供快速创建新MCP项目的功能。

**主要功能:**
- 基于模板创建新的MCP服务器项目
- 自动配置package.json和项目结构
- 支持自定义目录和覆盖选项

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
- `pnpm dev:zmc`: 开发模式构建
- `pnpm link:zmc`: 全局链接create-mcp-template工具
- `pnpm unlink:zmc`: 取消全局链接

## 技术栈

- **包管理**: pnpm + 工作区
- **语言**: TypeScript
- **构建工具**: TypeScript Compiler
- **测试框架**: Vitest
- **代码检查**: ESLint
- **MCP SDK**: @modelcontextprotocol/sdk

## 项目配置

### TypeScript配置
- 使用严格模式
- 支持ES模块
- 统一的编译配置

### ESLint配置
- TypeScript支持
- 导入规则
- 代码风格统一

## 许可证

ISC License

## 贡献

欢迎提交Issue和Pull Request！

## 更新日志

### v1.0.0
- 初始版本
- 基础项目结构
- create-mcp-template工具
- test-mcp服务器
- 完整的开发工具链 
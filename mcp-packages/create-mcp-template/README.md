# Create MCP Template

一个用于快速创建 Model Context Protocol (MCP) 服务器项目的CLI工具。

## 功能特性

- 🚀 **快速创建**: 一键生成完整的MCP服务器项目
- 📦 **模板系统**: 基于预定义模板创建项目结构
- 🔧 **自动配置**: 自动设置package.json和项目配置
- 📁 **灵活目录**: 支持自定义输出目录
- ⚡ **覆盖选项**: 支持覆盖已存在的文件

## 安装

### 全局安装
```bash
# 在项目根目录执行
pnpm link:zmc
```

### 本地使用
```bash
# 直接运行
pnpm start
```

## 使用方法

### 基本用法
```bash
# 创建新的MCP服务器项目
zmc my-mcp-server

# 指定自定义目录
zmc my-mcp-server -d custom-directory

# 覆盖已存在的文件
zmc my-mcp-server -o
```

### 命令行选项

- `-d, --directory [directory]`: 指定创建项目的目录，默认为 `mcp-packages`
- `-o, --overwrite [overwrite]`: 是否覆盖已存在的文件，默认为 `false`

### 示例

```bash
# 在默认目录创建项目
zmc weather-mcp

# 在指定目录创建项目
zmc weather-mcp -d my-projects

# 覆盖已存在的项目
zmc weather-mcp -o
```

## 生成的项目结构

创建的项目将包含以下文件结构：

```
my-mcp-server/
├── cli.js                 # CLI入口文件
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript配置
├── src/
│   ├── index.ts           # 主入口文件
│   ├── cli.ts             # CLI实现
│   ├── mcpServer.ts       # MCP服务器
│   ├── sseServer.ts       # SSE服务器
│   ├── stido.ts           # Stido服务器
│   ├── logger.ts          # 日志工具
│   ├── package.ts         # 包管理
│   ├── all-tools.ts       # 工具集合
│   └── tools/
│       ├── tool.ts        # 工具定义接口
│       ├── time.ts        # 时间工具
│       └── hello.ts       # 示例工具
└── test/
    └── tools.test.ts      # 测试文件
```

## 模板特性

### 1. 完整的MCP服务器实现
- 支持多种服务器模式 (Stido, SSE)
- 完整的错误处理
- 结构化日志系统

### 2. 工具系统
- 模块化的工具架构
- TypeScript类型安全
- 易于扩展的工具接口

### 3. 开发工具
- ESLint代码检查
- Vitest测试框架
- TypeScript严格模式

### 4. 构建系统
- 自动构建脚本
- 开发模式支持
- 清理脚本

## 开发

### 构建项目
```bash
pnpm build
```

### 开发模式
```bash
pnpm dev
```

### 运行CLI
```bash
pnpm start
```

### 清理构建文件
```bash
pnpm clean
```

## 项目结构

```
create-mcp-template/
├── cli.js                 # CLI入口文件
├── package.json           # 项目配置
├── src/
│   └── cli.ts            # CLI实现
└── template/              # 项目模板
    ├── cli.js
    ├── package.json
    ├── tsconfig.json
    ├── src/
    │   ├── index.ts
    │   ├── cli.ts
    │   ├── mcpServer.ts
    │   ├── sseServer.ts
    │   ├── stido.ts
    │   ├── logger.ts
    │   ├── package.ts
    │   ├── all-tools.ts
    │   └── tools/
    │       ├── tool.ts
    │       ├── time.ts
    │       └── hello.ts
    └── test/
        └── tools.test.ts
```

## 技术栈

- **语言**: TypeScript
- **CLI框架**: cac
- **文件操作**: Node.js fs模块
- **构建工具**: TypeScript Compiler
- **包管理**: pnpm

## 许可证

ISC License

## 贡献

欢迎提交Issue和Pull Request！

## 更新日志

### v0.0.1
- 初始版本
- 基础模板创建功能
- 命令行参数支持
- 自动依赖安装
- 项目结构生成 
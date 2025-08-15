import { cac } from 'cac';
import fs, { existsSync, rmSync, readdirSync, copyFileSync, statSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path, { resolve } from 'node:path';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const COLORINFO = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  CYAN: '\x1b[36m',
  NC: '\x1b[0m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
};

const cli = cac('zmc');

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const pwd = process.cwd();
const templatePath = resolve(__dirname, '../template');

interface Options {
  directory: string;
  overwrite: boolean;
  slient: boolean;
}

cli
    .option('-d, --directory [directory]', '创建模版的目录 默认为mcp-packages', { default: 'mcp-packages' })
    .option('-o, --overwrite [overwrite]', '是否覆盖已存在的文件', { default: false })
    .option('-s, --slient [slient]', '是否静默', { default: true })
    .command('<name>', 'create a new mcp server')
    .action(async (name: string, options: Options) => {
      const { directory, overwrite, slient } = options;
      const outputDir = resolve(pwd, directory, name);

      console.log(`${COLORINFO.CYAN}${COLORINFO.BOLD}🚀 开始创建 MCP 项目: ${name}${COLORINFO.NC}`);
      console.log(`${COLORINFO.DIM}📍 项目路径: ${outputDir}${COLORINFO.NC}\n`);

      console.log(`${COLORINFO.YELLOW}📁 创建项目目录...${COLORINFO.NC}`);
      try {
        await ensureDir(outputDir);
        console.log(`${COLORINFO.GREEN}   ✅ 目录创建完成${COLORINFO.NC}`);
      } catch (error) {
        console.log(`${COLORINFO.RED}   ❌ 目录创建失败: ${error}${COLORINFO.NC}`);
        process.exit(1);
      }

      console.log(`${COLORINFO.YELLOW}📋 复制模板文件...${COLORINFO.NC}`);
      try {
        if (overwrite) {
          console.log(`${COLORINFO.DIM}   ⚠️  覆盖已存在的文件${COLORINFO.NC}`);
          emptyDir(outputDir);
        }
        copyDir(templatePath, outputDir);
        console.log(`${COLORINFO.GREEN}   ✅ 模板文件复制完成${COLORINFO.NC}`);
      } catch (error) {
        console.log(`${COLORINFO.RED}   ❌ 模板文件复制失败: ${error}${COLORINFO.NC}`);
        process.exit(1);
      }

      console.log(`${COLORINFO.YELLOW}⚙️  配置项目信息...${COLORINFO.NC}`);
      try {
        const packageJsonPath = resolve(outputDir, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        packageJson.name = `@zh-mcp/${name}`;
        packageJson.bin = {
          [name]: 'cli.js'
        };
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log(`${COLORINFO.GREEN}   ✅ package.json 配置完成${COLORINFO.NC}`);
      } catch (error) {
        console.log(`${COLORINFO.RED}   ❌ package.json 配置失败: ${error}${COLORINFO.NC}`);
        process.exit(1);
      }

      process.chdir(outputDir);
      console.log(`${COLORINFO.YELLOW}📦 安装项目依赖...${COLORINFO.NC}`);
      try {
        const installResult = spawnSync('pnpm', ['install'], {
          stdio: slient ? 'ignore' : 'inherit',
          shell: true
        });

        if (installResult.status === 0)
          console.log(`${COLORINFO.GREEN}   ✅ 依赖安装完成${COLORINFO.NC}`);
        else
          throw new Error(`安装失败，退出码: ${installResult.status}`);

      } catch (error) {
        console.log(`${COLORINFO.RED}   ❌ 依赖安装失败: ${error}${COLORINFO.NC}`);
        process.exit(1);
      }

      process.chdir(pwd);
      console.log(`${COLORINFO.GREEN}${COLORINFO.BOLD}🎉 项目创建完成！${COLORINFO.NC}\n`);

      const HELP_INFO = [
        '',
        `${COLORINFO.CYAN}${COLORINFO.BOLD}🎉 项目创建成功！${COLORINFO.NC}`,
        '',
        `${COLORINFO.YELLOW}${COLORINFO.BOLD}📋 使用指南${COLORINFO.NC}`,
        `${COLORINFO.DIM}┌─────────────────────────────────────────────────────────────┐${COLORINFO.NC}`,
        `${COLORINFO.DIM}│${COLORINFO.NC} ${COLORINFO.GREEN}🚀 开发模式${COLORINFO.NC}${COLORINFO.DIM} │${COLORINFO.NC} pnpm -F @zh-mcp/${name} dev`,
        `${COLORINFO.DIM}│${COLORINFO.NC} ${COLORINFO.BLUE}🔗 全局链接${COLORINFO.NC}${COLORINFO.DIM} │${COLORINFO.NC} pnpm -C ${directory}/${name} link --global`,
        `${COLORINFO.DIM}│${COLORINFO.NC} ${COLORINFO.MAGENTA}⚡ 启动服务${COLORINFO.NC}${COLORINFO.DIM} │${COLORINFO.NC} ${name}`,
        `${COLORINFO.DIM}│${COLORINFO.NC} ${COLORINFO.CYAN}🌐 SSE模式${COLORINFO.NC}${COLORINFO.DIM} │${COLORINFO.NC} ${name} sse`,
        `${COLORINFO.DIM}│${COLORINFO.NC} ${COLORINFO.YELLOW}❓ 更多帮助${COLORINFO.NC}${COLORINFO.DIM} │${COLORINFO.NC} ${name} --help`,
        `${COLORINFO.DIM}└─────────────────────────────────────────────────────────────┘${COLORINFO.NC}`,
        '',
        `${COLORINFO.DIM}💡 提示: 项目已自动安装依赖，可以直接开始开发！${COLORINFO.NC}`,
        ''
      ];

      console.log(HELP_INFO.join('\n'));
    });
function copy(src: string, dest: string) {
  if (statSync(src).isDirectory())
    copyDir(src, dest);
  else
    copyFileSync(src, dest);

}
function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function emptyDir(dir: string) {
  if (!existsSync(dir))
    return;

  for (const file of readdirSync(dir)) {
    if (file === '.git')
      continue;

    rmSync(resolve(dir, file), { recursive: true, force: true });
  }
}

async function ensureDir(dir: string) {
  try {
    await access(dir);
  } catch (error) {
    await mkdir(dir, { recursive: true });
  }
}
cli.help();
cli.version('1.0.0');
cli.parse();

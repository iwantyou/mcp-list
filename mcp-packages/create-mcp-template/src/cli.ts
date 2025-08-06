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
};

const cli = cac('zm');

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const pwd = process.cwd();
const templatePath = resolve(__dirname, '../template');

interface Options {
  directory: string;
  overwrite: boolean;
}

cli
    .option('-d, --directory [directory]', '创建模版的目录 默认为mcp-packages', { default: 'mcp-packages' })
    .option('-o, --overwrite [overwrite]', '是否覆盖已存在的文件', { default: false })
    .command('<name>', 'create a new mcp server')
    .action(async (name: string, options: Options) => {
      const { directory, overwrite } = options;
      const outputDir = resolve(pwd, directory, name);
      await ensureDir(outputDir);
      if (overwrite)
        emptyDir(outputDir);
      else
        copyDir(templatePath, outputDir);

      //  更改package.json中的name
      const packageJsonPath = resolve(outputDir, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      packageJson.name = `@zh-mcp/${name}`;
      packageJson.bin = {
        [name]: 'cli.js'
      };
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      process.chdir(outputDir);

      console.log(`${COLORINFO.CYAN}install...${COLORINFO.NC}`);
      try {
        spawnSync('pnpm', ['install'], { stdio: 'inherit' });
      } catch (error) {
        console.log(`${COLORINFO.RED}install failed: ${error}${COLORINFO.NC}`);
        process.exit(1);
      }
      console.log(`${COLORINFO.GREEN}install done${COLORINFO.NC}`);
      process.chdir(pwd);

      const HELP_INFO =  [
        COLORINFO.YELLOW,
        `执行 ${name} 用于启动 stido mcp`,
        `执行 ${name} sse 用于启动 sse mcp`,
        `更多细节执行 ${name} --help`,
        COLORINFO.NC,
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

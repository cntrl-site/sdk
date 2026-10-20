const { existsSync, readdirSync, readFileSync } = require('fs');
const path = require('path');

const dynamicImports = (code) => [...code.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)].map(match => match[1]);

const sourceFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) return sourceFiles(file);
  return /\.tsx?$/.test(entry.name) && !/\.(test|d)\.tsx?$/.test(entry.name) ? [file] : [];
});

const problems = sourceFiles('src').flatMap((file) => {
  const modules = dynamicImports(readFileSync(file, 'utf8'));
  if (!modules.length) return [];
  const output = path.join('lib', path.relative('src', file)).replace(/\.tsx?$/, '.js');
  if (!existsSync(output)) return [`${file} has a dynamic import but tsc emitted no ${output}.`];
  const kept = new Set(dynamicImports(readFileSync(output, 'utf8')));
  return modules
    .filter(module => !kept.has(module))
    .map(module => `${output} no longer keeps a native import('${module}'). tsc rewrote it to require(), which bundles ${module} into every site's _app chunk. tsconfig.build.json must use module/moduleResolution Node16.`);
});

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

const { existsSync, readdirSync, readFileSync } = require('fs');
const path = require('path');
const ts = require('typescript');

const files = (dir, pattern) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) return files(file, pattern);
  return pattern.test(entry.name) ? [file] : [];
});

const dynamicImports = (file) => {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const modules = [];
  const visit = (node) => {
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const [specifier] = node.arguments;
      if (specifier && ts.isStringLiteralLike(specifier)) modules.push(specifier.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return modules;
};

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const problems = [];
const packages = new Set();
for (const file of files('src', /\.tsx?$/).filter(file => !/\.(test|d)\.tsx?$/.test(file))) {
  const modules = dynamicImports(file);
  if (!modules.length) continue;
  modules.filter(module => !module.startsWith('.')).forEach(module => packages.add(module));
  const output = path.join('lib', path.relative('src', file)).replace(/\.tsx?$/, '.js');
  if (!existsSync(output)) {
    problems.push(`${file} has a dynamic import but tsc emitted no ${output}.`);
    continue;
  }
  const kept = new Set(dynamicImports(output));
  for (const module of modules.filter(module => !kept.has(module))) {
    problems.push(`${output} no longer keeps a native import('${module}'). tsc rewrote it to require(), which bundles ${module} into every site's _app chunk. tsconfig.build.json must use module/moduleResolution Node16.`);
  }
}

for (const output of files('lib', /\.js$/)) {
  const code = readFileSync(output, 'utf8');
  for (const module of packages) {
    if (new RegExp(`\\brequire\\(\\s*["']${escapeRegExp(module)}["']\\s*\\)`).test(code)) {
      problems.push(`${output} requires ${module} statically, which bundles it into every site's _app chunk. Load it with import() instead.`);
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

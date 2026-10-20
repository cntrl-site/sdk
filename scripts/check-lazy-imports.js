const { existsSync, readFileSync } = require('fs');

const LAZY_IMPORTS = [
  { file: 'lib/VideoDecoder/VideoDecoder.js', module: 'mp4box' },
];

const problems = LAZY_IMPORTS.flatMap(({ file, module }) => {
  if (!existsSync(file)) return [`${file} is missing; update LAZY_IMPORTS in scripts/check-lazy-imports.js if it moved.`];
  if (readFileSync(file, 'utf8').includes(`import('${module}')`)) return [];
  return [`${file} no longer keeps a native import('${module}'). tsc rewrote it to require(), which puts ${module} back into every site's _app chunk. tsconfig.build.json must use module/moduleResolution Node16.`];
});

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

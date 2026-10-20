const { readFileSync } = require('fs');

const file = 'lib/VideoDecoder/VideoDecoder.js';
if (!readFileSync(file, 'utf8').includes("import('mp4box')")) {
  console.error(`${file} no longer keeps a native import('mp4box'). tsc rewrote it to require(), which puts mp4box back into every site's _app chunk. tsconfig.build.json must use module/moduleResolution Node16.`);
  process.exit(1);
}

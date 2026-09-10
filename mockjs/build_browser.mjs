import { build } from 'esbuild';

await build({
  entryPoints: ['mockjs/browser_entry.mjs'],
  outfile: 'mock/riichi.js',
  bundle: true,
  platform: 'browser',
  format: 'iife',
  target: ['es2020'],
  legalComments: 'inline',
  banner: {
    js: '/* 由 mockjs/build_browser.mjs 自动生成，请修改 mockjs/ 源码后重新构建。 */',
  },
});

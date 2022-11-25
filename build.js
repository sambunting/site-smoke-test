import { build } from 'esbuild';

build({
  entryPoints: ['bin/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'dist',
  external: ['axios', 'playwright', 'cosmiconfig']
})
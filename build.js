#!/usr/bin/env node
const { build } = require('estrella');

build({
  platform: 'browser',
  format: 'esm',
  entry: './src/modalFlow.jsx',
  outfile: './build/modalFlow.jsx',
  bundle: true,
  minify: true,
  sourcemap: true
});

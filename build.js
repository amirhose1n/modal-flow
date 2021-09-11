#!/usr/bin/env node
const { build, ts, tsconfig, dirname, glob, log } = require('estrella');

build({
  format: 'esm',
  target: ['esnext'],
  external: ['react', 'react-dom'],
  entry: './src/ModalFlow.tsx',
  outfile: './build/ModalFlow.js',
  bundle: true,
  minify: true,
  sourcemap: true,
  onEnd(config) {
    const dtsFilesOutdir = dirname(config.outfile);
    generateTypeDefs(tsconfig(config), config.entry, dtsFilesOutdir);
  }
});

function generateTypeDefs(tsconfig, entryfiles, outdir) {
  const filenames = Array.from(
    new Set(
      (Array.isArray(entryfiles) ? entryfiles : [entryfiles]).concat(
        tsconfig.include || []
      )
    )
  ).filter((v) => v);
  log.info('Generating type declaration files for', filenames.join(', '));
  const compilerOptions = {
    ...tsconfig.compilerOptions,
    moduleResolution: undefined,
    declaration: true,
    outDir: outdir
  };
  const program = ts.ts.createProgram(filenames, compilerOptions);
  const targetSourceFile = undefined;
  const writeFile = undefined;
  const cancellationToken = undefined;
  const emitOnlyDtsFiles = true;
  program.emit(
    targetSourceFile,
    writeFile,
    cancellationToken,
    emitOnlyDtsFiles
  );
  log.info('Wrote', glob(outdir + '/*.d.ts').join(', '));
}

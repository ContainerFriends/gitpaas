import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    platform: 'node',
    target: 'es2022',
    format: 'esm',
    outfile: 'dist/main.js',
    tsconfig: 'tsconfig.json',
    packages: 'external',
});

import * as esbuild from 'esbuild';
import { cpSync } from 'node:fs';
import path from 'node:path';

const PRISMA_CLIENT_SRC = 'src/core/infrastructure/prisma/client';
const PRISMA_CLIENT_DEST = 'dist/core/infrastructure/prisma/client';

const prismaExternalPlugin: esbuild.Plugin = {
    name: 'prisma-external',
    setup: (build) => {
        build.onResolve({ filter: /^\.\/client$/ }, (args) => {
            if (args.resolveDir.endsWith(path.join('infrastructure', 'prisma'))) {
                return { path: './core/infrastructure/prisma/client/index.js', external: true };
            }
            return undefined;
        });
    },
};

await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'es2022',
    format: 'esm',
    outfile: 'dist/index.js',
    tsconfig: 'tsconfig.json',
    packages: 'external',
    plugins: [prismaExternalPlugin],
});

// Copy Prisma generated client (CJS + WASM) to dist/
cpSync(PRISMA_CLIENT_SRC, PRISMA_CLIENT_DEST, { recursive: true });

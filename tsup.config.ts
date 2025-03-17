import {defineConfig} from 'tsup';

export default defineConfig({
    entry: [
      'src/index.ts',
      'src/schema/index.ts',
      'src/schema/fields/index.ts',
      'src/client/index.ts',
      'src/api/index.ts'
    ],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true
});
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import virtual from '@rollup/plugin-virtual';

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-konva': 'ReactKonva',
        'konva': 'Konva',
        'styled-components': 'styled'
      }
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-konva': 'ReactKonva',
        'konva': 'Konva',
        'styled-components': 'styled'
      }
    },
  ],
  external: [
    'react',
    'react-dom',
    'styled-components',
    'react-konva',
    'konva',
    /^react\/.*/,
    /^react-dom\/.*/,
    /^react-konva\/.*/,
    /^konva\/.*/
  ],
  plugins: [
    virtual({
      'canvas': 'export default {};'
    }),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      skip: ['canvas'],
      mainFields: ['module', 'main'],
      preferBuiltins: true
    }),
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: 'auto',
      transformMixedEsModules: true
    }),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      inlineSources: true,
      compilerOptions: {
        module: 'ESNext',
        target: 'ESNext'
      }
    }),
  ],
}); 
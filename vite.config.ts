import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import pluginChecker from 'vite-plugin-checker';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgrPlugin(), tsconfigPaths(), pluginChecker({ typescript: true })],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 2000,
 },
  resolve: {
    alias: {
       '@ui': `${path.resolve(__dirname, './src/shared/ui')}`,
       '@ui/*': `${path.resolve(__dirname, './src/shared/ui/*')}`,
       '@shared': `${path.resolve(__dirname, './src/shared/')}`,
       '@shared/*': `${path.resolve(__dirname, './src/shared/*')}`,
       '@app': `${path.resolve(__dirname, './src/app/')}`,
       '@app/*': `${path.resolve(__dirname, './src/app/*')}`,
       '@pages': `${path.resolve(__dirname, './src/pages/')}`,
       '@pages/*': `${path.resolve(__dirname, './src/pages/*')}`,
       '@layout': `${path.resolve(__dirname, './src/layout/')}`,
       '@layout/*': `${path.resolve(__dirname, './src/layout/*')}`,
    },
 },
});

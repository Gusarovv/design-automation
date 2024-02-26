import path from 'path';
import { defineConfig } from 'vite';
import pluginChecker from 'vite-plugin-checker';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgrPlugin(), tsconfigPaths(), pluginChecker({ typescript: true })],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
    //   watch: { // WSL
    // 	usePolling: true
    //   }
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

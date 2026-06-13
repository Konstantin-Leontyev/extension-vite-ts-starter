import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';

function generateManifest() {
  const manifest = readJsonFile('src/manifest.json');
  const pkg = readJsonFile('package.json');
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

export default defineConfig({
  plugins: [
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint .',
        useFlatConfig: true,
      },
    }),
    react({
      babel: {
        plugins: [['babel-plugin-styled-components', { displayName: true, fileName: true }]],
      },
    }),
    webExtension({
      manifest: generateManifest,
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});

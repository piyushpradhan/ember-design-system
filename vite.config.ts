import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.lib.json',
      include: ['src/lib/**/*.ts', 'src/lib/**/*.tsx'],
      exclude: ['**/*.stories.tsx', '**/*.test.ts', '**/*.test.tsx'],
      rollupTypes: false,
      insertTypesEntry: false,
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'lucide-react',
        'clsx',
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css'
          return assetInfo.name ?? 'asset-[hash][extname]'
        },
      },
    },
    cssCodeSplit: false,
  },
})

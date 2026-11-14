import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// запити /api/* під час розробки йдуть на локальний сервер (порт 3001)
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3001' } },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // A GitHub Pages l'app viu a /trinquet-genoves/; en local, a l'arrel.
  base: process.env.GITHUB_PAGES ? '/trinquet-genoves/' : '/',
  server: { host: true, port: 5173 }, // host:true → accessible des de la PDI/tauletes de la xarxa del centre
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import fs from 'fs'
import path from 'path'

function createPageChunksFromDir(dir:string) {
  const chunks = {};
  const files = fs.readdirSync(path.resolve(dir));
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) continue; 
    
    const name = path.parse(file).name;
    chunks[name] = [fullPath];
  }

  return chunks;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer()],
  server: {
    watch: {
      ignored: ['!src/**']
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          ...createPageChunksFromDir('./src/pages'),
          ...createPageChunksFromDir('./src/pages/dashboard'),
          firebase: ['@firebase/app', '@firebase/auth'],
          firestore: ['@firebase/firestore'],
        }
      }
    }
  }
})

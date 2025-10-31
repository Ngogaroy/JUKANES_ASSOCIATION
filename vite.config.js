import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    
    // This is the new, correct 'define' block
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        // You can add any other env vars here if needed
      }
    },
  };
});
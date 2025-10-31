import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => { // <-- Change this to a function
  return { // <-- Add 'return {'
    plugins: [
      react(),
      tailwindcss(),
    ], // <-- Close the plugins array here

    // 'define' must be a top-level key, outside of 'plugins'
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  }; // <-- Close the returned object
}); // <-- Close the function
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    force: true, // Ensures dependencies are always optimized on start
    include: ["lightbox2","jquery"], // Add any problematic dependencies here
    exclude: [], // Specify dependencies to exclude from optimization
  },
  resolve: {
    alias: {
      jquery: 'jquery/dist/jquery.min.js', // Alias for jQuery
    },
  },
  build: {
    target: "esnext", // Set to modern JavaScript target
    outDir: "dist", // Specify output directory
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit if needed
  },
});

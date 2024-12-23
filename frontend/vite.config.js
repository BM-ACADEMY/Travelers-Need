import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from `.env` file
dotenv.config();

export default defineConfig({
  plugins: [react()],

  // Force dependency optimization
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
  // Increase server timeout
  // server: {
  //   hmr: {
  //     timeout: 50000, // Increase the timeout to 50 seconds
  //   },
  //   port: process.env.VITE_PORT || 3000, // Allow customizable port via .env
  // },

  // Add base build configuration
  build: {
    target: "esnext", // Set to modern JavaScript target
    outDir: "dist", // Specify output directory
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit if needed
  },
});

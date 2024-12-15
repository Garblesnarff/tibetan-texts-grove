import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      jsxImportSource: 'react'
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      'pdfjs-dist', 
      'react', 
      'react-dom', 
      'react/jsx-runtime',
      '@supabase/supabase-js',
      '@supabase/postgrest-js'
    ]
  },
  build: {
    commonjsOptions: {
      include: [
        /pdfjs-dist/, 
        /node_modules\/react/,
        /node_modules\/@supabase/
      ]
    },
    rollupOptions: {
      external: [
        'pdfjs-dist/build/pdf.worker.entry'
      ]
    }
  }
}));
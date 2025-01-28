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
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "pdfjs-dist": path.resolve(__dirname, "./node_modules/pdfjs-dist"),
      "pdfjs-dist/build/pdf.worker.min": path.resolve(__dirname, "./node_modules/pdfjs-dist/build/pdf.worker.min.js")
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist', 'react', 'react-dom']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
}));
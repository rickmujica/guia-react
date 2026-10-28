import mdx from '@mdx-js/rollup'
import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas: el build funciona abierto desde cualquier carpeta o subruta.
  base: './',
  plugins: [
    // MDX: los capítulos de la guía son archivos .mdx (Markdown + JSX).
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm] }) },
    react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
    // React Compiler en modo "annotation": solo compila los componentes que
    // empiezan con la directiva "use memo". Así podemos comparar en la guía
    // un componente compilado contra uno sin compilar (capítulo React Compiler).
    // En un proyecto real usarías reactCompilerPreset() sin opciones.
    babel({ presets: [reactCompilerPreset({ compilationMode: 'annotation' })] }),
  ],
  build: {
    // La guía completa (31 capítulos + demos) es un solo bundle de ~200 kB con gzip.
    // Para una app de documentación está bien, así que subimos el límite del aviso.
    chunkSizeWarningLimit: 1000,
  },
})

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
  server: {
    // El progreso de lectura se guarda en el localStorage, que es distinto para cada
    // puerto. Con strictPort la guía siempre abre en el mismo (5173) y no lo pierde.
    port: 5173,
    strictPort: true,
  },
  build: {
    // Todas las guías (capítulos + demos) van en un solo bundle de unos cientos de kB con gzip.
    // Para una app de documentación está bien, así que subimos el límite del aviso.
    chunkSizeWarningLimit: 2000,
  },
})

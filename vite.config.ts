import mdx from '@mdx-js/rollup'
import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import remarkGfm from 'remark-gfm'
import { fileURLToPath } from 'node:url'
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
  resolve: {
    // Las demos de la guía de React Native son las de la app de Expo (app-expo/src/demos) e
    // importan de 'react-native'. En el navegador eso es react-native-web, que dibuja View,
    // Text, FlatList, etc. con elementos HTML. El archivo intermedio solo cambia Modal.
    alias: [
      {
        find: /^react-native$/,
        replacement: fileURLToPath(new URL('./src/lib/react-native-web.ts', import.meta.url)),
      },
    ],
    // Si instalaste app-expo, tiene su propio node_modules con otra copia de React:
    // que las demos usen la misma que la guía.
    dedupe: ['react', 'react-dom', 'react-native-web'],
  },
  server: {
    // El progreso de lectura se guarda en el localStorage, que es distinto para cada
    // puerto. Con strictPort la guía siempre abre en el mismo (5173) y no lo pierde.
    port: 5173,
    strictPort: true,
  },
  build: {
    // Todas las guías (capítulos + demos) van en un solo bundle de unos cientos de kB con gzip.
    // Para una app de documentación está bien, así que subimos el límite del aviso.
    chunkSizeWarningLimit: 2500,
  },
})

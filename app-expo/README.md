# Búsqueda RN

La app de ejemplo de la guía de React Native: una app de búsqueda de empleo hecha con **Expo SDK 58** (React Native 0.88, React 19.3) y Expo Router. Tiene login, una lista de ofertas con búsqueda y scroll infinito, el detalle de cada oferta, ofertas guardadas, foto de perfil, y una pestaña **Demos** con las mismas demos que se ven en la guía, corriendo nativas.

La API es falsa (`src/api/ofertas.ts`): devuelve datos de ejemplo con un retraso, como si fuera la red.

## Abrirla en el celular

Necesitás Node 22.13 o superior y la app **Expo Go** en el teléfono (App Store o Google Play).

```bash
cd app-expo
npm install
npx expo start
```

Escaneá el QR: con la cámara en iPhone, o desde Expo Go en Android. La computadora y el teléfono tienen que estar en la misma red Wi-Fi (si no, `npx expo start --tunnel`).

Para entrar: **cualquier email** y la contraseña **`expo1234`**.

En la terminal, `w` la abre en el navegador, `i` en el simulador de iOS (con Xcode) y `a` en el emulador de Android (con Android Studio).

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npx expo start` | Servidor de desarrollo y QR para Expo Go. |
| `npm run typecheck` | Chequeo de tipos (incluye los ejemplos de `src/ejemplos/`). |
| `npm test` | Tests con Jest y Testing Library. |
| `npm run lint` | ESLint con la configuración de Expo. |
| `npx expo export --platform web` | Build estático para la web en `dist/`. |

El test de punta a punta con Maestro está en `.maestro/login.yaml` (necesita la app instalada en un simulador: `maestro test .maestro/login.yaml`).

## Estructura

```text
src/
  app/          Las pantallas (Expo Router): _layout, login, (tabs)/, oferta/[id], demo/[id]
  components/   TarjetaOferta, estados de carga y error, títulos
  hooks/        useOfertas y useOferta (TanStack Query)
  stores/       Sesión (SecureStore) y ofertas guardadas (AsyncStorage), con Zustand
  api/          La API falsa
  lib/          El adaptador de almacenamiento seguro
  demos/        Las demos de la guía: solo importan de react y react-native
  ejemplos/     Snippets de la guía que no son demos (gestos, SQLite, notificaciones, cámara…)
app.json        Configuración: nombre, identificadores, permisos y config plugins
eas.json        Perfiles de build para EAS (development, preview, production)
```

Los identificadores (`com.ejemplo.busquedarn`) y el `ascAppId` de `eas.json` son de ejemplo: para compilar con EAS de verdad, cambialos por los tuyos y corré `eas init`.

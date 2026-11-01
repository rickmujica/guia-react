import { useSesion } from '@/stores/sesion'

// Las variables que empiezan con EXPO_PUBLIC_ se copian dentro del bundle al compilar.
// Sirven para URLs y claves públicas; NUNCA pongas acá secretos (cualquiera puede leerlas).
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

export class ErrorApi extends Error {
  constructor(
    public status: number,
    mensaje: string,
  ) {
    super(mensaje)
  }
}

/** fetch con la URL base, el token de la sesión, timeout y errores con status. */
export async function api<T>(ruta: string, init: RequestInit = {}): Promise<T> {
  const token = useSesion.getState().token // fuera de un componente: getState()
  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    // En el celular la red se corta seguido: sin timeout, la promesa puede quedar colgada
    signal: init.signal ?? AbortSignal.timeout(15_000),
  })

  if (respuesta.status === 401) {
    useSesion.getState().cerrarSesion() // token vencido: Stack.Protected lo manda al login
    throw new ErrorApi(401, 'Tu sesión venció')
  }
  if (!respuesta.ok) throw new ErrorApi(respuesta.status, await respuesta.text())
  if (respuesta.status === 204) return undefined as T
  return (await respuesta.json()) as T
}

// Uso con TanStack Query:
//   useQuery({ queryKey: ['oferta', id], queryFn: () => api<Oferta>(`/ofertas/${id}`) })
//   useMutation({ mutationFn: (datos) => api('/postulaciones', { method: 'POST', body: JSON.stringify(datos) }) })

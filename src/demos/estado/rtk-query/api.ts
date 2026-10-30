import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { api as servidor, siguienteEtapa, type Postulacion } from '../api'

// En un proyecto real usarías fetchBaseQuery({ baseUrl: '/api' }) y cada endpoint sería
// query: () => 'postulaciones'. Acá usamos queryFn para llamar a la API falsa de la guía.
let datos: Postulacion[] | null = null

export const postulacionesApi = createApi({
  reducerPath: 'postulacionesApi',
  baseQuery: fakeBaseQuery<{ message: string }>(),
  tagTypes: ['Postulacion'],
  endpoints: (build) => ({
    // Una query: lee datos y los guarda en caché.
    listar: build.query<Postulacion[], void>({
      async queryFn() {
        try {
          datos ??= await servidor.listar()
          await servidor.ofertasNuevas() // un poco de demora en cada pedido
          return { data: datos.map((p) => ({ ...p })) }
        } catch (e) {
          return { error: { message: e instanceof Error ? e.message : 'Error' } }
        }
      },
      providesTags: ['Postulacion'], // "esta caché tiene postulaciones"
    }),
    // Una mutation: cambia datos en el servidor.
    avanzar: build.mutation<Postulacion, number>({
      async queryFn(id) {
        await servidor.ofertasNuevas()
        const postulacion = datos?.find((p) => p.id === id)
        if (!postulacion) return { error: { message: 'No existe' } }
        postulacion.etapa = siguienteEtapa[postulacion.etapa]
        return { data: { ...postulacion } }
      },
      invalidatesTags: ['Postulacion'], // al terminar, las queries con ese tag se vuelven a pedir
    }),
  }),
})

// RTK Query genera un hook por endpoint: use + Nombre + Query/Mutation.
export const { useListarQuery, useAvanzarMutation } = postulacionesApi

export function reiniciarDatos() {
  datos = null
}

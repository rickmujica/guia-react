import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { buscarOfertas, obtenerOferta } from '@/api/ofertas'

// TanStack Query guarda cada respuesta en caché por su queryKey: volver a una pantalla
// muestra los datos al instante y los actualiza por detrás.
export function useOfertas(texto: string) {
  return useInfiniteQuery({
    queryKey: ['ofertas', texto],
    queryFn: ({ pageParam }) => buscarOfertas(texto, pageParam),
    initialPageParam: 0,
    getNextPageParam: (ultimaPagina) => ultimaPagina.siguiente,
  })
}

export function useOferta(id: number) {
  return useQuery({ queryKey: ['oferta', id], queryFn: () => obtenerOferta(id) })
}

// Un tipo literal es un valor exacto. Unidos con | arman un conjunto cerrado de opciones.
type Estado = 'postulado' | 'entrevista' | 'oferta' | 'rechazado'

let estado: Estado = 'postulado'
estado = 'oferta'

// @ts-expect-error: '"contratado"' no está entre las opciones (y el editor te autocompleta las válidas).
estado = 'contratado'

// as const congela un valor: todo pasa a ser readonly y literal.
const ESTADOS = ['postulado', 'entrevista', 'oferta', 'rechazado'] as const
// typeof ESTADOS es readonly ["postulado", "entrevista", "oferta", "rechazado"]

// Y de ahí se puede sacar la unión, sin escribir las opciones dos veces:
type EstadoDesdeArray = (typeof ESTADOS)[number] // 'postulado' | 'entrevista' | ...

const config = { tema: 'oscuro', columnas: 3 } as const
// @ts-expect-error: Cannot assign to 'tema' because it is a read-only property.
config.tema = 'claro'

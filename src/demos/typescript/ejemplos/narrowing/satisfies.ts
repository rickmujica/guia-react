type Estado = 'postulado' | 'entrevista' | 'oferta'

// Con una anotación, el objeto "se olvida" de sus valores exactos:
const coloresAnotados: Record<Estado, string> = {
  postulado: '#888',
  entrevista: '#08f',
  oferta: '#0a0',
}
coloresAnotados.oferta // string

// satisfies chequea que cumpla el tipo PERO conserva el tipo inferido, más preciso.
const colores = {
  postulado: '#888',
  entrevista: '#08f',
  oferta: '#0a0',
} as const satisfies Record<Estado, string>
colores.oferta // "#0a0"

// Y sigue avisando si falta algo o sobra algo:
const incompletos = {
  postulado: '#888',
  entrevista: '#08f',
  // @ts-expect-error: 'ofertta' no es una clave válida (¿quisiste decir 'oferta'?).
  ofertta: '#0a0',
} satisfies Record<Estado, string>

// El operador ! (non-null assertion) le dice a TS "confiá en mí, no es null".
// Si te equivocás, explota en runtime: preferí revisar con un if.
const root = document.getElementById('root')!

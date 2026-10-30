// Un genérico es un "parámetro de tipo": la función se escribe una vez y sirve para cualquier T.
function primero<T>(lista: T[]): T | undefined {
  return lista[0]
}

const empresa = primero(['Acme', 'Globex']) // string | undefined (T se infiere: string)
const numero = primero([1, 2, 3]) // number | undefined

// Sin genérico habría que elegir entre un tipo fijo o perder el tipo con any/unknown.
function primeroAny(lista: any[]) {
  return lista[0] // any: se pierde el tipo
}

// Restricciones con extends: T puede ser cualquier cosa QUE TENGA un id.
function porId<T extends { id: number }>(lista: T[], id: number) {
  return lista.find((item) => item.id === id)
}

const ofertas = [{ id: 1, empresa: 'Acme', salario: 3000 }]
const oferta = porId(ofertas, 1) // conserva el tipo completo: { id; empresa; salario } | undefined

// @ts-expect-error: string no tiene id.
porId(['a', 'b'], 1)

// keyof y genéricos juntos: una clave que tiene que existir en el objeto.
function ordenarPor<T, K extends keyof T>(lista: T[], clave: K) {
  return [...lista].sort((a, b) => (a[clave] > b[clave] ? 1 : -1))
}

ordenarPor(ofertas, 'salario')
// @ts-expect-error: '"sueldo"' is not assignable to parameter of type '"id" | "empresa" | "salario"'.
ordenarPor(ofertas, 'sueldo')

// any apaga el chequeo: todo vale, y los errores aparecen recién en el navegador.
const peligro: any = JSON.parse('{"nombre": "Acme"}')
peligro.noExiste.tampoco() // compila, pero explota al ejecutarse

// unknown es el "any seguro": acepta cualquier valor, pero hay que revisarlo antes de usarlo.
const dato: unknown = JSON.parse('{"nombre": "Acme"}')

// @ts-expect-error: 'dato' is of type 'unknown'.
dato.nombre

if (typeof dato === 'object' && dato !== null && 'nombre' in dato) {
  console.log(dato.nombre) // acá TypeScript ya sabe que tiene "nombre"
}

// never: un valor que no puede existir. Lo devuelve una función que nunca termina bien
// y aparece cuando una unión se queda sin opciones (lo vemos en narrowing).
function fallar(mensaje: string): never {
  throw new Error(mensaje)
}

// void: la función no devuelve nada útil (como un event handler).
function avisar(mensaje: string): void {
  console.log(mensaje)
}

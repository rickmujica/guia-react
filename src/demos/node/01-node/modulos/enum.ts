// Node ejecuta TypeScript borrando los tipos, sin compilar.
// Lo que no se puede borrar (porque genera código), como un enum, no anda.
// @ts-expect-error: erasableSyntaxOnly marca lo mismo que Node
enum Seniority {
  Junior,
  Senior,
}

console.log(Seniority.Senior)

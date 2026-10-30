// Tipos que se calculan. No los vas a escribir todos los días, pero sí leerlos en librerías.

// Mapped types: recorrer las claves de otro tipo y transformar cada una.
type Oferta = { empresa: string; salario: number; remoto: boolean }

type Banderas<T> = { [K in keyof T]: boolean }
type CamposTocados = Banderas<Oferta> // { empresa: boolean; salario: boolean; remoto: boolean }

// Así está hecho Partial en la librería estándar:
type MiPartial<T> = { [K in keyof T]?: T[K] }

// Conditional types: un "if" a nivel de tipos.
type EsArray<T> = T extends unknown[] ? 'array' : 'otro'
type A = EsArray<string[]> // 'array'
type B = EsArray<number> // 'otro'

// infer: capturar una parte del tipo mientras se compara.
type Elemento<T> = T extends (infer E)[] ? E : T
type C = Elemento<Oferta[]> // Oferta

// Template literal types: armar strings a nivel de tipos.
type Evento = 'click' | 'focus'
type Handler = `on${Capitalize<Evento>}` // 'onClick' | 'onFocus'

type Setters<T> = { [K in keyof T as `set${Capitalize<string & K>}`]: (valor: T[K]) => void }
type SettersOferta = Setters<Oferta>
// { setEmpresa: (valor: string) => void; setSalario: (valor: number) => void; setRemoto: ... }

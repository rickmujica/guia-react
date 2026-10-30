type Postulacion = {
  id: number
  empresa: string
  puesto: string
  salario: number
  notas?: string
}

// Partial: todo opcional. Ideal para un "update" que cambia solo algunos campos.
function actualizar(p: Postulacion, cambios: Partial<Postulacion>): Postulacion {
  return { ...p, ...cambios }
}

// Required: todo obligatorio (saca los ?).
type Completa = Required<Postulacion> // notas: string

// Readonly: nada se puede reasignar (solo el primer nivel).
type Congelada = Readonly<Postulacion>

// Pick y Omit: quedarse con algunas claves o sacar algunas.
type Resumen = Pick<Postulacion, 'empresa' | 'puesto'>
type NuevaPostulacion = Omit<Postulacion, 'id'> // el id lo pone el servidor

const nueva: NuevaPostulacion = { empresa: 'Acme', puesto: 'Frontend', salario: 3000 }

// Record: objeto con claves y valores de cierto tipo.
type PorEmpresa = Record<string, Postulacion[]>

// Con uniones: Exclude, Extract y NonNullable.
type Estado = 'postulado' | 'entrevista' | 'oferta' | 'rechazado'
type Activo = Exclude<Estado, 'rechazado'> // 'postulado' | 'entrevista' | 'oferta'
type Final = Extract<Estado, 'oferta' | 'rechazado' | 'otro'> // 'oferta' | 'rechazado'
type SinNulos = NonNullable<string | null | undefined> // string

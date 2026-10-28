import { sleep } from '../shared/utils'

// Imaginá que esto es una Server Function en Next.js ("use server").
// Recibe el estado anterior y el FormData, valida y devuelve el estado nuevo.

export type Application = { id: number; company: string; role: string; salary: number }

export type FormState = {
  status: 'idle' | 'error' | 'success'
  message: string
  errors: Partial<Record<'company' | 'role' | 'salary', string>>
  values: { company: string; role: string; salary: string } // para no perder lo escrito si hay error
  saved: Application[]
}

export const initialFormState: FormState = {
  status: 'idle',
  message: '',
  errors: {},
  values: { company: '', role: '', salary: '' },
  saved: [],
}

export async function createApplication(prevState: FormState, formData: FormData): Promise<FormState> {
  const values = {
    company: String(formData.get('company') ?? '').trim(),
    role: String(formData.get('role') ?? '').trim(),
    salary: String(formData.get('salary') ?? '').trim(),
  }

  await sleep(1000) // latencia de red

  const errors: FormState['errors'] = {}
  if (!values.company) errors.company = 'Falta la empresa.'
  if (!values.role) errors.role = 'Falta el puesto.'
  if (Number(values.salary) < 1000) errors.salary = 'El salario tiene que ser de al menos USD 1000.'

  if (Object.keys(errors).length > 0) {
    return { ...prevState, status: 'error', message: 'Revisá los campos marcados.', errors, values }
  }

  const application: Application = { id: Date.now(), ...values, salary: Number(values.salary) }
  return {
    status: 'success',
    message: `¡Postulación a ${values.company} guardada!`,
    errors: {},
    values: initialFormState.values,
    saved: [...prevState.saved, application], // usamos el estado anterior, como un reducer
  }
}

import { useState } from 'react'
import { z } from 'zod'

// El esquema describe y valida la respuesta. El tipo Oferta sale de acá.
const OfertaSchema = z.object({
  id: z.number(),
  empresa: z.string().min(1, 'no puede estar vacía'),
  salario: z.number().positive().optional(),
  modalidad: z.enum(['remoto', 'hibrido', 'presencial']),
  tags: z.array(z.string()).default([]),
})
type Oferta = z.infer<typeof OfertaSchema>

const ejemplos = {
  valida: '{\n  "id": 1,\n  "empresa": "Nubelia",\n  "salario": 3200,\n  "modalidad": "remoto"\n}',
  rota: '{\n  "id": "1",\n  "empresa": "",\n  "modalidad": "full remote",\n  "tags": ["react", 3]\n}',
}

type Resultado = { ok: true; oferta: Oferta } | { ok: false; errores: string[] }

function validar(texto: string): Resultado {
  let json: unknown // JSON.parse devuelve any: lo bajamos a unknown a propósito
  try {
    json = JSON.parse(texto)
  } catch {
    return { ok: false, errores: ['No es JSON válido'] }
  }
  const r = OfertaSchema.safeParse(json)
  return r.success
    ? { ok: true, oferta: r.data }
    : { ok: false, errores: r.error.issues.map((i) => `${i.path.join('.') || '(raíz)'}: ${i.message}`) }
}

export default function ValidarRespuesta() {
  const [texto, setTexto] = useState(ejemplos.valida)
  const resultado = validar(texto) // estado derivado: se calcula en cada render

  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => setTexto(ejemplos.valida)}>Respuesta válida</button>
        <button onClick={() => setTexto(ejemplos.rota)}>Respuesta rota</button>
      </div>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={7}
        spellCheck={false}
        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', width: '100%' }}
        aria-label="JSON de la respuesta"
      />
      {resultado.ok ? (
        <p className="ok-text">
          ✓ Válida: {resultado.oferta.empresa}, {resultado.oferta.modalidad}
          {resultado.oferta.salario !== undefined && `, USD ${resultado.oferta.salario}`} · tags: [
          {resultado.oferta.tags.join(', ')}]
        </p>
      ) : (
        <ul className="error-text">
          {resultado.errores.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

import { z } from 'zod'

z.config(z.locales.es())

// La configuración se valida UNA vez, al arrancar. Si falta algo, la app no arranca:
// mejor un error claro en el deploy que un undefined a las 3 de la mañana.
const Entorno = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PUERTO: z.coerce.number().int().default(3000),
  DB_HOST: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'Tiene que tener al menos 32 caracteres'),
})

const resultado = Entorno.safeParse(process.env)
if (!resultado.success) {
  console.error('Configuración inválida:')
  for (const problema of resultado.error.issues) console.error(`  ${problema.path.join('.')}: ${problema.message}`)
  process.exit(1)
}

export const config = resultado.data // tipada: config.PUERTO es number

if (import.meta.main) {
  console.log('Configuración OK:', { ...config, DB_PASSWORD: '***', JWT_SECRET: '***' })
}

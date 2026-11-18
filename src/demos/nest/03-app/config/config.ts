import { Injectable, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { join } from 'node:path'
import { z } from 'zod'

// Las variables de entorno siempre llegan como strings: Zod las valida y las convierte
const Entorno = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PUERTO: z.coerce.number().int().default(3000),
  DB_URL: z.url(),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET tiene que tener al menos 16 caracteres'),
})
export type Entorno = z.infer<typeof Entorno>

@Injectable()
class BaseDeDatos {
  // ConfigService<Entorno, true>: get() con el nombre exacto y el tipo correcto
  constructor(private readonly config: ConfigService<Entorno, true>) {}

  describir() {
    const url = new URL(this.config.get('DB_URL', { infer: true }))
    return `${url.protocol}//${url.hostname}:${url.port}${url.pathname} (puerto de la API: ${this.config.get('PUERTO', { infer: true })})`
  }
}

function validar(variables: Record<string, unknown>) {
  const resultado = Entorno.safeParse(variables)
  if (!resultado.success) throw new Error(`Configuración inválida:\n${z.prettifyError(resultado.error)}`)
  return resultado.data
}

const archivo = process.argv[2] ?? '.env.ejemplo'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigService disponible en todos los módulos sin importarlo
      envFilePath: join(import.meta.dirname, archivo), // lee el .env (las variables reales tienen prioridad)
      validate: validar, // si falta algo, la app no arranca
    }),
  ],
  providers: [BaseDeDatos],
})
class AppModule {}

const app = await NestFactory.createApplicationContext(AppModule, { logger: false, abortOnError: false })
console.log('Conectando a', app.get(BaseDeDatos).describir())
console.log('NODE_ENV =', app.get(ConfigService).get('NODE_ENV'))
await app.close()

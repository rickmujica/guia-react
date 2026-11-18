import { Inject, Injectable, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

// 1. Un valor: la clave del provider es un string (un "token") en lugar de una clase
export const MONEDA = 'MONEDA'

// 2. Una clase abstracta como contrato, y dos implementaciones
export abstract class Notificador {
  abstract enviar(mensaje: string): string
}
class NotificadorEmail extends Notificador {
  enviar(mensaje: string) {
    return `email: ${mensaje}`
  }
}
class NotificadorConsola extends Notificador {
  enviar(mensaje: string) {
    return `consola: ${mensaje}`
  }
}

// 3. Una fábrica: una función (puede ser async) que arma el valor con otros providers
export const RELOJ = Symbol('RELOJ')
type Reloj = { ahora: () => string }

@Injectable()
class Alertas {
  constructor(
    @Inject(MONEDA) private readonly moneda: string, // un token que no es clase: con @Inject
    private readonly notificador: Notificador, // una clase abstracta sí sirve de token
    @Inject(RELOJ) private readonly reloj: Reloj,
  ) {}

  nuevaOferta(titulo: string, salario: number) {
    return this.notificador.enviar(`[${this.reloj.ahora()}] ${titulo}: ${salario} ${this.moneda}`)
  }
}

@Module({
  providers: [
    Alertas, // atajo de { provide: Alertas, useClass: Alertas }
    { provide: MONEDA, useValue: 'USD' },
    {
      provide: Notificador,
      useClass: process.env.NODE_ENV === 'production' ? NotificadorEmail : NotificadorConsola,
    },
    {
      provide: RELOJ,
      useFactory: (moneda: string): Reloj => ({ ahora: () => `10:00 (${moneda})` }),
      inject: [MONEDA], // lo que recibe la fábrica, en orden
    },
  ],
})
class AppModule {}

// Un "contexto de aplicación": el contenedor de Nest sin servidor HTTP (para scripts y CLIs)
const app = await NestFactory.createApplicationContext(AppModule, { logger: false })
console.log(app.get(Alertas).nuevaOferta('Frontend React Senior', 4000))
console.log('Moneda:', app.get(MONEDA))
console.log('¿Misma instancia?', app.get(Alertas) === app.get(Alertas))
await app.close()

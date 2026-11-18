import { Controller, Get, Injectable, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

// Un servicio: la lógica. @Injectable() lo deja inyectar en otras clases.
@Injectable()
class SaludoService {
  saludar() {
    return { mensaje: 'Hola desde Nest' }
  }
}

// Un controlador: las rutas. Nest le pasa el servicio en el constructor.
@Controller()
class AppController {
  constructor(private readonly saludo: SaludoService) {}

  @Get()
  hola() {
    return this.saludo.saludar() // un objeto se responde como JSON
  }

  @Get('salud')
  salud() {
    return { ok: true }
  }
}

// Un módulo: junta las piezas
@Module({ controllers: [AppController], providers: [SaludoService] })
export class AppModule {}

export const crearApp = () => NestFactory.create(AppModule)

// Solo si se ejecuta este archivo (los ejemplos de la guía lo levantan en otro puerto)
if (import.meta.main) {
  const app = await crearApp()
  await app.listen(3000)
}

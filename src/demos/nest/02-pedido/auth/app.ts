import { Body, Controller, Get, HttpCode, Module, Post } from '@nestjs/common'
import { APP_GUARD, NestFactory } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service.js'
import { Publica, Roles, Usuario, type UsuarioToken } from './decoradores.js'
import { AuthGuard, RolesGuard } from './guards.js'

@Controller()
class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Publica()
  @Post('login')
  @HttpCode(200)
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password)
  }

  @Get('yo')
  yo(@Usuario() usuario: UsuarioToken) {
    return usuario
  }

  @Roles(['admin'])
  @Get('admin/usuarios')
  usuarios() {
    return this.auth.listar()
  }
}

@Module({
  imports: [
    // Un módulo dinámico: register() lo configura. En producción, el secreto sale del entorno.
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secreto-solo-para-desarrollo',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // Guards globales registrados como providers: así pueden inyectar dependencias.
    // Corren en este orden.
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
class AppModule {}

export const crearApp = () => NestFactory.create(AppModule, { logger: false })

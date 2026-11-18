import { Injectable, UnauthorizedException, type OnModuleInit } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { hashear, verificar } from './claves.js'
import type { Rol } from './decoradores.js'

type UsuarioGuardado = { id: string; email: string; rol: Rol; hash: string }

@Injectable()
export class AuthService implements OnModuleInit {
  private usuarios: UsuarioGuardado[] = []

  constructor(private readonly jwt: JwtService) {}

  // Un hook del ciclo de vida: corre cuando el módulo está listo (puede ser async)
  async onModuleInit() {
    this.usuarios = [
      { id: 'u1', email: 'ana@ejemplo.com', rol: 'usuario', hash: await hashear('secreto-123') },
      { id: 'u2', email: 'admin@ejemplo.com', rol: 'admin', hash: await hashear('admin-456') },
    ]
  }

  async login(email: string, password: string) {
    const usuario = this.usuarios.find((u) => u.email === email)
    if (!usuario || !(await verificar(password, usuario.hash))) {
      throw new UnauthorizedException('Email o contraseña incorrectos') // no decir cuál falló
    }
    const token = await this.jwt.signAsync({ sub: usuario.id, email, rol: usuario.rol })
    return { token }
  }

  listar() {
    return this.usuarios.map(({ id, email, rol }) => ({ id, email, rol }))
  }
}

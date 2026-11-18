import { ForbiddenException, Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import type { Request } from 'express'
import { ES_PUBLICA, Roles, type UsuarioToken } from './decoradores.js'

// Verifica el token en TODAS las rutas (es global), salvo las marcadas con @Publica()
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    // Busca el metadato en el handler y, si no está, en el controlador
    const esPublica = this.reflector.getAllAndOverride<boolean>(ES_PUBLICA, [context.getHandler(), context.getClass()])
    if (esPublica) return true

    const req = context.switchToHttp().getRequest<Request & { usuario?: UsuarioToken }>()
    const token = req.get('authorization')?.replace(/^Bearer /, '')
    if (!token) throw new UnauthorizedException('Falta el token')
    try {
      const { sub, email, rol } = await this.jwt.verifyAsync(token)
      req.usuario = { id: sub, email, rol } // lo lee el decorador @Usuario()
      return true
    } catch {
      throw new UnauthorizedException('Token inválido o vencido')
    }
  }
}

// Corre después de AuthGuard: compara el rol del usuario con el de @Roles()
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride(Roles, [context.getHandler(), context.getClass()])
    if (!roles) return true // la ruta no pide un rol
    const { usuario } = context.switchToHttp().getRequest<Request & { usuario?: UsuarioToken }>()
    if (!usuario || !roles.includes(usuario.rol)) throw new ForbiddenException('Solo para administradores')
    return true
  }
}

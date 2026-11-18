import { createParamDecorator, SetMetadata, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

export type Rol = 'admin' | 'usuario'
export type UsuarioToken = { id: string; email: string; rol: Rol }

// Los decoradores propios guardan metadatos en el handler; los guards los leen con Reflector.

// @Publica(): esta ruta no necesita token
export const ES_PUBLICA = 'esPublica'
export const Publica = () => SetMetadata(ES_PUBLICA, true)

// @Roles(['admin']): solo para esos roles (createDecorator ya lo tipa)
export const Roles = Reflector.createDecorator<Rol[]>()

// @Usuario(): el usuario que dejó el guard en el pedido, como parámetro del handler
export const Usuario = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => context.switchToHttp().getRequest<Request & { usuario: UsuarioToken }>().usuario,
)

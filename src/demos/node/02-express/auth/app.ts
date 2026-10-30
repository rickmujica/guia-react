import express, { type RequestHandler } from 'express'
import { jwtVerify, SignJWT } from 'jose'
import { hashear, verificar } from './claves.ts'

// En producción, el secreto sale de una variable de entorno larga y aleatoria
const secreto = new TextEncoder().encode(process.env.JWT_SECRET ?? 'secreto-solo-para-desarrollo')

type Usuario = { id: string; email: string; rol: 'admin' | 'usuario'; hash: string }
const usuarios: Usuario[] = [
  { id: 'u1', email: 'ana@ejemplo.com', rol: 'usuario', hash: await hashear('secreto-123') },
]

export const app = express()
app.use(express.json())

// Login: si la clave es correcta, devuelve un token firmado que vence en 15 minutos
app.post('/login', async (req, res) => {
  const usuario = usuarios.find((u) => u.email === req.body.email)
  if (!usuario || !(await verificar(req.body.password, usuario.hash))) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos' }) // no decir cuál falló
  }
  const token = await new SignJWT({ rol: usuario.rol })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(usuario.id)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secreto)
  res.json({ token })
})

// Middleware: verifica el token del header Authorization y deja el usuario en res.locals
const autenticar: RequestHandler = async (req, res, next) => {
  const token = req.get('authorization')?.replace(/^Bearer /, '')
  if (!token) return res.status(401).json({ error: 'Falta el token' })
  try {
    const { payload } = await jwtVerify(token, secreto)
    res.locals.usuario = { id: payload.sub, rol: payload.rol }
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o vencido' })
  }
}

const soloAdmin: RequestHandler = (_req, res, next) => {
  if (res.locals.usuario.rol !== 'admin') return res.status(403).json({ error: 'Solo para administradores' })
  next()
}

app.get('/yo', autenticar, (_req, res) => {
  res.json(res.locals.usuario)
})

app.get('/admin/usuarios', autenticar, soloAdmin, (_req, res) => {
  res.json(usuarios.map(({ id, email }) => ({ id, email })))
})

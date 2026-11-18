import type { GuideDef, PartDef } from './types'

import Bienvenida from '../content/nest/00-empeza-aca/bienvenida.mdx'
import Proyecto from '../content/nest/01-fundamentos/proyecto.mdx'
import Controladores from '../content/nest/01-fundamentos/controladores.mdx'
import Providers from '../content/nest/01-fundamentos/providers.mdx'
import Modulos from '../content/nest/01-fundamentos/modulos.mdx'
import Ciclo from '../content/nest/02-pedido/ciclo.mdx'
import Validacion from '../content/nest/02-pedido/validacion.mdx'
import Excepciones from '../content/nest/02-pedido/excepciones.mdx'
import Auth from '../content/nest/02-pedido/auth.mdx'
import Interceptores from '../content/nest/02-pedido/interceptores.mdx'
import Configuracion from '../content/nest/03-app/configuracion.mdx'
import BaseDeDatos from '../content/nest/03-app/base-de-datos.mdx'
import Testing from '../content/nest/03-app/testing.mdx'
import Produccion from '../content/nest/03-app/produccion.mdx'
import Ecosistema from '../content/nest/03-app/ecosistema.mdx'
import Chuleta from '../content/nest/04-repaso/chuleta.mdx'

const partDefs: PartDef[] = [
  {
    id: 'empeza-aca',
    title: 'Empezá acá',
    intro: 'Qué es Nest, cómo se relaciona con Node y Express, y cómo están hechos los ejemplos.',
    chapters: [
      {
        slug: 'bienvenida',
        title: 'Node, Express y Nest',
        summary: 'Cómo encajan las tres piezas, qué agrega Nest y cuándo conviene usarlo.',
        Content: Bienvenida,
      },
    ],
  },
  {
    id: 'fundamentos',
    title: 'Parte 1 · Fundamentos',
    intro: 'Las cuatro piezas de toda app de Nest: el proyecto, los controladores, los providers y los módulos.',
    chapters: [
      {
        slug: 'proyecto',
        title: 'Crear un proyecto',
        summary: 'nest new, la estructura, los decoradores y por qué Nest se compila.',
        Content: Proyecto,
      },
      {
        slug: 'controladores',
        title: 'Controladores y rutas',
        summary: '@Controller, @Get y compañía, params, query y body, status codes y headers.',
        Content: Controladores,
      },
      {
        slug: 'providers',
        title: 'Providers e inyección de dependencias',
        summary: 'Servicios, el contenedor de Nest, tokens, useValue, useClass, useFactory y scopes.',
        Content: Providers,
      },
      {
        slug: 'modulos',
        title: 'Módulos',
        summary: 'imports y exports, el error más común de Nest, módulos globales y dinámicos.',
        Content: Modulos,
      },
    ],
  },
  {
    id: 'pedido',
    title: 'Parte 2 · El ciclo del pedido',
    intro: 'Todo lo que pasa entre que llega el pedido y sale la respuesta: middlewares, guards, interceptores, pipes y filtros.',
    chapters: [
      {
        slug: 'ciclo',
        title: 'El ciclo de un pedido',
        summary: 'En qué orden corre cada pieza, y para qué sirve cada una.',
        Content: Ciclo,
      },
      {
        slug: 'validacion',
        title: 'Pipes y validación',
        summary: 'Zod con Standard Schema (Nest 12) y los DTO con class-validator.',
        Content: Validacion,
      },
      {
        slug: 'excepciones',
        title: 'Excepciones y filtros',
        summary: 'Las excepciones HTTP de Nest, errores de negocio y filtros propios.',
        Content: Excepciones,
      },
      {
        slug: 'auth',
        title: 'Guards y autenticación',
        summary: 'Login con JWT, un guard global, @Publica(), roles y decoradores propios.',
        Content: Auth,
      },
      {
        slug: 'interceptores',
        title: 'Interceptores',
        summary: 'Transformar respuestas y cortar por tiempo, con los operadores de RxJS.',
        Content: Interceptores,
      },
    ],
  },
  {
    id: 'app',
    title: 'Parte 3 · Una app de verdad',
    intro: 'Configuración, base de datos, tests, producción y el resto del ecosistema.',
    chapters: [
      {
        slug: 'configuracion',
        title: 'Configuración',
        summary: '@nestjs/config, variables de entorno validadas con Zod y ConfigService tipado.',
        Content: Configuracion,
      },
      {
        slug: 'base-de-datos',
        title: 'Capas y base de datos',
        summary: 'Servicio y repositorio, MySQL como provider, y Prisma, TypeORM y Drizzle.',
        Content: BaseDeDatos,
      },
      {
        slug: 'testing',
        title: 'Tests',
        summary: 'Test.createTestingModule, mocks de providers y tests de la API entera.',
        Content: Testing,
      },
      {
        slug: 'produccion',
        title: 'A producción',
        summary: 'Prefijo, versiones, CORS, logs, hooks del ciclo de vida, apagado prolijo y Docker.',
        Content: Produccion,
      },
      {
        slug: 'ecosistema',
        title: 'El resto del ecosistema',
        summary: 'Swagger, GraphQL, WebSockets, colas, tareas programadas, microservicios y Fastify.',
        Content: Ecosistema,
      },
    ],
  },
  {
    id: 'repaso',
    title: 'Parte 4 · Repaso',
    intro: 'Todo junto para repasar antes de una entrevista.',
    chapters: [
      {
        slug: 'chuleta',
        title: 'Chuleta y preguntas de entrevista',
        summary: 'Nest en una página, Express vs Nest, qué cambió en Nest 12 y preguntas frecuentes.',
        Content: Chuleta,
      },
    ],
  },
]

export const nestGuide: GuideDef = {
  id: 'nest',
  title: 'NestJS',
  description:
    'El framework de Node para APIs grandes: módulos, inyección de dependencias, guards, pipes, validación con Zod, JWT y tests. Con ejemplos que se ejecutan de verdad.',
  badge: 'NestJS 12.5',
  icon: 'NE',
  color: '#e0234e',
  pdf: 'guia-nestjs.pdf',
  parts: partDefs,
}

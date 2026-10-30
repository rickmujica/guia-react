import type { GuideDef, PartDef } from './types'

import Bienvenida from '../content/node/00-empeza-aca/bienvenida.mdx'
import Modulos from '../content/node/01-node/modulos.mdx'
import EventLoop from '../content/node/01-node/event-loop.mdx'
import Asincronia from '../content/node/01-node/asincronia.mdx'
import ArchivosYStreams from '../content/node/01-node/archivos-y-streams.mdx'
import Proceso from '../content/node/01-node/proceso.mdx'
import Http from '../content/node/01-node/http.mdx'
import Express from '../content/node/02-express/express.mdx'
import Middlewares from '../content/node/02-express/middlewares.mdx'
import ApiRest from '../content/node/02-express/api-rest.mdx'
import Validacion from '../content/node/02-express/validacion.mdx'
import Capas from '../content/node/02-express/capas.mdx'
import Auth from '../content/node/02-express/auth.mdx'
import Testing from '../content/node/02-express/testing.mdx'
import Produccion from '../content/node/02-express/produccion.mdx'
import Chuleta from '../content/node/03-repaso/chuleta.mdx'

const partDefs: PartDef[] = [
  {
    id: 'empeza-aca',
    title: 'Empezá acá',
    intro: 'Qué es Node, cómo se generan las salidas de los ejemplos y cómo está armada la guía.',
    chapters: [
      {
        slug: 'bienvenida',
        title: 'Cómo usar esta guía',
        summary: 'Node en un párrafo, Node vs el navegador, y ejemplos que se ejecutan de verdad.',
        Content: Bienvenida,
      },
    ],
  },
  {
    id: 'node',
    title: 'Parte 1 · Node.js',
    intro: 'El runtime: módulos, el event loop, asincronía, archivos, el proceso y HTTP sin frameworks.',
    chapters: [
      {
        slug: 'modulos',
        title: 'Módulos, npm y TypeScript',
        summary: 'ES modules y CommonJS, package.json, semver y ejecutar .ts sin compilar.',
        Content: Modulos,
      },
      {
        slug: 'event-loop',
        title: 'El event loop',
        summary: 'Un hilo, microtareas y fases, en qué orden corre cada cosa, no bloquear y worker threads.',
        Content: EventLoop,
      },
      {
        slug: 'asincronia',
        title: 'Callbacks, promesas y async/await',
        summary: 'Los tres estilos, en serie o en paralelo, Promise.all y compañía, cancelar y timeouts.',
        Content: Asincronia,
      },
      {
        slug: 'archivos-y-streams',
        title: 'Archivos, rutas y streams',
        summary: 'node:path, node:fs/promises, streams con pipeline y Buffer.',
        Content: ArchivosYStreams,
      },
      {
        slug: 'proceso',
        title: 'Eventos y el proceso',
        summary: 'EventEmitter, argumentos, variables de entorno, códigos de salida y señales.',
        Content: Proceso,
      },
      {
        slug: 'http',
        title: 'HTTP sin frameworks',
        summary: 'Un servidor con node:http, métodos y status codes, y fetch como cliente.',
        Content: Http,
      },
    ],
  },
  {
    id: 'express',
    title: 'Parte 2 · Express',
    intro: 'APIs con Express 5: de la primera ruta a una app en capas, segura, testeada y lista para producción.',
    chapters: [
      {
        slug: 'express',
        title: 'Express: rutas y respuestas',
        summary: 'La app, req y res, params, query y body, Router y cómo organizar el proyecto.',
        Content: Express,
      },
      {
        slug: 'middlewares',
        title: 'Middlewares',
        summary: 'La cadena del pedido, next(), errores en Express 5, 404 y CORS.',
        Content: Middlewares,
      },
      {
        slug: 'api-rest',
        title: 'Diseñar una API REST',
        summary: 'Un CRUD completo, convenciones, status codes, paginación e idempotencia.',
        Content: ApiRest,
      },
      {
        slug: 'validacion',
        title: 'Validar con Zod',
        summary: 'Body, query y params validados, errores 400 con detalle y mass assignment.',
        Content: Validacion,
      },
      {
        slug: 'capas',
        title: 'Capas y base de datos',
        summary: 'Rutas, servicio y repositorio, inyección de dependencias y el repositorio de MySQL.',
        Content: Capas,
      },
      {
        slug: 'auth',
        title: 'Autenticación y seguridad',
        summary: 'Contraseñas con hash, sesiones o JWT, 401 y 403, y la seguridad básica de una API.',
        Content: Auth,
      },
      {
        slug: 'testing',
        title: 'Tests con node:test',
        summary: 'Unit tests, mocks y tests de la API entera, sin instalar nada.',
        Content: Testing,
      },
      {
        slug: 'produccion',
        title: 'A producción',
        summary: 'Configuración validada, logs, errores, apagado prolijo, health check y Docker.',
        Content: Produccion,
      },
    ],
  },
  {
    id: 'repaso',
    title: 'Parte 3 · Repaso',
    intro: 'Todo junto para repasar antes de una entrevista.',
    chapters: [
      {
        slug: 'chuleta',
        title: 'Chuleta y preguntas de entrevista',
        summary: 'Node y Express en una página, de Express 4 a 5 y preguntas frecuentes.',
        Content: Chuleta,
      },
    ],
  },
]

export const nodeGuide: GuideDef = {
  id: 'node',
  title: 'Node.js y Express',
  description:
    'JavaScript en el servidor: el event loop, asincronía, streams y APIs REST con Express 5, Zod, JWT y tests. Con ejemplos que se ejecutan de verdad.',
  badge: 'Node 24 · Express 5',
  icon: 'JS',
  color: '#3c873a',
  pdf: 'guia-node-express.pdf',
  parts: partDefs,
}

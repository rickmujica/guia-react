import type { GuideDef, PartDef } from './types'

import Bienvenida from '../content/mysql/00-empeza-aca/bienvenida.mdx'
import Tablas from '../content/mysql/01-basico/tablas.mdx'
import Insertar from '../content/mysql/01-basico/insertar.mdx'
import Select from '../content/mysql/01-basico/select.mdx'
import FuncionesYNull from '../content/mysql/01-basico/funciones-y-null.mdx'
import Agrupar from '../content/mysql/01-basico/agrupar.mdx'
import Joins from '../content/mysql/01-basico/joins.mdx'
import Subconsultas from '../content/mysql/02-intermedio/subconsultas.mdx'
import FuncionesVentana from '../content/mysql/02-intermedio/funciones-ventana.mdx'
import Indices from '../content/mysql/02-intermedio/indices.mdx'
import Transacciones from '../content/mysql/02-intermedio/transacciones.mdx'
import Diseno from '../content/mysql/02-intermedio/diseno.mdx'
import VistasYMas from '../content/mysql/02-intermedio/vistas-y-mas.mdx'
import DesdeNode from '../content/mysql/02-intermedio/desde-node.mdx'
import Chuleta from '../content/mysql/03-repaso/chuleta.mdx'

const partDefs: PartDef[] = [
  {
    id: 'empeza-aca',
    title: 'Empezá acá',
    intro: 'La base de ejemplo, cómo se generan los resultados y cómo instalar MySQL.',
    chapters: [
      {
        slug: 'bienvenida',
        title: 'Cómo usar esta guía',
        summary: 'Qué es una base relacional, la base de ejemplo, el playground y MySQL en la Mac.',
        Content: Bienvenida,
      },
    ],
  },
  {
    id: 'basico',
    title: 'Parte 1 · Lo básico',
    intro: 'Crear tablas, cargar datos y consultarlos: lo que vas a escribir todos los días.',
    chapters: [
      {
        slug: 'tablas',
        title: 'Crear tablas',
        summary: 'CREATE TABLE, tipos de datos, restricciones y ALTER TABLE.',
        Content: Tablas,
      },
      {
        slug: 'insertar',
        title: 'Insertar, actualizar y borrar',
        summary: 'INSERT, UPDATE y DELETE, las claves foráneas en acción y el upsert.',
        Content: Insertar,
      },
      {
        slug: 'select',
        title: 'SELECT, WHERE y ORDER BY',
        summary: 'Elegir columnas, filtrar, ordenar, paginar y DISTINCT.',
        Content: Select,
      },
      {
        slug: 'funciones-y-null',
        title: 'Funciones y NULL',
        summary: 'Texto, números, fechas, CASE y cómo se comporta NULL.',
        Content: FuncionesYNull,
      },
      {
        slug: 'agrupar',
        title: 'Agrupar: GROUP BY y HAVING',
        summary: 'COUNT, SUM y AVG, GROUP BY, HAVING, agregaciones condicionales y GROUP_CONCAT.',
        Content: Agrupar,
      },
      {
        slug: 'joins',
        title: 'JOINs',
        summary: 'INNER y LEFT JOIN, buscar lo que falta, ON vs WHERE, muchos a muchos y UNION.',
        Content: Joins,
      },
    ],
  },
  {
    id: 'intermedio',
    title: 'Parte 2 · Intermedio',
    intro: 'Consultas de varios pasos, performance, concurrencia y diseño: lo que separa a un junior de un semi senior.',
    chapters: [
      {
        slug: 'subconsultas',
        title: 'Subconsultas y CTE',
        summary: 'Subconsultas en el WHERE, el FROM y el SELECT, EXISTS, WITH y CTE recursivas.',
        Content: Subconsultas,
      },
      {
        slug: 'funciones-ventana',
        title: 'Funciones de ventana',
        summary: 'OVER y PARTITION BY, rankings, el mejor de cada grupo, acumulados, LAG y LEAD.',
        Content: FuncionesVentana,
      },
      {
        slug: 'indices',
        title: 'Índices y EXPLAIN',
        summary: 'Cómo funciona un índice, cómo leer un EXPLAIN, índices compuestos y qué los rompe.',
        Content: Indices,
      },
      {
        slug: 'transacciones',
        title: 'Transacciones y concurrencia',
        summary: 'COMMIT y ROLLBACK, ACID, niveles de aislamiento, bloqueos y deadlocks.',
        Content: Transacciones,
      },
      {
        slug: 'diseno',
        title: 'Diseño de tablas',
        summary: 'Normalización, relaciones, ON DELETE, elegir tipos y decisiones típicas.',
        Content: Diseno,
      },
      {
        slug: 'vistas-y-mas',
        title: 'Vistas, procedimientos, triggers y JSON',
        summary: 'Más herramientas de MySQL, usuarios y permisos, y backups.',
        Content: VistasYMas,
      },
      {
        slug: 'desde-node',
        title: 'MySQL desde Node',
        summary: 'mysql2, pool, parámetros, SQL injection, transacciones en código, N+1 y ORMs.',
        Content: DesdeNode,
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
        title: 'Chuleta y ejercicios de entrevista',
        summary: 'La sintaxis en una página, ejercicios resueltos y preguntas frecuentes.',
        Content: Chuleta,
      },
    ],
  },
]

export const mysqlGuide: GuideDef = {
  id: 'mysql',
  title: 'MySQL',
  description:
    'Bases de datos relacionales de cero a intermedio: consultas, joins, ventanas, índices, transacciones y diseño, con resultados de un MySQL real.',
  badge: 'MySQL 8',
  icon: 'SQL',
  color: '#00758f',
  pdf: 'guia-mysql.pdf',
  parts: partDefs,
}

-- La misma base para el playground del navegador, que corre SQLite (no MySQL).
-- SQLite no tiene ENUM ni AUTO_INCREMENT: se reemplazan por CHECK e INTEGER PRIMARY KEY.
PRAGMA foreign_keys = ON;

CREATE TABLE empresas (
  id         INTEGER PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL UNIQUE,
  pais       CHAR(2)      NOT NULL,
  empleados  INT          NULL CHECK (empleados > 0)
);

CREATE TABLE ofertas (
  id           INTEGER PRIMARY KEY,
  empresa_id   INT          NOT NULL REFERENCES empresas (id),
  titulo       VARCHAR(150) NOT NULL,
  seniority    TEXT NOT NULL CHECK (seniority IN ('junior', 'semi', 'senior')),
  modalidad    TEXT NOT NULL DEFAULT 'remoto' CHECK (modalidad IN ('remoto', 'hibrido', 'presencial')),
  salario_min  INT  NULL,
  salario_max  INT  NULL,
  publicada    DATE NOT NULL
);

CREATE TABLE tecnologias (
  id      INTEGER PRIMARY KEY,
  nombre  VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE oferta_tecnologia (
  oferta_id      INT NOT NULL REFERENCES ofertas (id) ON DELETE CASCADE,
  tecnologia_id  INT NOT NULL REFERENCES tecnologias (id),
  PRIMARY KEY (oferta_id, tecnologia_id)
);

CREATE TABLE postulaciones (
  id         INTEGER PRIMARY KEY,
  oferta_id  INT  NOT NULL UNIQUE REFERENCES ofertas (id),
  estado     TEXT NOT NULL DEFAULT 'postulado' CHECK (estado IN ('postulado', 'entrevista', 'oferta', 'rechazado')),
  fecha      DATE NOT NULL,
  notas      TEXT NULL
);

CREATE TABLE entrevistas (
  id              INTEGER PRIMARY KEY,
  postulacion_id  INT      NOT NULL REFERENCES postulaciones (id) ON DELETE CASCADE,
  fecha           DATETIME NOT NULL,
  tipo            TEXT NOT NULL CHECK (tipo IN ('rrhh', 'tecnica', 'live coding', 'final')),
  resultado       TEXT NOT NULL DEFAULT 'pendiente' CHECK (resultado IN ('pendiente', 'paso', 'no paso'))
);

-- Base de datos de ejemplo de la guía de MySQL: una búsqueda laboral.
-- Este archivo crea las tablas (MySQL 8). Los datos están en datos.sql.

CREATE TABLE empresas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL UNIQUE,
  pais       CHAR(2)      NOT NULL,          -- código ISO: AR, PY, UY…
  empleados  INT          NULL CHECK (empleados > 0)
);

CREATE TABLE ofertas (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id   INT          NOT NULL,
  titulo       VARCHAR(150) NOT NULL,
  seniority    ENUM('junior', 'semi', 'senior') NOT NULL,
  modalidad    ENUM('remoto', 'hibrido', 'presencial') NOT NULL DEFAULT 'remoto',
  salario_min  INT  NULL,                    -- USD por mes; NULL si no lo publican
  salario_max  INT  NULL,
  publicada    DATE NOT NULL,
  FOREIGN KEY (empresa_id) REFERENCES empresas (id)
);

CREATE TABLE tecnologias (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  nombre  VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla intermedia: una oferta pide muchas tecnologías y una tecnología aparece en muchas ofertas.
CREATE TABLE oferta_tecnologia (
  oferta_id      INT NOT NULL,
  tecnologia_id  INT NOT NULL,
  PRIMARY KEY (oferta_id, tecnologia_id),
  FOREIGN KEY (oferta_id) REFERENCES ofertas (id) ON DELETE CASCADE,
  FOREIGN KEY (tecnologia_id) REFERENCES tecnologias (id)
);

CREATE TABLE postulaciones (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  oferta_id  INT  NOT NULL UNIQUE,           -- una sola postulación por oferta
  estado     ENUM('postulado', 'entrevista', 'oferta', 'rechazado') NOT NULL DEFAULT 'postulado',
  fecha      DATE NOT NULL,
  notas      TEXT NULL,
  FOREIGN KEY (oferta_id) REFERENCES ofertas (id)
);

CREATE TABLE entrevistas (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  postulacion_id  INT      NOT NULL,
  fecha           DATETIME NOT NULL,
  tipo            ENUM('rrhh', 'tecnica', 'live coding', 'final') NOT NULL,
  resultado       ENUM('pendiente', 'paso', 'no paso') NOT NULL DEFAULT 'pendiente',
  FOREIGN KEY (postulacion_id) REFERENCES postulaciones (id) ON DELETE CASCADE
);

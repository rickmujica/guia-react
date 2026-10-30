-- Datos de ejemplo (sirven igual para MySQL y para SQLite).

INSERT INTO empresas (id, nombre, pais, empleados) VALUES
  (1, 'Nubelia', 'AR', 120),
  (2, 'Pagos Sur', 'UY', 300),
  (3, 'Andes Labs', 'CL', 45),
  (4, 'Mate Cloud', 'AR', 80),
  (5, 'Tereré Tech', 'PY', 25),
  (6, 'Yerba Labs', 'PY', 12),
  (7, 'Cumbre Data', 'MX', 600),
  (8, 'Delta Pay', 'BR', 1500),
  (9, 'Remoto.dev', 'US', NULL),
  (10, 'Quebracho AI', 'PY', 8);

INSERT INTO tecnologias (id, nombre) VALUES
  (1, 'React'), (2, 'TypeScript'), (3, 'Next.js'), (4, 'Node.js'), (5, 'MySQL'),
  (6, 'PostgreSQL'), (7, 'Redux'), (8, 'AWS'), (9, 'Python'), (10, 'Vue');

INSERT INTO ofertas (id, empresa_id, titulo, seniority, modalidad, salario_min, salario_max, publicada) VALUES
  (1, 1, 'Frontend React Senior', 'senior', 'remoto', 3000, 4000, '2026-09-02'),
  (2, 1, 'Fullstack Node', 'semi', 'remoto', 2200, 3000, '2026-09-20'),
  (3, 2, 'Frontend Engineer', 'senior', 'remoto', 3500, 4500, '2026-10-01'),
  (4, 2, 'React Native Developer', 'semi', 'hibrido', 2500, 3200, '2026-10-05'),
  (5, 3, 'Desarrollador React', 'semi', 'remoto', NULL, NULL, '2026-09-15'),
  (6, 4, 'Frontend Junior', 'junior', 'presencial', 1200, 1600, '2026-08-28'),
  (7, 4, 'Tech Lead Frontend', 'senior', 'remoto', 4500, 5500, '2026-10-12'),
  (8, 5, 'Fullstack Next.js', 'semi', 'remoto', 2000, 2800, '2026-10-03'),
  (9, 6, 'Frontend React + TypeScript', 'senior', 'remoto', 2800, 3300, '2026-10-18'),
  (10, 7, 'Data Engineer', 'senior', 'hibrido', 3000, 4200, '2026-09-10'),
  (11, 7, 'Frontend Senior', 'senior', 'presencial', 2600, 3400, '2026-09-25'),
  (12, 8, 'Senior Frontend Engineer', 'senior', 'remoto', 4000, 6000, '2026-10-20'),
  (13, 8, 'Backend Node.js', 'semi', 'remoto', NULL, NULL, '2026-10-22'),
  (14, 9, 'React Developer (LatAm)', 'semi', 'remoto', 2500, 3500, '2026-10-08'),
  (15, 9, 'Junior Frontend', 'junior', 'remoto', 1500, 2000, '2026-10-25');

INSERT INTO oferta_tecnologia (oferta_id, tecnologia_id) VALUES
  (1, 1), (1, 2), (1, 7),
  (2, 4), (2, 2), (2, 5),
  (3, 1), (3, 2), (3, 3),
  (4, 1), (4, 2),
  (5, 1), (5, 7),
  (6, 1),
  (7, 1), (7, 2), (7, 3), (7, 8),
  (8, 3), (8, 4), (8, 6),
  (9, 1), (9, 2),
  (10, 9), (10, 8), (10, 6),
  (11, 1), (11, 7),
  (12, 1), (12, 2), (12, 3),
  (13, 4), (13, 5), (13, 8),
  (14, 1), (14, 2), (14, 4),
  (15, 1);

INSERT INTO postulaciones (id, oferta_id, estado, fecha, notas) VALUES
  (1, 1, 'entrevista', '2026-09-05', 'Contacto por LinkedIn'),
  (2, 3, 'oferta', '2026-10-02', NULL),
  (3, 5, 'rechazado', '2026-09-16', 'Buscaban a alguien en Chile'),
  (4, 7, 'postulado', '2026-10-13', NULL),
  (5, 9, 'entrevista', '2026-10-19', 'Startup local, equipo chico'),
  (6, 12, 'postulado', '2026-10-21', NULL),
  (7, 14, 'rechazado', '2026-10-10', NULL),
  (8, 8, 'entrevista', '2026-10-04', NULL);

INSERT INTO entrevistas (id, postulacion_id, fecha, tipo, resultado) VALUES
  (1, 1, '2026-09-10 15:00:00', 'rrhh', 'paso'),
  (2, 1, '2026-09-17 16:00:00', 'tecnica', 'paso'),
  (3, 1, '2026-09-24 15:30:00', 'live coding', 'pendiente'),
  (4, 2, '2026-10-06 14:00:00', 'rrhh', 'paso'),
  (5, 2, '2026-10-09 17:00:00', 'tecnica', 'paso'),
  (6, 2, '2026-10-14 15:00:00', 'final', 'paso'),
  (7, 5, '2026-10-23 11:00:00', 'rrhh', 'pendiente'),
  (8, 8, '2026-10-07 10:00:00', 'rrhh', 'paso'),
  (9, 8, '2026-10-15 10:00:00', 'tecnica', 'pendiente');

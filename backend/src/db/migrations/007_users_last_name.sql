-- Apellidos en su propia columna (la tabla ya existe, por eso es una migración nueva)
ALTER TABLE users
  ADD COLUMN last_name VARCHAR(100) NOT NULL DEFAULT '';

-- El DEFAULT solo era para no romper los usuarios que ya existen
ALTER TABLE users
  ALTER COLUMN last_name DROP DEFAULT;

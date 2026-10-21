-- Ajustes a users y letters (las tablas ya existen, por eso es una migracion nueva)

-- Fecha con zona horaria; las fechas existentes se toman como UTC
ALTER TABLE users
  ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

-- Solo se permiten las dificultades que usa el frontend
ALTER TABLE letters
  ADD CONSTRAINT letters_difficulty_check CHECK (difficulty IN ('easy', 'medium', 'hard'));

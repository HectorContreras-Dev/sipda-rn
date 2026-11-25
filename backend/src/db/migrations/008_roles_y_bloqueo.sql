-- Rol del usuario: 'user' (normal) o 'admin'. Todos empiezan como 'user'
ALTER TABLE users
  ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

-- Fecha en que se bloqueó la cuenta. NULL = cuenta activa
ALTER TABLE users
  ADD COLUMN blocked_at TIMESTAMPTZ;

-- El primer administrador se asigna a mano en el SQL Editor (nunca desde la app):
-- UPDATE users SET role = 'admin' WHERE email = 'correo-del-admin@ejemplo.com';

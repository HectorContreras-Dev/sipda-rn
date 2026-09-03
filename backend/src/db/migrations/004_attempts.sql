CREATE TABLE attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  letter_id INTEGER NOT NULL REFERENCES letters(id),
  is_correct BOOLEAN NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
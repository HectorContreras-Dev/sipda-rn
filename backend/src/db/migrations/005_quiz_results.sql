CREATE TABLE quiz_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  letter_id INTEGER NOT NULL REFERENCES letters(id),
  attempts_taken INTEGER NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  duration_seconds INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
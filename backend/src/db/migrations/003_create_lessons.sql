CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL
);


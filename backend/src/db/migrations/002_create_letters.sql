CREATE TABLE letters (
  id SERIAL PRIMARY KEY,
  letter VARCHAR(2) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image_url VARCHAR(255),
  video_url VARCHAR(255),
  difficulty VARCHAR(10) NOT NULL DEFAULT 'easy'
);
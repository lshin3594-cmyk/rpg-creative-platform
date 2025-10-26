CREATE TABLE IF NOT EXISTS saved_stories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  genre VARCHAR(100),
  story_context TEXT,
  universe_id INTEGER,
  character_ids INTEGER[],
  length VARCHAR(50),
  style VARCHAR(50),
  rating VARCHAR(50),
  is_favorite BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
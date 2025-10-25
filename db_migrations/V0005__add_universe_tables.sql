-- Create universes table
CREATE TABLE IF NOT EXISTS universes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  canon_source TEXT,
  source_type TEXT CHECK (source_type IN ('canon', 'custom')),
  genre TEXT,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expand characters table for fanfic characters
ALTER TABLE characters ADD COLUMN IF NOT EXISTS universe_id INTEGER REFERENCES universes(id);
ALTER TABLE characters ADD COLUMN IF NOT EXISTS age TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS appearance TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS abilities TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS strengths TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS weaknesses TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS goals TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS character_role TEXT CHECK (character_role IN ('main', 'supporting', 'antagonist'));

-- Expand stories table for fanfic stories
ALTER TABLE stories ADD COLUMN IF NOT EXISTS universe_id INTEGER REFERENCES universes(id);
ALTER TABLE stories ADD COLUMN IF NOT EXISTS character_ids INTEGER[];
ALTER TABLE stories ADD COLUMN IF NOT EXISTS length TEXT;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS style TEXT;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS rating TEXT;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_characters_universe ON characters(universe_id);
CREATE INDEX IF NOT EXISTS idx_stories_universe ON stories(universe_id);
CREATE INDEX IF NOT EXISTS idx_stories_favorite ON stories(is_favorite);

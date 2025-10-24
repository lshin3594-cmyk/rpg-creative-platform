CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar TEXT,
    stats TEXT,
    personality TEXT,
    backstory TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS worlds (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    genre TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_characters_created_at ON characters(created_at DESC);
CREATE INDEX idx_worlds_created_at ON worlds(created_at DESC);

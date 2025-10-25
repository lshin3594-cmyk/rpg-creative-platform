CREATE TABLE IF NOT EXISTS t_p56538376_rpg_creative_platfor.plots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    genre VARCHAR(100),
    hooks TEXT,
    conflict TEXT,
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plots_created_at ON t_p56538376_rpg_creative_platfor.plots(created_at DESC);

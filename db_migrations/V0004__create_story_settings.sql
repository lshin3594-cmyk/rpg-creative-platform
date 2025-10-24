CREATE TABLE IF NOT EXISTS t_p56538376_rpg_creative_platfor.story_settings (
  id SERIAL PRIMARY KEY,
  narrative_mode text NOT NULL DEFAULT 'mixed',
  player_character_id integer REFERENCES t_p56538376_rpg_creative_platfor.characters(id),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE t_p56538376_rpg_creative_platfor.story_settings IS 'Story generation settings';
COMMENT ON COLUMN t_p56538376_rpg_creative_platfor.story_settings.narrative_mode IS 'mixed, first_person, third_person';

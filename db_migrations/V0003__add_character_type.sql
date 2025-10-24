ALTER TABLE t_p56538376_rpg_creative_platfor.characters 
ADD COLUMN IF NOT EXISTS character_type text DEFAULT 'player';

COMMENT ON COLUMN t_p56538376_rpg_creative_platfor.characters.character_type IS 'player or npc';

-- Добавляем поля для живых NPC: сцены, цитаты, идеи
ALTER TABLE t_p56538376_rpg_creative_platfor.characters 
ADD COLUMN IF NOT EXISTS scenes TEXT,
ADD COLUMN IF NOT EXISTS quotes TEXT,
ADD COLUMN IF NOT EXISTS ideas TEXT;
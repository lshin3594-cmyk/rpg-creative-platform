-- Добавляем поля race и is_main_character в таблицу characters
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS race TEXT,
ADD COLUMN IF NOT EXISTS is_main_character BOOLEAN DEFAULT FALSE;
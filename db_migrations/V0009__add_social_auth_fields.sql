-- Добавление полей для OAuth авторизации через соцсети
ALTER TABLE users ADD COLUMN IF NOT EXISTS vk_id VARCHAR(100) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_id VARCHAR(100) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local';

-- Индексы для быстрого поиска по соцсетям
CREATE INDEX IF NOT EXISTS idx_users_vk_id ON users(vk_id);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);
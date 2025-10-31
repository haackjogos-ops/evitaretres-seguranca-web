-- Adicionar campo logo_url nas tabelas
ALTER TABLE trainings ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE monitoring_services ADD COLUMN IF NOT EXISTS logo_url text;
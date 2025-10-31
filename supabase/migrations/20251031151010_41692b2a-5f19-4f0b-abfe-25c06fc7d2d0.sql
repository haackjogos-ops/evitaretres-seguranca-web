-- Renomear coluna emoji para icon nas tabelas
ALTER TABLE trainings RENAME COLUMN emoji TO icon;
ALTER TABLE courses RENAME COLUMN emoji TO icon;
ALTER TABLE monitoring_services RENAME COLUMN emoji TO icon;

-- Atualizar valores existentes com ícones padrão se estiverem vazios
UPDATE trainings SET icon = 'GraduationCap' WHERE icon IS NULL OR icon = '';
UPDATE courses SET icon = 'BookOpen' WHERE icon IS NULL OR icon = '';
UPDATE monitoring_services SET icon = 'Search' WHERE icon IS NULL OR icon = '';
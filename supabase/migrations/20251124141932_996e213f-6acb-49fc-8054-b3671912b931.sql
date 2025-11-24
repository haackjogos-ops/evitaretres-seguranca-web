-- Add new fields for certificate pages 1 and 2
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS course_logo_url TEXT,
ADD COLUMN IF NOT EXISTS instructor_name TEXT DEFAULT 'ISMAEL S. FERREIRA',
ADD COLUMN IF NOT EXISTS instructor_credentials TEXT DEFAULT 'Técnico em Segurança do Trabalho - Reg. MTESC N° 07.0.00008-5/SC
Bombeiro Profissional Civil - CBM-SC
Instrutores Credenciados',
ADD COLUMN IF NOT EXISTS course_curriculum TEXT[],
ADD COLUMN IF NOT EXISTS student_status TEXT DEFAULT 'APROVADO' CHECK (student_status IN ('APROVADO', 'REPROVADO')),
ADD COLUMN IF NOT EXISTS student_grade TEXT DEFAULT '70% ACIMA',
ADD COLUMN IF NOT EXISTS validity_text TEXT DEFAULT 'Este certificado tem validade de 02 (DOIS ANOS) contado a partir da data de emissão, ou ocorrendo sua revisão, o que prevalecer (conforme item 34.3.3 da NR-34).';
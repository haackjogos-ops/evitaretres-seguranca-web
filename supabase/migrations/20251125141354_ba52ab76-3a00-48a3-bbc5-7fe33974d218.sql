-- Add description column to medicine_services table
ALTER TABLE public.medicine_services
ADD COLUMN description TEXT;

-- Update existing records with their descriptions from the hardcoded content
-- Documentos
UPDATE public.medicine_services SET description = 'Programa de Gerenciamento de Riscos' WHERE section_type = 'document' AND title = 'PGR';
UPDATE public.medicine_services SET description = 'Laudo Técnico das condições Ambientais de Trabalho' WHERE section_type = 'document' AND title = 'LTCAT';
UPDATE public.medicine_services SET description = 'Programa de Controle Médico de Saúde Ocupacional' WHERE section_type = 'document' AND title = 'PCMSO';
UPDATE public.medicine_services SET description = 'Comunicado de Acidente de Trabalho' WHERE section_type = 'document' AND title = 'CAT';
UPDATE public.medicine_services SET description = 'Perfil Profissiográfico Previdenciário' WHERE section_type = 'document' AND title = 'PPP';
UPDATE public.medicine_services SET description = 'Análise Ergonômica do Trabalho' WHERE section_type = 'document' AND title = 'AET';
UPDATE public.medicine_services SET description = 'Análise Preliminar de Risco Ergonômico' WHERE section_type = 'document' AND title = 'APRE';
UPDATE public.medicine_services SET description = 'Ficha de registro de EPI' WHERE section_type = 'document' AND title = 'FRE';

-- Exames
UPDATE public.medicine_services SET description = 'Atestados de saúde ocupacionais: Admissão, Mudança de função/riscos, Retorno ao trabalho, demissão e abono de atestados' WHERE section_type = 'exam' AND title = 'ASO';
UPDATE public.medicine_services SET description = 'Audiometria, Espirometria, Eletrocardiograma, Eletroencefalograma, Acuidade visual' WHERE section_type = 'exam' AND title = 'COMPLEMENTARES';
UPDATE public.medicine_services SET description = 'Encaminhamento interno a parceiros' WHERE section_type = 'exam' AND title = 'LABORATORIAIS';

-- Insert Atendimento Personalizado items
INSERT INTO public.medicine_services (section_type, title, description, display_order, is_active) VALUES
('service', 'Cursos e treinamentos in loco', 'Cursos e treinamentos inloco no conforto de seu ambiente e data e horário desejado', 1, true),
('service', 'Visitas técnicas periódicas', 'Visitas técnicas periódicas com relatórios online em tempo real em seu smartphone', 2, true),
('service', 'Atendimento integral', 'Atendimento em tempo integral presencial ou remoto', 3, true),
('service', 'Nova NR01 - Riscos psicossociais', 'Implantação e controle para atendimento na NOVA NR01 Riscos psicossociais', 4, true),
('service', 'Tratamento diferenciado', 'Tratamento diferenciado de nossa equipe', 5, true);
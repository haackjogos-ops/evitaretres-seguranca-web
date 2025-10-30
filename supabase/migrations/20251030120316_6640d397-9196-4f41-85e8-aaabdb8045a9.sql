-- Create pages_content table for page titles and metadata
CREATE TABLE public.pages_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create services table for home page cards
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  action_label TEXT,
  action_path TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trainings table
CREATE TABLE public.trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji TEXT NOT NULL DEFAULT '📚',
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji TEXT NOT NULL DEFAULT '📖',
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create benefits table
CREATE TABLE public.benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create about_sections table
CREATE TABLE public.about_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create monitoring_services table
CREATE TABLE public.monitoring_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji TEXT NOT NULL DEFAULT '🔍',
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create medicine_services table
CREATE TABLE public.medicine_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type TEXT NOT NULL, -- 'document' or 'exam'
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.pages_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pages_content
CREATE POLICY "Anyone can view pages content" ON public.pages_content FOR SELECT USING (true);
CREATE POLICY "Only admins can insert pages content" ON public.pages_content FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update pages content" ON public.pages_content FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete pages content" ON public.pages_content FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for services
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Only admins can insert services" ON public.services FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update services" ON public.services FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete services" ON public.services FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for trainings
CREATE POLICY "Anyone can view trainings" ON public.trainings FOR SELECT USING (true);
CREATE POLICY "Only admins can insert trainings" ON public.trainings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update trainings" ON public.trainings FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete trainings" ON public.trainings FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for courses
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Only admins can insert courses" ON public.courses FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update courses" ON public.courses FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete courses" ON public.courses FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for benefits
CREATE POLICY "Anyone can view benefits" ON public.benefits FOR SELECT USING (true);
CREATE POLICY "Only admins can insert benefits" ON public.benefits FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update benefits" ON public.benefits FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete benefits" ON public.benefits FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for about_sections
CREATE POLICY "Anyone can view about sections" ON public.about_sections FOR SELECT USING (true);
CREATE POLICY "Only admins can insert about sections" ON public.about_sections FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update about sections" ON public.about_sections FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete about sections" ON public.about_sections FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for monitoring_services
CREATE POLICY "Anyone can view monitoring services" ON public.monitoring_services FOR SELECT USING (true);
CREATE POLICY "Only admins can insert monitoring services" ON public.monitoring_services FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update monitoring services" ON public.monitoring_services FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete monitoring services" ON public.monitoring_services FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for medicine_services
CREATE POLICY "Anyone can view medicine services" ON public.medicine_services FOR SELECT USING (true);
CREATE POLICY "Only admins can insert medicine services" ON public.medicine_services FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update medicine services" ON public.medicine_services FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete medicine services" ON public.medicine_services FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_pages_content_updated_at BEFORE UPDATE ON public.pages_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_trainings_updated_at BEFORE UPDATE ON public.trainings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_benefits_updated_at BEFORE UPDATE ON public.benefits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_about_sections_updated_at BEFORE UPDATE ON public.about_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_monitoring_services_updated_at BEFORE UPDATE ON public.monitoring_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_medicine_services_updated_at BEFORE UPDATE ON public.medicine_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Seed initial data for services (Home page)
INSERT INTO public.services (title, description, icon_name, action_label, action_path, display_order) VALUES
  ('Consultoria Anual', 'Serviço completo de assessoria em segurança e medicina do trabalho com suporte contínuo durante todo o ano.', 'HeartHandshake', 'Ver vantagens', '/vantagens', 1),
  ('Treinamentos', 'Cursos e capacitações em segurança do trabalho, ministrados por profissionais especializados.', 'GraduationCap', 'Ver treinamentos', '/treinamentos', 2),
  ('Cursos', 'Formação profissional em diversas áreas da segurança e saúde ocupacional.', 'BookOpen', 'Ver cursos', '/cursos', 3),
  ('Monitoramento', 'Serviços de medição e controle de agentes ambientais no ambiente de trabalho.', 'Activity', 'Saiba mais', '/monitoramento', 4),
  ('Medicina do Trabalho', 'Exames ocupacionais e acompanhamento médico especializado.', 'Stethoscope', 'Saiba mais', '/medicina', 5),
  ('Sobre Nós', 'Conheça nossa história, missão e valores que guiam nosso trabalho.', 'Users', 'Conheça', '/sobre', 6),
  ('Contato', 'Entre em contato conosco para tirar dúvidas ou solicitar orçamento.', 'Phone', 'Fale conosco', '/contato', 7);

-- Seed trainings data
INSERT INTO public.trainings (emoji, title, subtitle, description, display_order) VALUES
  ('🔥', 'Brigada de Incêndio', 'NR 23', 'Capacitação para formação de brigadas de combate a incêndio e situações de emergência.', 1),
  ('⚡', 'NR 10', 'Segurança em Instalações Elétricas', 'Treinamento obrigatório para trabalhos com eletricidade.', 2),
  ('🏗️', 'NR 35', 'Trabalho em Altura', 'Capacitação para atividades acima de 2 metros do nível inferior.', 3),
  ('🔒', 'NR 33', 'Espaço Confinado', 'Treinamento para trabalhos em ambientes confinados.', 4),
  ('🚜', 'NR 11', 'Operador de Empilhadeira', 'Formação para operação segura de empilhadeiras.', 5),
  ('🏥', 'Primeiros Socorros', 'Atendimento de Emergência', 'Capacitação em procedimentos básicos de primeiros socorros.', 6),
  ('⚠️', 'CIPA', 'Comissão Interna de Prevenção', 'Treinamento para membros da CIPA.', 7);

-- Seed courses data
INSERT INTO public.courses (emoji, title, subtitle, description, display_order) VALUES
  ('👷', 'Técnico em Segurança do Trabalho', 'Formação Completa', 'Curso técnico completo com certificação reconhecida pelo MEC.', 1),
  ('🎓', 'Engenharia de Segurança do Trabalho', 'Pós-graduação', 'Especialização para engenheiros e arquitetos.', 2),
  ('⚙️', 'Ergonomia', 'Análise e Prevenção', 'Curso sobre análise ergonômica do trabalho e prevenção de LER/DORT.', 3),
  ('🧪', 'Higiene Ocupacional', 'Agentes Químicos e Físicos', 'Formação em identificação e controle de riscos ambientais.', 4),
  ('📋', 'Auditor Interno', 'ISO 45001', 'Capacitação para auditoria de sistemas de gestão de SST.', 5),
  ('🔬', 'Toxicologia Ocupacional', 'Riscos Químicos', 'Curso sobre exposição e efeitos de agentes químicos.', 6),
  ('🏭', 'Gestão de Segurança', 'Processos Industriais', 'Formação em gestão de segurança em ambientes industriais.', 7),
  ('📊', 'Perícia em Segurança', 'Laudo Técnico', 'Curso para elaboração de laudos e perícias técnicas.', 8);

-- Seed benefits data
INSERT INTO public.benefits (description, display_order) VALUES
  ('Elaboração e implementação do PCMSO (Programa de Controle Médico de Saúde Ocupacional)', 1),
  ('Desenvolvimento do PGR (Programa de Gerenciamento de Riscos)', 2),
  ('Treinamentos obrigatórios (NR10, NR35, NR33, etc.)', 3),
  ('Suporte na formação e treinamento da CIPA', 4),
  ('Assessoria jurídica trabalhista especializada', 5),
  ('Elaboração de laudos técnicos (LTCAT, PPP, PPRA)', 6),
  ('Acompanhamento de fiscalizações do Ministério do Trabalho', 7),
  ('Gestão de exames ocupacionais (admissional, periódico, demissional)', 8),
  ('Sistema online para gestão de documentos e certificados', 9),
  ('Atendimento presencial e remoto com profissionais qualificados', 10);

-- Seed about sections data
INSERT INTO public.about_sections (section_key, title, description, icon_name, display_order) VALUES
  ('mission', 'Nossa Missão', 'Promover a segurança e saúde no ambiente de trabalho através de soluções inovadoras e eficazes, contribuindo para o bem-estar dos trabalhadores e o sucesso das empresas.', 'Target', 1),
  ('vision', 'Nossa Visão', 'Ser referência nacional em consultoria de segurança do trabalho, reconhecida pela excelência técnica e compromisso com a prevenção de acidentes.', 'Eye', 2),
  ('values', 'Nossos Valores', 'Comprometimento com a vida, ética profissional, inovação constante, respeito às pessoas e responsabilidade socioambiental.', 'Heart', 3),
  ('differential', 'Nosso Diferencial', 'Equipe multidisciplinar altamente qualificada, atendimento personalizado, tecnologia de ponta e acompanhamento contínuo das normas regulamentadoras.', 'Award', 4);

-- Seed monitoring services data
INSERT INTO public.monitoring_services (emoji, title, subtitle, description, display_order) VALUES
  ('🔊', 'Ruído Ocupacional', 'NR-15 Anexo I', 'Avaliação quantitativa dos níveis de ruído no ambiente de trabalho.', 1),
  ('🌡️', 'Calor', 'NR-15 Anexo III', 'Medição de temperatura e umidade para avaliação de sobrecarga térmica.', 2),
  ('💨', 'Agentes Químicos', 'NR-15 Anexo XI', 'Análise de concentração de gases e vapores no ar.', 3),
  ('💡', 'Iluminância', 'NBR ISO/CIE 8995-1', 'Medição dos níveis de iluminação nos postos de trabalho.', 4),
  ('⚡', 'Radiações Ionizantes', 'NR-15 Anexo V', 'Monitoramento de exposição a radiações ionizantes.', 5),
  ('📡', 'Radiações Não Ionizantes', 'NR-15 Anexo VII', 'Avaliação de campos eletromagnéticos e radiação UV.', 6);

-- Seed medicine services data
INSERT INTO public.medicine_services (section_type, title, display_order) VALUES
  ('document', 'PCMSO - Programa de Controle Médico de Saúde Ocupacional', 1),
  ('document', 'PGR - Programa de Gerenciamento de Riscos', 2),
  ('document', 'LTCAT - Laudo Técnico das Condições Ambientais do Trabalho', 3),
  ('document', 'PPP - Perfil Profissiográfico Previdenciário', 4),
  ('exam', 'Exame Admissional', 1),
  ('exam', 'Exame Periódico', 2),
  ('exam', 'Exame Demissional', 3),
  ('exam', 'Exame de Retorno ao Trabalho', 4),
  ('exam', 'Exame de Mudança de Função', 5),
  ('exam', 'Audiometria', 6),
  ('exam', 'Acuidade Visual', 7),
  ('exam', 'Espirometria', 8);

-- Seed pages content data
INSERT INTO public.pages_content (page_key, title, subtitle) VALUES
  ('home', 'Segurança e Saúde no Trabalho', 'Protegendo vidas, construindo futuros mais seguros'),
  ('about', 'Sobre a EVITARE', 'Conheça nossa história e nossos valores'),
  ('benefits', 'Vantagens da Consultoria Anual', 'Tenha o suporte completo que sua empresa precisa'),
  ('trainings', 'Treinamentos Especializados', 'Capacitação profissional em segurança do trabalho'),
  ('courses', 'Cursos Profissionalizantes', 'Formação completa nas áreas de segurança e saúde ocupacional'),
  ('monitoring', 'Monitoramento Ocupacional', 'Avaliação e controle de agentes ambientais'),
  ('medicine', 'Medicina e Segurança do Trabalho', 'Serviços completos de saúde ocupacional'),
  ('contact', 'Entre em Contato', 'Estamos prontos para atender sua empresa');
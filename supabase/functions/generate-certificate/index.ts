import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CertificateData {
  id: string;
  student_name: string;
  course_type: string;
  course_name: string;
  course_norm: string;
  course_hours: string;
  course_date: string;
  archive_code: string;
  registration_number: string;
  issue_location: string;
  issue_date: string;
  course_curriculum?: string[];
  instructor_name?: string;
  instructor_credentials?: string;
  student_status?: string;
  student_grade?: string;
  validity_text?: string;
  course_logo_url?: string;
}

const generateCertificateHTML = (data: CertificateData): string => {
  const courseDate = new Date(data.course_date).toLocaleDateString('pt-BR');
  const issueDate = new Date(data.issue_date).toLocaleDateString('pt-BR');
  const qrCodeUrl = `https://gtryoayjcnylkszwyyno.supabase.co/certificado/${data.registration_number}`;
  
  // Generate curriculum HTML
  const curriculumHtml = (data.course_curriculum || [])
    .map(item => `<li><span style="color: #0066CC; font-weight: bold; font-size: 18px;">•</span> ${item}</li>`)
    .join('');
  
  // Parse instructor credentials for styling
  const instructorCredentialsHtml = (data.instructor_credentials || '').split('\n')
    .map(line => {
      if (line.includes('TÉCNICO') || line.includes('BOMBEIRO') || line.includes('CIVIL')) {
        return `<p style="font-weight: 600; color: #0066CC;">• ${line}</p>`;
      }
      return `<p style="color: #4a5568;">${line}</p>`;
    })
    .join('');
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado - ${data.student_name}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
    }
    .certificate-page {
      width: 210mm;
      height: 297mm;
      background: white;
      position: relative;
      page-break-after: always;
      overflow: hidden;
    }
    .certificate-page:last-child {
      page-break-after: auto;
    }
    
    /* Decorative border */
    .border-decoration {
      position: absolute;
      inset: 10mm;
      border: 3px solid #0066CC;
      border-radius: 8px;
      pointer-events: none;
    }
    
    /* Page 1 Styles */
    .header-gradient {
      background: linear-gradient(to right, #0066CC, #0088FF);
      color: white;
      padding: 30px 40px;
      text-align: center;
      position: relative;
    }
    .header-logo {
      height: 80px;
      margin-bottom: 15px;
    }
    .header-title {
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .main-content {
      padding: 30px 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: calc(297mm - 200px);
    }
    .certificate-text {
      text-align: center;
      font-size: 18px;
      line-height: 1.8;
      margin: 20px 0;
    }
    .student-name-highlight {
      font-weight: bold;
      font-size: 22px;
      color: #0066CC;
      background: #fffbeb;
      padding: 5px 15px;
      border-radius: 4px;
      border-bottom: 2px solid #0066CC;
      display: inline-block;
      margin: 0 5px;
    }
    .course-logo-section {
      text-align: center;
      margin: 30px 0;
    }
    .course-logo-border {
      display: inline-block;
      border: 4px solid #0066CC;
      border-radius: 8px;
      padding: 20px;
      background: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .course-logo-border img {
      height: 120px;
      object-fit: contain;
    }
    .signature-section {
      margin-top: 40px;
      text-align: center;
    }
    .signature-line {
      width: 320px;
      border-top: 2px solid #1a1a1a;
      margin: 0 auto;
      margin-bottom: 10px;
    }
    .student-info-box {
      background: #0066CC;
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      font-weight: bold;
    }
    .tracking-section {
      margin-top: 30px;
    }
    .tracking-title {
      font-size: 20px;
      font-weight: bold;
      color: #0066CC;
      border-bottom: 2px solid #0066CC;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }
    .tracking-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      background: #f7fafc;
      border: 2px solid #cbd5e0;
      border-radius: 8px;
      padding: 20px;
    }
    .tracking-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #cbd5e0;
      padding-bottom: 10px;
    }
    .tracking-label {
      font-weight: 600;
      color: #4a5568;
    }
    .tracking-value {
      font-weight: bold;
      color: #0066CC;
    }
    .footer-gradient {
      background: linear-gradient(to right, #f7fafc, #edf2f7);
      padding: 25px 40px;
      border-top: 2px solid #0066CC;
      position: absolute;
      bottom: 0;
      width: 100%;
    }
    .footer-contacts {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
    }
    .qr-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .qr-code-border {
      background: white;
      padding: 8px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border: 2px solid #0066CC;
    }
    .copyright {
      text-align: center;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #cbd5e0;
      font-size: 12px;
      color: #718096;
    }
    
    /* Page 2 Styles */
    .back-header {
      padding: 30px 40px;
      border-bottom: 2px solid #0066CC;
      text-align: center;
    }
    .back-logo {
      height: 60px;
      margin-bottom: 15px;
    }
    .company-name {
      font-size: 18px;
      font-weight: bold;
      color: #0066CC;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .back-content {
      padding: 25px 40px;
    }
    .section-box {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      color: #0066CC;
      border-bottom: 2px solid #0066CC;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }
    .instructor-box {
      background: linear-gradient(to right, #eff6ff, #dbeafe);
      border: 2px solid #0066CC;
      border-radius: 8px;
      padding: 25px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .instructor-name {
      font-size: 20px;
      font-weight: bold;
      color: #0066CC;
      text-align: center;
      margin-bottom: 15px;
    }
    .curriculum-list {
      list-style: none;
      padding: 0;
    }
    .curriculum-list li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;
      font-size: 14px;
      color: #2d3748;
      line-height: 1.6;
    }
    .status-box {
      border: 4px solid #0066CC;
      border-radius: 8px;
      padding: 25px;
      background: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .status-title {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      color: #0066CC;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }
    .status-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .status-approved {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .status-icon-approved {
      color: #00CC66;
      font-size: 48px;
      font-weight: bold;
    }
    .status-text-approved {
      font-size: 32px;
      font-weight: bold;
      color: #00CC66;
    }
    .status-icon-reproved {
      color: #CC0000;
      font-size: 48px;
      font-weight: bold;
    }
    .status-text-reproved {
      font-size: 32px;
      font-weight: bold;
      color: #CC0000;
    }
    .grade-box {
      background: #f7fafc;
      padding: 20px 30px;
      border-radius: 8px;
      border: 2px solid #cbd5e0;
      text-align: right;
    }
    .grade-label {
      font-size: 14px;
      color: #718096;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .grade-value {
      font-size: 32px;
      font-weight: bold;
      color: #0066CC;
    }
    .validity-box {
      background: linear-gradient(to right, #fef3c7, #fde68a);
      border-left: 4px solid #FFD700;
      border-radius: 4px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .validity-text {
      font-size: 14px;
      color: #2d3748;
      font-style: italic;
      line-height: 1.6;
    }
    .validity-icon {
      color: #d97706;
      font-weight: bold;
      margin-right: 5px;
    }
    .back-footer {
      background: linear-gradient(to right, #f7fafc, #edf2f7);
      padding: 15px 40px;
      border-top: 2px solid #0066CC;
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: #718096;
    }
  </style>
</head>
<body>
  <!-- Page 1 -->
  <div class="certificate-page">
    <div class="border-decoration"></div>
    
    <!-- Header -->
    <div class="header-gradient">
      <img class="header-logo" src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><text x="50%" y="50%" font-family="Arial" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">EVITARE</text></svg>')}" alt="EVITARE">
      <div class="header-title">Certificado de Conclusão</div>
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
      <div>
        <p class="certificate-text">
          Certificamos que o senhor (a), 
          <span class="student-name-highlight">${data.student_name}</span>, 
          participou e concluiu com êxito o 
          <strong style="text-transform: uppercase;">${data.course_type}</strong> de: 
          <strong style="color: #0066CC; text-transform: uppercase;">${data.course_name}</strong>.
        </p>
        
        <p class="certificate-text">
          Com carga horária de <strong>${data.course_hours}</strong>, conforme
          exigências da <strong>${data.course_norm}</strong>.
        </p>
        
        ${data.course_logo_url ? `
        <div class="course-logo-section">
          <div class="course-logo-border">
            <img src="${data.course_logo_url}" alt="Logo do Curso">
          </div>
        </div>
        ` : ''}
        
        <div class="signature-section">
          <div class="signature-line"></div>
          <p style="font-weight: bold; font-size: 14px;">EVITARE - SEGURANÇA E MEDICINA DO TRABALHO</p>
        </div>
        
        <div class="student-info-box">
          <span>ALUNO: ${data.student_name}</span>
          <span>CNPJ: 28.842.691/0001-90</span>
        </div>
      </div>
      
      <div class="tracking-section">
        <div class="tracking-title">RASTREAMENTO</div>
        <div class="tracking-grid">
          <div class="tracking-item">
            <span class="tracking-label">Arquivo:</span>
            <span class="tracking-value">${data.archive_code}</span>
          </div>
          <div class="tracking-item">
            <span class="tracking-label">Registro:</span>
            <span class="tracking-value">${data.registration_number}</span>
          </div>
          <div class="tracking-item" style="border-bottom: none;">
            <span class="tracking-label">Período de estudos:</span>
            <span class="tracking-value">${courseDate}</span>
          </div>
          <div class="tracking-item" style="border-bottom: none;">
            <span class="tracking-label">Emissão:</span>
            <span class="tracking-value">${data.issue_location}, ${issueDate}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer-gradient">
      <div class="footer-contacts">
        <div style="display: flex; gap: 25px;">
          <div class="contact-item">
            📞 9.9608-5605
          </div>
          <div class="contact-item">
            📧 evitare@outlook.com.br
          </div>
          <div class="contact-item">
            📱 9.9608-5605
          </div>
          <div class="contact-item">
            📷 evitare_turvo
          </div>
        </div>
        
        <div class="qr-section">
          <div style="text-align: right;">
            <p style="font-size: 12px; font-weight: 600; color: #4a5568;">Validar Certificado:</p>
            <p style="font-size: 11px; color: #718096;">Escaneie o QR Code</p>
          </div>
          <div class="qr-code-border">
            <img style="width: 64px; height: 64px;" src="https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(qrCodeUrl)}" alt="QR Code">
          </div>
        </div>
      </div>
      
      <div class="copyright">
        © 2025 EVITARE
      </div>
    </div>
  </div>
  
  <!-- Page 2 -->
  <div class="certificate-page">
    <div class="border-decoration"></div>
    
    <!-- Header -->
    <div class="back-header">
      <img class="back-logo" src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="180" height="60"><text x="50%" y="50%" font-family="Arial" font-size="40" font-weight="bold" fill="#0066CC" text-anchor="middle" dominant-baseline="middle">EVITARE</text></svg>')}" alt="EVITARE">
      <div class="company-name">Assessoria em Segurança e Medicina do Trabalho</div>
    </div>
    
    <!-- Content -->
    <div class="back-content">
      ${data.instructor_name ? `
      <div class="section-box">
        <div class="instructor-box">
          <div class="instructor-name">${data.instructor_name}</div>
          <div style="font-size: 14px;">
            ${instructorCredentialsHtml}
          </div>
        </div>
      </div>
      ` : ''}
      
      ${curriculumHtml ? `
      <div class="section-box">
        <div class="section-title">Conteúdo Programático do Curso:</div>
        <ul class="curriculum-list">
          ${curriculumHtml}
        </ul>
      </div>
      ` : ''}
      
      ${data.student_status ? `
      <div class="section-box">
        <div class="status-box">
          <div class="status-title">SITUAÇÃO DO ALUNO</div>
          <div class="status-content">
            ${data.student_status === 'APROVADO' ? `
            <div class="status-approved">
              <span class="status-icon-approved">✓</span>
              <span class="status-text-approved">APROVADO</span>
            </div>
            ` : `
            <div class="status-approved">
              <span class="status-icon-reproved">✗</span>
              <span class="status-text-reproved">REPROVADO</span>
            </div>
            `}
            <div class="grade-box">
              <div class="grade-label">Aproveitamento</div>
              <div class="grade-value">${data.student_grade || '-'}</div>
            </div>
          </div>
        </div>
      </div>
      ` : ''}
      
      ${data.validity_text ? `
      <div class="section-box">
        <div class="validity-box">
          <p class="validity-text">
            <span class="validity-icon">⚠ IMPORTANTE:</span> ${data.validity_text}
          </p>
        </div>
      </div>
      ` : ''}
    </div>
    
    <!-- Footer -->
    <div class="back-footer">
      © 2025 EVITARE - Todos os direitos reservados
    </div>
  </div>
</body>
</html>
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { certificateId } = await req.json();

    console.log('Generating certificate for ID:', certificateId);

    // Fetch certificate data
    const { data: certificate, error: fetchError } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', certificateId)
      .single();

    if (fetchError || !certificate) {
      console.error('Certificate not found:', fetchError);
      throw new Error('Certificate not found');
    }

    // Generate HTML with both pages
    const html = generateCertificateHTML(certificate);

    const fileName = `${certificate.registration_number}.html`;
    const filePath = `${new Date().getFullYear()}/${fileName}`;
    
    // Upload HTML to storage
    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(filePath, html, {
        contentType: 'text/html',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('certificates')
      .getPublicUrl(filePath);

    const publicUrl = `${supabaseUrl.replace('//', '//gtryoayjcnylkszwyyno.supabase.co')}/certificado/${certificate.registration_number}`;

    // Update certificate with URLs
    const { error: updateError } = await supabase
      .from('certificates')
      .update({
        pdf_url: urlData.publicUrl,
        qr_code_url: publicUrl
      })
      .eq('id', certificateId);

    if (updateError) {
      console.error('Update error:', updateError);
    }

    console.log('Certificate generated successfully:', {
      pdfUrl: urlData.publicUrl,
      qrCodeUrl: publicUrl
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        pdfUrl: urlData.publicUrl,
        qrCodeUrl: publicUrl
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error generating certificate:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

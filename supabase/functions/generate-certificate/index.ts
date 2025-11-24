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
    .map(item => `<li>${item}</li>`)
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
      padding: 20mm;
      position: relative;
      page-break-after: always;
    }
    .certificate-page:last-child {
      page-break-after: auto;
    }
    
    /* Page 1 Styles */
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header img {
      height: 60px;
      margin-bottom: 10px;
    }
    .title {
      font-size: 42px;
      font-weight: bold;
      color: #1e3a8a;
      text-align: center;
      margin: 30px 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .content {
      text-align: center;
      font-size: 16px;
      color: #334155;
      line-height: 1.8;
    }
    .student-name {
      font-size: 32px;
      font-weight: bold;
      color: #0066CC;
      margin: 25px 0;
      text-align: center;
    }
    .course-logo {
      text-align: center;
      margin: 20px 0;
    }
    .course-logo img {
      max-height: 80px;
    }
    .course-details {
      font-size: 18px;
      color: #334155;
      text-align: center;
      margin: 15px 0;
      line-height: 1.6;
    }
    .tracking-box {
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
      margin: 30px auto;
      max-width: 500px;
    }
    .tracking-title {
      font-weight: bold;
      color: #1e3a8a;
      margin-bottom: 10px;
      text-align: center;
    }
    .tracking-info {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px;
      font-size: 14px;
    }
    .tracking-label {
      font-weight: 600;
      color: #475569;
    }
    .signature-section {
      margin-top: 40px;
      text-align: center;
    }
    .signature-line {
      border-top: 2px solid #334155;
      width: 300px;
      margin: 40px auto 10px;
    }
    .signature-text {
      font-size: 14px;
      color: #334155;
    }
    .cnpj {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #64748b;
    }
    .qr-section {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 20px;
      gap: 10px;
    }
    .qr-code {
      width: 80px;
      height: 80px;
    }
    .qr-text {
      font-size: 10px;
      color: #64748b;
      font-weight: 600;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #64748b;
      margin-top: 20px;
    }
    
    /* Page 2 Styles */
    .back-page-header {
      text-align: center;
      margin-bottom: 30px;
    }
    .back-page-header img {
      height: 50px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #1e3a8a;
      margin-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 5px;
    }
    .curriculum-list {
      list-style-type: disc;
      padding-left: 25px;
      font-size: 14px;
      color: #334155;
      line-height: 1.8;
    }
    .instructor-info {
      font-size: 14px;
      color: #334155;
      line-height: 1.6;
    }
    .status-box {
      background: #f0fdf4;
      border: 2px solid #86efac;
      border-radius: 8px;
      padding: 15px;
      margin-top: 10px;
      text-align: center;
    }
    .status-box.reproved {
      background: #fef2f2;
      border-color: #fca5a5;
    }
    .status-text {
      font-size: 24px;
      font-weight: bold;
      color: #16a34a;
    }
    .status-text.reproved {
      color: #dc2626;
    }
    .grade {
      font-size: 18px;
      color: #334155;
      margin-top: 5px;
    }
    .validity-text {
      font-size: 14px;
      color: #334155;
      line-height: 1.6;
      white-space: pre-line;
    }
  </style>
</head>
<body>
  <!-- Page 1 -->
  <div class="certificate-page">
    <div class="header">
      <img src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><text x="50%" y="50%" font-family="Arial" font-size="32" font-weight="bold" fill="#1e3a8a" text-anchor="middle" dominant-baseline="middle">EVITARE</text></svg>')}" alt="EVITARE">
      <div style="font-size: 12px; color: #64748b;">Saúde e Segurança do Trabalho</div>
    </div>
    
    <div class="title">Certificado</div>
    
    <div class="content">
      Certificamos que
    </div>
    
    <div class="student-name">${data.student_name}</div>
    
    ${data.course_logo_url ? `
    <div class="course-logo">
      <img src="${data.course_logo_url}" alt="Logo do Curso">
    </div>
    ` : ''}
    
    <div class="content">
      Concluiu com êxito o curso de
    </div>
    
    <div class="course-details">
      <strong>${data.course_name}</strong><br>
      ${data.course_norm} • ${data.course_hours}<br>
      <span style="font-size: 16px;">${data.course_type}</span>
    </div>
    
    <div class="content">
      Realizado em ${courseDate}
    </div>
    
    <div class="tracking-box">
      <div class="tracking-title">RASTREAMENTO</div>
      <div class="tracking-info">
        <span class="tracking-label">Período:</span>
        <span>${courseDate}</span>
        <span class="tracking-label">Registro:</span>
        <span>${data.registration_number}</span>
        <span class="tracking-label">Arquivo:</span>
        <span>${data.archive_code}</span>
      </div>
    </div>
    
    <div class="signature-section">
      <div class="signature-line"></div>
      <div class="signature-text">
        <strong>EVITARE - Saúde e Segurança do Trabalho</strong><br>
        ${data.issue_location}, ${issueDate}
      </div>
    </div>
    
    <div class="cnpj">CNPJ: 28.842.691/0001-90</div>
    
    <div class="qr-section">
      <div class="qr-text">Valide online</div>
      <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(qrCodeUrl)}" alt="QR Code">
    </div>
    
    <div class="footer">
      📞 (11) 94321-5318 | 📧 contato@evitare.com.br | 📷 @evitarebrasil
    </div>
  </div>
  
  <!-- Page 2 -->
  <div class="certificate-page">
    <div class="back-page-header">
      <img src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="180" height="50"><text x="50%" y="50%" font-family="Arial" font-size="28" font-weight="bold" fill="#1e3a8a" text-anchor="middle" dominant-baseline="middle">EVITARE</text></svg>')}" alt="EVITARE">
    </div>
    
    ${curriculumHtml ? `
    <div class="section">
      <div class="section-title">CONTEÚDO PROGRAMÁTICO</div>
      <ul class="curriculum-list">
        ${curriculumHtml}
      </ul>
    </div>
    ` : ''}
    
    ${data.instructor_name ? `
    <div class="section">
      <div class="section-title">INSTRUTOR</div>
      <div class="instructor-info">
        <strong>${data.instructor_name}</strong><br>
        ${data.instructor_credentials || ''}
      </div>
    </div>
    ` : ''}
    
    ${data.student_status ? `
    <div class="section">
      <div class="section-title">APROVEITAMENTO</div>
      <div class="status-box ${data.student_status === 'REPROVADO' ? 'reproved' : ''}">
        <div class="status-text ${data.student_status === 'REPROVADO' ? 'reproved' : ''}">
          ${data.student_status === 'REPROVADO' ? '✗ REPROVADO' : '✓ APROVADO'}
        </div>
        ${data.student_grade ? `<div class="grade">Nota: ${data.student_grade}</div>` : ''}
      </div>
    </div>
    ` : ''}
    
    ${data.validity_text ? `
    <div class="section">
      <div class="section-title">VALIDADE</div>
      <div class="validity-text">${data.validity_text}</div>
    </div>
    ` : ''}
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

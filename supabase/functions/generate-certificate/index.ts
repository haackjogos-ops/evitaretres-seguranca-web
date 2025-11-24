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

function generateCertificateHTML(data: CertificateData): string {
  const validationUrl = `${Deno.env.get('SITE_URL') || 'https://evitare.lovable.app'}/certificado/${data.registration_number}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color: #333333;
    }
    .certificate-page {
      width: 210mm;
      height: 297mm;
      page-break-after: always;
      position: relative;
      background: white;
      display: flex;
      flex-direction: column;
    }
    .certificate-page:last-child {
      page-break-after: auto;
    }
    .header-green {
      background: #E8F5E9;
      padding: 16px 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .header-green img {
      height: 48px;
    }
    .header-green .cert-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
    }
    .main-content {
      flex: 1;
      padding: 24px 32px;
      display: flex;
      gap: 32px;
    }
    .left-column {
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .course-logo-large {
      max-width: 100%;
      max-height: 400px;
      object-fit: contain;
    }
    .course-logo-placeholder {
      text-align: center;
    }
    .course-logo-placeholder .nr-number {
      font-size: 96px;
      font-weight: bold;
      color: #2196F3;
      margin-bottom: 16px;
    }
    .course-logo-placeholder .course-name {
      font-size: 24px;
      font-weight: 600;
      color: #333333;
    }
    .right-column {
      width: 40%;
      display: flex;
      flex-direction: column;
    }
    .tracking-box {
      background: white;
      border: 2px solid #4CAF50;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .tracking-box h3 {
      font-size: 14px;
      font-weight: bold;
      color: #4CAF50;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    .tracking-box .field {
      margin-bottom: 8px;
      font-size: 12px;
    }
    .tracking-box .field-label {
      font-weight: 600;
      color: #666666;
    }
    .tracking-box .field-value {
      color: #333333;
    }
    .cert-text {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .student-name-box {
      background: #E8F5E9;
      border-left: 4px solid #4CAF50;
      padding: 12px;
      border-radius: 4px;
      margin: 16px 0;
    }
    .student-name-box p {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      color: #333333;
    }
    .footer-simple {
      background: #F5F5F5;
      padding: 16px 32px;
      text-align: center;
    }
    .footer-contacts {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 32px;
      margin-bottom: 8px;
    }
    .footer-contacts span {
      font-size: 12px;
      font-weight: 600;
      color: #666666;
    }
    .footer-copyright {
      font-size: 10px;
      color: #999999;
      margin-top: 8px;
    }
    /* Page 2 styles */
    .header-curriculum {
      background: #E8F5E9;
      padding: 32px 48px;
      text-align: center;
    }
    .header-curriculum img {
      height: 64px;
      margin-bottom: 16px;
    }
    .header-curriculum h2 {
      font-size: 20px;
      font-weight: bold;
      color: #4CAF50;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .page2-content {
      flex: 1;
      padding: 32px 48px;
      display: flex;
      flex-direction: column;
    }
    .instructor-section {
      margin-bottom: 32px;
    }
    .instructor-section h3 {
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 12px;
    }
    .instructor-section p {
      font-size: 14px;
      color: #666666;
      margin-bottom: 4px;
    }
    .curriculum-list {
      flex: 1;
      margin-bottom: 32px;
    }
    .curriculum-list ul {
      list-style: none;
      padding: 0;
    }
    .curriculum-list li {
      font-size: 14px;
      color: #333333;
      line-height: 1.6;
      margin-bottom: 8px;
      padding-left: 16px;
      position: relative;
    }
    .curriculum-list li:before {
      content: "•";
      color: #4CAF50;
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    .status-section {
      border-top: 2px solid #E0E0E0;
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .status-section .status-label {
      font-weight: 600;
      color: #666666;
      margin-right: 16px;
    }
    .status-section .status-value {
      font-weight: bold;
      font-size: 18px;
    }
    .status-approved {
      color: #4CAF50;
    }
    .status-failed {
      color: #CC0000;
    }
    .validity-box {
      background: #FFF9C4;
      border-left: 4px solid #FDD835;
      border-radius: 4px;
      padding: 16px;
    }
    .validity-box p {
      font-size: 14px;
      color: #333333;
      line-height: 1.6;
    }
    .validity-box .important {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <!-- Page 1: Front -->
  <div class="certificate-page">
    <!-- Header -->
    <div class="header-green">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 32px;">🏢</span>
        <span style="font-weight: 600; font-size: 16px;">EVITARE</span>
      </div>
      <div class="cert-label">
        <span style="font-size: 24px;">📜</span>
        <span>CERTIFICADO</span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Left Column: Course Logo -->
      <div class="left-column">
        ${data.course_logo_url ? `
          <img src="${data.course_logo_url}" alt="${data.course_name}" class="course-logo-large" />
        ` : `
          <div class="course-logo-placeholder">
            <div class="nr-number">NR 35</div>
            <div class="course-name">${data.course_name}</div>
          </div>
        `}
      </div>

      <!-- Right Column: Tracking & Text -->
      <div class="right-column">
        <!-- Tracking Box -->
        <div class="tracking-box">
          <h3>Rastreamento</h3>
          <div class="field">
            <span class="field-label">Arquivo:</span>
            <p class="field-value">${data.archive_code}</p>
          </div>
          <div class="field">
            <span class="field-label">Registro:</span>
            <p class="field-value">${data.registration_number}</p>
          </div>
          <div class="field">
            <span class="field-label">Período de Estudos:</span>
            <p class="field-value">${data.course_date}</p>
          </div>
          <div class="field">
            <span class="field-label">Emissão:</span>
            <p class="field-value">${data.issue_date}</p>
          </div>
          <div class="field">
            <span class="field-label">Local:</span>
            <p class="field-value">${data.issue_location}</p>
          </div>
        </div>

        <!-- Certificate Text -->
        <div>
          <p class="cert-text">Certificamos que</p>
          
          <div class="student-name-box">
            <p>${data.student_name}</p>
          </div>

          <p class="cert-text">
            Concluiu com aproveitamento o curso de <strong>${data.course_name}</strong>, 
            conforme <strong>${data.course_norm}</strong>, com carga horária de <strong>${data.course_hours}</strong>, 
            do tipo <strong>${data.course_type}</strong>.
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-simple">
      <div class="footer-contacts">
        <span>📞 (19) 3454-6343</span>
        <span>✉️ evitare@evitare.com.br</span>
        <span>📱 (19) 99999-9999</span>
        <span>📷 @evitare</span>
      </div>
      <p class="footer-copyright">© 2025 EVITARE - Todos os direitos reservados</p>
    </div>
  </div>

  <!-- Page 2: Back -->
  <div class="certificate-page">
    <!-- Header -->
    <div class="header-curriculum">
      <span style="font-size: 64px;">🏢</span>
      <h2>Grade Curricular</h2>
    </div>

    <div class="page2-content">
      <!-- Instructor Info -->
      <div class="instructor-section">
        <h3>${data.instructor_name || 'Instrutor'}</h3>
        ${(data.instructor_credentials || '').split('\n').map(line => {
          const isTechnical = line.includes('TÉCNICO') || line.includes('BOMBEIRO') || line.includes('CIVIL');
          return `<p>${isTechnical ? '• ' : ''}${line}</p>`;
        }).join('')}
      </div>

      <!-- Course Content -->
      <div class="curriculum-list">
        <ul>
          ${(data.course_curriculum || []).map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <!-- Student Status -->
      <div class="status-section">
        <div style="display: flex; align-items: center;">
          <span class="status-label">SITUAÇÃO:</span>
          <span class="status-value ${data.student_status === 'APROVADO' ? 'status-approved' : 'status-failed'}">
            ${data.student_status || 'APROVADO'}
          </span>
        </div>
        <div style="display: flex; align-items: center;">
          <span class="status-label">APROVEITAMENTO:</span>
          <span class="status-value" style="color: #333333;">${data.student_grade || 'N/A'}</span>
        </div>
      </div>

      <!-- Validity Text -->
      <div class="validity-box">
        <p>
          <span class="important">⚠ IMPORTANTE:</span> ${data.validity_text || 'Este certificado possui validade conforme legislação vigente.'}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-simple">
      <p class="footer-copyright">© 2025 EVITARE - Todos os direitos reservados</p>
    </div>
  </div>
</body>
</html>
  `;
}

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

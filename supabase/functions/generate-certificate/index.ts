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
}

const generateCertificateHTML = (data: CertificateData): string => {
  const courseDate = new Date(data.course_date).toLocaleDateString('pt-BR');
  const issueDate = new Date(data.issue_date).toLocaleDateString('pt-BR');
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Arial', sans-serif;
      width: 297mm;
      height: 210mm;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .certificate {
      width: 280mm;
      height: 195mm;
      background: white;
      border: 8px solid #fbbf24;
      border-radius: 20px;
      padding: 30px;
      position: relative;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #1e3a8a;
      margin-bottom: 5px;
    }
    .subtitle {
      font-size: 12px;
      color: #64748b;
    }
    .title {
      text-align: center;
      font-size: 48px;
      font-weight: bold;
      color: #1e3a8a;
      margin: 20px 0;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    .course-type {
      text-align: center;
      font-size: 24px;
      color: #3b82f6;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .content {
      text-align: center;
      font-size: 16px;
      line-height: 1.8;
      color: #334155;
      margin: 20px 0;
    }
    .student-name {
      font-size: 28px;
      font-weight: bold;
      color: #1e3a8a;
      margin: 15px 0;
      text-decoration: underline;
    }
    .course-details {
      font-size: 18px;
      color: #334155;
      margin: 10px 0;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
    }
    .signature-block {
      text-align: center;
      flex: 1;
    }
    .signature-line {
      border-top: 2px solid #334155;
      width: 200px;
      margin: 40px auto 5px;
    }
    .signature-name {
      font-size: 14px;
      font-weight: bold;
      color: #334155;
    }
    .signature-role {
      font-size: 12px;
      color: #64748b;
    }
    .metadata {
      font-size: 11px;
      color: #64748b;
      text-align: right;
    }
    .watermark {
      position: absolute;
      bottom: 20px;
      left: 20px;
      font-size: 10px;
      color: #cbd5e1;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">EVITARE</div>
      <div class="subtitle">Saúde e Segurança do Trabalho</div>
    </div>
    
    <div class="title">Certificado</div>
    
    <div class="course-type">${data.course_type}</div>
    
    <div class="content">
      Certificamos que
    </div>
    
    <div class="student-name">${data.student_name}</div>
    
    <div class="content">
      Participou do curso de
    </div>
    
    <div class="course-details">
      <strong>${data.course_name}</strong><br>
      ${data.course_norm} • ${data.course_hours}
    </div>
    
    <div class="content">
      Realizado em ${courseDate}
    </div>
    
    <div class="footer">
      <div class="signature-block">
        <div class="signature-line"></div>
        <div class="signature-name">Instrutor Responsável</div>
        <div class="signature-role">EVITARE - ${data.course_norm}</div>
      </div>
      
      <div class="metadata">
        Registro: ${data.registration_number}<br>
        Arquivo: ${data.archive_code}<br>
        ${data.issue_location}, ${issueDate}
      </div>
    </div>
    
    <div class="watermark">
      Certificado gerado digitalmente • Valide em: evitare.com.br/certificado/${data.registration_number}
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

    // Fetch certificate data
    const { data: certificate, error: fetchError } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', certificateId)
      .single();

    if (fetchError || !certificate) {
      throw new Error('Certificate not found');
    }

    // Generate HTML
    const html = generateCertificateHTML(certificate);

    // For now, return HTML directly
    // In production, you would use Puppeteer to convert to PDF
    // But that requires additional setup and dependencies
    
    const fileName = `${certificate.registration_number}.html`;
    const filePath = `${new Date().getFullYear()}/${fileName}`;
    
    // Upload HTML to storage (as a temporary solution)
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

    const publicUrl = `${supabaseUrl}/certificado/${certificate.registration_number}`;

    // Update certificate with URLs
    await supabase
      .from('certificates')
      .update({
        pdf_url: urlData.publicUrl,
        qr_code_url: publicUrl
      })
      .eq('id', certificateId);

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
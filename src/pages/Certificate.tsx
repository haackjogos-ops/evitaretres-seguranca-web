import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, Shield, XCircle, Download, CheckCircle2, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import CertificateTemplate from "@/components/CertificateTemplate";
import { CertificateBackPage } from "@/components/CertificateBackPage";
import html2pdf from "html2pdf.js";
import { useToast } from "@/hooks/use-toast";

const Certificate = () => {
  const { registrationNumber } = useParams();
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .eq("registration_number", registrationNumber)
          .eq("is_active", true)
          .single();

        if (error) throw error;
        setCertificate(data);
      } catch (err: any) {
        setError("Certificado não encontrado ou inválido");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (registrationNumber) {
      fetchCertificate();
    }
  }, [registrationNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p>Carregando certificado...</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!certificate) return;
    
    setDownloadingPdf(true);
    
    try {
      toast({
        title: "Gerando PDF...",
        description: "Por favor aguarde, isso pode levar alguns segundos.",
      });

      // Get the certificate content
      const element = document.getElementById('certificate-content');
      
      if (!element) {
        throw new Error('Elemento do certificado não encontrado');
      }

      // Configure html2pdf options
      const opt = {
        margin: 0,
        filename: `Certificado-${certificate.registration_number}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as const
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Generate PDF
      await html2pdf().set(opt).from(element).save();

      toast({
        title: "PDF baixado com sucesso!",
        description: "Verifique sua pasta de downloads.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Tente usar o botão Imprimir e salve como PDF.",
        variant: "destructive",
      });
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center">
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Certificado Não Encontrado</h1>
              <p className="text-muted-foreground">
                O certificado com número de registro <strong>{registrationNumber}</strong> não foi encontrado ou está inativo.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Validation Badge and Actions - Hidden on print */}
          <div className="flex items-center justify-between gap-4 print:hidden">
            <Badge variant="default" className="bg-green-500 hover:bg-green-600 px-4 py-2 text-base">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Certificado Válido
            </Badge>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleDownload} 
                size="lg" 
                className="gap-2"
                disabled={downloadingPdf}
              >
                {downloadingPdf ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Baixar PDF
                  </>
                )}
              </Button>
              <Button onClick={handlePrint} variant="outline" size="lg" className="gap-2">
                <Printer className="h-5 w-5" />
                Imprimir
              </Button>
            </div>
          </div>

          {/* Certificate Display - 2 Pages */}
          <div id="certificate-content" className="print:mt-0 space-y-0">
            {/* Page 1 */}
            <CertificateTemplate
              studentName={certificate.student_name}
              courseName={certificate.course_name}
              courseNorm={certificate.course_norm}
              courseType={certificate.course_type}
              courseHours={certificate.course_hours}
              courseDate={certificate.course_date}
              issueDate={certificate.issue_date}
              issueLocation={certificate.issue_location}
              registrationNumber={certificate.registration_number}
              archiveCode={certificate.archive_code}
              courseLogo={certificate.course_logo_url}
            />
            
            {/* Page Break */}
            <div className="page-break" />
            
            {/* Page 2 */}
            <CertificateBackPage
              studentName={certificate.student_name}
              courseName={certificate.course_name}
              instructorName={certificate.instructor_name || 'ISMAEL S. FERREIRA'}
              instructorCredentials={certificate.instructor_credentials || 'Técnico em Segurança do Trabalho - Reg. MTESC N° 07.0.00008-5/SC\nBombeiro Profissional Civil - CBM-SC\nInstrutores Credenciados'}
              courseCurriculum={certificate.course_curriculum || []}
              studentStatus={certificate.student_status || 'APROVADO'}
              studentGrade={certificate.student_grade || '70% ACIMA'}
              validityText={certificate.validity_text || 'Este certificado tem validade de 02 (DOIS ANOS) contado a partir da data de emissão, ou ocorrendo sua revisão, o que prevalecer (conforme item 34.3.3 da NR-34).'}
            />
          </div>

          {/* Certificate Information - Hidden on print */}
          <Card className="print:hidden">
            <CardHeader>
              <CardTitle className="text-2xl">Informações do Certificado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Aluno</p>
                  <p className="font-semibold text-lg">{certificate.student_name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Número de Registro</p>
                  <p className="font-semibold">{certificate.registration_number}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Curso</p>
                  <p className="font-semibold">{certificate.course_name}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Norma</p>
                  <p className="font-semibold">{certificate.course_norm}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-semibold">{certificate.course_type}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Carga Horária</p>
                  <p className="font-semibold">{certificate.course_hours}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Data do Curso</p>
                  <p className="font-semibold">
                    {new Date(certificate.course_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Data de Emissão</p>
                  <p className="font-semibold">
                    {new Date(certificate.issue_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Local de Emissão</p>
                  <p className="font-semibold">{certificate.issue_location}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Código de Arquivo</p>
                  <p className="font-semibold">{certificate.archive_code}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions - Hidden on print */}
          <Card className="print:hidden">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                💡 Instruções para Download
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">📄 Para salvar como PDF:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Clique no botão <strong>"Baixar PDF"</strong> acima</li>
                  <li>Na janela de impressão, selecione <strong>"Salvar como PDF"</strong></li>
                  <li>Escolha onde deseja salvar e clique em <strong>"Salvar"</strong></li>
                </ol>
              </div>
              
              <div className="pt-3 border-t border-border">
                <h4 className="font-semibold text-sm mb-2">✅ Validação do certificado:</h4>
                <p className="text-sm text-muted-foreground">
                  Use o <strong>QR Code</strong> no certificado para validar sua autenticidade a qualquer momento. 
                  Basta escanear com a câmera do seu celular.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .certificate-container {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 20mm !important;
          }
          
          .certificate-page {
            box-shadow: none !important;
            margin: 0 !important;
          }
          
          .page-break {
            page-break-after: always;
            break-after: page;
            height: 0;
            margin: 0;
            padding: 0;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Certificate;
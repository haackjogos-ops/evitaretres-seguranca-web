import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, Shield, XCircle } from "lucide-react";
import Header from "@/components/Header";
import CertificateTemplate from "@/components/CertificateTemplate";
import { CertificateBackPage } from "@/components/CertificateBackPage";

const Certificate = () => {
  const { registrationNumber } = useParams();
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          {/* Validation Badge - Hidden on print */}
          <Card className="border-green-500 bg-green-50 dark:bg-green-950 print:hidden">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <h2 className="font-bold text-green-900 dark:text-green-100">Certificado Válido</h2>
                  <p className="text-sm text-green-700 dark:text-green-200">
                    Este certificado foi emitido pela EVITARE e é autêntico
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Print Button - Hidden on print */}
          <div className="flex justify-center gap-4 print:hidden">
            <Button onClick={handlePrint} size="lg" className="gap-2">
              <Printer className="h-5 w-5" />
              Imprimir / Salvar como PDF
            </Button>
          </div>

          {/* Certificate Display - 2 Pages */}
          <div className="print:mt-0 space-y-0">
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
          <Card className="print:hidden bg-muted">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                💡 <strong>Dica:</strong> Use o botão acima para imprimir ou salvar como PDF. 
                No diálogo de impressão, selecione "Salvar como PDF" como destino.
              </p>
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
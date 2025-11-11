import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle, XCircle, Shield } from "lucide-react";
import Header from "@/components/Header";

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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Validation Badge */}
          <Card className="border-green-500 bg-green-50 dark:bg-green-950">
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

          {/* Certificate Information */}
          <Card>
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

              {certificate.pdf_url && (
                <div className="pt-4 border-t">
                  <Button onClick={() => window.open(certificate.pdf_url, '_blank')} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Certificado PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certificate Preview */}
          {certificate.pdf_url && (
            <Card>
              <CardHeader>
                <CardTitle>Visualização do Certificado</CardTitle>
              </CardHeader>
              <CardContent>
                <iframe
                  src={certificate.pdf_url}
                  className="w-full h-[600px] border rounded"
                  title="Certificado"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificate;
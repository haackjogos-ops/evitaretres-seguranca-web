import certificateLogo from "@/assets/certificate-logo.png";
import certificateIcon1 from "@/assets/certificate-icon-1.png";
import certificateIcon2 from "@/assets/certificate-icon-2.png";
import { Mail, Phone, Instagram } from "lucide-react";

interface CertificateTemplateProps {
  studentName: string;
  courseName: string;
  courseNorm: string;
  courseType: string;
  courseHours: string;
  courseDate: string;
  issueDate: string;
  issueLocation: string;
  registrationNumber: string;
  archiveCode: string;
}

const CertificateTemplate = ({
  studentName,
  courseName,
  courseNorm,
  courseType,
  courseHours,
  courseDate,
  issueDate,
  issueLocation,
  registrationNumber,
  archiveCode,
}: CertificateTemplateProps) => {
  return (
    <div className="certificate-container bg-white text-black p-8 max-w-[210mm] min-h-[297mm] mx-auto shadow-2xl print:shadow-none relative">
      {/* Decorative Icons - Top Left and Right */}
      <div className="absolute top-4 left-4 opacity-20">
        <img src={certificateIcon1} alt="" className="w-16 h-16" />
      </div>
      <div className="absolute top-4 right-4 opacity-20">
        <img src={certificateIcon2} alt="" className="w-16 h-16" />
      </div>

      {/* Header with Logo */}
      <div className="text-center mb-6 pt-4">
        <img 
          src={certificateLogo} 
          alt="EVITARE" 
          className="h-20 mx-auto mb-2"
        />
      </div>

      {/* Certificate Title */}
      <div className="text-center mb-8">
        <div className="inline-block border-b-2 border-primary pb-2 px-8">
          <h2 className="text-2xl font-bold text-foreground tracking-wide">
            Certificado de Conclusão
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 text-center mb-8 px-8">
        <p className="text-base leading-relaxed text-foreground">
          Certificamos que o senhor (a),{" "}
          <span className="font-bold text-foreground text-lg">{studentName}</span>, 
          participou e concluiu com êxito o <span className="font-bold">{courseType}</span> de:
        </p>
        
        <div className="py-4">
          <p className="text-xl font-bold text-foreground uppercase">
            {courseName}
          </p>
        </div>

        <p className="text-base leading-relaxed text-foreground">
          Com carga horária de <span className="font-bold">{courseHours}</span>, conforme exigências da{" "}
          <span className="font-bold">{courseNorm}</span>.
        </p>
      </div>

      {/* Signature Line */}
      <div className="text-center my-12 px-16">
        <div className="border-t-2 border-gray-800 pt-2 inline-block min-w-[300px]">
          <p className="text-sm font-bold text-foreground uppercase">
            EVITARE - Segurança e Medicina do Trabalho
          </p>
        </div>
      </div>

      {/* Student Name Line (crossed out in original) */}
      <div className="text-center mb-8">
        <p className="text-sm text-foreground">
          ALUNO: <span className="font-bold">{studentName}</span>
        </p>
      </div>

      {/* CNPJ */}
      <div className="text-center mb-6">
        <p className="text-sm font-semibold text-foreground">
          CNPJ: 28.842.691/0001-90
        </p>
      </div>

      {/* Tracking Section */}
      <div className="bg-muted/30 border-2 border-primary/20 rounded-lg p-6 mb-8">
        <h3 className="text-center text-lg font-bold text-primary mb-4 tracking-wider">
          RASTREAMENTO
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Período de estudos:</p>
            <p className="font-semibold text-foreground">
              {new Date(courseDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Arquivo:</p>
            <p className="font-semibold text-foreground">{archiveCode}</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Registro:</p>
            <p className="font-semibold text-foreground">{registrationNumber}</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Emissão:</p>
            <p className="font-semibold text-foreground">
              {issueLocation}, {new Date(issueDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Contact Info */}
      <div className="border-t border-border pt-4 mt-8">
        <div className="flex justify-center items-center gap-6 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>9.9608-5605</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            <span>evitare@outlook.com.br</span>
          </div>
          <div className="flex items-center gap-1">
            <Instagram className="w-3 h-3" />
            <span>evitare_turvo</span>
          </div>
        </div>
        
        <p className="text-center text-xs text-muted-foreground">
          © 2025 EVITARE
        </p>
      </div>

      {/* Validation Footer */}
      <div className="text-center mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground">
        <p>Certificado válido e autêntico. Verifique em: evitare.com.br/certificado/{registrationNumber}</p>
      </div>
    </div>
  );
};

export default CertificateTemplate;

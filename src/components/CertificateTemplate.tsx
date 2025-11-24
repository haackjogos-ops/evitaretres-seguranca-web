import { QRCodeSVG } from "qrcode.react";
import evitareLogo from "@/assets/evitare-logo.png";
import certificateLogo from "@/assets/certificate-logo.png";

interface CertificateTemplateProps {
  studentName: string;
  courseName: string;
  courseType: string;
  courseHours: string;
  courseNorm: string;
  courseDate: string;
  issueDate: string;
  issueLocation: string;
  registrationNumber: string;
  archiveCode: string;
  courseLogo?: string;
}

const CertificateTemplate = ({
  studentName,
  courseName,
  courseType,
  courseHours,
  courseNorm,
  courseDate,
  issueDate,
  issueLocation,
  registrationNumber,
  archiveCode,
  courseLogo,
}: CertificateTemplateProps) => {
  const validationUrl = `${window.location.origin}/certificado/${registrationNumber}`;

  return (
    <div className="w-[210mm] h-[297mm] bg-white relative overflow-hidden flex flex-col certificate-page">
      {/* Header with light green background */}
      <div className="relative px-8 py-4 bg-[#E8F5E9]">
        <div className="flex items-center justify-center gap-3">
          <img src={evitareLogo} alt="Evitare" className="h-12" />
          <div className="flex items-center gap-2">
            <img src={certificateLogo} alt="Certificado" className="h-8" />
            <span className="text-sm font-semibold text-[#333333]">CERTIFICADO</span>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 px-8 py-6 flex gap-8">
        {/* Left column: Large course logo */}
        <div className="w-[60%] flex items-center justify-center">
          {courseLogo ? (
            <img 
              src={courseLogo} 
              alt={courseName}
              className="max-w-full max-h-[400px] object-contain"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center">
                <div className="text-8xl font-bold text-[#2196F3] mb-4">NR 35</div>
                <div className="text-2xl font-semibold text-[#333333]">{courseName}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Tracking box and content */}
        <div className="w-[40%] flex flex-col">
          {/* Compact tracking box */}
          <div className="bg-white border-2 border-[#4CAF50] rounded-lg p-4 mb-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#4CAF50] mb-3 uppercase">Rastreamento</h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-[#666666]">Arquivo:</span>
                <p className="text-[#333333]">{archiveCode}</p>
              </div>
              <div>
                <span className="font-semibold text-[#666666]">Registro:</span>
                <p className="text-[#333333]">{registrationNumber}</p>
              </div>
              <div>
                <span className="font-semibold text-[#666666]">Período de Estudos:</span>
                <p className="text-[#333333]">{courseDate}</p>
              </div>
              <div>
                <span className="font-semibold text-[#666666]">Emissão:</span>
                <p className="text-[#333333]">{issueDate}</p>
              </div>
              <div>
                <span className="font-semibold text-[#666666]">Local:</span>
                <p className="text-[#333333]">{issueLocation}</p>
              </div>
            </div>
          </div>

          {/* Certificate text */}
          <div className="space-y-4">
            <p className="text-sm text-[#333333] leading-relaxed">
              Certificamos que
            </p>
            
            <div className="bg-[#E8F5E9] border-l-4 border-[#4CAF50] p-3 rounded">
              <p className="text-lg font-bold text-[#333333] text-center uppercase">
                {studentName}
              </p>
            </div>

            <p className="text-sm text-[#333333] leading-relaxed">
              Concluiu com aproveitamento o curso de <strong>{courseName}</strong>, 
              conforme <strong>{courseNorm}</strong>, com carga horária de <strong>{courseHours}</strong>, 
              do tipo <strong>{courseType}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Footer with simple contact info */}
      <div className="relative bg-[#F5F5F5] px-8 py-4">
        <div className="flex justify-center items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#666666]">📞 (19) 3454-6343</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#666666]">✉️ evitare@evitare.com.br</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#666666]">📱 (19) 99999-9999</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#666666]">📷 @evitare</span>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-[#999999]">© 2025 EVITARE - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;

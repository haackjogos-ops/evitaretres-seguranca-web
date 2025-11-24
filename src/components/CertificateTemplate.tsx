import { QRCodeSVG } from "qrcode.react";
import evitareLogo from "@/assets/evitare-logo.png";
import certLogo from "@/assets/cert-logo.png";
import certIconPhone from "@/assets/cert-icon-phone.png";
import certIconEmail from "@/assets/cert-icon-email.png";
import certIconWhatsapp from "@/assets/cert-icon-whatsapp.png";
import certIconInstagram from "@/assets/cert-icon-instagram.png";

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
      {/* Decorative border */}
      <div className="absolute inset-4 border-[3px] border-[#0066CC] rounded-lg pointer-events-none"></div>
      
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-r from-[#0066CC] to-[#0088FF] text-white px-12 py-8 text-center">
        <div className="flex justify-center mb-4">
          <img src={certLogo} alt="Evitare Logo" className="h-20" />
        </div>
        <h1 className="text-3xl font-bold tracking-wider">Certificado de Conclusão</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 px-16 py-8 flex flex-col justify-between">
        {/* Certificate text */}
        <div className="space-y-6">
          <p className="text-center text-lg leading-relaxed">
            Certificamos que o senhor (a),{" "}
            <span className="font-bold text-xl text-[#0066CC] inline-block bg-yellow-50 px-3 py-1 rounded border-b-2 border-[#0066CC]">
              {studentName}
            </span>
            , participou e concluiu com êxito o{" "}
            <span className="font-bold uppercase">{courseType}</span> de:{" "}
            <span className="font-bold text-[#0066CC] uppercase">{courseName}</span>.
          </p>

          <p className="text-center text-base">
            Com carga horária de <span className="font-bold">{courseHours}</span>, conforme
            exigências da <span className="font-bold">{courseNorm}</span>.
          </p>

          {/* Course Logo - Large and Centered */}
          {courseLogo && (
            <div className="flex justify-center my-8">
              <div className="border-4 border-[#0066CC] rounded-lg p-6 bg-white shadow-lg">
                <img
                  src={courseLogo}
                  alt="Logo do Curso"
                  className="h-32 w-auto object-contain"
                />
              </div>
            </div>
          )}

          {/* Signature line */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="w-80 border-t-2 border-gray-800"></div>
            <div className="text-center">
              <p className="font-bold text-sm">EVITARE - SEGURANÇA E MEDICINA DO TRABALHO</p>
            </div>
          </div>

          {/* Student info box */}
          <div className="bg-[#0066CC] text-white px-6 py-3 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-bold">ALUNO: {studentName}</span>
              <span className="font-bold">CNPJ: 28.842.691/0001-90</span>
            </div>
          </div>
        </div>

        {/* Tracking table */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-3 text-[#0066CC] border-b-2 border-[#0066CC] pb-1">
            RASTREAMENTO
          </h3>
          <div className="grid grid-cols-2 gap-3 bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-semibold">Arquivo:</span>
              <span className="font-bold text-[#0066CC]">{archiveCode}</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-semibold">Registro:</span>
              <span className="font-bold text-[#0066CC]">{registrationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Período de estudos:</span>
              <span className="font-bold text-[#0066CC]">{courseDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Emissão:</span>
              <span className="font-bold text-[#0066CC]">
                {issueLocation}, {issueDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with contacts and QR code */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-12 py-6 border-t-2 border-[#0066CC]">
        <div className="flex items-center justify-between">
          {/* Contact icons */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src={certIconPhone} alt="Telefone" className="h-6 w-6" />
              <span className="text-sm font-semibold">9.9608-5605</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={certIconEmail} alt="Email" className="h-6 w-6" />
              <span className="text-sm font-semibold">evitare@outlook.com.br</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={certIconWhatsapp} alt="WhatsApp" className="h-6 w-6" />
              <span className="text-sm font-semibold">9.9608-5605</span>
            </div>
            <div className="flex items-center gap-2">
              <img src={certIconInstagram} alt="Instagram" className="h-6 w-6" />
              <span className="text-sm font-semibold">evitare_turvo</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-700">Validar Certificado:</p>
              <p className="text-xs text-gray-600">Escaneie o QR Code</p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-md border-2 border-[#0066CC]">
              <QRCodeSVG value={validationUrl} size={64} level="H" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-3 pt-3 border-t border-gray-300">
          <p className="text-xs text-gray-600">© 2025 EVITARE</p>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;

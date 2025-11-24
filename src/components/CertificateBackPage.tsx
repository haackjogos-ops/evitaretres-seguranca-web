import { CheckCircle2, XCircle } from "lucide-react";
import evitareLogo from "@/assets/evitare-logo.png";

interface CertificateBackPageProps {
  studentName: string;
  courseName: string;
  instructorName: string;
  instructorCredentials: string;
  courseCurriculum: string[];
  studentStatus: 'APROVADO' | 'REPROVADO';
  studentGrade: string;
  validityText: string;
}

export const CertificateBackPage = ({
  studentName,
  courseName,
  instructorName,
  instructorCredentials,
  courseCurriculum = [],
  studentStatus = 'APROVADO',
  studentGrade,
  validityText,
}: CertificateBackPageProps) => {
  return (
    <div className="w-[210mm] h-[297mm] bg-white relative overflow-hidden flex flex-col certificate-page">
      {/* Decorative border */}
      <div className="absolute inset-4 border-[3px] border-[#0066CC] rounded-lg pointer-events-none"></div>

      {/* Header with logo and company name */}
      <div className="px-12 py-8 border-b-2 border-[#0066CC]">
        <div className="flex items-center justify-center gap-4 mb-4">
          <img src={evitareLogo} alt="Evitare" className="h-16" />
        </div>
        <h2 className="text-center text-lg font-bold text-[#0066CC] uppercase tracking-wide">
          Assessoria em Segurança e Medicina do Trabalho
        </h2>
      </div>

      <div className="flex-1 px-12 py-6 flex flex-col">
        {/* Instructor Info */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-[#0066CC] rounded-lg p-6 mb-6 shadow-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-[#0066CC] mb-2">{instructorName}</h3>
          </div>
          <div className="text-sm text-gray-800 space-y-1">
            {instructorCredentials.split('\n').map((line, index) => (
              <p key={index} className="font-semibold">
                {line.includes('TÉCNICO') || line.includes('BOMBEIRO') || line.includes('CIVIL') ? (
                  <span className="text-[#0066CC]">• {line}</span>
                ) : (
                  <span className="text-gray-700">{line}</span>
                )}
              </p>
            ))}
          </div>
        </div>

        {/* Course Content */}
        <div className="mb-6 flex-1">
          <h3 className="text-xl font-bold mb-4 text-[#0066CC] border-b-2 border-[#0066CC] pb-2">
            Conteúdo Programático do Curso:
          </h3>
          <ul className="space-y-2 text-sm">
            {courseCurriculum.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-800">
                <span className="text-[#0066CC] font-bold text-lg">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Student Status */}
        <div className="border-4 border-[#0066CC] rounded-lg p-6 mb-6 bg-white shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-center text-[#0066CC] uppercase tracking-wide">
            SITUAÇÃO DO ALUNO
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {studentStatus === 'APROVADO' ? (
                <>
                  <CheckCircle2 className="w-12 h-12 text-[#00CC66]" strokeWidth={3} />
                  <span className="text-3xl font-bold text-[#00CC66]">APROVADO</span>
                </>
              ) : (
                <>
                  <XCircle className="w-12 h-12 text-[#CC0000]" strokeWidth={3} />
                  <span className="text-3xl font-bold text-[#CC0000]">REPROVADO</span>
                </>
              )}
            </div>
            <div className="text-right bg-gray-50 px-6 py-4 rounded-lg border-2 border-gray-300">
              <p className="text-sm text-gray-600 font-semibold mb-1">Aproveitamento</p>
              <p className="text-3xl font-bold text-[#0066CC]">{studentGrade}</p>
            </div>
          </div>
        </div>

        {/* Validity Text */}
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-[#FFD700] rounded p-4 shadow-md">
          <p className="text-sm text-gray-800 italic leading-relaxed">
            <span className="font-bold text-yellow-800">⚠ IMPORTANTE:</span> {validityText}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-12 py-4 border-t-2 border-[#0066CC]">
        <div className="text-center">
          <p className="text-xs text-gray-600">© 2025 EVITARE - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

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
      {/* Header with logo */}
      <div className="px-12 py-8 bg-[#E8F5E9]">
        <div className="flex items-center justify-center mb-4">
          <img src={evitareLogo} alt="Evitare" className="h-16" />
        </div>
        <h2 className="text-center text-xl font-bold text-[#4CAF50] uppercase tracking-wide">
          Grade Curricular
        </h2>
      </div>

      <div className="flex-1 px-12 py-8 flex flex-col">
        {/* Instructor Info - Simple list */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#333333] mb-3">{instructorName}</h3>
          <div className="text-sm text-[#666666] space-y-1">
            {instructorCredentials.split('\n').map((line, index) => (
              <p key={index}>
                {line.includes('TÉCNICO') || line.includes('BOMBEIRO') || line.includes('CIVIL') ? (
                  <span>• {line}</span>
                ) : (
                  <span>{line}</span>
                )}
              </p>
            ))}
          </div>
        </div>

        {/* Course Content */}
        <div className="mb-8 flex-1">
          <ul className="space-y-2 text-sm text-[#333333]">
            {courseCurriculum.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#4CAF50] font-bold">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Student Status - Inline text */}
        <div className="border-t-2 border-[#E0E0E0] pt-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-[#666666]">SITUAÇÃO:</span>
              {studentStatus === 'APROVADO' ? (
                <span className="font-bold text-[#4CAF50] text-lg">APROVADO</span>
              ) : (
                <span className="font-bold text-[#CC0000] text-lg">REPROVADO</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#666666]">APROVEITAMENTO:</span>
              <span className="font-bold text-[#333333] text-lg">{studentGrade}</span>
            </div>
          </div>
        </div>

        {/* Validity Text */}
        <div className="bg-[#FFF9C4] border-l-4 border-[#FDD835] rounded p-4 mt-6">
          <p className="text-sm text-[#333333] leading-relaxed">
            <span className="font-bold">⚠ IMPORTANTE:</span> {validityText}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#F5F5F5] px-12 py-4">
        <div className="text-center">
          <p className="text-xs text-[#999999]">© 2025 EVITARE - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

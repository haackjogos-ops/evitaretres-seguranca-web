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
    <div className="w-[210mm] h-[297mm] bg-white p-12 flex flex-col certificate-page">
      {/* Header */}
      <div className="flex justify-center mb-6">
        <img src={evitareLogo} alt="Evitare" className="h-16" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-8 italic">
        Grade Curricular
      </h2>

      {/* Instructor Info */}
      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-lg mb-2">Instrutor</h3>
        <p className="font-bold text-primary mb-1">{instructorName}</p>
        <div className="text-sm text-gray-700 whitespace-pre-line">
          {instructorCredentials}
        </div>
      </div>

      {/* Course Content */}
      <div className="mb-6 flex-1">
        <h3 className="font-bold text-lg mb-3">Conteúdo Programático do Curso:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          {courseCurriculum.map((item, index) => (
            <li key={index} className="text-gray-700">{item}</li>
          ))}
        </ul>
      </div>

      {/* Student Status */}
      <div className="border-2 border-gray-300 rounded-lg p-6 mb-6">
        <h3 className="font-bold text-lg mb-3">SITUAÇÃO</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {studentStatus === 'APROVADO' ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-green-600">APROVADO</span>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-red-600" />
                <span className="text-2xl font-bold text-red-600">REPROVADO</span>
              </>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Aproveitamento</p>
            <p className="text-xl font-bold">{studentGrade}</p>
          </div>
        </div>
      </div>

      {/* Validity Text */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-xs text-gray-700 italic">
          {validityText}
        </p>
      </div>
    </div>
  );
};

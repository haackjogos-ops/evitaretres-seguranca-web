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
    <div className="certificate-container bg-white text-black p-12 max-w-[210mm] mx-auto shadow-2xl print:shadow-none">
      {/* Header */}
      <div className="text-center mb-8 border-b-4 border-primary pb-6">
        <h1 className="text-4xl font-bold text-primary mb-2">EVITARE</h1>
        <p className="text-lg text-gray-700">Segurança e Medicina do Trabalho</p>
      </div>

      {/* Certificate Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">CERTIFICADO</h2>
        <p className="text-sm text-gray-600">DE CONCLUSÃO DE CURSO</p>
      </div>

      {/* Main Content */}
      <div className="space-y-6 text-center mb-8">
        <p className="text-lg leading-relaxed text-gray-700">
          Certificamos que
        </p>
        
        <p className="text-2xl font-bold text-primary py-4 px-6 bg-primary/5 rounded-lg">
          {studentName}
        </p>

        <p className="text-lg leading-relaxed text-gray-700">
          concluiu com aproveitamento o curso de
        </p>

        <div className="bg-gray-50 p-6 rounded-lg space-y-3">
          <p className="text-xl font-bold text-gray-800">{courseName}</p>
          <p className="text-md text-gray-600">Norma: {courseNorm}</p>
          <p className="text-md text-gray-600">Tipo: {courseType}</p>
          <p className="text-md text-gray-600">Carga Horária: {courseHours}</p>
        </div>

        <p className="text-lg leading-relaxed text-gray-700">
          Realizado em {new Date(courseDate).toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
      </div>

      {/* Footer Information */}
      <div className="border-t-2 border-gray-300 pt-6 mt-8">
        <div className="grid grid-cols-2 gap-6 text-sm text-gray-600 mb-6">
          <div>
            <p className="font-semibold text-gray-800">Data de Emissão:</p>
            <p>{new Date(issueDate).toLocaleDateString('pt-BR')}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Local:</p>
            <p>{issueLocation}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Registro:</p>
            <p>{registrationNumber}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Arquivo:</p>
            <p>{archiveCode}</p>
          </div>
        </div>

        {/* Signature Area */}
        <div className="text-center pt-8 mt-8 border-t border-gray-300">
          <div className="inline-block">
            <div className="w-64 border-t-2 border-gray-800 pt-2">
              <p className="font-bold text-gray-800">EVITARE</p>
              <p className="text-sm text-gray-600">Segurança e Medicina do Trabalho</p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Footer */}
      <div className="text-center mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500">
        <p>Certificado válido e autêntico. Verifique em: evitare.com.br/certificado/{registrationNumber}</p>
      </div>
    </div>
  );
};

export default CertificateTemplate;

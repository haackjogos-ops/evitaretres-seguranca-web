import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCertificates } from "@/hooks/useCertificates";
import { Plus, Download, Eye, Trash2, QrCode, Edit, Share2, FileEdit } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { PdfUpload } from "../PdfUpload";
import { PdfEditor } from "../PdfEditor";
import { useToast } from "@/hooks/use-toast";

export const CertificatesTab = () => {
  const { certificates, isLoading, createCertificate, updateCertificate, deleteCertificate } = useCertificates();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState<string>("");
  const [editorDialogOpen, setEditorDialogOpen] = useState(false);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string>("");
  const [pdfType, setPdfType] = useState<"generated" | "uploaded">("generated");

  const [formData, setFormData] = useState({
    student_name: "",
    course_type: "INICIAL",
    course_name: "",
    course_norm: "NR-35",
    course_hours: "08 horas",
    course_date: new Date().toISOString().split('T')[0],
    archive_code: "",
    registration_number: "",
    issue_location: "Turvo",
    issue_date: new Date().toISOString().split('T')[0],
    course_logo_url: "",
    instructor_name: "ISMAEL S. FERREIRA",
    instructor_credentials: "Técnico em Segurança do Trabalho - Reg. MTESC N° 07.0.00008-5/SC\nBombeiro Profissional Civil - CBM-SC\nInstrutores Credenciados",
    course_curriculum: "",
    student_status: "APROVADO",
    student_grade: "70% ACIMA",
    validity_text: "Este certificado tem validade de 02 (DOIS ANOS) contado a partir da data de emissão, ou ocorrendo sua revisão, o que prevalecer (conforme item 34.3.3 da NR-34).",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      course_curriculum: formData.course_curriculum.split('\n').filter(line => line.trim()),
      uploaded_pdf_url: uploadedPdfUrl || undefined,
      pdf_type: pdfType,
    };
    if (editingId) {
      updateCertificate({ id: editingId, ...submitData });
      setEditingId(null);
    } else {
      createCertificate(submitData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const shareOnWhatsApp = (cert: any) => {
    const url = `${window.location.origin}/certificado/${cert.registration_number}`;
    const text = `📜 Certificado de ${cert.student_name}\n📚 ${cert.course_name} - ${cert.course_norm}\n🔗 Validar: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    toast({
      title: "Compartilhamento preparado",
      description: "A janela do WhatsApp foi aberta.",
    });
  };

  const downloadQRCode = (registrationNumber: string) => {
    const svg = document.getElementById(`qr-${registrationNumber}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `QRCode-${registrationNumber}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast({
        title: "QR Code baixado",
        description: "O arquivo PNG foi salvo.",
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const resetForm = () => {
    setFormData({
      student_name: "",
      course_type: "INICIAL",
      course_name: "",
      course_norm: "NR-35",
      course_hours: "08 horas",
      course_date: new Date().toISOString().split('T')[0],
      archive_code: "",
      registration_number: "",
      issue_location: "Turvo",
      issue_date: new Date().toISOString().split('T')[0],
      course_logo_url: "",
      instructor_name: "ISMAEL S. FERREIRA",
      instructor_credentials: "Técnico em Segurança do Trabalho - Reg. MTESC N° 07.0.00008-5/SC\nBombeiro Profissional Civil - CBM-SC\nInstrutores Credenciados",
      course_curriculum: "",
      student_status: "APROVADO",
      student_grade: "70% ACIMA",
      validity_text: "Este certificado tem validade de 02 (DOIS ANOS) contado a partir da data de emissão, ou ocorrendo sua revisão, o que prevalecer (conforme item 34.3.3 da NR-34).",
    });
    setUploadedPdfUrl("");
    setPdfType("generated");
  };

  const handleEdit = (certificate: any) => {
    setFormData({
      student_name: certificate.student_name,
      course_type: certificate.course_type,
      course_name: certificate.course_name,
      course_norm: certificate.course_norm,
      course_hours: certificate.course_hours,
      course_date: certificate.course_date,
      archive_code: certificate.archive_code,
      registration_number: certificate.registration_number,
      issue_location: certificate.issue_location,
      issue_date: certificate.issue_date,
      course_logo_url: certificate.course_logo_url || "",
      instructor_name: certificate.instructor_name || "ISMAEL S. FERREIRA",
      instructor_credentials: certificate.instructor_credentials || "Técnico em Segurança do Trabalho - Reg. MTESC N° 07.0.00008-5/SC\nBombeiro Profissional Civil - CBM-SC\nInstrutores Credenciados",
      course_curriculum: Array.isArray(certificate.course_curriculum) ? certificate.course_curriculum.join('\n') : "",
      student_status: certificate.student_status || "APROVADO",
      student_grade: certificate.student_grade || "70% ACIMA",
      validity_text: certificate.validity_text || "Este certificado tem validade de 02 (DOIS ANOS) contado a partir da data de emissão, ou ocorrendo sua revisão, o que prevalecer (conforme item 34.3.3 da NR-34).",
    });
    setEditingId(certificate.id);
    setIsModalOpen(true);
  };

  const handleDelete = (certificate: any) => {
    setSelectedCertificate(certificate);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCertificate) {
      deleteCertificate(selectedCertificate.id);
    }
    setIsDeleteDialogOpen(false);
    setSelectedCertificate(null);
  };

  const showQRCode = (qrCodeUrl: string) => {
    setSelectedQRCode(qrCodeUrl);
    setQrDialogOpen(true);
  };

  if (isLoading) {
    return <div>Carregando certificados...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Certificados</h2>
          <p className="text-muted-foreground">Gere e gerencie certificados de cursos</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Certificado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Novo'} Certificado</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* PDF Type Selection */}
              <Tabs value={pdfType} onValueChange={(v) => setPdfType(v as "generated" | "uploaded")} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="generated">📝 Gerar Certificado</TabsTrigger>
                  <TabsTrigger value="uploaded">📤 Enviar PDF</TabsTrigger>
                </TabsList>
                
                <TabsContent value="uploaded" className="mt-4">
                  <PdfUpload 
                    onUploadComplete={setUploadedPdfUrl}
                    certificateId={editingId || undefined}
                  />
                  {uploadedPdfUrl && (
                    <p className="text-sm text-green-600 mt-2">✓ PDF enviado com sucesso!</p>
                  )}
                </TabsContent>
                
                <TabsContent value="generated">
                  <p className="text-sm text-muted-foreground">
                    Preencha os dados abaixo e o certificado será gerado automaticamente.
                  </p>
                </TabsContent>
              </Tabs>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="student_name">Nome do Aluno *</Label>
                  <Input
                    id="student_name"
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="course_type">Tipo de Curso *</Label>
                  <Select value={formData.course_type} onValueChange={(value) => setFormData({ ...formData, course_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INICIAL">INICIAL</SelectItem>
                      <SelectItem value="RECICLAGEM">RECICLAGEM</SelectItem>
                      <SelectItem value="APERFEIÇOAMENTO">APERFEIÇOAMENTO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="course_norm">Norma *</Label>
                  <Select value={formData.course_norm} onValueChange={(value) => setFormData({ ...formData, course_norm: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NR-35">NR-35</SelectItem>
                      <SelectItem value="NR-10">NR-10</SelectItem>
                      <SelectItem value="NR-33">NR-33</SelectItem>
                      <SelectItem value="NR-06">NR-06</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="course_name">Nome do Curso *</Label>
                  <Input
                    id="course_name"
                    value={formData.course_name}
                    onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                    placeholder="Ex: Trabalho em Altura"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="course_hours">Carga Horária *</Label>
                  <Input
                    id="course_hours"
                    value={formData.course_hours}
                    onChange={(e) => setFormData({ ...formData, course_hours: e.target.value })}
                    placeholder="Ex: 08 horas"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="course_date">Data do Curso *</Label>
                  <Input
                    id="course_date"
                    type="date"
                    value={formData.course_date}
                    onChange={(e) => setFormData({ ...formData, course_date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="registration_number">Número de Registro *</Label>
                  <Input
                    id="registration_number"
                    value={formData.registration_number}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    placeholder="Ex: 02-072"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="archive_code">Código de Arquivo *</Label>
                  <Input
                    id="archive_code"
                    value={formData.archive_code}
                    onChange={(e) => setFormData({ ...formData, archive_code: e.target.value })}
                    placeholder="Ex: 09 - 2025"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="issue_location">Local de Emissão *</Label>
                  <Input
                    id="issue_location"
                    value={formData.issue_location}
                    onChange={(e) => setFormData({ ...formData, issue_location: e.target.value })}
                    required
                  />
                </div>

                 <div>
                   <Label htmlFor="issue_date">Data de Emissão *</Label>
                   <Input
                     id="issue_date"
                     type="date"
                     value={formData.issue_date}
                     onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                     required
                   />
                 </div>
               </div>

               {/* New Section: Page 2 Fields */}
               <div className="border-t pt-4 mt-4">
                 <h3 className="font-semibold text-lg mb-4">Informações da Página 2</h3>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                     <Label htmlFor="course_logo_url">Logo do Curso (URL)</Label>
                     <Input
                       id="course_logo_url"
                       value={formData.course_logo_url}
                       onChange={(e) => setFormData({ ...formData, course_logo_url: e.target.value })}
                       placeholder="https://exemplo.com/logo.png"
                     />
                   </div>

                   <div>
                     <Label htmlFor="instructor_name">Nome do Instrutor</Label>
                     <Input
                       id="instructor_name"
                       value={formData.instructor_name}
                       onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                     />
                   </div>

                   <div>
                     <Label htmlFor="student_status">Status do Aluno</Label>
                     <Select value={formData.student_status} onValueChange={(value) => setFormData({ ...formData, student_status: value })}>
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="APROVADO">APROVADO</SelectItem>
                         <SelectItem value="REPROVADO">REPROVADO</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   <div className="col-span-2">
                     <Label htmlFor="instructor_credentials">Credenciais do Instrutor</Label>
                     <Textarea
                       id="instructor_credentials"
                       className="min-h-[80px]"
                       value={formData.instructor_credentials}
                       onChange={(e) => setFormData({ ...formData, instructor_credentials: e.target.value })}
                       placeholder="Técnico em Segurança..."
                     />
                   </div>

                   <div className="col-span-2">
                     <Label htmlFor="course_curriculum">Conteúdo Programático (um item por linha)</Label>
                     <Textarea
                       id="course_curriculum"
                       className="min-h-[120px]"
                       value={formData.course_curriculum}
                       onChange={(e) => setFormData({ ...formData, course_curriculum: e.target.value })}
                       placeholder="Introdução à NR-35&#10;Análise de Riscos&#10;Equipamentos de Proteção..."
                     />
                   </div>

                   <div>
                     <Label htmlFor="student_grade">Aproveitamento</Label>
                     <Input
                       id="student_grade"
                       value={formData.student_grade}
                       onChange={(e) => setFormData({ ...formData, student_grade: e.target.value })}
                       placeholder="70% ACIMA"
                     />
                   </div>

                   <div className="col-span-2">
                     <Label htmlFor="validity_text">Texto de Validade</Label>
                     <Textarea
                       id="validity_text"
                       className="min-h-[60px]"
                       value={formData.validity_text}
                       onChange={(e) => setFormData({ ...formData, validity_text: e.target.value })}
                     />
                   </div>
                 </div>
               </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingId ? 'Atualizar' : 'Criar'} Certificado
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert: any) => (
          <Card key={cert.id}>
            <CardHeader>
              <CardTitle className="text-lg">{cert.student_name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {cert.course_name} • {cert.course_norm}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p><strong>Tipo:</strong> {cert.course_type}</p>
                <p><strong>Registro:</strong> {cert.registration_number}</p>
                <p><strong>Data:</strong> {new Date(cert.course_date).toLocaleDateString('pt-BR')}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => window.open(`/certificado/${cert.registration_number}`, '_blank')}>
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>

                <Button size="sm" variant="outline" onClick={() => shareOnWhatsApp(cert)}>
                  <Share2 className="h-3 w-3 mr-1" />
                  WhatsApp
                </Button>

                {cert.qr_code_url && (
                  <Button size="sm" variant="outline" onClick={() => showQRCode(cert.registration_number)}>
                    <QrCode className="h-3 w-3 mr-1" />
                    QR
                  </Button>
                )}

                {cert.pdf_url && (
                  <Button size="sm" variant="outline" onClick={() => window.open(cert.pdf_url, '_blank')}>
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                )}

                <Button size="sm" variant="outline" onClick={() => handleEdit(cert)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>

                <Button size="sm" variant="destructive" onClick={() => handleDelete(cert)}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o certificado de {selectedCertificate?.student_name}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code do Certificado</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 p-6">
            {selectedQRCode && (
              <>
                <div id={`qr-${selectedQRCode}`}>
                  <QRCodeSVG 
                    value={`${window.location.origin}/certificado/${selectedQRCode}`}
                    size={256}
                    level="H"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Escaneie este código para validar o certificado
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => downloadQRCode(selectedQRCode)} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar QR Code
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editorDialogOpen} onOpenChange={setEditorDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editor de PDF</DialogTitle>
          </DialogHeader>
          <PdfEditor pdfUrl={selectedCertificate?.uploaded_pdf_url} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
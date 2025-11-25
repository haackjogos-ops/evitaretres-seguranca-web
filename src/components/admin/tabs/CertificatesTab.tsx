import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCertificates, Certificate } from "@/hooks/useCertificates";
import { PdfUpload } from "@/components/admin/PdfUpload";
import { PdfEditor } from "@/components/admin/PdfEditor";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Download,
  Link as LinkIcon,
  Share2,
  QrCode,
  Edit,
  Trash2,
  Search,
} from "lucide-react";

export const CertificatesTab = () => {
  const { groupedCertificates, createCertificate, updateCertificate, deleteCertificate } =
    useCertificates();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorPdfUrl, setEditorPdfUrl] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<Partial<Certificate> | null>(null);

  const [formData, setFormData] = useState({
    student_name: "",
    course_name: "",
    course_type: "",
    course_norm: "",
    course_hours: "",
    registration_number: "",
    archive_code: "",
    course_date: "",
    issue_date: new Date().toISOString().split("T")[0],
    issue_location: "Turvo",
    pdf_url: "",
  });

  const filteredGroups = Object.entries(groupedCertificates).filter(([studentName]) =>
    studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (certificate?: Certificate) => {
    if (certificate) {
      setEditingCertificate(certificate);
      setFormData({
        student_name: certificate.student_name,
        course_name: certificate.course_name,
        course_type: certificate.course_type,
        course_norm: certificate.course_norm,
        course_hours: certificate.course_hours,
        registration_number: certificate.registration_number,
        archive_code: certificate.archive_code,
        course_date: certificate.course_date,
        issue_date: certificate.issue_date,
        issue_location: certificate.issue_location,
        pdf_url: certificate.pdf_url || "",
      });
    } else {
      setEditingCertificate(null);
      setFormData({
        student_name: "",
        course_name: "",
        course_type: "",
        course_norm: "",
        course_hours: "",
        registration_number: "",
        archive_code: "",
        course_date: "",
        issue_date: new Date().toISOString().split("T")[0],
        issue_location: "Turvo",
        pdf_url: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingCertificate?.id) {
        await updateCertificate({ id: editingCertificate.id, ...formData });
      } else {
        await createCertificate(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar certificado:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCertificate(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Erro ao excluir certificado:", error);
    }
  };

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/certificado?id=${id}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: "O link de validação foi copiado para a área de transferência.",
    });
  };

  const handleWhatsAppShare = (certificate: Certificate) => {
    const link = `${window.location.origin}/certificado?id=${certificate.id}`;
    const message = `Olá ${certificate.student_name}! Seu certificado do curso ${certificate.course_name} está disponível em: ${link}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleDownloadPdf = (pdfUrl: string, studentName: string) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `certificado-${studentName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    link.click();
  };

  const handleOpenEditor = (certificate: Certificate) => {
    if (!certificate.pdf_url) {
      toast({
        title: "PDF não encontrado",
        description: "Este certificado não possui um PDF para editar.",
        variant: "destructive",
      });
      return;
    }
    setEditingCertificate(certificate);
    setEditorPdfUrl(certificate.pdf_url);
    setIsEditorOpen(true);
  };

  const handleEditorSave = async (dataUrl: string) => {
    try {
      // Se está editando certificado existente
      if (editingCertificate?.id) {
        await updateCertificate({
          id: editingCertificate.id,
          pdf_url: dataUrl,
        });
        toast({
          title: "Certificado atualizado",
          description: "O certificado foi atualizado com sucesso.",
        });
      } else {
        // Se é novo certificado, atualizar formData e reabrir modal
        setFormData({ ...formData, pdf_url: dataUrl });
        setIsEditorOpen(false);
        setIsModalOpen(true);
        toast({
          title: "Edição concluída",
          description: "Agora salve o certificado para finalizar.",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciar Certificados</CardTitle>
              <CardDescription>
                Organize certificados por aluno, edite PDFs e gere links de validação
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Certificado
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome do aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {filteredGroups.map(([studentName, certificates]) => (
              <AccordionItem key={studentName} value={studentName} className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-medium">{studentName}</span>
                    <span className="text-sm text-muted-foreground">
                      {certificates.length} {certificates.length === 1 ? "certificado" : "certificados"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{cert.course_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Reg: {cert.registration_number} • {cert.course_hours}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {cert.pdf_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadPdf(cert.pdf_url!, cert.student_name)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyLink(cert.id)}
                          >
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWhatsAppShare(cert)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          {cert.pdf_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEditor(cert)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteId(cert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Nenhum certificado encontrado para esta busca"
                  : "Nenhum certificado cadastrado ainda"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Novo/Editar Certificado */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCertificate ? "Editar Certificado" : "Novo Certificado"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student_name">Nome do Aluno *</Label>
                <Input
                  id="student_name"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  placeholder="João Silva"
                />
              </div>
              <div>
                <Label htmlFor="registration_number">Número de Registro *</Label>
                <Input
                  id="registration_number"
                  value={formData.registration_number}
                  onChange={(e) =>
                    setFormData({ ...formData, registration_number: e.target.value })
                  }
                  placeholder="001/2024"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="course_name">Nome do Curso *</Label>
              <Input
                id="course_name"
                value={formData.course_name}
                onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                placeholder="NR-35 Trabalho em Altura"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="course_type">Tipo</Label>
                <Input
                  id="course_type"
                  value={formData.course_type}
                  onChange={(e) => setFormData({ ...formData, course_type: e.target.value })}
                  placeholder="Treinamento"
                />
              </div>
              <div>
                <Label htmlFor="course_norm">Norma</Label>
                <Input
                  id="course_norm"
                  value={formData.course_norm}
                  onChange={(e) => setFormData({ ...formData, course_norm: e.target.value })}
                  placeholder="NR-35"
                />
              </div>
              <div>
                <Label htmlFor="course_hours">Carga Horária</Label>
                <Input
                  id="course_hours"
                  value={formData.course_hours}
                  onChange={(e) => setFormData({ ...formData, course_hours: e.target.value })}
                  placeholder="8h"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course_date">Data do Curso</Label>
                <Input
                  id="course_date"
                  type="date"
                  value={formData.course_date}
                  onChange={(e) => setFormData({ ...formData, course_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="issue_date">Data de Emissão</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="archive_code">Código de Arquivo</Label>
                <Input
                  id="archive_code"
                  value={formData.archive_code}
                  onChange={(e) => setFormData({ ...formData, archive_code: e.target.value })}
                  placeholder="ARQ-001"
                />
              </div>
              <div>
                <Label htmlFor="issue_location">Local de Emissão</Label>
                <Input
                  id="issue_location"
                  value={formData.issue_location}
                  onChange={(e) => setFormData({ ...formData, issue_location: e.target.value })}
                  placeholder="Turvo"
                />
              </div>
            </div>

            <div>
              <Label>Upload de PDF</Label>
              <PdfUpload
                onUploadComplete={(url) => setFormData({ ...formData, pdf_url: url })}
                currentFile={formData.pdf_url}
              />
            </div>

            {formData.pdf_url && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEditorPdfUrl(formData.pdf_url);
                  setIsModalOpen(false);
                  setIsEditorOpen(true);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Abrir Editor de PDF
              </Button>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Certificado</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Editor */}
      {editorPdfUrl && (
        <PdfEditor
          open={isEditorOpen}
          onOpenChange={(open) => {
            setIsEditorOpen(open);
            if (!open) setEditorPdfUrl(null);
          }}
          pdfUrl={editorPdfUrl}
          onSave={handleEditorSave}
        />
      )}

      {/* Alert Dialog Delete */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este certificado? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

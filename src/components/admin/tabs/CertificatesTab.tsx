import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCertificates } from "@/hooks/useCertificates";
import { Plus, Download, Eye, Trash2, QrCode, Edit } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export const CertificatesTab = () => {
  const { certificates, isLoading, createCertificate, updateCertificate, deleteCertificate } = useCertificates();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState<string>("");

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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCertificate({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      createCertificate(formData);
    }
    setIsModalOpen(false);
    resetForm();
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
    });
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Novo'} Certificado</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                {cert.pdf_url && (
                  <Button size="sm" variant="outline" onClick={() => window.open(cert.pdf_url, '_blank')}>
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                )}
                
                {cert.qr_code_url && (
                  <Button size="sm" variant="outline" onClick={() => showQRCode(cert.qr_code_url)}>
                    <QrCode className="h-3 w-3 mr-1" />
                    QR Code
                  </Button>
                )}

                <Button size="sm" variant="outline" onClick={() => window.open(`/certificado/${cert.registration_number}`, '_blank')}>
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>

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
            <QRCodeSVG value={selectedQRCode} size={256} level="H" />
            <p className="text-sm text-muted-foreground text-center">
              Escaneie o QR Code para acessar o certificado online
            </p>
            <Button onClick={() => {
              const canvas = document.querySelector('canvas');
              if (canvas) {
                const url = canvas.toDataURL();
                const a = document.createElement('a');
                a.download = 'qrcode.png';
                a.href = url;
                a.click();
              }
            }}>
              Baixar QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
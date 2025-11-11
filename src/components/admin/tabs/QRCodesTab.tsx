import { useState } from "react";
import { useQRCodes } from "@/hooks/useQRCodes";
import { Button } from "@/components/ui/button";
import { Plus, QrCode } from "lucide-react";
import { QRCodeCard } from "../QRCodeCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const QRCodesTab = () => {
  const { qrCodes, isLoading, createQRCode, updateQRCode, deleteQRCode } = useQRCodes();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingQRCode, setEditingQRCode] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    client_name: "",
    link: "",
    whatsapp_number: "",
  });

  const handleOpenModal = (qrCode?: any) => {
    if (qrCode) {
      setEditingQRCode(qrCode);
      setFormData({
        client_name: qrCode.client_name,
        link: qrCode.link,
        whatsapp_number: qrCode.whatsapp_number || "",
      });
    } else {
      setEditingQRCode(null);
      setFormData({
        client_name: "",
        link: "",
        whatsapp_number: "",
      });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingQRCode) {
      updateQRCode({ id: editingQRCode.id, ...formData });
    } else {
      createQRCode(formData);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteQRCode(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleToggleActive = (qrCode: any) => {
    updateQRCode({ id: qrCode.id, is_active: !qrCode.is_active });
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            QR Codes
          </h2>
          <p className="text-muted-foreground mt-1">
            Gerencie QR codes personalizados para seus clientes
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Novo QR Code
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCodes.map((qrCode) => (
          <QRCodeCard
            key={qrCode.id}
            clientName={qrCode.client_name}
            link={qrCode.link}
            whatsappNumber={qrCode.whatsapp_number}
            isActive={qrCode.is_active}
            onEdit={() => handleOpenModal(qrCode)}
            onDelete={() => handleDelete(qrCode.id)}
            onToggleActive={() => handleToggleActive(qrCode)}
          />
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingQRCode ? "Editar QR Code" : "Novo QR Code"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados para gerar o QR Code
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="client_name">Nome do Cliente *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
                placeholder="Ex: João Silva"
              />
            </div>

            <div>
              <Label htmlFor="link">Link *</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="https://exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="whatsapp_number">WhatsApp (Opcional)</Label>
              <Input
                id="whatsapp_number"
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp_number: e.target.value })
                }
                placeholder="(11) 98765-4321"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Para enviar o QR code via WhatsApp
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.client_name || !formData.link}
            >
              {editingQRCode ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este QR Code? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

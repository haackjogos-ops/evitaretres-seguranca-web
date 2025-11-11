import { useState } from "react";
import { useRegistrations } from "@/hooks/useRegistrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RegistrationsTab = () => {
  const { registrations, isLoading, updateRegistration, deleteRegistration } = useRegistrations();
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const handleStatusChange = (id: string, status: string) => {
    updateRegistration({ id, status });
  };

  const handleNotesChange = (id: string, notes: string) => {
    updateRegistration({ id, notes });
  };

  const handleView = (registration: any) => {
    setSelectedRegistration(registration);
    setViewOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "contacted":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return <div>Carregando inscrições...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inscrições Recebidas</h2>
        <Badge variant="secondary">{registrations.length} total</Badge>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>
                  {new Date(registration.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="font-medium">{registration.name}</TableCell>
                <TableCell>{registration.email}</TableCell>
                <TableCell>{registration.phone}</TableCell>
                <TableCell className="capitalize">{registration.service_type}</TableCell>
                <TableCell>
                  <Select
                    value={registration.status}
                    onValueChange={(value) => handleStatusChange(registration.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="contacted">Contatado</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleView(registration)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja excluir esta inscrição?")) {
                          deleteRegistration(registration.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Inscrição</DialogTitle>
            <DialogDescription>
              Informações completas da inscrição
            </DialogDescription>
          </DialogHeader>

          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome</Label>
                  <p className="text-sm mt-1">{selectedRegistration.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm mt-1">{selectedRegistration.email}</p>
                </div>
                <div>
                  <Label>Telefone</Label>
                  <p className="text-sm mt-1">{selectedRegistration.phone}</p>
                </div>
                <div>
                  <Label>Empresa</Label>
                  <p className="text-sm mt-1">{selectedRegistration.company || "Não informado"}</p>
                </div>
                <div>
                  <Label>CNPJ</Label>
                  <p className="text-sm mt-1">{selectedRegistration.cnpj || "Não informado"}</p>
                </div>
                <div>
                  <Label>Tipo de Serviço</Label>
                  <p className="text-sm mt-1 capitalize">{selectedRegistration.service_type}</p>
                </div>
              </div>

              {selectedRegistration.message && (
                <div>
                  <Label>Mensagem</Label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{selectedRegistration.message}</p>
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notas Internas</Label>
                <Textarea
                  id="notes"
                  placeholder="Adicione observações sobre esta inscrição..."
                  value={selectedRegistration.notes || ""}
                  onChange={(e) => {
                    setSelectedRegistration({
                      ...selectedRegistration,
                      notes: e.target.value,
                    });
                  }}
                  rows={4}
                />
                <Button
                  className="mt-2"
                  onClick={() => {
                    handleNotesChange(selectedRegistration.id, selectedRegistration.notes);
                    setViewOpen(false);
                  }}
                >
                  Salvar Notas
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationsTab;

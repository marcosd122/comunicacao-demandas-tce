
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import { Input } from "@/components/ui/input";

interface StatusConclusaoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (extras: { motivoRejeicao?: string; linkConclusao?: string; anexosConclusao?: File[] }) => void;
  status: "Concluída" | "Rejeitada";
}

const StatusConclusaoModal = ({ open, onClose, onSubmit, status }: StatusConclusaoModalProps) => {
  const [motivo, setMotivo] = useState("");
  const [link, setLink] = useState("");
  const [anexos, setAnexos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFilesChange = (files: File[]) => {
    const invalid = files.find(f => f.size > 100 * 1024 * 1024);
    if (invalid) {
      setError("Arquivos devem ter no máximo 100MB.");
    } else {
      setError(null);
      setAnexos(files);
    }
  };

  const handleConfirm = () => {
    if (status === "Rejeitada" && !motivo.trim()) {
      setError("Informe o motivo da rejeição.");
      return;
    }
    onSubmit({
      motivoRejeicao: status === "Rejeitada" ? motivo : undefined,
      linkConclusao: status === "Concluída" ? link : undefined,
      anexosConclusao: anexos,
    });
    setMotivo("");
    setLink("");
    setAnexos([]);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogTitle>
          {status === "Concluída" ? "Finalizar como Concluída" : "Finalizar como Rejeitada"}
        </DialogTitle>
        <div className="space-y-4">
          {status === "Rejeitada" && (
            <>
              <label className="block text-sm">Motivo da Rejeição *</label>
              <Input value={motivo} onChange={e => setMotivo(e.target.value)} required />
            </>
          )}
          {status === "Concluída" && (
            <>
              <label className="block text-sm">Link de Conclusão (opcional)</label>
              <Input value={link} onChange={e => setLink(e.target.value)} />
            </>
          )}
          <div>
            <label className="block text-sm mb-2">Anexos de Conclusão/Rejeição (opcional - max 100MB cada)</label>
            <FileUpload onFilesChange={handleFilesChange} />
          </div>
          {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusConclusaoModal;

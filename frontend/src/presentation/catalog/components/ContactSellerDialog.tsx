import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContactSellerDialogProps {
  open: boolean;
  sellerName: string;
  productName: string;
  onClose: () => void;
}

/** Simula el contacto: la app no tiene mensajería, así que nada sale del navegador. */
export function ContactSellerDialog({
  open,
  sellerName,
  productName,
  onClose,
}: ContactSellerDialogProps) {
  const [message, setMessage] = useState(`Hola, ¿sigue disponible «${productName}»?`);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onClose();
    toast("Es una demo: el mensaje no se ha enviado a nadie");
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contactar con {sellerName}</DialogTitle>
          <DialogDescription>Escríbele sobre este producto.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-message">Mensaje</Label>
            <Textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Enviar mensaje</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

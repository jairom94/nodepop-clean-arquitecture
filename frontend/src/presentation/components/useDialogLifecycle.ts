import { useEffect, useState } from "react";

/**
 * Para diálogos que el padre monta y desmonta. El diálogo:
 * - se abre justo después de montarse, para que se vea su animación de entrada
 *   (montado ya abierto, Base UI se la salta);
 * - se cierra con su animación de salida y solo al terminarla avisa al padre.
 */
export function useDialogLifecycle(onClosed: () => void) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return {
    close: () => setOpen(false),
    rootProps: {
      open,
      onOpenChange: (next: boolean) => {
        if (!next) setOpen(false);
      },
      onOpenChangeComplete: (next: boolean) => {
        if (!next) onClosed();
      },
    },
  };
}

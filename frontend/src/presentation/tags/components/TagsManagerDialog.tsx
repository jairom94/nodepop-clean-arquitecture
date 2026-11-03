import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { apiErrorMessage, hasErrorCode } from "@/lib/api-error";
import { toast } from "sonner";
import type { TagDto } from "@/application/tags/schemas/TagSchema";
import { useTags } from "@/presentation/tags/hooks/useTags";
import { useCreateTag } from "@/presentation/tags/hooks/useCreateTag";
import { useUpdateTag } from "@/presentation/tags/hooks/useUpdateTag";
import { useDeleteTag } from "@/presentation/tags/hooks/useDeleteTag";
import { ConfirmDialog } from "@/presentation/components/ConfirmDialog";
import { useDialogLifecycle } from "@/presentation/components/useDialogLifecycle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

/** El backend responde 403 FORBIDDEN si el tag lo usan productos de otros usuarios. */
const SHARED_TAG_MESSAGE = "Este tag lo usan productos de otros usuarios y no se puede cambiar";

function isSharedTagError(error: unknown): boolean {
  return hasErrorCode(error, "FORBIDDEN");
}

interface TagsManagerDialogProps {
  onClose: () => void;
}

export function TagsManagerDialog({ onClose }: TagsManagerDialogProps) {
  const dialog = useDialogLifecycle(onClose);
  const tagsQuery = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  // El tag se conserva al cerrar para que el texto no cambie durante la animación.
  const [deleting, setDeleting] = useState<TagDto | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      await createTag.mutateAsync(name);
      setNewName("");
    } catch (error) {
      toast.error(apiErrorMessage(error, "No se pudo crear el tag (¿nombre duplicado?)"));
    }
  };

  const handleRename = async (id: number) => {
    const name = editingName.trim();
    if (!name) return;
    try {
      await updateTag.mutateAsync({ id, name });
      setEditingId(null);
    } catch (error) {
      toast.error(
        apiErrorMessage(
          error,
          isSharedTagError(error)
            ? SHARED_TAG_MESSAGE
            : "No se pudo renombrar el tag (¿nombre duplicado?)",
        ),
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTag.mutateAsync(id);
    } catch (error) {
      toast.error(
        apiErrorMessage(
          error,
          isSharedTagError(error) ? SHARED_TAG_MESSAGE : "No se pudo eliminar el tag",
        ),
      );
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <Dialog {...dialog.rootProps}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gestionar tags</DialogTitle>
        </DialogHeader>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void handleCreate();
          }}
        >
          <Input
            aria-label="Nuevo tag"
            placeholder="Nuevo tag (máx. 50 caracteres)"
            maxLength={50}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button type="submit" disabled={createTag.isPending}>
            Crear
          </Button>
        </form>

        {tagsQuery.isPending && <p className="text-muted-foreground">Cargando tags...</p>}
        {tagsQuery.isError && <p className="text-destructive">No se pudieron cargar los tags</p>}

        <ul className="flex flex-col divide-y">
          {(tagsQuery.data ?? []).map((tag) => (
            <li key={tag.id} className="flex flex-wrap items-center gap-2 py-2">
              {editingId === tag.id ? (
                <>
                  <Input
                    autoFocus
                    aria-label={`Nuevo nombre del tag ${tag.name}`}
                    className="min-w-32 flex-1"
                    value={editingName}
                    maxLength={50}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <Button size="sm" onClick={() => void handleRename(tag.id as number)}>
                    Guardar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <span className="mr-auto rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                    {tag.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Renombrar ${tag.name}`}
                    onClick={() => {
                      setEditingId(tag.id as number);
                      setEditingName(tag.name);
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    aria-label={`Eliminar ${tag.name}`}
                    onClick={() => {
                      setDeleting(tag);
                      setConfirmOpen(true);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>

        <ConfirmDialog
          open={confirmOpen}
          title="¿Eliminar este tag?"
          description={`«${deleting?.name ?? ""}» se quitará de los productos que lo usan.`}
          confirmLabel="Eliminar"
          pending={deleteTag.isPending}
          onConfirm={() => deleting && void handleDelete(deleting.id as number)}
          onCancel={() => setConfirmOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { TagDto } from "@/application/tags/schemas/TagSchema";
import { useTags } from "@/presentation/tags/hooks/useTags";
import { useCreateTag } from "@/presentation/tags/hooks/useCreateTag";
import { useUpdateTag } from "@/presentation/tags/hooks/useUpdateTag";
import { useDeleteTag } from "@/presentation/tags/hooks/useDeleteTag";
import { ConfirmDialog } from "@/presentation/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface TagsManagerDialogProps {
  onClose: () => void;
}

export function TagsManagerDialog({ onClose }: TagsManagerDialogProps) {
  const tagsQuery = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleting, setDeleting] = useState<TagDto | null>(null);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      await createTag.mutateAsync(name);
      setNewName("");
    } catch {
      toast.error("No se pudo crear el tag (¿nombre duplicado?)");
    }
  };

  const handleRename = async (id: number) => {
    const name = editingName.trim();
    if (!name) return;
    try {
      await updateTag.mutateAsync({ id, name });
      setEditingId(null);
    } catch {
      toast.error("No se pudo renombrar el tag (¿nombre duplicado?)");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTag.mutateAsync(id);
    } catch {
      toast.error("No se pudo eliminar el tag");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
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
                    onClick={() => setDeleting(tag)}
                  >
                    <Trash2 />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>

        {deleting && (
          <ConfirmDialog
            open
            title="¿Eliminar este tag?"
            description={`«${deleting.name}» se quitará de los productos que lo usan.`}
            confirmLabel="Eliminar"
            pending={deleteTag.isPending}
            onConfirm={() => void handleDelete(deleting.id as number)}
            onCancel={() => setDeleting(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { useTags } from "@/presentation/tags/hooks/useTags";
import { useCreateTag } from "@/presentation/tags/hooks/useCreateTag";
import { useUpdateTag } from "@/presentation/tags/hooks/useUpdateTag";
import { useDeleteTag } from "@/presentation/tags/hooks/useDeleteTag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      await createTag.mutateAsync(name);
      setNewName("");
    } catch {
      window.alert("No se pudo crear el tag (¿nombre duplicado?)");
    }
  };

  const handleRename = async (id: number) => {
    const name = editingName.trim();
    if (!name) return;
    try {
      await updateTag.mutateAsync({ id, name });
      setEditingId(null);
    } catch {
      window.alert("No se pudo renombrar el tag (¿nombre duplicado?)");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`¿Eliminar el tag "${name}"?`)) return;
    await deleteTag.mutateAsync(id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>Gestionar tags</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nuevo tag (máx. 50 caracteres)"
              maxLength={50}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleCreate();
              }}
            />
            <Button onClick={() => void handleCreate()} disabled={createTag.isPending}>
              Crear
            </Button>
          </div>

          {tagsQuery.isPending && (
            <p className="text-sm text-muted-foreground">Cargando tags...</p>
          )}
          {tagsQuery.isError && (
            <p className="text-sm text-destructive">No se pudieron cargar los tags</p>
          )}

          <ul className="flex max-h-64 flex-col divide-y overflow-y-auto">
            {(tagsQuery.data ?? []).map((tag) => (
              <li key={tag.id} className="flex items-center gap-2 py-2">
                {editingId === tag.id ? (
                  <>
                    <Input
                      autoFocus
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
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {tag.name}
                    </span>
                    <span className="ml-auto flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingId(tag.id as number);
                          setEditingName(tag.name);
                        }}
                      >
                        Renombrar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleteTag.isPending}
                        onClick={() => void handleDelete(tag.id as number, tag.name)}
                      >
                        Eliminar
                      </Button>
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>

          <Button variant="outline" onClick={onClose} className="self-end">
            Cerrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

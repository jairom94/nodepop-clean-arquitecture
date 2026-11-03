import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateUserSchema, type UpdateUserDto } from "@/application/auth/schemas/UpdateUserSchema";
import { useUser, useAuthActions } from "@/store/auth/auth-selectors";
import { useUpdateUser } from "./hooks/useUpdateUser";

export function UpdateProfile() {
  const user = useUser();
  const { updateUser } = useAuthActions();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<UpdateUserDto>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user?.name ?? "",
      lastname1: user?.lastname1 ?? "",
      email: user?.email ?? "",
    },
  });

  const update = useUpdateUser();

  const onSubmit = async (values: UpdateUserDto) => {
    if (!user) return;

    try {
      const updated = await update.mutateAsync({
        id: user.id,
        changes: values,
      });
      updateUser({
        id: updated.id ?? user.id,
        name: updated.name,
        lastname1: updated.lastname1,
        email: updated.email,
      });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      const message =
        isAxiosError(err) && err.response?.status === 409
          ? "Este email ya está en uso por otro usuario"
          : isAxiosError(err) && err.response?.status === 401
            ? "No autorizado. Inicia sesión de nuevo"
            : "Error al actualizar. Inténtalo de nuevo";
      setError("root", { message });
    }
  };

  // La ruta está protegida: sin usuario no hay formulario que mostrar.
  if (!user) return null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex flex-col gap-4 rounded-2xl bg-card p-6"
    >
      {errors.root && (
        <p
          role="alert"
          className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive"
        >
          {errors.root.message}
        </p>
      )}
      {isSuccess && (
        <p
          role="status"
          className="rounded-xl bg-success/10 px-3.5 py-2.5 text-sm font-medium text-success"
        >
          Perfil actualizado correctamente
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                aria-invalid={!!fieldState.error}
                {...field}
              />
              {fieldState.error && (
                <p className="text-sm text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          name="lastname1"
          control={control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastname1">Apellido</Label>
              <Input
                id="lastname1"
                type="text"
                placeholder="Tu apellido"
                aria-invalid={!!fieldState.error}
                {...field}
              />
              {fieldState.error && (
                <p className="text-sm text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      </div>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              aria-invalid={!!fieldState.error}
              {...field}
            />
            {fieldState.error && (
              <p className="text-sm text-destructive">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" disabled={update.isPending}>
          {update.isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            reset({
              name: user.name,
              lastname1: user.lastname1,
              email: user.email,
            })
          }
          disabled={update.isPending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

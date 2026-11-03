import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RegisterCredentialsSchema,
  type RegisterCredentials,
} from "@/application/auth/schemas/RegisterCredentialsSchema";
import { useRegister } from "./hooks/useRegister";

export function Register() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(RegisterCredentialsSchema),
    defaultValues: { name: "", lastname1: "", email: "", password: "" },
  });

  const register = useRegister();

  const onSubmit = async (values: RegisterCredentials) => {
    try {
      await register.mutateAsync(values);
      setIsSuccess(true);
      setTimeout(() => navigate("/login", { replace: true, viewTransition: true }), 2000);
    } catch (err) {
      const message =
        isAxiosError(err) && err.response?.status === 409
          ? "Este email ya está registrado"
          : "Error al registrar. Inténtalo de nuevo";
      setError("root", { message });
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md rounded-3xl px-4 py-8">
        <CardHeader>
          <CardTitle className="font-heading text-3xl leading-tight font-extrabold tracking-tight">
            Cuenta creada
          </CardTitle>
          <CardDescription>
            Tu cuenta se ha registrado correctamente. Redirigiéndote al login...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => navigate("/login", { replace: true, viewTransition: true })}
          >
            Ir al login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md rounded-3xl px-4 py-8">
      <CardHeader>
        <CardTitle className="font-heading text-3xl leading-tight font-extrabold tracking-tight">
          Crear cuenta
        </CardTitle>
        <CardDescription>Regístrate para empezar a comprar y vender</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {errors.root && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive"
            >
              {errors.root.message}
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
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
          <Button type="submit" size="lg" className="w-full" disabled={register.isPending}>
            {register.isPending ? "Registrando..." : "Registrarse"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            viewTransition
            to="/login"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

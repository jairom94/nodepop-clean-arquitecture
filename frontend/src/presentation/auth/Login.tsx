import { Link } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginCredentialsSchema, type LoginCredentials } from "@/application/auth/schemas/LoginCredentialsSchema";

export function Login() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginCredentials>({ resolver: zodResolver(LoginCredentialsSchema) });

  const onSubmit = async (values: LoginCredentials) => {
    console.log(values);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Entrar
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-primary underline-offset-4 hover:underline">
            Regístrate
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

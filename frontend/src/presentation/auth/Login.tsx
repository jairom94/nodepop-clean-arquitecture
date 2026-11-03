import { Link, useLocation, useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LoginCredentialsSchema,
  type LoginCredentials,
} from "@/application/auth/schemas/LoginCredentialsSchema";
import { useAuthActions } from "@/store/auth/auth-selectors";
import { useLogin } from "./hooks/useLogin";

/** Cuenta de la demo pública; sin variables de entorno no se muestra. */
const DEMO_ACCOUNT =
  import.meta.env.VITE_DEMO_EMAIL && import.meta.env.VITE_DEMO_PASSWORD
    ? { email: import.meta.env.VITE_DEMO_EMAIL, password: import.meta.env.VITE_DEMO_PASSWORD }
    : null;

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuthActions();
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(LoginCredentialsSchema),
    defaultValues: { email: "", password: "" },
  });

  const login = useLogin();

  const onSubmit = async (values: LoginCredentials) => {
    try {
      const session = await login.mutateAsync(values);
      setSession(session);
      const from = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(from, { replace: true, viewTransition: true });
    } catch (err) {
      const message =
        isAxiosError(err) && err.response?.status === 401
          ? "Email o contraseña incorrectos"
          : "Error al iniciar sesión. Inténtalo de nuevo";
      setError("root", { message });
    }
  };

  const enterWithDemo = () => {
    if (!DEMO_ACCOUNT) return;
    setValue("email", DEMO_ACCOUNT.email);
    setValue("password", DEMO_ACCOUNT.password);
    void handleSubmit(onSubmit)();
  };

  return (
    <Card className="w-full max-w-md rounded-3xl px-4 py-8">
      <CardHeader>
        <CardTitle className="font-heading text-3xl leading-tight font-extrabold tracking-tight">
          Iniciar sesión
        </CardTitle>
        <CardDescription>Entra para gestionar tus productos</CardDescription>
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
          <Button type="submit" size="lg" className="w-full" disabled={login.isPending}>
            {login.isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        {DEMO_ACCOUNT && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-dashed border-input bg-secondary/60 p-4 text-sm">
            <div>
              <p className="font-semibold">¿Solo quieres echar un vistazo?</p>
              <p className="text-muted-foreground">
                La demo es de solo lectura. Entra con {DEMO_ACCOUNT.email} y la contraseña{" "}
                {DEMO_ACCOUNT.password}.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={login.isPending}
              onClick={enterWithDemo}
            >
              Entrar con la cuenta de demo
            </Button>
          </div>
        )}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link
            viewTransition
            to="/register"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

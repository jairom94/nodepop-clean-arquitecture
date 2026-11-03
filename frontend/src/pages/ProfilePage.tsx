import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { UpdateProfile } from "@/presentation/auth/UpdateProfile";
import { useLogout } from "@/presentation/auth/hooks/useLogout";
import { UserAvatar } from "@/presentation/components/UserAvatar";
import { useAuthActions, useUser } from "@/store/auth/auth-selectors";

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useUser();
  const { clearSession } = useAuthActions();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      clearSession();
      navigate("/login", { replace: true, viewTransition: true });
    } catch {
      toast.error("No se pudo cerrar la sesión");
    }
  };

  return (
    <PageContainer className="max-w-xl">
      <div className="flex items-center gap-4">
        {user && (
          <UserAvatar
            name={user.name}
            lastname={user.lastname1}
            className="size-18 bg-brand font-heading text-3xl font-extrabold text-brand-foreground"
          />
        )}
        <div className="min-w-0">
          <h1 className="font-heading text-4xl leading-tight font-extrabold tracking-tight">
            Mi perfil
          </h1>
          <p className="text-muted-foreground">Actualiza tu información personal</p>
        </div>
      </div>

      <UpdateProfile />

      <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card px-6 py-4">
        <h2 className="font-semibold">Sesión</h2>
        <Button
          variant="outline"
          className="text-destructive"
          disabled={logout.isPending}
          onClick={() => void handleLogout()}
        >
          {logout.isPending ? "Saliendo..." : "Cerrar sesión"}
        </Button>
      </section>
    </PageContainer>
  );
}

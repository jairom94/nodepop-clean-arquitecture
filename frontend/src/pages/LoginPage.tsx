import { AuthLayout } from "@/presentation/auth/AuthLayout";
import { Login } from "@/presentation/auth/Login";

export default function LoginPage() {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}

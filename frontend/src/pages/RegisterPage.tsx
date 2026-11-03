import { AuthLayout } from "@/presentation/auth/AuthLayout";
import { Register } from "@/presentation/auth/Register";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Register />
    </AuthLayout>
  );
}

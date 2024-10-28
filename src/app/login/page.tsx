import { LoginForm } from "@/components/login-form";
import LoginLayout from "./layout";

export default async function LoginPage() {
  return (
    <LoginLayout>
      <div className="flex h-screen w-full items-center justify-center px-4">
        <LoginForm />
      </div>
    </LoginLayout>
  );
}

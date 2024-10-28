"use client";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { login } from "@/app/lib";
import { RefreshCcw } from "lucide-react";

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const { access_token } = data;

      await login(access_token);

      toast({ description: "Login successful" });

      router.push("/dashboard");
    } else {
      const error = await response.json();
      toast({
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <Image
          src="/logo.svg"
          alt="Logo"
          width={32}
          height={32}
          className="mx-auto"
          style={{ width: "auto", height: "auto" }}
        />
        <CardTitle className="text-xl mx-auto">
          Login Arpa Admin Panel
        </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@gmail.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {loading ? (
              <Button disabled>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Login
              </Button>
            )}
          </div>
        </form>
        <div className="text-xs font-thin italic flex flex-col mt-2">
          <div className="font-bold">Example Purpose</div>
          <div>Email: admin@gmail.com</div>
          <div>Password: password</div>
        </div>
      </CardContent>
    </Card>
  );
}

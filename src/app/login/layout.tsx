import { ReactNode } from "react";

interface LoginLayoutProps {
  children: ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      {children}
    </div>
  );
}

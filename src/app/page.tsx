"use client";
import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ReactNode, useEffect, useState } from "react";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "./lib";
import { useToast } from "@/hooks/use-toast";

interface PageProps {
  children: ReactNode;
}

export default function Page({ children }: PageProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, [pathname, router]);

  const currentTheme = theme === "system" ? systemTheme : theme;

  if (!mounted) return null;

  return (
    <>
      {pathname === "/login" ? (
        children
      ) : (
        <SidebarProvider
          style={
            {
              "--sidebar-width": "19rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="ml-auto pr-4 flex gap-3">
                {currentTheme === "dark" ? (
                  <Button
                    onClick={() => setTheme("light")}
                    size="sm"
                    variant="outline"
                  >
                    <Sun />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setTheme("dark")}
                    size="sm"
                    variant="outline"
                  >
                    <Moon />
                  </Button>
                )}

                <UserDropdown />
              </div>
            </header>
            <main className="flex-1 p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}

export function UserDropdown() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({ description: "Logged out", duration: 1000 });
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>User Name</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

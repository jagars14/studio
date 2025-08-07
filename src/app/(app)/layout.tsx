import type { Metadata } from "next";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LayoutDashboard, CalendarHeart, BrainCircuit, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "BovinoPro Lite",
  description: "Gestión integral para fincas ganaderas.",
};

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Panel" },
  { href: "/animals", icon: Logo, label: "Animales" },
  { href: "/reproduction", icon: CalendarHeart, label: "Reproducción" },
  { href: "/optimizer", icon: BrainCircuit, label: "Optimizador IA" },
  { href: "/settings", icon: Settings, label: "Configuración" },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Button variant="ghost" size="icon" className="hover:bg-sidebar-accent rounded-lg">
                <Logo className="h-10 w-10" />
            </Button>
            <h1 className="text-xl font-headline font-semibold">BovinoPro Lite</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <Link href={item.href}>
                    {item.href === '/animals' ? <Logo className="h-6 w-6 text-sidebar-foreground" /> : <item.icon />}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
             {/* El contenido futuro del encabezado específico de la página puede ir aquí */}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

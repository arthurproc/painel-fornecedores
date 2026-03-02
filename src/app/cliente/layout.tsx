import { AppSidebar, NavItem } from "@/components/app-sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/cliente", icon: "LayoutDashboard" },
  { label: "Pedidos", href: "/cliente/pedidos", icon: "ShoppingCart" },
  { label: "Fornecedores", href: "/cliente/fornecedores", icon: "Store" },
  { label: "Perfil", href: "/cliente/perfil", icon: "User" },
];

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar title="Área do Cliente" navItems={navItems} homeHref="/cliente" />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}

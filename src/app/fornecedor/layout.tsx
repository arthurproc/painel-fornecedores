import { AppSidebar, NavItem } from "@/components/app-sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/fornecedor", icon: "LayoutDashboard" },
  { label: "Produtos", href: "/fornecedor/produtos", icon: "Package" },
  { label: "Pedidos", href: "/fornecedor/pedidos", icon: "ShoppingCart" },
  { label: "Perfil", href: "/fornecedor/perfil", icon: "User" },
];

export default function FornecedorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar title="Área do Fornecedor" navItems={navItems} homeHref="/fornecedor" />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}

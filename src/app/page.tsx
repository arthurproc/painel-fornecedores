import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen w-screen">
      <Link
        href="/cliente"
        className="flex flex-1 items-center justify-center bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        <span className="text-3xl font-bold text-center px-4">
          Entrar como cliente
        </span>
      </Link>
      <Link
        href="/fornecedor"
        className="flex flex-1 items-center justify-center bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
      >
        <span className="text-3xl font-bold text-center px-4">
          Entrar como fornecedor
        </span>
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function NavLinks() {
  return (
    <nav className="flex flex-col md:flex-row gap-6 text-gray-300">
      <Link href="/" className="hover:text-white transition">
        Estoque
      </Link>

      <Link href="/galpoes" className="hover:text-white transition">
        Galpões
      </Link>

      <Link href="/enderecos" className="hover:text-white transition">
        Endereços
      </Link>
    </nav>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-[#1e3a5f] text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-chama-header.png"
            alt="CHAMA - Serviços entre vizinhos"
            width={1536}
            height={864}
            className="h-11 w-auto"
            priority
          />
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/como-funciona" className="hover:text-[#e67e22] transition-colors">
            Como funciona
          </Link>
          <Link
            href="/cadastro"
            className="bg-[#e67e22] hover:bg-[#d35400] px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Comece agora
          </Link>
        </nav>
      </div>
    </header>
  );
}

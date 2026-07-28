"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="bg-[#1e3a5f] text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          CHAMA
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
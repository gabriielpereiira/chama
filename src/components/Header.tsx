"use client";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-[#1e3a5f] text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="CHAMA - Página inicial">
          <svg viewBox="0 0 280 64" className="h-11 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CHAMA - Serviços entre vizinhos">
            {/* Mão esquerda - silhueta estilizada em posição de namaste */}
            <path d="M26 52 C18 50 12 42 12 32 C12 22 16 14 22 12 C28 10 32 14 34 18 C36 22 36 28 34 34 C32 40 30 48 26 52 Z" fill="#ffffff" />
            {/* Mão direita - espelhada */}
            <path d="M54 52 C62 50 68 42 68 32 C68 22 64 14 58 12 C52 10 48 14 46 18 C44 22 44 28 46 34 C48 40 50 48 54 52 Z" fill="#ffffff" />
            {/* Detalhes dos dedos - mão esquerda */}
            <path d="M18 14 C20 10 24 8 26 10" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M22 12 C24 8 28 6 30 8" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Detalhes dos dedos - mão direita */}
            <path d="M62 14 C60 10 56 8 54 10" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M58 12 C56 8 52 6 50 8" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Oval central laranja entre as palmas */}
            <ellipse cx="40" cy="32" rx="6" ry="14" fill="#e67e22" />
            {/* Núcleo interno do oval */}
            <ellipse cx="40" cy="32" rx="2.5" ry="6" fill="#ffffff" />
            {/* Ondas sonoras - 3 arcos crescentes à direita */}
            <path d="M50 24 C54 24 56 28 56 32 C56 36 54 40 50 40" stroke="#e67e22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M56 20 C61 20 64 26 64 32 C64 38 61 44 56 44" stroke="#e67e22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M62 16 C68 16 72 24 72 32 C72 40 68 48 62 48" stroke="#e67e22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Wordmark CHAMA */}
            <text x="80" y="44" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="36" letterSpacing="2">
              <tspan fill="#e67e22">C</tspan>
              <tspan fill="#ffffff">H</tspan>
              <tspan fill="#e67e22">A</tspan>
              <tspan fill="#e67e22">M</tspan>
              <tspan fill="#ffffff">A</tspan>
            </text>
          </svg>
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

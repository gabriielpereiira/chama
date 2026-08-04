"use client";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-[#1e3a5f] text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="CHAMA - Página inicial">
          <svg viewBox="0 0 280 64" className="h-11 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CHAMA - Serviços entre vizinhos">
            {/* Boca aberta gritando */}
            <ellipse cx="40" cy="32" rx="9" ry="15" fill="#e67e22" />
            <ellipse cx="40" cy="35" rx="4.5" ry="7" fill="#d35400" />
            {/* Mão esquerda em concha */}
            <g stroke="#ffffff" strokeWidth="7" strokeLinecap="round" fill="none">
              <path d="M14 46 C10 30 12 16 18 12" />
              <path d="M22 48 C18 34 20 22 26 18" />
              <path d="M30 50 C26 38 28 28 33 24" />
              <path d="M10 46 C18 54 32 54 40 50" />
            </g>
            {/* Mão direita em concha (espelhada) */}
            <g stroke="#ffffff" strokeWidth="7" strokeLinecap="round" fill="none" transform="translate(80 0) scale(-1 1)">
              <path d="M14 46 C10 30 12 16 18 12" />
              <path d="M22 48 C18 34 20 22 26 18" />
              <path d="M30 50 C26 38 28 28 33 24" />
              <path d="M10 46 C18 54 32 54 40 50" />
            </g>
            {/* Ondas sonoras saindo da boca */}
            <g stroke="#e67e22" strokeWidth="4" strokeLinecap="round">
              <path d="M58 20 C63 20 65 25 65 30" />
              <path d="M66 14 C73 14 76 22 76 30" />
              <path d="M74 8 C84 8 88 20 88 30" />
            </g>
            {/* Wordmark CHAMA */}
            <text x="96" y="47" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="40" letterSpacing="3">
              <tspan fill="#e67e22">C</tspan>
              <tspan fill="#ffffff">H</tspan>
              <tspan fill="#e67e22">A</tspan>
              <tspan fill="#ffffff">M</tspan>
              <tspan fill="#e67e22">A</tspan>
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

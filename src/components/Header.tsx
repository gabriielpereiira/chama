"use client";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-[#1e3a5f] text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="CHAMA - Página inicial">
          <svg
            viewBox="0 0 360 90"
            className="h-12 w-auto"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="CHAMA - Serviços entre vizinhos"
          >
            {/* Mão esquerda em concha, dedos para cima, inclinada para o centro */}
            <path
              d="M16 80 Q8 66 11 50 Q13 36 19 30 Q23 24 29 27 Q35 30 37 40 Q41 54 38 70 Q36 80 16 80 Z"
              fill="#ffffff"
            />
            {/* Linhas internas dos dedos - mão esquerda */}
            <path d="M21 29 Q20 40 21 52" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M26 28 Q25 40 26 52" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M31 30 Q31 42 31 52" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Mão direita em concha, espelhada */}
            <path
              d="M104 80 Q112 66 109 50 Q107 36 101 30 Q97 24 91 27 Q85 30 83 40 Q79 54 82 70 Q84 80 104 80 Z"
              fill="#ffffff"
            />
            {/* Linhas internas dos dedos - mão direita */}
            <path d="M99 29 Q100 40 99 52" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M94 28 Q95 40 94 52" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M89 30 Q89 42 89 52" stroke="#1e3a5f" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Oval vertical central entre as palmas */}
            <rect x="50" y="16" width="20" height="60" rx="10" fill="#e67e22" />
            {/* Núcleo interno do oval */}
            <rect x="56.5" y="26" width="7" height="40" rx="3.5" fill="#ffffff" />
            {/* Ondas sonoras à direita do ícone */}
            <g stroke="#e67e22" strokeWidth="3" fill="none" strokeLinecap="round">
              <path d="M112 34 Q116 38 116 44" />
              <path d="M118 28 Q124 34 124 48" />
              <path d="M124 22 Q132 32 132 52" />
            </g>
            {/* Wordmark CHAMA com as cores da referência (navy adaptado para branco) */}
            <text
              x="142"
              y="66"
              fontFamily="Arial, Helvetica, sans-serif"
              fontWeight="800"
              fontSize="44"
              letterSpacing="3"
            >
              <tspan fill="#e67e22">C</tspan>
              <tspan fill="#ffffff">H</tspan>
              <tspan fill="#e67e22">A</tspan>
              <tspan fill="#ffffff">M</tspan>
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

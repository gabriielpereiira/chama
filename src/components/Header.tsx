"use client";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-[#1e3a5f] text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="CHAMA - Página inicial">
          <svg
            viewBox="0 0 320 72"
            className="h-11 w-auto"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="CHAMA - Serviços entre vizinhos"
          >
            {/* Grupo do ícone, levemente inclinado como na logo original */}
            <g transform="rotate(-6 56 38)">
              {/* Mão esquerda */}
              <path
                d="M14 58 C9 46 9 32 17 24 C21 20 27 16 33 16 C39 16 43 20 45 26 C45 34 43 44 39 54 C35 60 23 62 14 58 Z"
                fill="#ffffff"
              />
              {/* Linhas dos dedos - mão esquerda */}
              <path d="M21 22 C22 30 23 42 22 52" stroke="#1e3a5f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M29 20 C30 28 31 40 30 50" stroke="#1e3a5f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              {/* Mão direita */}
              <path
                d="M98 58 C103 46 103 32 95 24 C91 20 85 16 79 16 C73 16 69 20 67 26 C67 34 69 44 73 54 C77 60 89 62 98 58 Z"
                fill="#ffffff"
              />
              {/* Linhas dos dedos - mão direita */}
              <path d="M91 22 C90 30 89 42 90 52" stroke="#1e3a5f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M83 20 C82 28 81 40 82 50" stroke="#1e3a5f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              {/* Oval vertical entre as palmas */}
              <rect x="49" y="20" width="14" height="34" rx="7" fill="#e67e22" />
              {/* Núcleo interno do oval (originalmente navy, adaptado para branco) */}
              <rect x="53.5" y="25" width="5" height="24" rx="2.5" fill="#ffffff" />
              {/* Ondas sonoras à direita do ícone */}
              <path d="M104 28 C110 28 114 34 114 42" stroke="#e67e22" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M110 22 C118 22 123 30 123 42" stroke="#e67e22" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </g>
            {/* Wordmark CHAMA com as cores da logo (navy adaptado para branco) */}
            <text
              x="132"
              y="47"
              fontFamily="Arial, Helvetica, sans-serif"
              fontWeight="800"
              fontSize="42"
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

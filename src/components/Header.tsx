"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
export function Header() {
  const [usuario, setUsuario] = useState<{ email?: string } | null>(null);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUsuario(data.user ?? null);
      setCarregando(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);
  return (
    <header className="bg-[#1e3a5f] text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="CHAMA - Página inicial">
          <img
            src="/logo-chama-header.svg"
            alt="CHAMA - Serviços entre vizinhos"
            className="h-11 w-auto"
          />
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/como-funciona" className="hover:text-[#e67e22] transition-colors">
            Como funciona
          </Link>
          <Link href="/tarefas" className="hover:text-[#e67e22] transition-colors">
            Pegar serviço
          </Link>
          {!carregando && !usuario && (
            <>
              <Link href="/login" className="hover:text-[#e67e22] transition-colors">
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="bg-[#e67e22] hover:bg-[#d35400] px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Comece agora
              </Link>
            </>
          )}
          {!carregando && usuario && (
            <Link
              href="/perfil"
              className="bg-[#e67e22] hover:bg-[#d35400] px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Meu painel
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

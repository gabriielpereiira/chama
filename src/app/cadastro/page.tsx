"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [contaCriada, setContaCriada] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } },
    });

    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }

    setContaCriada(true);
  }

  if (contaCriada) {
    return (
      <main className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">Conta criada</h1>
        <p className="text-gray-600 mb-4">
          Confira seu e-mail para confirmar o cadastro, se a confirmação estiver ativa, e depois entre.
        </p>
        <Link
          href="/login"
          className="inline-block bg-[#e67e22] hover:bg-[#d35400] text-white font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          Ir para o login
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">Criar conta</h1>
      <p className="text-sm text-gray-600 mb-6">
        Você começa como cliente. Depois, no seu perfil, pode se tornar prestador também.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="voce@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {carregando ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4 text-center">
        Já tem conta?{" "}
        <Link href="/login" className="text-[#e67e22] font-medium">
          Entrar
        </Link>
      </p>
    </main>
  );
}

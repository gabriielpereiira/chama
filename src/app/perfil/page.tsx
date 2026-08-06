"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Dashboard } from "../../components/Dashboard";

type Perfil = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
};

export default function PerfilPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error || !data.user) {
        router.push("/login");
        return;
      }
      const { data: perfilData } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", data.user.id)
        .single();
      setPerfil(perfilData ?? null);
      setCarregando(false);
    });
  }, [router]);

  async function alternarTipo() {
    if (!perfil || perfil.tipo === "admin") return;
    setSalvando(true);
    setMensagem("");
    const novoTipo = perfil.tipo === "prestador" ? "cliente" : "prestador";
    const { error } = await supabase
      .from("usuarios")
      .update({ tipo: novoTipo })
      .eq("id", perfil.id);
    setSalvando(false);
    if (error) {
      setMensagem("Não foi possível atualizar. Tente de novo.");
      return;
    }
    setPerfil({ ...perfil, tipo: novoTipo });
    setMensagem(
      novoTipo === "prestador"
        ? "Agora você também pode oferecer serviços."
        : "Você voltou a ser cliente."
    );
  }

  async function sair() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (carregando) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-gray-600">Carregando perfil...</p>
      </main>
    );
  }

  if (!perfil) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-gray-600">Perfil não encontrado.</p>
      </main>
    );
  }

  const ehAdmin = perfil.tipo === "admin";

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#1e3a5f] mb-6">Meu perfil</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
        <div>
          <p className="text-sm text-gray-500">Nome</p>
          <p className="font-medium">{perfil.nome}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">E-mail</p>
          <p className="font-medium">{perfil.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Papel</p>
          <p className="font-medium capitalize">
            {ehAdmin
              ? "Administrador"
              : perfil.tipo === "prestador"
                ? "Prestador"
                : "Cliente"}
          </p>
        </div>
      </div>

      {ehAdmin ? (
        <div className="mt-6 bg-[#1e3a5f]/5 border border-[#1e3a5f]/20 rounded-xl p-6">
          <p className="text-sm text-[#1e3a5f]">
            Conta de administrador. O papel não pode ser alterado por aqui —
            use o seletor dentro do painel para alternar entre ver como
            prestador ou como cliente.
          </p>
        </div>
      ) : (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-700 mb-3">
            {perfil.tipo === "prestador"
              ? "Você é prestador. Também pode continuar usando o site como cliente: o que muda é a intenção, criar tarefas para pedir serviços ou enviar orçamentos para oferecer."
              : "Você é cliente. Quer oferecer serviços para os vizinhos? Ative o perfil de prestador."}
          </p>
          <button
            onClick={alternarTipo}
            disabled={salvando}
            className="w-full bg-[#1e3a5f] hover:bg-[#162c47] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {salvando
              ? "Atualizando..."
              : perfil.tipo === "prestador"
                ? "Voltar a ser cliente"
                : "Quero ser prestador também"}
          </button>
          {mensagem && (
            <p className="text-sm text-gray-600 mt-3">{mensagem}</p>
          )}
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">Meu painel</h2>
        <Dashboard key={perfil.tipo} />
      </section>

      <button
        onClick={sair}
        className="w-full mt-8 text-sm text-gray-500 hover:text-gray-800 py-2"
      >
        Sair da conta
      </button>
    </main>
  );
}

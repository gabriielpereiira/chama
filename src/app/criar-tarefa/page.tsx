"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Categoria = { id: string; nome: string };

export default function CriarTarefaPage() {
  const router = useRouter();
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [bairro, setBairro] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUsuarioId(data.user.id);

      const { data: cats } = await supabase
        .from("categorias")
        .select("id, nome")
        .order("nome");

      setCategorias((cats ?? []) as Categoria[]);
      setCarregando(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!usuarioId) return;
    if (!categoriaId) {
      setErro("Escolha uma categoria para o serviço.");
      return;
    }

    setSalvando(true);

    const { data, error } = await supabase
      .from("tarefas")
      .insert({
        cliente_id: usuarioId,
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
        categoria_id: categoriaId,
        bairro: bairro.trim() || null,
        orcamento_sugerido: orcamento ? Number(orcamento.replace(",", ".")) : null,
        status: "aberta",
      })
      .select("id")
      .single();

    setSalvando(false);

    if (error || !data) {
      setErro("Não foi possível publicar a tarefa. Tente de novo.");
      return;
    }

    router.push(`/tarefas/${data.id}`);
  }

  if (carregando) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-gray-600">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">
        Anunciar um serviço
      </h1>
      <p className="text-gray-600 mb-8">
        Conte o que você precisa e os prestadores da região vão enviar orçamentos.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Ex: Preciso de um eletricista para trocar uma tomada"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <select
            required
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Selecione...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          {categorias.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Nenhuma categoria cadastrada. Rode o SQL do Bloco 2 (seed de categorias).
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Detalhe o serviço: o que precisa, tamanho, urgência, materiais..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bairro</label>
            <input
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Ex: Centro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Orçamento sugerido (R$)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={orcamento}
              onChange={(e) => setOrcamento(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Ex: 150"
            />
          </div>
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={salvando}
            className="bg-[#e67e22] hover:bg-[#d35400] text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {salvando ? "Publicando..." : "Publicar tarefa"}
          </button>
          <Link
            href="/tarefas"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}

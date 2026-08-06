"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
type Tarefa = {
  id: string;
  cliente_id: string;
  titulo: string;
  descricao: string | null;
  bairro: string | null;
  orcamento_sugerido: number | null;
  status: string;
  created_at: string;
  categorias?: { nome: string } | null;
};
type Categoria = { id: string; nome: string };
const formatarMoeda = (valor: number | null) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor ?? 0);
const formatarData = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
export default function ListaTarefasPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [bairroFiltro, setBairroFiltro] = useState("");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUsuarioId(data.user?.id ?? null);
    });
    supabase
      .from("categorias")
      .select("id, nome")
      .order("nome")
      .then(({ data }) => {
        setCategorias((data ?? []) as Categoria[]);
      });
  }, []);
  useEffect(() => {
    setCarregando(true);
    setErro("");
    let query = supabase
      .from("tarefas")
      .select("*, categorias(nome)")
      .eq("status", "aberta")
      .order("created_at", { ascending: false });
    if (categoriaFiltro) {
      query = query.eq("categoria_id", categoriaFiltro);
    }
    if (bairroFiltro) {
      query = query.eq("bairro", bairroFiltro);
    }
    query.then(({ data, error }) => {
      setTarefas((data ?? []) as Tarefa[]);
      setErro(error ? "Não foi possível carregar as tarefas." : "");
      setCarregando(false);
    });
  }, [categoriaFiltro, bairroFiltro]);
  const bairros = Array.from(
    new Set(tarefas.map((t) => t.bairro).filter((b): b is string => !!b))
  );
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a5f] mb-1">
            Tarefas disponíveis para você
          </h1>
          <p className="text-gray-600">
            Serviços abertos na vizinhança pedindo orçamento. Encontre um e ofereça seu trabalho.
          </p>
        </div>
        {usuarioId && (
          <Link
            href="/criar-tarefa"
            className="bg-[#e67e22] hover:bg-[#d35400] text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-center"
          >
            Anunciar serviço
          </Link>
        )}
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setCategoriaFiltro("")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            categoriaFiltro === ""
              ? "bg-[#1e3a5f] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c.id}
            onClick={() =>
              setCategoriaFiltro(categoriaFiltro === c.id ? "" : c.id)
            }
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              categoriaFiltro === c.id
                ? "bg-[#1e3a5f] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {c.nome}
          </button>
        ))}
      </div>
      {bairros.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setBairroFiltro("")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              bairroFiltro === ""
                ? "bg-[#1e3a5f] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todos os bairros
          </button>
          {bairros.map((b) => (
            <button
              key={b}
              onClick={() => setBairroFiltro(bairroFiltro === b ? "" : b)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                bairroFiltro === b
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}
      {erro && <p className="text-sm text-red-600 mb-4">{erro}</p>}
      {carregando ? (
        <p className="text-gray-600">Carregando tarefas...</p>
      ) : tarefas.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-gray-600 mb-2">
            Nenhuma tarefa aberta na sua região agora.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Ajuste o filtro de categoria ou bairro para ver mais opções.
          </p>
          {usuarioId ? (
            <Link href="/criar-tarefa" className="text-[#e67e22] font-medium">
              Seja o primeiro a anunciar
            </Link>
          ) : (
            <Link href="/cadastro" className="text-[#e67e22] font-medium">
              Crie uma conta para anunciar
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tarefas.map((t) => {
            const minha = usuarioId === t.cliente_id;
            return (
              <div
                key={t.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#e67e22]/10 text-[#d35400] text-xs font-semibold px-3 py-1 rounded-full">
                    {t.categorias?.nome ?? "Sem categoria"}
                  </span>
                  {minha && (
                    <span className="bg-[#1e3a5f]/10 text-[#1e3a5f] text-xs font-semibold px-3 py-1 rounded-full">
                      Minha tarefa
                    </span>
                  )}
                </div>
                <h2 className="font-semibold text-[#1e3a5f] text-lg mb-1 leading-snug">
                  {t.titulo}
                </h2>
                {t.descricao && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {t.descricao}
                  </p>
                )}
                <div className="mt-auto pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {t.bairro ?? "Bairro não informado"}
                    </span>
                    <span className="font-semibold text-[#1e3a5f]">
                      {formatarMoeda(t.orcamento_sugerido)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {formatarData(t.created_at)}
                    </span>
                    <Link
                      href={`/tarefas/${t.id}`}
                      className="text-[#e67e22] font-medium text-sm hover:text-[#d35400]"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

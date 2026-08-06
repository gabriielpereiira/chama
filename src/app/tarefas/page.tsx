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
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [bairrosSelecionados, setBairrosSelecionados] = useState<string[]>([]);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

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
    if (categoriasSelecionadas.length > 0) {
      query = query.in("categoria_id", categoriasSelecionadas);
    }
    if (bairrosSelecionados.length > 0) {
      query = query.in("bairro", bairrosSelecionados);
    }
    query.then(({ data, error }) => {
      setTarefas((data ?? []) as Tarefa[]);
      setErro(error ? "Não foi possível carregar as tarefas." : "");
      setCarregando(false);
    });
  }, [categoriasSelecionadas, bairrosSelecionados]);

  const bairros = Array.from(
    new Set(tarefas.map((t) => t.bairro).filter((b): b is string => !!b))
  );

  function alternarCategoria(id: string) {
    setCategoriasSelecionadas((atual) =>
      atual.includes(id) ? atual.filter((c) => c !== id) : [...atual, id]
    );
  }

  function alternarBairro(bairro: string) {
    setBairrosSelecionados((atual) =>
      atual.includes(bairro) ? atual.filter((b) => b !== bairro) : [...atual, bairro]
    );
  }

  function limparFiltros() {
    setCategoriasSelecionadas([]);
    setBairrosSelecionados([]);
  }

  const temFiltroAtivo =
    categoriasSelecionadas.length > 0 || bairrosSelecionados.length > 0;

  const conteudoFiltros = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[#1e3a5f]">Filtros</h2>
        {temFiltroAtivo && (
          <button
            onClick={limparFiltros}
            className="text-sm text-[#e67e22] hover:text-[#d35400] font-medium"
          >
            Limpar
          </button>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Categoria</h3>
        <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
          {categorias.map((c) => {
            const marcada = categoriasSelecionadas.includes(c.id);
            return (
              <label
                key={c.id}
                className="flex items-center gap-2 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={marcada}
                  onChange={() => alternarCategoria(c.id)}
                  className="w-4 h-4 accent-[#e67e22]"
                />
                <span className={marcada ? "text-[#1e3a5f] font-medium" : "text-gray-700"}>
                  {c.nome}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {bairros.length > 0 && (
        <>
          <div className="border-t border-gray-100" />
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Bairro</h3>
            <div className="space-y-2">
              {bairros.map((b) => {
                const marcado = bairrosSelecionados.includes(b);
                return (
                  <label
                    key={b}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={marcado}
                      onChange={() => alternarBairro(b)}
                      className="w-4 h-4 accent-[#e67e22]"
                    />
                    <span className={marcado ? "text-[#1e3a5f] font-medium" : "text-gray-700"}>
                      {b}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
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

      {/* Botão Filtros - visível apenas no mobile */}
      <button
        onClick={() => setFiltrosAbertos(true)}
        className="lg:hidden mb-6 w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-[#1e3a5f] flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 4h18M6 12h12M10 20h4"
          />
        </svg>
        Filtros
        {temFiltroAtivo && (
          <span className="bg-[#e67e22] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {categoriasSelecionadas.length + bairrosSelecionados.length}
          </span>
        )}
      </button>

      <div className="flex gap-8">
        {/* Sidebar de filtros - desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-6">
            {conteudoFiltros}
          </div>
        </aside>

        {/* Painel deslizante - mobile */}
        {filtrosAbertos && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setFiltrosAbertos(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85%] bg-white shadow-xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#1e3a5f]">Filtros</h2>
                <button
                  onClick={() => setFiltrosAbertos(false)}
                  className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                  aria-label="Fechar filtros"
                >
                  ×
                </button>
              </div>
              {conteudoFiltros}
              <button
                onClick={() => setFiltrosAbertos(false)}
                className="mt-6 w-full bg-[#1e3a5f] hover:bg-[#162c47] text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Ver resultados
              </button>
            </div>
          </div>
        )}

        {/* Grade de resultados */}
        <div className="flex-1">
          {!carregando && (
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-semibold text-[#1e3a5f]">{tarefas.length}</span>{" "}
              {tarefas.length === 1 ? "tarefa encontrada" : "tarefas encontradas"}
            </p>
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
                Ajuste os filtros de categoria ou bairro para ver mais opções.
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
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { RoscaChart } from "./RoscaChart";

type Visao = "prestador" | "cliente";

type Orcamento = {
  id: string;
  tarefa_id: string;
  valor: number | null;
  status: string;
  prazo_execucao: string | null;
  created_at: string;
};

type Tarefa = {
  id: string;
  titulo: string;
  status: string;
  bairro: string | null;
  orcamento_sugerido: number | null;
  created_at: string;
};

const formatarMoeda = (valor: number | null | undefined) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor ?? 0);

const formatarData = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

export function Dashboard() {
  const [visao, setVisao] = useState<Visao>("prestador");
  const [ehAdmin, setEhAdmin] = useState(false);
  const [tipoReal, setTipoReal] = useState<Visao | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [minhasTarefas, setMinhasTarefas] = useState<Tarefa[]>([]);
  const [tarefasDisponiveis, setTarefasDisponiveis] = useState<Tarefa[]>([]);
  const [orcamentosRecebidos, setOrcamentosRecebidos] = useState<Orcamento[]>([]);

  const visaoEfetiva: Visao = ehAdmin ? visao : tipoReal ?? "prestador";

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const { data: sessao } = await supabase.auth.getUser();
      if (!sessao.user) return;

      const usuarioId = sessao.user.id;
      setUid(usuarioId);

      const { data: adminData } = await supabase.rpc("is_admin");
      const admin = !!adminData;
      setEhAdmin(admin);

      if (!admin) {
        const { data: perfil } = await supabase
          .from("perfis_publicos")
          .select("tipo")
          .eq("id", usuarioId)
          .single();
        if (perfil?.tipo === "prestador" || perfil?.tipo === "cliente") {
          setTipoReal(perfil.tipo);
        }
      }

      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!uid || carregando) return;
    let ativo = true;

    async function carregarVisao() {
      if (visaoEfetiva === "prestador") {
        const { data: orc } = await supabase
          .from("orcamentos")
          .select("*")
          .eq("prestador_id", uid);
        if (ativo) setOrcamentos((orc ?? []) as Orcamento[]);

        const { data: tarefasAbertas } = await supabase
          .from("tarefas")
          .select("*")
          .eq("status", "aberta");
        const idsComOrcamento = new Set(
          (orc ?? []).map((o: { tarefa_id: string }) => o.tarefa_id)
        );
        const disponiveis = ((tarefasAbertas ?? []) as Tarefa[]).filter(
          (t) => !idsComOrcamento.has(t.id)
        );
        if (ativo) setTarefasDisponiveis(disponiveis);
      } else {
        const { data: tarefas } = await supabase
          .from("tarefas")
          .select("*")
          .eq("cliente_id", uid);
        if (ativo) setMinhasTarefas((tarefas ?? []) as Tarefa[]);

        const ids = (tarefas ?? []).map((t: { id: string }) => t.id);
        if (ids.length > 0) {
          const { data: orc } = await supabase
            .from("orcamentos")
            .select("*")
            .in("tarefa_id", ids);
          if (ativo) setOrcamentosRecebidos((orc ?? []) as Orcamento[]);
        } else if (ativo) {
          setOrcamentosRecebidos([]);
        }
      }
    }

    carregarVisao();
    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, visaoEfetiva, carregando]);

  if (carregando) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <p className="text-gray-500 text-sm">Carregando painel...</p>
      </div>
    );
  }

  const pendentes = orcamentos.filter((o) => o.status === "pendente").length;
  const aceitos = orcamentos.filter((o) => o.status === "aceito").length;
  const recusados = orcamentos.filter((o) => o.status === "recusado").length;
  const taxaConversao =
    orcamentos.length > 0
      ? Math.round((aceitos / orcamentos.length) * 100)
      : 0;

  const tarefasAbertas = minhasTarefas.filter((t) => t.status === "aberta").length;
  const tarefasConcluidas = minhasTarefas.filter(
    (t) => t.status === "concluida"
  ).length;

  const coresStatus: Record<string, string> = {
    pendente: "#e67e22",
    aceito: "#16a34a",
    recusado: "#9ca3af",
    aberta: "#e67e22",
    concluida: "#16a34a",
  };

  const rotuloStatus: Record<string, string> = {
    pendente: "Pendente",
    aceito: "Aceito",
    recusado: "Recusado",
    aberta: "Aberta",
    concluida: "Concluída",
  };

  return (
    <div className="space-y-6">
      {ehAdmin && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-[#1e3a5f]">
            Modo admin:
          </span>
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              onClick={() => setVisao("prestador")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                visao === "prestador"
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Ver como prestador
            </button>
            <button
              onClick={() => setVisao("cliente")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                visao === "cliente"
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Ver como cliente
            </button>
          </div>
        </div>
      )}

      {visaoEfetiva === "prestador" ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">Orçamentos enviados</p>
              <p className="text-2xl font-bold text-[#1e3a5f]">
                {orcamentos.length}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">Aceitos</p>
              <p className="text-2xl font-bold text-green-600">{aceitos}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-[#e67e22]">{pendentes}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">Conversão</p>
              <p className="text-2xl font-bold text-[#1e3a5f]">
                {taxaConversao}%
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <RoscaChart
                titulo="Meus orçamentos por status"
                dados={[
                  { label: "Pendente", valor: pendentes, cor: coresStatus.pendente },
                  { label: "Aceito", valor: aceitos, cor: coresStatus.aceito },
                  { label: "Recusado", valor: recusados, cor: coresStatus.recusado },
                ]}
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-[#1e3a5f] mb-4">
                Tarefas disponíveis para você
              </h3>
              {tarefasDisponiveis.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhuma tarefa aberta no momento.
                </p>
              ) : (
                <div className="space-y-3">
                  {tarefasDisponiveis.slice(0, 6).map((t) => (
                    <Link
                      key={t.id}
                      href={`/tarefas/${t.id}`}
                      className="block border border-gray-200 rounded-xl p-3 hover:border-[#e67e22] transition-colors"
                    >
                      <p className="font-medium text-[#1e3a5f] text-sm">
                        {t.titulo}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {t.bairro ?? "Bairro não informado"} ·{" "}
                        {formatarMoeda(t.orcamento_sugerido)}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-[#1e3a5f] mb-4">
              Meus orçamentos enviados
            </h3>
            {orcamentos.length === 0 ? (
              <p className="text-sm text-gray-500">
                Você ainda não enviou orçamentos.
              </p>
            ) : (
              <div className="space-y-3">
                {orcamentos.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between border border-gray-200 rounded-xl p-3"
                  >
                    <div>
                      <p className="font-semibold text-[#1e3a5f] text-sm">
                        {formatarMoeda(o.valor)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Enviado em {formatarData(o.created_at)}
                      </p>
                    </div>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                      style={{
                        backgroundColor: coresStatus[o.status] ?? "#9ca3af",
                      }}
                    >
                      {rotuloStatus[o.status] ?? o.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">Tarefas publicadas</p>
              <p className="text-2xl font-bold text-[#1e3a5f]">
                {minhasTarefas.length}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">Abertas</p>
              <p className="text-2xl font-bold text-[#e67e22]">
                {tarefasAbertas}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">Concluídas</p>
              <p className="text-2xl font-bold text-green-600">
                {tarefasConcluidas}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">Orçamentos recebidos</p>
              <p className="text-2xl font-bold text-[#1e3a5f]">
                {orcamentosRecebidos.length}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <RoscaChart
                titulo="Minhas tarefas por status"
                dados={[
                  { label: "Aberta", valor: tarefasAbertas, cor: coresStatus.aberta },
                  {
                    label: "Concluída",
                    valor: tarefasConcluidas,
                    cor: coresStatus.concluida,
                  },
                ]}
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-[#1e3a5f] mb-4">
                Minhas tarefas
              </h3>
              {minhasTarefas.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Você ainda não publicou tarefas.
                </p>
              ) : (
                <div className="space-y-3">
                  {minhasTarefas.slice(0, 6).map((t) => (
                    <Link
                      key={t.id}
                      href={`/tarefas/${t.id}`}
                      className="block border border-gray-200 rounded-xl p-3 hover:border-[#e67e22] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-[#1e3a5f] text-sm">
                          {t.titulo}
                        </p>
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                          style={{
                            backgroundColor:
                              coresStatus[t.status] ?? "#9ca3af",
                          }}
                        >
                          {rotuloStatus[t.status] ?? t.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {t.bairro ?? "Bairro não informado"} ·{" "}
                        {formatarData(t.created_at)}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
